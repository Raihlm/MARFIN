/**
 * src/fetcher.js
 * Unified news fetcher — merges RSS (local) + NewsAPI (global),
 * deduplicates by URL/title, and sorts by publish date descending.
 */

import { fetchLocalNews } from "./feeds.js";
import { fetchGlobalNews } from "./newsapi.js";

/**
 * Fetch and merge news from all sources.
 *
 * @param {{ newsApiKey?: string, localLimit?: number, globalLimit?: number }} opts
 * @returns {Promise<Array>}  Sorted, deduped articles.
 */
export async function fetchAllNews({ newsApiKey, localLimit = 5, globalLimit = 5 } = {}) {
  const [local, global] = await Promise.all([
    fetchLocalNews(localLimit),
    fetchGlobalNews(newsApiKey, globalLimit),
  ]);

  const all = [...local, ...global];

  // Deduplicate by sourceUrl, then by title (case-insensitive first 60 chars)
  const seenUrls  = new Set();
  const seenTitles = new Set();
  const deduped = [];

  for (const article of all) {
    const urlKey   = (article.sourceUrl || "").toLowerCase();
    const titleKey = (article.title || "").toLowerCase().slice(0, 60);

    if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) continue;
    seenUrls.add(urlKey);
    seenTitles.add(titleKey);
    deduped.push(article);
  }

  // Sort newest first
  deduped.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return deduped;
}
