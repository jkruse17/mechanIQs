# mechanIQs

Vehicle-specific car repair platform that helps people maintain their own cars without intimidation or confusion.

## Features

- **Vehicle Selector**: Choose your specific year, make, and model
- **Parts Catalog**: Browse compatible parts with OEM vs aftermarket pricing
- **Real-Time Parts Data**: Fetch live parts data from RockAuto via Apify API
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
   - Add your API keys:

```bash
cp .env.local.example .env.local
# Edit .env.local and add your keys
```

Required keys:
- **Anthropic API Key**: Get from https://console.anthropic.com/ (required for AI chat)
- **Apify API Token**: Get from https://console.apify.com/account/integrations (required for live parts data)

Your `.env.local` should look like:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-key
VITE_APIFY_API_TOKEN=apify_api_your-actual-token
VITE_APIFY_ROCKAUTO_ACTOR_ID=aljuahqih44TI4X3P
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

## Apify RockAuto Integration

This app uses the [Apify RockAuto Scraper](https://apify.com/lexis-solutions/rockauto) to fetch real-time parts data from RockAuto.com.

### How it works:

1. When you select a vehicle, the app starts with demo/mock parts data
2. Click "FETCH REAL PARTS" in the parts catalog to scrape live data from RockAuto
3. The Apify actor runs in the background and returns actual part prices, availability, and details
4. Results are transformed and displayed in the parts catalog

### Setup Apify:

1. Create a free account at https://apify.com
2. Go to Settings → Integrations: https://console.apify.com/account/integrations
3. Copy your API token
4. Add it to `.env.local` as `VITE_APIFY_API_TOKEN`

### API Service:

The `src/services/apifyService.js` file handles:
- Starting Apify actor runs
- Polling for completion
- Fetching and transforming results
- Fallback to mock data if API is not configured

### Start URL Pattern:

The RockAuto scraper uses URLs like:
```
https://www.rockauto.com/en/catalog/{make},{year},{model}
https://www.rockauto.com/en/partsearch/?partnum={partNumber}
```

## Note on API Keys

The current implementation makes direct API calls to Anthropic from the browser. For production use, you should implement a backend proxy to keep your API key secure.

## Tech Stack

- React 18
- Vite
- Anthropic Claude API (AI assistant)
- Apify API (RockAuto scraper for parts data)

