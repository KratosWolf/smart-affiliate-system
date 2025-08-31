/**
 * Test API endpoint to verify Google APIs are working
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleSearchValidator } from '@/lib/validation/google-search-validator'
import { API_CONFIG } from '@/lib/config/api-config'

export async function GET(request: NextRequest) {
  console.log('🧪 TESTING GOOGLE API CONNECTION')
  console.log('================================')
  
  // Check configuration
  console.log('📋 API Configuration:')
  console.log('- Custom Search enabled:', API_CONFIG.google.customSearchAPI.enabled)
  console.log('- API Key set:', !!process.env.GOOGLE_API_KEY)
  console.log('- Search Engine ID set:', !!process.env.GOOGLE_SEARCH_ENGINE_ID)
  console.log('- Service Account credentials:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS)
  console.log('')
  
  const validator = new GoogleSearchValidator()
  const results: any[] = []
  
  // Test with different products
  const testProducts = [
    'TestProduct12345XYZ', // Unique product that should have no real results
    'NouriX', // Previous test product  
    'iPhone', // Popular product with many results
  ]
  
  for (const product of testProducts) {
    console.log(`🔍 Testing product: "${product}"`)
    console.log('⏱️  Starting validation...')
    
    const startTime = Date.now()
    
    try {
      const result = await validator.validateProduct(product)
      const endTime = Date.now()
      const processingTime = endTime - startTime
      
      const testResult = {
        product,
        processingTime,
        score: result.score,
        viable: result.viable,
        totalResults: result.searchData.totalResults,
        specificResults: result.searchData.specificResults,
        reasoning: result.reasoning,
        apiStatus: processingTime > 500 ? 'REAL_API' : 
                   result.reasoning.includes('[Enhanced Mock Data]') ? 'MOCK_DATA' :
                   processingTime < 10 ? 'POSSIBLE_MOCK' : 'UNKNOWN'
      }
      
      results.push(testResult)
      
      console.log(`✅ Results for "${product}":`)
      console.log(`   - Processing time: ${processingTime}ms`)
      console.log(`   - Score: ${result.score}`)
      console.log(`   - Viable: ${result.viable}`)
      console.log(`   - Total Results: ${result.searchData.totalResults.toLocaleString()}`)
      console.log(`   - Specific Results: ${result.searchData.specificResults}`)
      console.log(`   - API Status: ${testResult.apiStatus}`)
      console.log('---')
      
    } catch (error) {
      console.error(`❌ Error testing "${product}":`, error)
      results.push({
        product,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  // Analyze results and provide recommendations
  const allMockData = results.every(r => r.apiStatus === 'MOCK_DATA')
  const hasRealApiResults = results.some(r => r.apiStatus === 'REAL_API')
  
  let status = 'UNKNOWN'
  let recommendations: string[] = []
  
  if (allMockData) {
    status = 'API_NOT_WORKING'
    recommendations = [
      '🔑 Google API key appears to be invalid',
      '📋 Go to Google Cloud Console (console.cloud.google.com)',
      '✅ Enable Custom Search API',
      '🔄 Generate new API key',
      '📝 Update .env.local file',
      '🔍 Create Custom Search Engine at programmablesearchengine.google.com'
    ]
  } else if (hasRealApiResults) {
    status = 'API_WORKING'
    recommendations = [
      '✅ Google Search API is working correctly',
      '🚀 Real competitive intelligence data is being used',
      '📊 System is fully operational'
    ]
  }
  
  // Return results
  return NextResponse.json({
    message: 'Google API Connection Test Completed',
    status,
    configuration: {
      customSearchEnabled: API_CONFIG.google.customSearchAPI.enabled,
      hasApiKey: !!process.env.GOOGLE_API_KEY,
      hasSearchEngineId: !!process.env.GOOGLE_SEARCH_ENGINE_ID,
      hasServiceAccount: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      apiKeyPreview: process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.substring(0, 15)}...` : 'MISSING'
    },
    recommendations,
    results
  })
}