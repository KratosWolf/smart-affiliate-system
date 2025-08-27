import { NextRequest, NextResponse } from 'next/server'
import { imageGenerator } from '@/lib/images/image-generator'
import { imageCleaner } from '@/lib/images/image-cleaner'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      productName, 
      originalImageUrl, 
      productType, 
      targetAudience, 
      style,
      designTokens,
      cleanImages = true,
      optimizeForGoogleAds = true
    } = body
    
    if (!productName || !originalImageUrl) {
      return NextResponse.json({
        success: false,
        error: 'productName e originalImageUrl são obrigatórios'
      }, { status: 400 })
    }
    
    console.log(`Generating image variations for ${productName}`)
    
    // 1. Gerar variações
    const variations = await imageGenerator.generateVariations({
      productName,
      originalImageUrl,
      productType: productType || 'general',
      targetAudience: targetAudience || 'unisex',
      style: style || 'modern',
      designTokens
    })
    
    if (variations.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Falha ao gerar variações de imagem'
      }, { status: 500 })
    }
    
    // 2. Limpar metadados se solicitado
    let cleanedVariations = variations
    if (cleanImages) {
      console.log('Cleaning image metadata...')
      
      const cleaningResults = await Promise.all(
        variations.map(variation => 
          imageCleaner.cleanImage({ buffer: variation.imageBuffer }, {
            quality: 90,
            maxWidth: 1200,
            maxHeight: 1200,
            format: 'jpeg'
          })
        )
      )
      
      cleanedVariations = variations.map((variation, index) => {
        const cleaningResult = cleaningResults[index]
        
        if (cleaningResult.success) {
          return {
            ...variation,
            imageBuffer: cleaningResult.cleanedBuffer,
            metadata: {
              ...variation.metadata,
              ...cleaningResult.metadata,
              originalSize: cleaningResult.originalSize,
              optimizedSize: cleaningResult.optimizedSize,
              compressionRatio: cleaningResult.compressionRatio
            }
          }
        }
        
        return variation // Keep original if cleaning failed
      })
    }
    
    // 3. Otimizar para Google Ads se solicitado
    if (optimizeForGoogleAds) {
      cleanedVariations = await imageGenerator.optimizeForGoogleAds(cleanedVariations)
    }
    
    // 4. Preparar resposta
    const response = {
      success: true,
      data: {
        productName,
        generatedAt: new Date().toISOString(),
        totalVariations: cleanedVariations.length,
        variations: cleanedVariations.map(variation => ({
          id: variation.id,
          name: variation.name,
          description: variation.description,
          metadata: variation.metadata,
          // Convert buffer to base64 for response
          imageData: `data:image/${variation.metadata.format};base64,${variation.imageBuffer.toString('base64')}`
        })),
        processing: {
          designTokensApplied: !!designTokens,
          metadataCleaned: cleanImages,
          googleAdsOptimized: optimizeForGoogleAds
        },
        statistics: {
          averageSize: cleanedVariations.reduce((sum, v) => sum + v.metadata.size, 0) / cleanedVariations.length,
          totalSize: cleanedVariations.reduce((sum, v) => sum + v.metadata.size, 0),
          compressionRatio: cleanImages 
            ? cleanedVariations.reduce((sum, v) => sum + (v.metadata as any).compressionRatio || 0, 0) / cleanedVariations.length
            : 0
        }
      }
    }
    
    console.log(`Generated ${cleanedVariations.length} image variations successfully`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Image generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno na geração de imagens'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/images/generate',
    methods: ['POST'],
    description: 'Gera variações automáticas de imagens para ads Google',
    requiredParams: {
      productName: 'string - Nome do produto',
      originalImageUrl: 'string - URL da imagem original do produto'
    },
    optionalParams: {
      productType: 'supplement | cosmetic | digital | cbd | general - Tipo do produto (default: general)',
      targetAudience: 'women | men | unisex - Público-alvo (default: unisex)',
      style: 'modern | medical | organic | tech | classic - Estilo visual (default: modern)',
      designTokens: 'object - Tokens de design da página original',
      cleanImages: 'boolean - Remove metadados EXIF (default: true)',
      optimizeForGoogleAds: 'boolean - Otimiza para Google Ads (default: true)'
    },
    variations: [
      'Imagem limpa original',
      'Com background gradient',
      'Com badges de confiança', 
      'Ênfase em quantidade',
      'Contexto lifestyle',
      'Estilo antes/depois (supplements/cosmetics)',
      'Blur version (CBD compliance)',
      'Mobile square format'
    ],
    example: {
      productName: 'Flexwell',
      originalImageUrl: 'https://example.com/product.jpg',
      productType: 'supplement',
      targetAudience: 'unisex',
      style: 'modern',
      designTokens: {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          accent: '#28a745',
          background: '#ffffff'
        }
      }
    }
  })
}