import { NextRequest, NextResponse } from 'next/server'
import { PresellTemplateGenerator } from '@/lib/presell/template-generator'
import { designMatcher } from '@/lib/design/design-matcher'
import { ProductValidationResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { validation, affiliateUrl, customization, originalPageUrl, templateType } = body
    
    console.log('🎯 API /presell received request with templateType:', templateType);
    console.log('Full body:', body);
    
    if (!validation || !affiliateUrl) {
      return NextResponse.json({
        success: false,
        error: 'Dados de validação e URL de afiliado são obrigatórios'
      }, { status: 400 })
    }

    // Extrair design tokens da página original se fornecida
    let designTokens = null
    if (originalPageUrl) {
      try {
        designTokens = await designMatcher.extractDesignTokens(originalPageUrl)
        console.log('Design tokens extracted:', designTokens)
      } catch (error) {
        console.warn('Failed to extract design tokens:', error)
        // Continua sem design matching em caso de erro
      }
    }

    const generator = new PresellTemplateGenerator()
    const presellData = generator.generateFromValidation(validation, affiliateUrl, { 
      designTokens, 
      customization,
      templateType: templateType || 'default'
    })
    
    const response = {
      success: true,
      data: {
        productName: validation.productName,
        targetCountry: validation.targetCountry,
        validationScore: validation.validationScore,
        generated: {
          html: presellData.html,
          css: presellData.css,
          js: presellData.js,
          assets: presellData.assets
        },
        optimization: {
          mobileOptimized: true,
          seoOptimized: true,
          conversionOptimized: true,
          loadTimeOptimized: true
        },
        metadata: {
          language: presellData.countrySettings?.language || 'pt-BR',
          currency: presellData.countrySettings?.currency || 'BRL',
          country: presellData.countrySettings?.country || validation.targetCountry,
          timezone: presellData.countrySettings?.timezone || 'America/Sao_Paulo',
          templateType: presellData.templateType || 'default',
          countdownEnabled: true,
          socialProofEnabled: true,
          testimonials: true,
          designMatched: !!designTokens,
          generatedAt: new Date().toISOString()
        },
        design: designTokens,
        countrySettings: presellData.countrySettings
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Presell generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno na geração da presell'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/presell',
    methods: ['POST'],
    description: 'Gera presell otimizada a partir de dados de validação',
    requiredParams: {
      validation: 'ProductValidationResponse - dados da validação do produto',
      affiliateUrl: 'string - URL de afiliado para conversão'
    },
    optionalParams: {
      originalPageUrl: 'string - URL da página original para matching de design',
      customization: {
        colors: 'object - personalização de cores',
        texts: 'object - textos personalizados',
        features: 'object - features a habilitar/desabilitar'
      }
    },
    example: {
      validation: '{ productName: "Flexwell", validationScore: 85, ... }',
      affiliateUrl: 'https://go.hotmart.com/abc123',
      customization: {
        colors: { primary: '#007bff', secondary: '#28a745' },
        texts: { ctaButton: 'QUERO AGORA' }
      }
    }
  })
}