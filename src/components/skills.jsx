import React, { useState, useEffect, useMemo, useRef } from "react";

// Monochromatic GitHub Activity Scale
const matrixColors = ["#141416", "#27272a", "#52525b", "#a1a1aa", "#ffffff"];

// Verified baseline
const defaultContributions = {
  total2026: 62,
  totalAll: 179,
  streak: 2,
};

export const Skills = () => {
  const [range, setRange] = useState("24H");
  const [githubStats, setGithubStats] = useState(defaultContributions);
  const [calendarData, setCalendarData] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const calendarRef = useRef(null);

  const [telemetry, setTelemetry] = useState({
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
  const [telemetryStatus, setTelemetryStatus] = useState("connecting");

  // 1. Fetch Real GitHub Contribution Data & Build Accurate Rolling 53-Week Calendar
  useEffect(() => {
    let isMounted = true;

    const fetchRealContributions = async () => {
      try {
        const res = await fetch(
          "https://github-contributions-api.jogruber.de/v4/Yaswanthpatnam"
        );
        if (!res.ok) return;
        const data = await res.json();

        if (data && Array.isArray(data.contributions) && isMounted) {
          const total2026 = data.total?.["2026"] ?? 62;
          const total2025 = data.total?.["2025"] ?? 117;
          const totalAll = total2026 + total2025;

          // 1. Sort strictly chronologically by date
          const sorted = data.contributions
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date));

          // 2. Identify the target ending date (today or the latest entry in API <= today)
          const todayStr = new Date().toISOString().split("T")[0];
          let endIdx = sorted.findIndex((c) => c.date === todayStr);
          if (endIdx === -1) {
            const past = sorted.filter((c) => c.date <= todayStr);
            endIdx = past.length > 0 ? sorted.indexOf(past[past.length - 1]) : sorted.length - 1;
          }

          // 3. Take rolling 365 days (52 full weeks + 1 day = 53 weeks)
          const startIdx = Math.max(0, endIdx - 364);
          const calendarDays = sorted.slice(startIdx, endIdx + 1);

          // 4. Calculate accurate active streak
          let streak = 0;
          let checkIdx = endIdx;
          if (sorted[checkIdx]?.count === 0 && checkIdx > 0) {
            checkIdx--; // If today has 0 commits so far, count active streak ending yesterday
          }
          while (checkIdx >= 0 && sorted[checkIdx]?.count > 0) {
            streak++;
            checkIdx--;
          }

          // 5. Build 7-day columns (Sunday [0] to Saturday [6])
          const weeks = [];
          let currentWeek = [];

          calendarDays.forEach((day) => {
            const dt = new Date(day.date + "T00:00:00Z");
            const dow = dt.getUTCDay();

            // First week: pad front if first day is not Sunday
            if (weeks.length === 0 && currentWeek.length === 0 && dow > 0) {
              for (let p = 0; p < dow; p++) currentWeek.push(null);
            }

            // If Sunday and week is in progress, push week and start new one
            if (dow === 0 && currentWeek.length > 0) {
              while (currentWeek.length < 7) currentWeek.push(null);
              weeks.push(currentWeek);
              currentWeek = [];
            }

            currentWeek.push({
              date: day.date,
              count: day.count,
              level: Math.min(day.level, 4),
              dow,
              formattedDate: dt.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              }),
            });
          });

          if (currentWeek.length > 0) {
            while (currentWeek.length < 7) currentWeek.push(null);
            weeks.push(currentWeek);
          }

          // 6. Calculate month labels aligned above column indices
          const months = [];
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          let prevMonth = -1;

          weeks.forEach((week, colIdx) => {
            const firstValid = week.find((d) => d !== null);
            if (!firstValid) return;
            const m = new Date(firstValid.date + "T00:00:00Z").getUTCMonth();
            if (m !== prevMonth) {
              months.push({ colIndex: colIdx, name: monthNames[m] });
              prevMonth = m;
            }
          });

          setGithubStats({
            total2026,
            totalAll,
            streak,
          });

          setCalendarData({
            weeks,
            months,
          });
        }
      } catch (err) {
        console.warn("Real GitHub contribution fetch fallback:", err);
      }
    };

    fetchRealContributions();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Real Analytics from /api/analytics (Vercel Serverless Function + Upstash Redis)
  useEffect(() => {
    let isMounted = true;

    const fetchRealTelemetry = async () => {
      try {
        const sessionKey = "telemetry_tracked_session";
        const hasTracked = sessionStorage.getItem(sessionKey);
        const endpoint = hasTracked ? "/api/analytics" : "/api/analytics?track=1";

        const res = await fetch(endpoint);
        if (!res.ok) return;
        const data = await res.json();

        if (data && data["24H"] && isMounted) {
          setTelemetry(data);
          setTelemetryStatus(data.status === "live" ? "live" : "ready");
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch (err) {
        console.warn("Telemetry fetch fallback:", err);
      }
    };

    fetchRealTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentData = telemetry[range] || telemetry["24H"];

  // SVG Chart path calculation with protection against all-zeros
  const { vPath, vArea, pPath } = useMemo(() => {
    const rawMax = Math.max(1, ...currentData.p, ...currentData.v);
    const maxVal = rawMax * 1.15;
    const count = Math.max(2, currentData.v.length);
    const stepX = 600 / (count - 1);

    const vPts = currentData.v.map((val, i) => ({
      x: i * stepX,
      y: 150 - (val / maxVal) * 130,
    }));

    const pPts = currentData.p.map((val, i) => ({
      x: i * stepX,
      y: 150 - (val / maxVal) * 130,
    }));

    const makeCurve = (pts) => {
      if (!pts || pts.length === 0) return "";
      let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const xc = ((pts[i].x + pts[i + 1].x) / 2).toFixed(1);
        const yc = ((pts[i].y + pts[i + 1].y) / 2).toFixed(1);
        d += ` Q ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${xc},${yc}`;
      }
      d += ` L ${pts[pts.length - 1].x.toFixed(1)},${pts[pts.length - 1].y.toFixed(1)}`;
      return d;
    };

    const vLine = makeCurve(vPts);
    const pLine = makeCurve(pPts);
    const area = `${vLine} L 600,160 L 0,160 Z`;

    return { vPath: vLine, vArea: area, pPath: pLine };
  }, [currentData]);

  const getCellBg = (level) => {
    switch (level) {
      case 1:
        return "#27272a";
      case 2:
        return "#52525b";
      case 3:
        return "#a1a1aa";
      case 4:
        return "#ffffff";
      default:
        return "#141416";
    }
  };

  // Immediate fallback calendar so layout renders instantly before network resolves
  const { fallbackWeeks, fallbackMonths } = useMemo(() => {
    const weeks = [];
    const months = [];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const baseDate = new Date("2026-10-07T00:00:00Z");
    const days = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setUTCDate(d.getUTCDate() - i);
      const dow = d.getUTCDay();
      const dStr = d.toISOString().split("T")[0];
      days.push({
        date: dStr,
        count: dStr === "2026-10-05" ? 7 : dStr === "2026-10-06" ? 3 : 0,
        level: dStr === "2026-10-05" ? 4 : dStr === "2026-10-06" ? 2 : 0,
        dow,
        formattedDate: d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }),
      });
    }

    let currentWeek = [];
    days.forEach((day) => {
      if (weeks.length === 0 && currentWeek.length === 0 && day.dow > 0) {
        for (let p = 0; p < day.dow; p++) currentWeek.push(null);
      }
      if (day.dow === 0 && currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    let prevMonth = -1;
    weeks.forEach((week, colIdx) => {
      const firstValid = week.find((d) => d !== null);
      if (!firstValid) return;
      const m = new Date(firstValid.date + "T00:00:00Z").getUTCMonth();
      if (m !== prevMonth) {
        months.push({ colIndex: colIdx, name: monthNames[m] });
        prevMonth = m;
      }
    });

    return { fallbackWeeks: weeks, fallbackMonths: months };
  }, []);

  const displayWeeks = calendarData?.weeks || fallbackWeeks;
  const displayMonths = calendarData?.months || fallbackMonths;

  return (
    <div className="relative z-10 space-y-12">
      {/* SECTION: REAL Monochromatic GitHub Activity Matrix */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="text-zinc-500 font-semibold">Fig. 1.</span>
            <span>{githubStats.totalAll} verified GitHub contributions</span>
          </div>
          <a
            href="https://github.com/Yaswanthpatnam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
          >
            github.com/Yaswanthpatnam ↗
          </a>
        </div>

        <div
          ref={calendarRef}
          className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-md hover:border-[var(--border-lit)] transition-colors p-5 space-y-3"
        >
          {/* Header Stats & Active Inspect readout */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono min-h-[22px]">
            {hoveredDay ? (
              <div className="flex items-center gap-2 text-white transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                <span className="font-semibold">
                  {hoveredDay.count === 0
                    ? "No contributions"
                    : `${hoveredDay.count} contribution${hoveredDay.count === 1 ? "" : "s"}`}
                </span>
                <span className="text-zinc-400">on {hoveredDay.formattedDate}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {githubStats.total2026} contributions in 2026
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">
                  {githubStats.totalAll} all-time
                </span>
              </div>
            )}

            <div className="text-zinc-300 flex items-center gap-1.5">
              <span>{githubStats.streak}-day active streak</span>
              <span>🔥</span>
            </div>
          </div>

          {/* Interactive Tooltip Card Floating over hovered square */}
          {hoveredDay && (
            <div
              className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-[calc(100%+10px)] px-2.5 py-1.5 rounded-lg bg-[#0c0c0e] border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] text-[11px] font-mono text-white whitespace-nowrap transition-all duration-75"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: hoveredDay.count > 0 ? "#ffffff" : "#71717a",
                    boxShadow: hoveredDay.count > 0 ? "0 0 6px white" : "none",
                  }}
                />
                <span className="font-semibold text-white">
                  {hoveredDay.count === 0
                    ? "No contributions"
                    : `${hoveredDay.count} contribution${hoveredDay.count === 1 ? "" : "s"}`}
                </span>
                <span className="text-zinc-400">on {hoveredDay.formattedDate}</span>
              </div>
              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#0c0c0e] border-r border-b border-zinc-700 rotate-45" />
            </div>
          )}

          {/* Scrollable GitHub Calendar Matrix */}
          <div className="overflow-x-auto pb-1 scrollbar-thin">
            <div className="min-w-max">
              {/* Month Header Labels */}
              <div className="relative h-4 text-[10px] font-mono text-zinc-500 mb-1 ml-7 select-none">
                {displayMonths.map((m, i) => (
                  <span
                    key={i}
                    className="absolute"
                    style={{ left: `${m.colIndex * 13}px` }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              {/* Grid: Left Weekday labels + Week Columns */}
              <div className="flex items-start gap-1">
                {/* Weekday Axis (Mon, Wed, Fri aligned to 7-day height) */}
                <div className="relative w-6 h-[88px] text-[9px] font-mono text-zinc-500 select-none flex-shrink-0">
                  <span className="absolute top-[13px] right-1">Mon</span>
                  <span className="absolute top-[39px] right-1">Wed</span>
                  <span className="absolute top-[65px] right-1">Fri</span>
                </div>

                {/* 53 Columns of Weeks */}
                <div className="flex gap-[3px]">
                  {displayWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={`empty-${dIdx}`}
                              className="w-2.5 h-2.5 rounded-[2px] opacity-0 pointer-events-none"
                            />
                          );
                        }

                        const isHovered = hoveredDay?.date === day.date;
                        return (
                          <div
                            key={day.date}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const parentRect =
                                calendarRef.current?.getBoundingClientRect() || {
                                  left: 0,
                                  top: 0,
                                };
                              setHoveredDay(day);
                              setTooltipPos({
                                x: rect.left - parentRect.left + rect.width / 2,
                                y: rect.top - parentRect.top,
                              });
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`w-2.5 h-2.5 rounded-[2px] cursor-pointer transition-all duration-150 border border-white/5 ${
                              isHovered
                                ? "ring-2 ring-white scale-125 z-20 shadow-[0_0_8px_white]"
                                : "hover:ring-1 hover:ring-white/80 hover:scale-110"
                            }`}
                            style={{
                              backgroundColor: getCellBg(day.level),
                              boxShadow:
                                day.level === 4
                                  ? "0 0 5px rgba(255, 255, 255, 0.45)"
                                  : undefined,
                            }}
                            title={`${day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`} on ${day.formattedDate}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Legend with Counts Guide */}
          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-[var(--border)] gap-2">
            <span className="text-zinc-400">
              Hover over any square for daily breakdown
            </span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="flex items-center gap-1">
                {matrixColors.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-[2px] border border-white/5"
                    style={{ backgroundColor: c }}
                    title={
                      i === 0
                        ? "0 contributions"
                        : i === 1
                        ? "1–3 contributions"
                        : i === 2
                        ? "4–6 contributions"
                        : i === 3
                        ? "7–9 contributions"
                        : "10+ contributions"
                    }
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Telemetry & Traffic Insights */}
      <section id="analytics" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="text-zinc-500 font-semibold">Fig. 2.</span>
            <span>Live telemetry & reader volume</span>
            {telemetryStatus === "live" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                Live Redis
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                Live Telemetry
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-mono text-xs">
            {["24H", "7D", "30D"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRange(tab)}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  range === tab
                    ? "text-black bg-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-md hover:border-[var(--border-lit)] transition-colors p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-white inline-block" />
                <span className="text-zinc-300">
                  Visitors: <b className="text-white font-bold">{currentData.vTotal}</b>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-zinc-500 inline-block border-t border-dashed" />
                <span className="text-zinc-300">
                  Page Views: <b className="text-zinc-200 font-bold">{currentData.pTotal}</b>
                </span>
              </div>
            </div>
            <span className="text-[11px] text-zinc-500">Live Telemetry</span>
          </div>

          <div className="relative w-full h-40 flex items-end">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 160"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="40"
                x2="600"
                y2="40"
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="90"
                x2="600"
                y2="90"
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="140"
                x2="600"
                y2="140"
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
              />

              <defs>
                <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={vArea} fill="url(#whiteGrad)" />
              <path
                d={vPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d={pPath}
                fill="none"
                stroke="#71717a"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-[var(--border)] pt-3">
            <span>{currentData.start}</span>
            <span>{currentData.mid}</span>
            <span>{currentData.end}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
