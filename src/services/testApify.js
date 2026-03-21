/**
 * Test utility for Apify RockAuto integration
 * Run this in the browser console to test the API
 */

import {
  searchPartsByVehicle,
  searchPartByNumber,
  isApifyConfigured,
  getMockPartsData
} from './apifyService.js'

export async function testApifyConnection() {
  console.log('🧪 Testing Apify Connection...')
  console.log('API Configured:', isApifyConfigured())

  if (!isApifyConfigured()) {
    console.error('❌ Apify API not configured. Please add VITE_APIFY_API_TOKEN to .env.local')
    return
  }

  try {
    // Test with a simple part search
    console.log('Testing part search by number...')
    const results = await searchPartByNumber('brake pads')
    console.log('✅ Test successful! Results:', results)
    return results
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

export async function testVehicleSearch(vehicle = { year: '2026', make: 'Honda', model: 'Civic' }) {
  console.log('🧪 Testing Vehicle Search...', vehicle)

  if (!isApifyConfigured()) {
    console.error('❌ Apify API not configured')
    return getMockPartsData()
  }

  try {
    const results = await searchPartsByVehicle(vehicle)
    console.log('✅ Vehicle search successful! Results:', results)
    return results
  } catch (error) {
    console.error('❌ Vehicle search failed:', error)
    throw error
  }
}

// Make available globally for testing in browser console
if (typeof window !== 'undefined') {
  window.testApifyConnection = testApifyConnection
  window.testVehicleSearch = testVehicleSearch
}
