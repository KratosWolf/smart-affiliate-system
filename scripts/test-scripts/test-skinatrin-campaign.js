/**
 * Teste do Campaign Builder com dados reais do Skinatrin
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

async function testCampaignBuilder() {
  try {
    console.log("🧪 Testando Campaign Builder com Skinatrin...\n");
    
    const response = await fetch('http://localhost:3000/api/v1/campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        validation: skinatrinValidation,
        affiliateUrl: affiliateUrl,
        presellUrl: presellUrl,
        exportFormat: 'csv'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Campanha gerada com sucesso!\n");
      
      // Mostra resumo da campanha
      console.log("📊 RESUMO DA CAMPANHA:");
      console.log(`Nome: ${result.data.campaign.campaign.name}`);
      console.log(`Orçamento: ${result.data.campaign.campaign.budget} ${result.data.campaign.campaign.currency}/dia`);
      console.log(`CPA Alvo: ${result.data.campaign.campaign.targetCpa} ${result.data.campaign.campaign.currency}`);
      console.log(`País: ${result.data.campaign.campaign.locations.join(', ')}`);
      console.log(`Idioma: ${result.data.campaign.campaign.languages.join(', ')}\n`);
      
      // Mostra keywords
      console.log("🎯 PALAVRAS-CHAVE:");
      result.data.campaign.keywords.forEach((keyword, index) => {
        console.log(`${index + 1}. "${keyword.keyword}" (${keyword.matchType}) - Máx CPC: ${keyword.maxCpc.toFixed(2)} PLN`);
      });
      console.log();
      
      // Mostra anúncios
      console.log("📢 ANÚNCIOS:");
      result.data.campaign.ads.forEach((ad, index) => {
        console.log(`\nAnúncio ${index + 1}:`);
        console.log(`Headlines: ${ad.headlines.join(' | ')}`);
        console.log(`Descriptions: ${ad.descriptions.join(' | ')}`);
        console.log(`URL Final: ${ad.finalUrl}`);
        console.log(`URL Display: ${ad.displayUrl}`);
      });
      console.log();
      
      // Mostra extensões
      console.log("🔧 EXTENSÕES:");
      result.data.campaign.extensions.forEach((ext, index) => {
        console.log(`${index + 1}. ${ext.type}: ${ext.text}`);
      });
      console.log();
      
      // Mostra estimativas de performance
      console.log("📈 ESTIMATIVAS DE PERFORMANCE:");
      const perf = result.data.metadata.estimatedPerformance;
      console.log(`Cliques Diários: ~${perf.dailyClicks}`);
      console.log(`Conversões Estimadas: ~${perf.estimatedConversions}/dia`);
      console.log(`CPA Estimado: ${perf.estimatedCpa.toFixed(2)} PLN`);
      console.log(`ROI Estimado: ${perf.estimatedRoi}%\n`);
      
      // Mostra CSV se disponível
      if (result.data.csvData) {
        console.log("📁 ARQUIVOS CSV GERADOS:");
        Object.keys(result.data.csvData).forEach(filename => {
          console.log(`- ${filename}: ${result.data.csvData[filename].split('\n').length - 1} linhas`);
        });
        console.log();
      }
      
      // Salva CSVs se disponível
      if (result.data.csvData) {
        const fs = require('fs');
        const path = require('path');
        
        const csvDir = './generated-campaigns/skinatrin';
        if (!fs.existsSync(csvDir)) {
          fs.mkdirSync(csvDir, { recursive: true });
        }
        
        Object.keys(result.data.csvData).forEach(filename => {
          const filePath = path.join(csvDir, filename);
          fs.writeFileSync(filePath, result.data.csvData[filename]);
          console.log(`💾 Salvo: ${filePath}`);
        });
        
        console.log(`\n✅ Arquivos CSV salvos em: ${csvDir}`);
      }
      
    } else {
      console.error("❌ Erro na geração da campanha:", result.error);
      if (result.validation_errors) {
        console.error("Erros de validação:", result.validation_errors);
      }
    }

  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Executa o teste
if (require.main === module) {
  testCampaignBuilder();
}

module.exports = { testCampaignBuilder, skinatrinValidation };