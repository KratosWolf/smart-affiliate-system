/**
 * Teste simplificado do Campaign Builder
 */

const skinatrinValidation = {
  productName: "Skinatrin",
  targetCountry: "Polônia",
  validationScore: 85,
  marketAnalysis: {
    avgCpc: 2.50,
    competitionLevel: "medium",
    searchVolume: 8100,
    trendDirection: "stable"
  },
  productData: {
    price: 149.00,
    currency: "PLN",
    description: "Advanced antifungal treatment formula",
    category: "health",
    platform: "direct"
  },
  recommendations: {
    suggestedBudget: 75.00,
    estimatedRoi: 180,
    riskLevel: "low"
  },
  validationDetails: {
    hasOfficialPage: true,
    hasTestimonials: true,
    hasGuarantee: true,
    priceCompetitive: true
  }
};

const affiliateUrl = "https://5y1c6.doctormurin.com/l";
const presellUrl = "https://bestbargains24x7.com/quiz-skinatrin.html";

async function testCampaignSimple() {
  try {
    console.log("🧪 Testando Campaign Builder (sem CSV)...\n");
    
    const response = await fetch('http://localhost:3000/api/v1/campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        validation: skinatrinValidation,
        affiliateUrl: affiliateUrl,
        presellUrl: presellUrl
        // Não solicita CSV para evitar o erro
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Campanha gerada com sucesso!\n");
      console.log("📊 ESTRUTURA COMPLETA DA CAMPANHA:");
      console.log(JSON.stringify(result.data.campaign, null, 2));
      
      console.log("\n📈 ESTIMATIVAS:");
      console.log(`Cliques/dia: ~${result.data.metadata.estimatedPerformance.dailyClicks}`);
      console.log(`Conversões/dia: ~${result.data.metadata.estimatedPerformance.estimatedConversions}`);
      console.log(`CPA: ${result.data.metadata.estimatedPerformance.estimatedCpa.toFixed(2)} PLN`);
      console.log(`ROI: ${result.data.metadata.estimatedPerformance.estimatedRoi}%`);
      
    } else {
      console.error("❌ Erro:", result.error);
    }

  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

testCampaignSimple();