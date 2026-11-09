/**
 * server.js
 * Express web server for Marfin AI Dashboard.
 *
 * Endpoints:
 *   GET  /              → serves public/index.html
 *   POST /api/digest    → generates a Marfin AI digest via Gemini
 *   GET  /api/health    → health check
 *   GET  /api/news      → fetch latest news (RSS local + NewsAPI global)
 */

import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { generateDigest } from "./src/marfin.js";
import { fetchAllNews }   from "./src/fetcher.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ── Digest endpoint ───────────────────────────────────────────────────────────
app.post("/api/digest", async (req, res) => {
  const { articleTitle, sourceUrl, rawContent, targetTickerOrSector } = req.body;

  if (!articleTitle || !rawContent) {
    return res.status(400).json({ error: "articleTitle and rawContent are required." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const digest = await generateDigest(
      { articleTitle, sourceUrl: sourceUrl || "N/A", rawContent, targetTickerOrSector },
      { apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL || "gemini-1.5-flash" }
    );
    res.json({ digest });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(502).json({ error: "Gemini API request failed: " + err.message });
  }
});

// ── News feed endpoint ────────────────────────────────────────────────────────
app.get("/api/news", async (_req, res) => {
  try {
    const articles = await fetchAllNews({
      newsApiKey: process.env.NEWS_API_KEY,
      localLimit: 6,
      globalLimit: 5,
    });
    res.json({ articles, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error("News fetch error:", err.message);
    res.status(502).json({ error: "Failed to fetch news: " + err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🤖  Marfin AI Dashboard running at http://localhost:${PORT}`);
});
