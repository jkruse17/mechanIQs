# Testing the Apify RockAuto Integration

This guide will help you test the Apify integration with your mechanIQs app.

## Prerequisites Checklist

✅ API keys configured in `.env.local`:
- `VITE_APIFY_API_TOKEN` - Your Apify API token
- `VITE_ANTHROPIC_API_KEY` - Your Anthropic API key
- `VITE_APIFY_ROCKAUTO_ACTOR_ID` - Set to `aljuahqih44TI4X3P`

✅ Development server running: `npm run dev`
✅ Browser open to http://localhost:5174 (or the port shown in terminal)

## Step-by-Step Testing

### 1. Test the Vehicle Selector

1. Open http://localhost:5174 in your browser
2. You should see the vehicle selector screen
3. Try the quick start: Click "2026 Honda Civic Sport Hybrid"
   - This should load the demo vehicle instantly
4. You should be redirected to the hub screen

### 2. Navigate to Parts Catalog

1. From the hub, click "Parts Catalog"
2. You should see the parts catalog screen with mock data
3. Look for the status banner at the top - it should show "⚠ MOCK DATA"

### 3. Test API Connection

Open browser console (F12 or Right-click → Inspect → Console) to see detailed logs.

1. Click the "FETCH REAL PARTS" button
2. Watch the console for logs:
   ```
   🔧 Fetching real parts for vehicle: {year: '2026', make: 'Honda', model: 'Civic'}
   🚀 Starting Apify RockAuto scrape with input: {...}
   ✅ Apify run started, Run ID: xxx
   ⏳ Waiting for run xxx to complete...
   📊 Poll #1: Status = RUNNING
   📊 Poll #2: Status = RUNNING
   ...
   📊 Poll #N: Status = SUCCEEDED
   ✅ Run completed! Fetching dataset xxx
   📦 Retrieved X items from dataset
   📦 Received data from Apify: [...]
   ✅ Transformed parts: [...]
   ✅ Loaded X real parts from RockAuto
   ```

3. Wait for the scraper to complete (30-90 seconds typically)
4. Look for success message: "Successfully loaded X parts from RockAuto!"
5. Status banner should now show "✓ LIVE DATA"

### 4. Verify Data Display

1. Check that parts are displaying with real RockAuto data
2. Prices should be different from mock data
3. Try filtering by category
4. Verify all categories work

### 5. Test Different Vehicles

1. Return to hub (click "← HUB" button)
2. Click "CHANGE VEHICLE"
3. Try different vehicles:
   - 2025 Toyota Camry
   - 2024 Ford F-150
   - 2023 BMW 3 Series
4. For each vehicle:
   - Go to Parts Catalog
   - Click "FETCH REAL PARTS"
   - Verify data loads

## Console Debugging

### Check API Configuration

Open browser console and run:
```javascript
console.log('Apify Token:', import.meta.env.VITE_APIFY_API_TOKEN)
console.log('Actor ID:', import.meta.env.VITE_APIFY_ROCKAUTO_ACTOR_ID)
```

If these show `undefined`, your environment variables aren't loading. Make sure:
- `.env.local` file exists in project root
- Development server was restarted after adding variables
- Variable names start with `VITE_`

### Test API Directly

In browser console:
```javascript
// Test if Apify is configured
const { isApifyConfigured } = await import('./src/services/apifyService.js')
console.log('Apify configured:', isApifyConfigured())

// Test part search
const { searchPartByNumber } = await import('./src/services/apifyService.js')
const results = await searchPartByNumber('brake pads')
console.log('Search results:', results)
```

## Common Issues & Solutions

### Issue: "API NOT CONFIGURED" Button

**Cause:** Environment variables not loaded

**Solution:**
1. Check `.env.local` exists and has correct values
2. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
3. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue: "Failed to fetch parts: Apify API error: 401"

**Cause:** Invalid API token

**Solution:**
1. Verify token in Apify console: https://console.apify.com/account/integrations
2. Copy the full token including `apify_api_` prefix
3. Update `.env.local`
4. Restart dev server

### Issue: "Failed to fetch parts: Apify API error: 404"

**Cause:** Invalid Actor ID

**Solution:**
1. Verify Actor ID is `aljuahqih44TI4X3P`
2. Check spelling in `.env.local`
3. Restart dev server

### Issue: "Timeout waiting for actor run to complete"

**Cause:** Scraper taking too long or stuck

**Solution:**
1. Check Apify console: https://console.apify.com/actors/runs
2. See if run is still running or failed
3. Try again with a different vehicle
4. Increase timeout in `src/services/apifyService.js` (line 75)

### Issue: "No parts found. Using mock data instead"

**Cause:** RockAuto has no results for that vehicle/search

**Solution:**
1. This is normal for some vehicles
2. Try a more common vehicle (Honda Civic, Toyota Camry)
3. Check console logs to see what data was returned

### Issue: Data loads but looks wrong

**Cause:** Data transformation needs adjustment

**Solution:**
1. Check console logs: "📦 Received data from Apify:"
2. See what fields are available
3. Update transformation in `src/App.jsx` fetchRealParts function
4. Adjust field mappings based on actual data structure

## Performance Testing

### Measure Scrape Time

Add this to browser console:
```javascript
const start = Date.now()
// Click "FETCH REAL PARTS" button
// When done, run:
const elapsed = Date.now() - start
console.log(`Scrape took ${elapsed}ms (${(elapsed/1000).toFixed(1)}s)`)
```

Typical times:
- Simple searches: 20-40 seconds
- Complex vehicles: 40-90 seconds
- Timeout: 120 seconds (2 minutes)

### Check API Usage

Monitor your Apify usage:
1. Go to https://console.apify.com/billing
2. Check "Compute units used"
3. Each scrape typically uses 0.1-0.5 compute units
4. Free tier includes 10 units/month

## Success Criteria

Your integration is working correctly if:

✅ "FETCH REAL PARTS" button is enabled (not "API NOT CONFIGURED")
✅ Console shows detailed logs during scraping
✅ Scraper completes within 2 minutes
✅ Success message appears after loading
✅ Status changes from "MOCK DATA" to "LIVE DATA"
✅ Parts list updates with new data
✅ Different vehicles return different parts
✅ Error handling works (shows error messages on failure)
✅ Fallback to mock data works if scraper fails

## Next Steps

Once testing is successful:

1. **Add More Features:**
   - Implement part search by keyword
   - Add category-specific searches
   - Cache results to reduce API calls

2. **Improve UX:**
   - Add loading progress indicator
   - Show number of parts found
   - Add "Refresh" button to update stale data

3. **Production Prep:**
   - Move API calls to backend proxy
   - Implement caching strategy
   - Add rate limiting
   - Set up error tracking

4. **Monitor Usage:**
   - Track API costs
   - Monitor scraper success rate
   - Log common errors for debugging

## Support Resources

- **Apify Console:** https://console.apify.com
- **Apify Docs:** https://docs.apify.com
- **RockAuto Actor:** https://apify.com/lexis-solutions/rockauto
- **mechanIQs Issues:** https://github.com/jkruse17/mechanIQs/issues

## Quick Reference

**Start server:** `npm run dev`
**View logs:** Open browser console (F12)
**Restart server:** Ctrl+C then `npm run dev`
**Clear cache:** Hard refresh (Ctrl+Shift+R)
**Check API usage:** https://console.apify.com/billing
