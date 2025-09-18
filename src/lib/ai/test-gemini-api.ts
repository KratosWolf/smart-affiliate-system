/**
 * Test script for Gemini API integration
 * Tests the provided API key functionality with Gemini 2.0 Flash
 */

import { MultiAIOrchestrator } from './multi-ai-orchestrator'

// Test configuration
const testConfig = {
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1000
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash',
    maxTokens: 1000
  },
  nanoBanana: {
    apiKey: 'mock-nano-key',
    endpoint: 'https://mock-nano.com/api'
  }
}

export async function testGeminiAPI(): Promise<{
  success: boolean
  error?: string
  result?: any
}> {
  console.log('🧪 Testing Gemini 2.0 Flash API with provided key...')
  
  if (!testConfig.gemini.apiKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not found in environment variables'
    }
  }

  try {
    const orchestrator = new MultiAIOrchestrator(testConfig)
    
    // Test simple validation request
    const testRequest = {
      content: [
        'Compre GlucoGen17 Agora',
        'GlucoGen17 - Melhor Preço', 
        'Controle Natural da Glicose'
      ],
      type: 'headlines' as const,
      policies: ['google-ads-policy', 'health-supplements']
    }

    console.log('📝 Sending validation request to Gemini 2.0 Flash...')
    const result = await orchestrator.validateContent(testRequest)
    
    console.log('✅ Gemini 2.0 Flash API test successful!')
    console.log('📊 Validation Result:', result)

    return {
      success: true,
      result
    }

  } catch (error: any) {
    console.error('❌ Gemini API test failed:', error.message)
    
    return {
      success: false,
      error: error.message
    }
  }
}

export async function testGeminiFlashSimple(): Promise<{
  success: boolean
  error?: string
  result?: any
}> {
  console.log('🧪 Testing Gemini Flash simple task...')
  
  if (!testConfig.gemini.apiKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY not found in environment variables'
    }
  }

  try {
    const orchestrator = new MultiAIOrchestrator(testConfig)
    
    console.log('⚡ Testing simple task with Gemini Flash...')
    const result = await orchestrator.processSimpleTask('translate', {
      content: ['Buy GlucoGen17 Now', 'Best Price Online'],
      targetLanguage: 'pt-BR'
    })
    
    console.log('✅ Gemini Flash simple task successful!')
    console.log('📊 Translation Result:', result)

    return {
      success: true,
      result
    }

  } catch (error: any) {
    console.error('❌ Gemini Flash test failed:', error.message)
    
    return {
      success: false,
      error: error.message
    }
  }
}

// Run both tests if called directly
if (require.main === module) {
  async function runAllTests() {
    console.log('🏁 Starting Gemini API tests...\n')

    // Test 1: Validation
    console.log('=== TEST 1: Gemini Validation ===')
    const validationResult = await testGeminiAPI()
    console.log('Result:', JSON.stringify(validationResult, null, 2))
    console.log('')

    // Test 2: Simple Task
    console.log('=== TEST 2: Gemini Flash Simple Task ===') 
    const flashResult = await testGeminiFlashSimple()
    console.log('Result:', JSON.stringify(flashResult, null, 2))

    console.log('\n🏁 All Gemini tests completed!')
  }

  runAllTests().catch(error => {
    console.error('\n💥 Test suite crashed:', error)
  })
}