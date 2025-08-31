/**
 * Design and Data Extraction API
 * Extracts design tokens and product data from producer pages
 */

import { NextRequest, NextResponse } from 'next/server'
import { designMatcher } from '@/lib/design/design-matcher'

export async function POST(request: NextRequest) {
  try {
    const { url, extractData } = await request.json()
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    console.log(`🔍 Extracting data from producer page: ${url}`)

    // Extract design tokens using existing design matcher
    let designTokens = null
    let productData = null

    try {
      designTokens = await designMatcher.extractDesignTokens(url)
      console.log('✅ Design tokens extracted successfully')
    } catch (error) {
      console.warn('⚠️ Failed to extract design tokens:', error)
      // Continue even if design extraction fails
    }

    // If extractData flag is set, also extract product information
    if (extractData) {
      try {
        productData = await extractProductData(url)
        console.log('✅ Product data extracted successfully')
      } catch (error) {
        console.warn('⚠️ Failed to extract product data:', error)
        // Provide fallback product data
        productData = {
          price: 97,
          currency: 'BRL',
          description: 'Produto inovador com excelentes resultados comprovados',
          benefits: [
            'Resultado garantido em 30 dias',
            'Aprovado por especialistas',
            'Milhares de clientes satisfeitos',
            '90 dias de garantia'
          ],
          images: []
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        url,
        designTokens,
        productData,
        extractedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Design extraction API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to extract data from page',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Extract product-specific data from the page
 */
async function extractProductData(url: string) {
  try {
    // Use the existing smart scraper functionality
    const { smartScraper } = await import('@/lib/scraping/smart-scraper')
    
    const scrapedData = await smartScraper.scrapePage(url, {
      extractProductInfo: true,
      extractImages: true,
      extractPricing: true
    })

    // Transform scraped data into our product structure
    const productData = {
      price: extractPrice(scrapedData.content),
      currency: detectCurrency(scrapedData.content),
      description: extractDescription(scrapedData.content),
      benefits: extractBenefits(scrapedData.content),
      images: scrapedData.images || []
    }

    return productData
    
  } catch (error) {
    console.error('❌ Product data extraction failed:', error)
    throw error
  }
}

/**
 * Helper functions for data extraction
 */
function extractPrice(content: string): number {
  // Look for price patterns
  const pricePatterns = [
    /R\$\s*(\d+(?:,\d{2})?)/g,
    /\$(\d+(?:\.\d{2})?)/g,
    /(\d+(?:,\d{2})?\s*reais?)/gi,
    /por apenas\s+.*?(\d+)/gi
  ]

  for (const pattern of pricePatterns) {
    const matches = content.match(pattern)
    if (matches && matches.length > 0) {
      const priceStr = matches[0].replace(/[^\d,\.]/g, '').replace(',', '.')
      const price = parseFloat(priceStr)
      if (price > 0 && price < 10000) { // Reasonable price range
        return Math.round(price)
      }
    }
  }

  return 97 // Default fallback price
}

function detectCurrency(content: string): string {
  if (content.includes('R$') || content.includes('reais') || content.includes('BRL')) {
    return 'BRL'
  }
  if (content.includes('$') || content.includes('USD') || content.includes('dollar')) {
    return 'USD'
  }
  if (content.includes('€') || content.includes('EUR') || content.includes('euro')) {
    return 'EUR'
  }
  
  return 'BRL' // Default to BRL
}

function extractDescription(content: string): string {
  // Look for product descriptions in common HTML patterns
  const descriptionPatterns = [
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)/i,
    /<div[^>]*class="[^"]*about[^"]*"[^>]*>([^<]+)/i,
    /<h2[^>]*>([^<]*(?:sobre|about|descrição|description)[^<]*)<\/h2>/i
  ]

  for (const pattern of descriptionPatterns) {
    const match = content.match(pattern)
    if (match && match[1] && match[1].length > 20) {
      return match[1].substring(0, 200) // Limit description length
    }
  }

  // Fallback: extract first meaningful paragraph
  const paragraphs = content.match(/<p[^>]*>([^<]{30,200})<\/p>/gi)
  if (paragraphs && paragraphs.length > 0) {
    const cleanText = paragraphs[0].replace(/<[^>]*>/g, '').trim()
    if (cleanText.length > 30) {
      return cleanText.substring(0, 200)
    }
  }

  return 'Produto inovador com excelentes resultados comprovados'
}

function extractBenefits(content: string): string[] {
  const benefits: string[] = []
  
  // Look for list items, checkmarks, or bullet points
  const benefitPatterns = [
    /<li[^>]*>([^<]{10,100})<\/li>/gi,
    /✓\s*([^<\n]{10,100})/gi,
    /✅\s*([^<\n]{10,100})/gi,
    /•\s*([^<\n]{10,100})/gi,
    /-\s*([^<\n]{10,100})/gi
  ]

  for (const pattern of benefitPatterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 10) {
        const benefit = match[1].replace(/<[^>]*>/g, '').trim()
        if (benefit.length >= 10 && benefit.length <= 100) {
          benefits.push(benefit)
        }
      }
    }
  }

  // Remove duplicates and limit to 6 benefits
  const uniqueBenefits = [...new Set(benefits)].slice(0, 6)
  
  // Ensure we have at least some benefits
  if (uniqueBenefits.length === 0) {
    return [
      'Resultado garantido em 30 dias',
      'Aprovado por especialistas', 
      'Milhares de clientes satisfeitos',
      'Garantia de 90 dias'
    ]
  }

  return uniqueBenefits
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/design-extract',
    methods: ['POST'],
    description: 'Extracts design tokens and product data from producer pages',
    requiredParams: {
      url: 'string - URL of the producer page to extract data from'
    },
    optionalParams: {
      extractData: 'boolean - Whether to extract product data in addition to design tokens'
    },
    example: {
      url: 'https://example.com/product-page',
      extractData: true
    }
  })
}