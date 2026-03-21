# Apify RockAuto Integration Guide

This guide explains how to set up and use the Apify RockAuto integration in mechanIQs.

## Prerequisites

1. **Apify Account** (Free tier available)
   - Sign up at https://apify.com
   - Free tier includes 10 compute units

2. **API Token**
   - Get from: https://console.apify.com/account/integrations
   - Copy the API token (starts with `apify_api_`)

## Setup Steps

### 1. Configure Environment Variables

Add your Apify API token to `.env.local`:

```env
VITE_APIFY_API_TOKEN=apify_api_your-actual-token-here
VITE_APIFY_ROCKAUTO_ACTOR_ID=aljuahqih44TI4X3P
```

### 2. Understanding the Apify Actor

The RockAuto scraper actor:
- **Actor ID**: `aljuahqih44TI4X3P`
- **Purpose**: Scrapes parts data from RockAuto.com
- **Input**: Start URLs, search parameters
- **Output**: Part details (name, price, manufacturer, etc.)

### 3. Using the Integration

1. Start the app: `npm run dev`
2. Select your vehicle (year, make, model)
3. Navigate to "Parts Catalog"
4. Click "FETCH REAL PARTS" button
5. Wait for the scraper to complete (typically 10-60 seconds)
6. View live parts data from RockAuto

## How It Works

### Architecture

```
User Action → App.jsx (fetchRealParts)
              ↓
         apifyService.js (searchPartsByVehicle)
              ↓
         Apify API (Start Actor Run)
              ↓
         Poll for completion (every 2 seconds)
              ↓
         Fetch Dataset Results
              ↓
         Transform Data → Display in UI
```

### Data Flow

1. **Start Scraper**: Creates an Apify actor run with vehicle-specific URLs
2. **Wait for Results**: Polls the run status every 2 seconds
3. **Fetch Data**: Retrieves the dataset when run completes
4. **Transform**: Converts Apify data format to app format
5. **Display**: Updates UI with real parts data

### URL Patterns

The service builds RockAuto URLs:
- **By Vehicle**: `https://www.rockauto.com/en/catalog/{make},{year},{model}`
- **By Part Number**: `https://www.rockauto.com/en/partsearch/?partnum={query}`

## Troubleshooting

### "API NOT CONFIGURED" Button

- **Cause**: Missing or invalid Apify API token
- **Solution**: Add valid token to `.env.local` and restart dev server

### "Failed to fetch parts" Error

Possible causes:
- Invalid API token
- No internet connection
- Apify service down
- No parts found for vehicle

### Timeout Errors

- **Default timeout**: 2 minutes (120,000ms)
- **Cause**: Scraper taking too long
- **Solution**: Increase timeout in `apifyService.js`:

```javascript
await waitForRunAndGetResults(runId, 180000) // 3 minutes
```

### Mock Data Fallback

If API fails, the app automatically falls back to mock data:
- Shows "⚠ MOCK DATA" indicator
- Displays demo parts
- Allows continued app usage

## API Costs

### Apify Pricing

- **Free Tier**: 10 compute units/month
- **Typical Run**: ~0.1-0.5 compute units per scrape
- **Estimate**: 20-100 free scrapes per month

Monitor usage at: https://console.apify.com/billing

## Development Tips

### Testing with Mock Data

To test without using API credits:
```javascript
// In App.jsx, temporarily set:
const [usingRealData, setUsingRealData] = useState(false)
```

### Custom Transformations

Edit `apifyService.js` to customize data mapping:

```javascript
const transformedParts = data.map((item, index) => ({
    id: index + 100,
    name: item.partName || item.name,
    cat: item.category || "General",
    // Add more fields...
}))
```

### Adding Categories

The scraper supports category filtering:

```javascript
await searchPartsByVehicle(vehicle, "Brakes")
```

## API Reference

### searchPartsByVehicle(vehicle, partCategory)

Fetches parts for a specific vehicle.

**Parameters:**
- `vehicle`: Object with `year`, `make`, `model`
- `partCategory`: Optional category filter

**Returns:** Promise<Array> of parts data

**Example:**
```javascript
const parts = await searchPartsByVehicle(
    { year: "2026", make: "Honda", model: "Civic" },
    "Brakes"
)
```

### searchPartByNumber(partQuery)

Searches for a specific part by number or name.

**Parameters:**
- `partQuery`: Part number or search term

**Returns:** Promise<Array> of matching parts

**Example:**
```javascript
const parts = await searchPartByNumber("ACT1089")
```

### isApifyConfigured()

Checks if Apify API is properly configured.

**Returns:** Boolean

**Example:**
```javascript
if (isApifyConfigured()) {
    // Use real API
} else {
    // Use mock data
}
```

## Next Steps

### Production Deployment

For production, you should:

1. **Use Backend Proxy**: Don't expose API tokens in frontend
2. **Implement Caching**: Cache scraper results to reduce costs
3. **Add Rate Limiting**: Prevent excessive API usage
4. **Error Handling**: Better error messages for users

### Backend Proxy Example (Node.js/Express)

```javascript
// server.js
app.post('/api/search-parts', async (req, res) => {
    const { vehicle } = req.body
    const apifyToken = process.env.APIFY_API_TOKEN // Server-side only

    // Call Apify from server
    const results = await fetch(...)
    res.json(results)
})
```

### Suggested Improvements

- Cache results in localStorage
- Add pagination for large result sets
- Implement part comparison feature
- Add price tracking over time

## Resources

- **Apify Console**: https://console.apify.com
- **RockAuto Scraper**: https://apify.com/lexis-solutions/rockauto
- **Apify API Docs**: https://docs.apify.com/api/v2
- **Support**: https://apify.com/support
