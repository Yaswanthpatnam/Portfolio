import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,POST"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  const isConfigured = Boolean(url && token);

  // 1. GET: Fetch all reviews
  if (req.method === "GET") {
    if (!isConfigured) {
      res.status(200).json({ success: true, reviews: [] });
      return;
    }

    try {
      const redis = new Redis({ url, token });
      const rawList = await redis.lrange("reviews:list", 0, 50);

      const parsedReviews = (rawList || []).map((item) => {
        try {
          return typeof item === "string" ? JSON.parse(item) : item;
        } catch {
          return null;
        }
      }).filter(Boolean);

      res.status(200).json({ success: true, reviews: parsedReviews });
    } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(200).json({ success: false, reviews: [] });
    }
    return;
  }

  // 2. POST: Submit a new review
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { name, role, organization, project, content, rating, ratingLabel } = body;

      if (!name || !content) {
        res.status(400).json({ success: false, error: "Name and content are required." });
        return;
      }

      const newReview = {
        id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: String(name).trim().slice(0, 100),
        role: String(role || "Client").trim().slice(0, 100),
        organization: String(organization || "Client Partner").trim().slice(0, 100),
        project: project ? String(project).trim().slice(0, 120) : "Collaborative Engagement",
        content: String(content).trim().slice(0, 1000),
        rating: Math.max(1, Math.min(5, parseFloat(rating) || 5.0)),
        ratingLabel: String(ratingLabel || "Satisfied").trim().slice(0, 50),
        year: new Date().getFullYear(),
        createdAt: new Date().toISOString(),
      };

      if (isConfigured) {
        const redis = new Redis({ url, token });
        await redis.lpush("reviews:list", JSON.stringify(newReview));
      }

      res.status(200).json({ success: true, review: newReview });
    } catch (err) {
      console.error("Error saving review:", err);
      res.status(500).json({ success: false, error: "Failed to store review." });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
