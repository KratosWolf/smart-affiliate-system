/**
 * 🤖 AI GENERATION ENDPOINT
 * Conecta com Claude/Gemini para gerar conteúdo
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      )
    }

    console.log('🤖 AI Generate - Prompt received:', prompt.substring(0, 100) + '...')

    // Tentar Claude primeiro, depois Gemini como fallback
    let result: string

    try {
      result = await generateWithClaude(prompt)
      console.log('✅ Generated with Claude')
    } catch (claudeError) {
      console.log('⚠️ Claude failed, trying Gemini...', claudeError)
      try {
        result = await generateWithGemini(prompt)
        console.log('✅ Generated with Gemini')
      } catch (geminiError) {
        console.log('❌ Both AI providers failed')
        throw new Error('Ambos provedores AI falharam')
      }
    }

    return NextResponse.json({ result })

  } catch (error) {
    console.error('❌ AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Erro na geração AI', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

/**
 * 🔵 GERAR COM CLAUDE
 */
async function generateWithClaude(prompt: string): Promise<string> {
  const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY

  if (!CLAUDE_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY não configurada')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${errorData}`)
  }

  const data = await response.json()
  return data.content[0].text
}

/**
 * 🟢 GERAR COM GEMINI
 */
async function generateWithGemini(prompt: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GOOGLE_API_KEY

  if (!GEMINI_API_KEY) {
    throw new Error('GOOGLE_API_KEY não configurada')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000
        }
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`)
  }

  const data = await response.json()

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Resposta inválida do Gemini')
  }

  return data.candidates[0].content.parts[0].text
}

/**
 * 📋 GET - INFORMAÇÕES DA API
 */
export async function GET() {
  return NextResponse.json({
    name: 'AI Generation API',
    version: '1.0.0',
    description: 'Gera conteúdo usando Claude ou Gemini',
    providers: ['Claude 3 Sonnet', 'Google Gemini Pro'],
    usage: {
      method: 'POST',
      body: {
        prompt: 'string (obrigatório)'
      }
    },
    fallbackOrder: ['Claude', 'Gemini']
  })
}