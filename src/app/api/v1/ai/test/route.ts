import { NextRequest, NextResponse } from 'next/server'
import { MultiAIOrchestrator } from '@/lib/ai/multi-ai-orchestrator'

const aiConfig = {
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4000
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash',
    maxTokens: 2000
  },
  nanoBanana: {
    apiKey: '',
    endpoint: ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, targetCountry = 'BR', language = 'pt-BR', task = 'headlines' } = body

    if (!productName) {
      return NextResponse.json({
        success: false,
        error: 'productName é obrigatório'
      }, { status: 400 })
    }

    console.log(`🧪 Testing AI system for product: ${productName} in ${targetCountry}`)

    const orchestrator = new MultiAIOrchestrator(aiConfig)

    // Test copywriting generation
    const result = await orchestrator.generateCopywriting({
      task,
      productData: {
        name: productName,
        category: 'health',
        price: 97
      },
      language,
      targetCountry
    })

    return NextResponse.json({
      success: true,
      data: {
        productName,
        targetCountry,
        language,
        task,
        result: {
          content: result.content,
          reasoning: result.reasoning,
          confidence: result.confidence
        },
        apiKeysConfigured: {
          claude: !!process.env.CLAUDE_API_KEY,
          gemini: !!process.env.GEMINI_API_KEY
        },
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ AI Test Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro no teste de IA',
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKeysConfigured: {
        claude: !!process.env.CLAUDE_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/ai/test',
    methods: ['POST'],
    description: 'Testa o sistema de IA (Claude + Gemini) para geração de headlines e descriptions',
    usage: {
      method: 'POST',
      body: {
        productName: 'string (required)',
        targetCountry: 'string (optional, default: BR)',
        language: 'string (optional, default: pt-BR)',  
        task: 'headlines | descriptions | callouts | sitelinks (optional, default: headlines)'
      }
    },
    example: {
      productName: 'Skinatrin',
      targetCountry: 'IT',
      language: 'it-IT',
      task: 'headlines'
    }
  })
}