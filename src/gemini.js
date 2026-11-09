/**
 * src/gemini.js
 * Thin wrapper around the Google Generative AI SDK.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Send a prompt to Gemini and return the text response.
 *
 * @param {string} systemPrompt  - The system/persona instruction.
 * @param {string} userMessage   - The user message (article payload).
 * @param {string} apiKey        - Gemini API key.
 * @param {string} modelName     - Gemini model name (default: gemini-1.5-flash).
 * @returns {Promise<string>}    - The generated digest text.
 */
export async function callGemini(systemPrompt, userMessage, apiKey, modelName = "gemini-1.5-flash") {
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userMessage);
  return result.response.text();
}
