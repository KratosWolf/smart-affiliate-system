/**
 * Full AI Campaign Integration Test
 * Testa o sistema completo: Metodologia Luiz + Claude + Gemini + Competitive Intelligence
 */

import { AICampaignIntegration, type AICampaignRequest } from './ai-campaign-integration'

export async function testFullIntegration(): Promise<void> {
  console.log('🚀 TESTING FULL AI CAMPAIGN INTEGRATION')
  console.log('=====================================\n')

  const integration = new AICampaignIntegration()

  // Test case: GlucoGen17 para Brasil
  const testRequest: AICampaignRequest = {
    // Product data
    productName: 'GlucoGen17',
    productPrice: 197,
    pack3Price: 477,
    pack5Price: 697,
    currency: 'BRL',
    
    // Campaign details  
    targetCountry: 'BR',
    language: 'pt-BR',
    keyword: 'suplemento diabetes',
    
    // Optional enhancements
    guaranteePeriod: '60 dias',
    deliveryType: 'Grátis',
    targetCity: 'São Paulo',
    bonuses: 'E-book + Consultoria',
    scarcityType: 'Últimas 48 horas',
    
    // AI configuration
    useRealAI: true,
    useCompetitiveIntelligence: true
  }

  console.log('📝 Test Request:')
  console.log(JSON.stringify(testRequest, null, 2))
  console.log('\n🎭 Starting AI campaign generation...\n')

  try {
    const result = await integration.generateAICampaign(testRequest)
    
    console.log('✅ CAMPAIGN GENERATION SUCCESSFUL!')
    console.log('================================\n')
    
    // Display results
    console.log('🎯 CAMPAIGN HEADLINES:')
    if (result.campaign.headlines) {
      result.campaign.headlines.forEach((headline: string, index: number) => {
        const isAI = index >= 7 // Headlines 8-15 are AI-generated
        console.log(`${index + 1}. ${headline} ${isAI ? '🤖 (AI)' : '📋 (Fixed)'}`)
      })
    }
    
    console.log('\n📝 CAMPAIGN DESCRIPTIONS:')
    if (result.campaign.descriptions) {
      result.campaign.descriptions.forEach((desc: string, index: number) => {
        console.log(`${index + 1}. ${desc}`)
      })
    }

    console.log('\n🔧 AI METADATA:')
    console.log(`• AI Models Used: ${result.metadata.aiModelsUsed.join(', ') || 'None'}`)
    console.log(`• Processing Time: ${result.metadata.processingTime}ms`)
    console.log(`• Estimated Cost: $${result.metadata.totalCost.toFixed(6)}`)
    console.log(`• Success: ${result.metadata.success ? '✅' : '❌'}`)
    console.log(`• Fallbacks Used: ${result.metadata.fallbacksUsed.length > 0 ? result.metadata.fallbacksUsed.join(', ') : 'None'}`)

    console.log('\n🎨 AI HEADLINES ANALYSIS:')
    console.log(`• Original Count: ${result.aiHeadlines.original.length}`)
    console.log(`• Validated Count: ${result.aiHeadlines.validated.length}`)
    console.log(`• Confidence: ${(result.aiHeadlines.confidence * 100).toFixed(1)}%`)
    console.log(`• Reasoning: ${result.aiHeadlines.reasoning.join('; ')}`)

    if (result.aiHeadlines.validated.length > 0) {
      console.log('\n🤖 AI-GENERATED HEADLINES:')
      result.aiHeadlines.validated.forEach((headline: string, index: number) => {
        console.log(`  ${index + 8}. ${headline} (${headline.length} chars)`)
      })
    }

    console.log('\n📊 AI DESCRIPTIONS ANALYSIS:')
    console.log(`• Original Count: ${result.aiDescriptions.original.length}`)
    console.log(`• Validated Count: ${result.aiDescriptions.validated.length}`)
    console.log(`• Confidence: ${(result.aiDescriptions.confidence * 100).toFixed(1)}%`)

    if (result.aiDescriptions.validated.length > 0) {
      console.log('\n📝 AI-GENERATED DESCRIPTIONS:')
      result.aiDescriptions.validated.forEach((desc: string, index: number) => {
        console.log(`  ${index + 1}. ${desc} (${desc.length} chars)`)
      })
    }

    if (result.competitorAnalysis) {
      console.log('\n🔍 COMPETITIVE ANALYSIS:')
      console.log(`• Keyword: ${result.competitorAnalysis.keyword}`)
      console.log(`• Total Ads Found: ${result.competitorAnalysis.totalAdsFound}`)
      console.log(`• Top Performers: ${result.competitorAnalysis.topPerformers.length}`)
    }

    console.log('\n🏆 FULL CAMPAIGN DATA:')
    console.log('Headlines: ' + (result.campaign.headlines?.length || 0))
    console.log('Descriptions: ' + (result.campaign.descriptions?.length || 0))
    console.log('Callouts: ' + (result.campaign.callouts?.length || 0))
    console.log('Sitelinks: ' + (result.campaign.sitelinks?.length || 0))

    console.log('\n🎉 INTEGRATION TEST COMPLETED SUCCESSFULLY!')
    
  } catch (error) {
    console.error('❌ INTEGRATION TEST FAILED:')
    console.error(error)
  }
}

// Teste mais simples sem AI real (para debugging)
export async function testBasicIntegration(): Promise<void> {
  console.log('🧪 TESTING BASIC INTEGRATION (NO REAL AI)')
  console.log('========================================\n')

  const integration = new AICampaignIntegration()

  const basicRequest: AICampaignRequest = {
    productName: 'GlucoGen17',
    productPrice: 197,
    currency: 'BRL',
    targetCountry: 'BR',
    language: 'pt-BR',
    useRealAI: false,
    useCompetitiveIntelligence: false
  }

  try {
    const result = await integration.generateAICampaign(basicRequest)
    
    console.log('✅ Basic campaign generation successful!')
    console.log(`Headlines: ${result.campaign.headlines?.length || 0}`)
    console.log(`Descriptions: ${result.campaign.descriptions?.length || 0}`)
    console.log(`Processing time: ${result.metadata.processingTime}ms`)
    console.log(`Success: ${result.metadata.success}`)
    
  } catch (error) {
    console.error('❌ Basic integration failed:', error)
  }
}

// Run tests if called directly
if (require.main === module) {
  async function runAllTests() {
    // Test 1: Basic integration
    await testBasicIntegration()
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Test 2: Full integration with AI
    await testFullIntegration()
  }

  runAllTests().catch(error => {
    console.error('\n💥 Test suite crashed:', error)
    process.exit(1)
  })
}