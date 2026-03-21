# mechanIQs

Vehicle-specific car repair platform that helps people maintain their own cars without intimidation or confusion.

## Features

- **Vehicle Selector**: Choose your specific year, make, and model
- **Parts Catalog**: Browse compatible parts with OEM vs aftermarket pricing
- **Guided Repairs**: Step-by-step instructions for common maintenance tasks
- **AI Assistant**: Get real-time help from Claude AI during repairs
- **Vehicle Context**: All guidance is specific to your exact vehicle

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Anthropic API key (get one from https://console.anthropic.com/)

```bash
cp .env.local.example .env.local
# Edit .env.local and add your API key
```

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

The current implementation makes direct API calls to Anthropic from the browser. For production use, you should implement a backend proxy to keep your API key secure.

## Tech Stack

- React 18
- Vite
- Anthropic Claude API

