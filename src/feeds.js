/**
 * src/feeds.js
 * RSS feed definitions for Indonesian financial news sources.
 * Each feed is fetched, parsed, and normalised into a standard article shape.
 */

import Parser from "rss-parser";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "MarfinAI/1.0 (+https://github.com/marfin-ai)" },
});

/** @typedef {{ id:string, title:string, sourceUrl:string, pubDate:string, summary:string, source:string, category:'local' }} RssArticle */

/**
 * Indonesian financial RSS feeds.
 * All are publicly accessible and do not require authentication.
 */
export const RSS_SOURCES = [
  {
    name: "Kontan",
    url: "https://rss.kontan.co.id/category/investasi",
    category: "IDX/IHSG",
  },
  {
    name: "Bisnis.com Pasar Modal",
    url: "https://feeds.bisnis.com/bisnis/rss/10/markets",
    category: "IDX/IHSG",
  },
  {
    name: "CNBC Indonesia",
    url: "https://www.cnbcindonesia.com/rss",
    category: "Macro",
  },
  {
    name: "Detik Finance",
    url: "https://finance.detik.com/rss",
    category: "Macro",
  },
  {
    name: "IDX Channel",
    url: "https://www.idxchannel.com/feed",
    category: "IDX/IHSG",
  },
];

/**
 * Fetch and normalise a single RSS feed.
 * Returns an empty array (never throws) so one bad feed doesn't break the rest.
 *
 * @param {{ name:string, url:string, category:string }} feed
 * @param {number} limit  Max articles to return per feed.
 * @returns {Promise<RssArticle[]>}
 */
async function fetchOneFeed(feed, limit = 5) {
  try {
    const data = await parser.parseURL(feed.url);
    return (data.items || []).slice(0, limit).map((item) => ({
      id: item.guid || item.link || item.title,
      title: item.title?.trim() ?? "(no title)",
      sourceUrl: item.link ?? feed.url,
      pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
      summary: stripHtml(item.contentSnippet || item.content || item.summary || ""),
      source: feed.name,
      category: feed.category,
      type: "local",
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch all Indonesian RSS feeds in parallel.
 *
 * @param {number} limitPerFeed
 * @returns {Promise<RssArticle[]>}
 */
export async function fetchLocalNews(limitPerFeed = 5) {
  const results = await Promise.all(RSS_SOURCES.map((f) => fetchOneFeed(f, limitPerFeed)));
  return results.flat();
}

/** Strip HTML tags and collapse whitespace. */
function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 600);
}
