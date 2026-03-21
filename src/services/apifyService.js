/**
 * Apify RockAuto API Service
 * Handles scraping car parts data from RockAuto.com using Apify actors
 */

const APIFY_API_BASE = 'https://api.apify.com/v2'
const APIFY_TOKEN = import.meta.env.VITE_APIFY_API_TOKEN
const ROCKAUTO_ACTOR_ID = import.meta.env.VITE_APIFY_ROCKAUTO_ACTOR_ID || 'aljuahqih44TI4X3P'

/**
 * Start an Apify actor run to scrape RockAuto
 * @param {Object} input - Actor input parameters
 * @returns {Promise<string>} Run ID
 */
export async function startRockAutoScrape(input) {
  console.log('🚀 Starting Apify RockAuto scrape with input:', input)

  const response = await fetch(
    `${APIFY_API_BASE}/acts/${ROCKAUTO_ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Apify API error:', response.status, errorText)
    throw new Error(`Apify API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  console.log('✅ Apify run started, Run ID:', data.data.id)
  return data.data.id
}

/**
 * Check the status of an Apify actor run
 * @param {string} runId - The run ID to check
 * @returns {Promise<Object>} Run status data
 */
export async function getRunStatus(runId) {
  const response = await fetch(
    `${APIFY_API_BASE}/actor-runs/${runId}?token=${APIFY_TOKEN}`
  )

  if (!response.ok) {
    throw new Error(`Apify API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get the dataset results from a completed run
 * @param {string} datasetId - The dataset ID from a completed run
 * @returns {Promise<Array>} Array of scraped items
 */
export async function getDatasetItems(datasetId) {
  // Add a longer delay to ensure data is fully written to the dataset
  console.log('⏳ Waiting 5 seconds for dataset to be fully written...')
  await new Promise(resolve => setTimeout(resolve, 5000))

  // First, get dataset info to see how many items there are
  const infoUrl = `${APIFY_API_BASE}/datasets/${datasetId}?token=${APIFY_TOKEN}`
  console.log(`📊 Checking dataset info...`)

  try {
    const infoResponse = await fetch(infoUrl)
    if (infoResponse.ok) {
      const info = await infoResponse.json()
      console.log('📊 Dataset info:', info.data)
      console.log(`📊 Dataset has ${info.data?.itemCount || 0} items`)
    }
  } catch (e) {
    console.warn('⚠️ Could not fetch dataset info:', e)
  }

  // Fetch items with explicit limit parameter
  const url = `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=1000`
  console.log(`📥 Fetching dataset items...`)

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Dataset fetch error:', response.status, errorText)
    throw new Error(`Apify API error: ${response.status} ${response.statusText}`)
  }

  // Get raw text first to see what we're dealing with
  const rawText = await response.text()
  console.log('📦 Raw response text (first 500 chars):', rawText.substring(0, 500))

  // Try to parse as JSON
  let data
  try {
    data = JSON.parse(rawText)
  } catch (e) {
    console.error('❌ Failed to parse JSON:', e)
    return []
  }

  console.log('📦 Parsed data:', data)
  console.log('📦 Data type:', typeof data, Array.isArray(data) ? `array with ${data.length} items` : 'not array')

  // Handle both array and object responses
  if (Array.isArray(data)) {
    return data
  } else if (data && data.items) {
    return data.items
  } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    // If it's a single object with content, wrap it in an array
    return [data]
  }

  return []
}

/**
 * Wait for a run to complete and return results
 * @param {string} runId - The run ID to wait for
 * @param {number} maxWaitTime - Maximum wait time in milliseconds (default 120000 = 2 min)
 * @returns {Promise<Array>} Array of scraped items
 */
export async function waitForRunAndGetResults(runId, maxWaitTime = 120000) {
  const startTime = Date.now()
  const pollInterval = 3000 // Poll every 3 seconds
  let pollCount = 0

  console.log(`⏳ Waiting for run ${runId} to complete...`)

  while (Date.now() - startTime < maxWaitTime) {
    pollCount++
    const status = await getRunStatus(runId)
    const runStatus = status.data.status

    console.log(`📊 Poll #${pollCount}: Status = ${runStatus}`)

    if (runStatus === 'SUCCEEDED') {
      console.log('✅ Run succeeded! Full status:', status.data)

      const datasetId = status.data.defaultDatasetId
      const keyValueStoreId = status.data.defaultKeyValueStoreId

      console.log(`📁 Dataset ID: ${datasetId}`)
      console.log(`📁 Key-Value Store ID: ${keyValueStoreId}`)

      // Try to get items from dataset first
      let items = await getDatasetItems(datasetId)

      // If dataset is empty, try key-value store
      if (items.length === 0 && keyValueStoreId) {
        console.log('⚠️ Dataset empty, trying key-value store...')
        items = await getKeyValueStoreOutput(keyValueStoreId)
      }

      console.log(`📦 Retrieved ${items.length} items total`)
      return items
    }

    if (runStatus === 'FAILED' || runStatus === 'ABORTED' || runStatus === 'TIMED-OUT') {
      console.error(`❌ Actor run ${runStatus}`)
      throw new Error(`Actor run ${runStatus.toLowerCase()}`)
    }

    // Still running, wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  console.error('⏰ Timeout waiting for actor run to complete')
  throw new Error('Timeout waiting for actor run to complete')
}

/**
 * Get output from key-value store (backup method)
 * @param {string} storeId - Key-value store ID
 * @returns {Promise<Array>} Array of items
 */
async function getKeyValueStoreOutput(storeId) {
  try {
    // Try to get OUTPUT key from key-value store
    const url = `${APIFY_API_BASE}/key-value-stores/${storeId}/records/OUTPUT?token=${APIFY_TOKEN}`
    console.log('📥 Fetching from key-value store OUTPUT...')

    const response = await fetch(url)
    if (!response.ok) {
      console.log('⚠️ No OUTPUT key in key-value store')
      return []
    }

    const data = await response.json()
    console.log('📦 Key-value store OUTPUT:', data)

    if (Array.isArray(data)) {
      return data
    } else if (data && data.items) {
      return data.items
    } else if (data && typeof data === 'object') {
      return [data]
    }
  } catch (e) {
    console.warn('⚠️ Error fetching from key-value store:', e)
  }

  return []
}

/**
 * Search for parts by vehicle year, make, and model
 * @param {Object} vehicle - Vehicle information
 * @param {string} vehicle.year - Vehicle year
 * @param {string} vehicle.make - Vehicle make
 * @param {string} vehicle.model - Vehicle model
 * @param {string} partCategory - Optional part category filter
 * @returns {Promise<Array>} Array of parts data
 */
export async function searchPartsByVehicle(vehicle, partCategory = null) {
  const { year, make, model } = vehicle

  // Build a vehicle-specific RockAuto catalog URL from the user's input
  // e.g. "2014 Toyota Camry" → https://www.rockauto.com/en/catalog/toyota,2014,camry
  const makeSlug = make.toLowerCase()
  const modelSlug = model.toLowerCase().replace(/\s+/g, '+')
  const searchUrl = `https://www.rockauto.com/en/catalog/${makeSlug},${year},${modelSlug}`

  console.log(`🔍 Searching RockAuto for ${year} ${make} ${model}: ${searchUrl}`)

  const input = {
    startUrls: [{ url: searchUrl }],
    maxRequestsPerCrawl: 20,
    maxPagesPerCrawl: 20,
    proxyConfiguration: {
      useApifyProxy: true,
    },
  }

  if (partCategory) {
    input.partCategory = partCategory
  }

  console.log('📤 Sending input to Apify:', input)

  const runId = await startRockAutoScrape(input)
  return waitForRunAndGetResults(runId)
}

/**
 * Search for a specific part by part number or name
 * @param {string} partQuery - Part number or part name
 * @returns {Promise<Array>} Array of parts data
 */
export async function searchPartByNumber(partQuery) {
  const searchUrl = `https://www.rockauto.com/en/partsearch/?partnum=${encodeURIComponent(partQuery)}`

  const input = {
    startUrls: [{ url: searchUrl }],
    maxRequestsPerCrawl: 20,
    proxyConfiguration: {
      useApifyProxy: true,
    },
  }

  const runId = await startRockAutoScrape(input)
  return waitForRunAndGetResults(runId)
}

/**
 * Mock data for development/testing when API is not configured
 */
export function getMockPartsData() {
  return [
    {
      id: 1,
      name: "Front Brake Pads",
      category: "Brakes",
      manufacturer: "Akebono",
      partNumber: "ACT1089",
      price: 35.99,
      oemPrice: 85.00,
      availability: "In Stock",
      rating: 4.5,
      reviews: 128,
      fitment: "Direct Fit",
    },
    {
      id: 2,
      name: "Engine Air Filter",
      category: "Engine",
      manufacturer: "Mann-Filter",
      partNumber: "C25114",
      price: 18.99,
      oemPrice: 32.00,
      availability: "In Stock",
      rating: 4.7,
      reviews: 89,
      fitment: "Direct Fit",
    },
    {
      id: 3,
      name: "Oil Filter",
      category: "Engine",
      manufacturer: "Mobil 1",
      partNumber: "M1-110",
      price: 12.99,
      oemPrice: 22.00,
      availability: "In Stock",
      rating: 4.8,
      reviews: 256,
      fitment: "Direct Fit",
    },
  ]
}

/**
 * Check if Apify is configured
 */
export function isApifyConfigured() {
  return APIFY_TOKEN && APIFY_TOKEN !== 'apify_api_your-token-here'
}

/**
 * Fetch dataset directly by ID (for testing with successful runs)
 * @param {string} datasetId - The dataset ID from Apify console
 * @returns {Promise<Array>} Array of items
 */
export async function fetchDatasetById(datasetId) {
  console.log(`📥 Fetching dataset by ID: ${datasetId}`)
  return getDatasetItems(datasetId)
}
