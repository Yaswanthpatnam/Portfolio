import { Redis } from "@upstash/redis";
import crypto from "crypto";

function getVisitorHash(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket?.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "";
  return crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}`)
    .digest("hex")
    .slice(0, 16);
}

function formatHourLabel(d) {
  let h = d.getUTCHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:00 ${ampm}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  const isConfigured = Boolean(url && token);

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const hourStr = String(now.getUTCHours()).padStart(2, "0");
  const hourKey = `${dateStr}-${hourStr}`;

  // Check if tracking is requested (GET with ?track=1 or POST)
  const shouldTrack = req.query?.track === "1" || req.method === "POST";

  if (isConfigured) {
    try {
      const redis = new Redis({ url, token });

      if (shouldTrack) {
        const visitorHash = getVisitorHash(req);
        const pipe = redis.pipeline();

        // Increment real page views
        pipe.incr(`pv:h:${hourKey}`);
        pipe.expire(`pv:h:${hourKey}`, 172800); // 48h
        pipe.incr(`pv:d:${dateStr}`);
        pipe.expire(`pv:d:${dateStr}`, 5184000); // 60d
        pipe.incr("pv:total");

        // Unique visitor hash sets
        pipe.sadd(`uv:h:${hourKey}`, visitorHash);
        pipe.expire(`uv:h:${hourKey}`, 172800);
        pipe.sadd(`uv:d:${dateStr}`, visitorHash);
        pipe.expire(`uv:d:${dateStr}`, 5184000);
        pipe.sadd("uv:total", visitorHash);

        await pipe.exec();
      }

      // Query real time-series metrics across 24H, 7D, and 30D
      const pipeQuery = redis.pipeline();

      // 1. 24H query: 24 hourly keys
      const hKeys = [];
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 3600 * 1000);
        const ds = d.toISOString().split("T")[0];
        const hs = String(d.getUTCHours()).padStart(2, "0");
        const key = `${ds}-${hs}`;
        hKeys.push(key);
        pipeQuery.get(`pv:h:${key}`);
        pipeQuery.scard(`uv:h:${key}`);
      }

      // 2. 7D query: 7 daily keys
      const dKeys7 = [];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400 * 1000);
        const ds = d.toISOString().split("T")[0];
        dKeys7.push({ date: ds, name: dayNames[d.getUTCDay()] });
        pipeQuery.get(`pv:d:${ds}`);
        pipeQuery.scard(`uv:d:${ds}`);
      }

      // 3. 30D query: 30 daily keys
      const dKeys30 = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400 * 1000);
        const ds = d.toISOString().split("T")[0];
        dKeys30.push({
          date: ds,
          day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        });
        pipeQuery.get(`pv:d:${ds}`);
        pipeQuery.scard(`uv:d:${ds}`);
      }

      // Execute single batch round-trip
      const results = await pipeQuery.exec();

      let rIdx = 0;

      // Parse 24H
      const v24All = [];
      const p24All = [];
      for (let i = 0; i < 24; i++) {
        const pVal = parseInt(results[rIdx++] || 0, 10);
        const vVal = parseInt(results[rIdx++] || 0, 10);
        p24All.push(pVal);
        v24All.push(vVal);
      }

      // Sample 24H to 12 two-hour intervals for a smooth SVG curve
      const v24 = [];
      const p24 = [];
      for (let i = 0; i < 24; i += 2) {
        v24.push(v24All[i] + (v24All[i + 1] || 0));
        p24.push(p24All[i] + (p24All[i + 1] || 0));
      }

      const vTotal24 = v24All.reduce((a, b) => a + b, 0);
      const pTotal24 = p24All.reduce((a, b) => a + b, 0);

      // Parse 7D
      const v7 = [];
      const p7 = [];
      for (let i = 0; i < 7; i++) {
        const pVal = parseInt(results[rIdx++] || 0, 10);
        const vVal = parseInt(results[rIdx++] || 0, 10);
        p7.push(pVal);
        v7.push(vVal);
      }
      const vTotal7 = v7.reduce((a, b) => a + b, 0);
      const pTotal7 = p7.reduce((a, b) => a + b, 0);

      // Parse 30D
      const v30All = [];
      const p30All = [];
      for (let i = 0; i < 30; i++) {
        const pVal = parseInt(results[rIdx++] || 0, 10);
        const vVal = parseInt(results[rIdx++] || 0, 10);
        p30All.push(pVal);
        v30All.push(vVal);
      }

      // Sample 30D into 10 points (3 days each)
      const v30 = [];
      const p30 = [];
      for (let i = 0; i < 30; i += 3) {
        v30.push(
          v30All[i] + (v30All[i + 1] || 0) + (v30All[i + 2] || 0)
        );
        p30.push(
          p30All[i] + (p30All[i + 1] || 0) + (p30All[i + 2] || 0)
        );
      }
      const vTotal30 = v30All.reduce((a, b) => a + b, 0);
      const pTotal30 = p30All.reduce((a, b) => a + b, 0);

      const dStart24 = new Date(now.getTime() - 24 * 3600 * 1000);
      const dMid24 = new Date(now.getTime() - 12 * 3600 * 1000);

      return res.status(200).json({
        status: "live",
        source: "upstash_redis",
        tracked: shouldTrack,
        "24H": {
          vTotal: vTotal24.toLocaleString(),
          pTotal: pTotal24.toLocaleString(),
          start: formatHourLabel(dStart24),
          mid: formatHourLabel(dMid24),
          end: formatHourLabel(now),
          v: v24,
          p: p24,
        },
        "7D": {
          vTotal: vTotal7.toLocaleString(),
          pTotal: pTotal7.toLocaleString(),
          start: dKeys7[0].name,
          mid: dKeys7[3].name,
          end: dKeys7[6].name,
          v: v7,
          p: p7,
        },
        "30D": {
          vTotal: vTotal30.toLocaleString(),
          pTotal: pTotal30.toLocaleString(),
          start: dKeys30[0].day,
          mid: dKeys30[15].day,
          end: dKeys30[29].day,
          v: v30,
          p: p30,
        },
      });
    } catch (err) {
      console.error("Upstash Redis handler error:", err);
    }
  }

  // Graceful response if Upstash environment variables are pending setup
  return res.status(200).json({
    status: "pending_configuration",
    source: "local_simulation",
    message:
      "To connect live Redis: Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel Project Settings > Environment Variables.",
    "24H": {
      vTotal: "142",
      pTotal: "489",
      start: "12:00 AM",
      mid: "12:00 PM",
      end: "11:59 PM",
      v: [8, 14, 20, 16, 28, 42, 60, 75, 58, 40, 26, 18],
      p: [18, 30, 42, 35, 60, 95, 135, 165, 125, 80, 55, 38],
    },
    "7D": {
      vTotal: "840",
      pTotal: "2,910",
      start: "Mon",
      mid: "Thu",
      end: "Sun",
      v: [420, 590, 750, 910, 1180, 1340, 1260],
      p: [1100, 1500, 2000, 2600, 3400, 4100, 3700],
    },
    "30D": {
      vTotal: "3,480",
      pTotal: "11,840",
      start: "Day 1",
      mid: "Day 15",
      end: "Day 30",
      v: [300, 480, 680, 850, 1150, 1380, 1520, 1440, 1710, 1780],
      p: [950, 1400, 2050, 2700, 3500, 4300, 4900, 4600, 5250, 5600],
    },
  });
}
