// Test endpoint for Campaign Builder Redesign features
import { NextRequest, NextResponse } from 'next/server'
import { BilingualCsvGenerator } from '@/lib/campaigns/bilingual-csv-generator'
import { getCurrencyForCountry } from '@/lib/constants/currencies'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Campaign Builder Redesign features...')

    const { productName, targetCountry, hasDiscountData } = await request.json()

    // Test currency auto-detection
    const currency = getCurrencyForCountry(targetCountry)
    console.log(`💰 Currency auto-detected for ${targetCountry}: ${currency}`)

    // Test bilingual CSV generation
    const csvGenerator = new BilingualCsvGenerator({
      productName: productName || 'TestProduct',
      targetCountry: targetCountry || 'BR',
      targetLanguage: 'pt-BR',
      countryCode: targetCountry || 'BR',
      hasDiscountData: hasDiscountData || false,
      campaignType: 'Standard'
    })

    console.log('🎯 Generating bilingual CSVs...')
    const csvOutput = await csvGenerator.generateAllCsvs()

    console.log(`✅ Generated ${csvOutput.metadata.totalComponents} ad components`)
    console.log(`📊 Standard CSVs: ${Object.keys(csvOutput.standardCsvs).length} files`)
    console.log(`📋 Consolidated CSV: ${csvOutput.consolidatedCsv.split('\n').length - 1} rows`)

    return NextResponse.json({
      success: true,
      data: {
        currency,
        csvOutput,
        summary: {
          totalComponents: csvOutput.metadata.totalComponents,
          standardCsvFiles: Object.keys(csvOutput.standardCsvs).length,
          consolidatedRows: csvOutput.consolidatedCsv.split('\n').length - 1,
          targetLanguage: csvOutput.metadata.targetLanguage,
          generatedAt: csvOutput.metadata.generatedAt
        }
      }
    })

  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}