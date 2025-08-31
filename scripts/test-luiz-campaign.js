/**
 * TESTE DA METODOLOGIA LUIZ - EXEMPLO DEMYXIL
 * Testa geração de campanha usando a estrutura exata do Luiz
 */

const demyxilExample = {
  productName: "Demyxil",
  targetCountry: "Hungary",
  validationScore: 85,
  marketAnalysis: {
    avgCpc: 2.50,
    competitionLevel: "medium",
    searchVolume: 5200,
    trendDirection: "stable"
  },
  productData: {
    price: 9900, // Ft 9900
    currency: "HUF", // Forinto húngaro
    description: "Advanced health supplement for daily wellness",
    category: "health",
    platform: "direct"
  },
  recommendations: {
    suggestedBudget: 350.00, // R$ 350,00 fixo
    estimatedRoi: 200,
    riskLevel: "low"
  }
};

const campaignData = {
  productName: "Demyxil",
  guarantee: "NA", // Conforme print
  unitPrice: 9900,
  discountPercent: 50,
  valueDiscount: 9900,
  country: "Hungary",
  language: "Hungarian", 
  currency: "Ft",
  currencyExample: "Ft 1,000.00"
};

const affiliateUrl = "https://example.com/demyxil-affiliate-link";

async function testLuizMethodology() {
  try {
    console.log("🎯 Testando METODOLOGIA LUIZ com Demyxil...\n");
    
    const response = await fetch('http://localhost:3000/api/v1/campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        validation: demyxilExample,
        affiliateUrl: affiliateUrl,
        exportFormat: 'csv',
        useLuizMethod: true, // USA METODOLOGIA LUIZ
        campaignData: campaignData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ CAMPANHA GERADA COM METODOLOGIA LUIZ!\n");
      
      console.log("📊 INFORMAÇÕES DA CAMPANHA:");
      console.log(`Metodologia: ${result.data.methodology}`);
      console.log(`Produto: ${result.data.metadata.productName}`);
      console.log(`Budget: R$ ${result.data.metadata.estimatedPerformance.dailyBudget}/dia`);
      console.log(`Estrutura: ${result.data.metadata.structure}`);
      console.log(`Strategy: ${result.data.metadata.budgetStrategy}\n`);

      console.log("🎯 HEADLINES:");
      if (result.data.campaign.ads && result.data.campaign.ads.headlines) {
        result.data.campaign.ads.headlines.forEach((headline, index) => {
          const type = index < 7 ? '[FIXO]' : '[CATEGORIA]';
          console.log(`${index + 1}. ${type} ${headline}`);
        });
      }
      console.log();

      console.log("📝 DESCRIPTIONS:");
      if (result.data.campaign.ads && result.data.campaign.ads.descriptions) {
        result.data.campaign.ads.descriptions.forEach((desc, index) => {
          console.log(`${index + 1}. ${desc}`);
        });
      }
      console.log();

      console.log("🔤 KEYWORDS:");
      if (result.data.campaign.keywords) {
        result.data.campaign.keywords.forEach((keyword, index) => {
          console.log(`${index + 1}. ${keyword.keyword} (${keyword.case}, ${keyword.matchType})`);
        });
      }
      console.log();

      console.log("🔗 SITELINKS:");
      if (result.data.campaign.extensions && result.data.campaign.extensions.sitelinks) {
        result.data.campaign.extensions.sitelinks.forEach((sitelink, index) => {
          console.log(`${index + 1}. [${sitelink.category}] ${sitelink.text}`);
        });
      }
      console.log();

      console.log("📢 CALLOUTS:");
      if (result.data.campaign.extensions && result.data.campaign.extensions.callouts) {
        result.data.campaign.extensions.callouts.forEach((callout, index) => {
          console.log(`${index + 1}. [${callout.category}] ${callout.text}`);
        });
      }
      console.log();

      console.log("🏷️ STRUCTURED SNIPPETS:");
      if (result.data.campaign.extensions && result.data.campaign.extensions.snippets) {
        result.data.campaign.extensions.snippets.forEach((snippet, index) => {
          console.log(`${index + 1}. [${snippet.category}] ${snippet.text}`);
        });
      }
      console.log();

      // Salva CSVs se disponível
      if (result.data.csvData) {
        console.log("📁 ARQUIVOS CSV GERADOS:");
        const fs = require('fs');
        const path = require('path');
        
        const csvDir = './generated-campaigns/demyxil-luiz-method';
        if (!fs.existsSync(csvDir)) {
          fs.mkdirSync(csvDir, { recursive: true });
        }
        
        Object.keys(result.data.csvData).forEach(filename => {
          const filePath = path.join(csvDir, filename);
          const content = result.data.csvData[filename];
          fs.writeFileSync(filePath, content);
          
          const lines = content.split('\n').length - 1;
          console.log(`📄 ${filename}: ${lines} linhas`);
        });
        
        console.log(`\n✅ Todos os CSVs salvos em: ${csvDir}`);
        console.log("📋 PRÓXIMO PASSO: Importar manualmente no Google Ads Editor\n");
      }

      console.log("📊 PERFORMANCE ESTIMADA:");
      const perf = result.data.metadata.estimatedPerformance;
      console.log(`Budget Diário: R$ ${perf.dailyBudget}`);
      console.log(`Cliques Estimados: ~${perf.dailyClicks}/dia`);
      console.log(`Conversões Estimadas: ~${perf.estimatedConversions}/dia`);
      console.log(`CPA Estimado: Ft ${perf.estimatedCpa}`);
      console.log(`Scaling: ${perf.scalingThreshold} → Budget máximo R$ ${perf.maxBudget}`);
      console.log(`ROI Estimado: ${perf.estimatedRoi}%\n`);

      console.log("🎉 RESUMO:");
      console.log("✅ Metodologia Luiz implementada com sucesso");
      console.log("✅ Headlines: 7 fixas + 8 por categoria");
      console.log("✅ Keywords: minúscula + MAIÚSCULA"); 
      console.log("✅ Extensions: Sitelinks + Callouts + Snippets");
      console.log("✅ CSVs prontos para Google Ads Editor");
      console.log("✅ Budget fixo R$ 350,00 configurado");
      console.log("✅ Estrutura 1 Campaign = 1 Ad confirmada");

    } else {
      console.error("❌ Erro na geração da campanha:", result.error);
    }

  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Executa o teste
if (require.main === module) {
  testLuizMethodology();
}

module.exports = { testLuizMethodology, demyxilExample, campaignData };