/**
 * index.js
 * CLI entry point for Marfin AI.
 *
 * Usage:
 *   node index.js
 *
 * The sample article from PROMPT.MD is used as the default input.
 * To process a custom article, edit the `article` object below or
 * import generateDigest() in your own script.
 */

import "dotenv/config";
import { generateDigest } from "./src/marfin.js";

// ── Sample article from PROMPT.MD ────────────────────────────────────────────
const article = {
  articleTitle: "IHSG Ditutup Menguat, Saham Perbankan Big Cap Menjadi Pendorong Utama",
  sourceUrl: "https://finance.example.com/market-news-123",
  targetTickerOrSector: "Perbankan (BBCA, BBRI, BMRI)",
  rawContent: `
Indeks Harga Saham Gabungan (IHSG) ditutup menguat 0,85% ke level 7.350 pada perdagangan hari ini.
Penguatan ini didorong oleh aksi beli bersih investor asing pada saham-saham perbankan berkapitalisasi
besar seperti BBCA dan BMRI yang masing-masing naik 1,2% dan 1,5%. Menurut analis, apresiasi rupiah
serta rilis laporan keuangan kuartal III yang melampaui ekspektasi pasar menjadi katalis positif utama.
Meski demikian, investor diimbau tetap waspada terhadap potensi ketidakpastian kebijakan suku bunga
global pekan depan.
  `.trim(),
};

// ── Config ────────────────────────────────────────────────────────────────────
const config = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
};

// ── Run ───────────────────────────────────────────────────────────────────────
if (!config.apiKey) {
  console.error("❌  GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.");
  process.exit(1);
}

console.log("🤖  Marfin AI — generating digest...\n");

try {
  const digest = await generateDigest(article, config);
  console.log("═".repeat(60));
  console.log(digest);
  console.log("═".repeat(60));
} catch (err) {
  console.error("❌  Failed to generate digest:", err.message);
  process.exit(1);
}
