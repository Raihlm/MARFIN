/**
 * src/marfin.js
 * Core digest processor — ties together prompt building and Gemini API call.
 */

import { callGemini } from "./gemini.js";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompt.js";

/**
 * Generate a Marfin AI Telegram digest for a given article.
 *
 * @param {object} article
 * @param {string} article.articleTitle           - Headline of the article.
 * @param {string} article.sourceUrl              - Source URL or label.
 * @param {string} article.rawContent             - Raw article body text.
 * @param {string} [article.targetTickerOrSector] - Optional ticker/sector hint.
 * @param {object} config
 * @param {string} config.apiKey                  - Gemini API key.
 * @param {string} [config.model]                 - Gemini model name.
 * @returns {Promise<string>}                     - Formatted Telegram digest.
 */
export async function generateDigest(article, config) {
  const { apiKey, model } = config;

  const userMessage = buildUserMessage(article);
  const digest = await callGemini(SYSTEM_PROMPT, userMessage, apiKey, model);

  return digest;
}
