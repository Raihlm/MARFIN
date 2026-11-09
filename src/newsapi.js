/**
 * src/newsapi.js
 * Fetches global financial headlines from NewsAPI.org (free tier).
 *
 * Free tier limits: 100 requests/day, articles from last 30 days.
 * Docs: https://newsapi.org/docs/endpoints/everything
 */

/** @typedef {{ id:string, title:string, sourceUrl:string, pubDate:string, summary:string, source:string, category:string, type:'global' }} GlobalArticle */

const BASE = "https://newsapi.org/v2/everything";

/** Queries that cover US market, Fed, commodities, and crypto relevant to IDX investors. */
const GLOBAL_QUERIES = [
  { q: "stock market OR S&P500 OR Federal Reserve", category: "US Market" },
  { q: "crude oil OR gold price OR commodities", category: "Commodities" },
  { q: "Indonesia economy OR Bank Indonesia OR IHSG", category: "Macro ID" },
];

/**
 * Fetch global financial news from NewsAPI.org.
 *
 * @param {string} apiKey      - NewsAPI key (from NEWS_API_KEY env var).
 * @param {number} pageSize    - Results per query (max 10 for free tier efficiency).
 * @returns {Promise<GlobalArticle[]>}
 */
export async function fetchGlobalNews(apiKey, pageSize = 5) {
  if (!apiKey) return [];

  const results = await Promise.all(
    GLOBAL_QUERIES.map(({ q, category }) => fetchQuery(apiKey, q, category, pageSize))
  );
  return results.flat();
}

async function fetchQuery(apiKey, q, category, pageSize) {
  try {
    const params = new URLSearchParams({
      q,
      language: "en",
      sortBy: "publishedAt",
      pageSize: String(pageSize),
      apiKey,
    });
    const resp = await fetch(`${BASE}?${params}`, {
      headers: { "User-Agent": "MarfinAI/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.articles || [])
      .filter((a) => a.title && a.title !== "[Removed]")
      .map((a) => ({
        id: a.url,
        title: a.title.trim(),
        sourceUrl: a.url,
        pubDate: a.publishedAt,
        summary: (a.description || a.content || "").slice(0, 600),
        source: a.source?.name ?? "NewsAPI",
        category,
        type: "global",
      }));
  } catch {
    return [];
  }
}
