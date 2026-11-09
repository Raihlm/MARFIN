# Marfin AI 🤖

**Market & Financial Intelligence AI Agent**

Marfin AI ingests raw financial news, extracts key market signals, classifies sentiment, and formats the output as concise Telegram-ready digests — powered by the **Gemini API (free tier)**.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and paste your Gemini API key
```

Get a free key at <https://aistudio.google.com/app/apikey>.

### 3. Run
```bash
npm start
```

The CLI processes the sample article from `PROMPT.MD` and prints the formatted Telegram digest to stdout.

---

## Project Structure

```
marfin-ai/
├── index.js          # CLI entry point (sample article runner)
├── src/
│   ├── gemini.js     # Google Generative AI SDK wrapper
│   ├── prompt.js     # System prompt + user message builder
│   └── marfin.js     # Core digest processor
├── .env.example      # Environment variable template
└── PROMPT.MD         # Original system design spec
```

---

## Using as a Module

```js
import { generateDigest } from "./src/marfin.js";

const digest = await generateDigest(
  {
    articleTitle: "Fed Holds Rates Steady",
    sourceUrl: "https://example.com/fed-news",
    rawContent: "The Federal Reserve held rates at 5.25–5.50%...",
    targetTickerOrSector: "Financials (JPM, BAC)",
  },
  {
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",          // or any other Gemini model
  }
);

console.log(digest); // Telegram-ready formatted digest
```

---

## Output Format

```
🤖 *Marfin AI Digest* | *Market Update*

📌 *Title:* ...
📊 *Sentiment:* [BULLISH 🟢]
🏷️ *Related Tickers/Sectors:* BBCA, BBRI, BMRI

---

💡 *Key Insights & Takeaways:*
• **[Highlight 1]:** ...
• **[Highlight 2]:** ...
• **[Highlight 3]:** ...

🎯 *Investor Actionable Takeaway:*
...

🔗 *Source:* https://...
```

---

## Environment Variables

| Variable       | Required | Default              | Description                    |
|----------------|----------|----------------------|--------------------------------|
| `GEMINI_API_KEY` | ✅ Yes  | —                    | Your Google Gemini API key     |
| `GEMINI_MODEL`   | No      | `gemini-1.5-flash`   | Gemini model name to use       |

---

## License

MIT
