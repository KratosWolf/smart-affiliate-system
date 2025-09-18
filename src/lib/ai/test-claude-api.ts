/**
 * Test script for Claude API integration
 * Tests the provided API key functionality
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
    apiKey: 'mock-gemini-key',
    model: 'gemini-pro',
    maxTokens: 1000
  },
  nanoBanana: {
    apiKey: 'mock-nano-key',
    endpoint: 'https://mock-nano.com/api'
  }
}

export async function testClaudeAPI(): Promise<{
  success: boolean
  error?: string
  result?: any
}> {
  console.log('🧪 Testing Claude API with provided key...')
  
  if (!testConfig.claude.apiKey) {
    return {
      success: false,
      error: 'CLAUDE_API_KEY not found in environment variables'
    }
  }

  try {
    const orchestrator = new MultiAIOrchestrator(testConfig)
    
    // Test simple copywriting request
    const testRequest = {
      task: 'headlines' as const,
      productData: {
        name: 'GlucoGen17',
        type: 'blood sugar supplement',
        benefits: ['natural ingredients', 'scientifically proven', '60-day guarantee']
      },
      language: 'pt-BR',
      targetCountry: 'BR'
    }

    console.log('📝 Sending test request to Claude...')
    const result = await orchestrator.generateCopywriting(testRequest)
    
    console.log('✅ Claude API test successful!')
    console.log('📊 Result:', result)

    return {
      success: true,
      result
    }

  } catch (error: any) {
    console.error('❌ Claude API test failed:', error.message)
    
    return {
      success: false,
      error: error.message
    }
  }
}

// Run test if called directly
if (require.main === module) {
  testClaudeAPI()
    .then(result => {
      console.log('\n🏁 Test completed:')
      console.log(JSON.stringify(result, null, 2))
    })
    .catch(error => {
      console.error('\n💥 Test crashed:', error)
    })
}