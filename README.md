# mechanIQs

Vehicle-specific car repair platform that helps people maintain their own cars without intimidation or confusion.

## Features

- **Vehicle Selector**: Choose your specific year, make, and model
- **Parts Catalog**: Browse compatible parts with OEM vs aftermarket pricing
- **Guided Repairs**: Step-by-step instructions for common maintenance tasks
- **AI Repair Assistant**: Step-aware chat help while you run the tutorial from Parts > Repair
- **AI Symptom Diagnosis**: Vehicle-aware chatbot that ranks likely causes and next checks
- **Vehicle Context**: All guidance is specific to your exact vehicle

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Anthropic API key (get one from https://console.anthropic.com/)
   - Add your OpenRouter API key (get one from https://openrouter.ai/keys)

```bash
cp .env.local.example .env.local
# Edit .env.local and add your API key
```

Required keys for AI features:
- `OPENROUTER_API_KEY` for both AI Repair Assistant and AI Symptom Diagnosis (server-side proxy)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (typically http://localhost:5173)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Note on API Keys

AI chat requests are proxied through Vite dev server at `/api/ai-chat`, so `OPENROUTER_API_KEY` stays server-side during development.

## Tech Stack

- React 18
- Vite
- Anthropic Claude API

