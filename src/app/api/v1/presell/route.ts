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

    // Extrair design tokens e análise de linguagem da página original se fornecida
    let designTokens = null
    let languageAnalysis = null
    
    if (originalPageUrl) {
      try {
        console.log('Extracting design tokens and language from:', originalPageUrl)
        
        // Call design-extract API to get both design tokens and language analysis
        const extractResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v1/design-extract`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: originalPageUrl,
            extractData: false,
            includeLanguageAnalysis: true
          })
        })
        
        if (extractResponse.ok) {
          const extractData = await extractResponse.json()
          if (extractData.success) {
            designTokens = extractData.data.designTokens
            languageAnalysis = extractData.data.languageAnalysis
            console.log('✅ Design tokens extracted:', designTokens)
            console.log('✅ Language analysis extracted:', languageAnalysis)
          }
        }
        
        // Fallback: Try old design matcher if new API fails
        if (!designTokens) {
          designTokens = await designMatcher.extractDesignTokens(originalPageUrl)
          console.log('Design tokens extracted via fallback:', designTokens)
        }
      } catch (error) {
        console.warn('Failed to extract design tokens and language:', error)
        // Use default design tokens in case of error
        designTokens = {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            accent: '#28a745',
            background: '#ffffff',
            text: '#333333',
            button: '#007bff'
          },
          typography: {
            primaryFont: 'Arial, sans-serif',
            secondaryFont: 'Arial, sans-serif',
            headingFont: 'Georgia, serif'
          }
        }
      }
    }

    let presellData
    try {
      const generator = new PresellTemplateGenerator()
      console.log('🎯 generateFromValidation called with options:', { 
        designTokens, 
        customization,
        templateType: templateType || 'default'
      });
      
      presellData = generator.generateFromValidation(validation, affiliateUrl, { 
        designTokens, 
        customization,
        templateType: templateType || 'default'
      })
      
      console.log('✅ Presell generated successfully')
    } catch (genError) {
      console.error('❌ Error during presell generation:', genError)
      throw genError
    }
    
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Error message:', error instanceof Error ? error.message : error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno na geração da presell',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
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