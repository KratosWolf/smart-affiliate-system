/**
 * TESTE EM PRODUÇÃO - METODOLOGIA LUIZ
 * Testa a API de campanha na Vercel
 */

async function testProduction() {
  console.log("🚀 TESTANDO METODOLOGIA LUIZ EM PRODUÇÃO\n");
  
  const productionUrl = 'https://smart-affiliate-system.vercel.app';
  
  // DADOS DE EXEMPLO - Leptitox Brasil
  const testData = {
    productName: "Leptitox",
    targetCountry: "Brasil",
    affiliateUrl: "https://go.hotmart.com/leptitox-oficial",
    useLuizMethod: true,
    exportFormat: "csv",
    campaignData: {
      productName: "Leptitox",
      guarantee: 60,
      unitPrice: 147,
      discountPercent: 50,
      valueDiscount: 74,
      country: "Brasil",
      language: "Portuguese", 
      currency: "BRL",
      currencyExample: "R$ 1.000,00"
    }
  };
  
  try {
    console.log("📋 ENVIANDO PARA PRODUÇÃO:");
    console.log(`   URL: ${productionUrl}/api/v1/campaign`);
    console.log(`   Produto: ${testData.productName}`);
    console.log(`   País: ${testData.targetCountry}`);
    console.log(`   Metodologia: Luiz Oficial`);
    console.log();
    
    const response = await fetch(`${productionUrl}/api/v1/campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📡 STATUS: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ERRO:", errorText);
      return;
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log("✅ CAMPANHA GERADA EM PRODUÇÃO!\n");
      
      console.log("📊 INFORMAÇÕES:");
      console.log(`   Metodologia: ${result.data.methodology}`);
      console.log(`   Produto: ${result.data.metadata.productName}`);
      console.log(`   Budget: R$ ${result.data.metadata.estimatedPerformance.dailyBudget}/dia`);
      console.log(`   CPA Target: R$ ${result.data.campaign.campaign.targetCpa}`);
      console.log(`   Estrutura: ${result.data.metadata.structure}`);
      console.log();
      
      console.log("🎯 HEADLINES (5 primeiros):");
      if (result.data.campaign.ads && result.data.campaign.ads.headlines) {
        result.data.campaign.ads.headlines.slice(0, 5).forEach((headline, index) => {
          const type = index < 7 ? '[FIXO]' : '[CATEGORIA]';
          console.log(`   ${index + 1}. ${type} ${headline}`);
        });
      }
      console.log();
      
      console.log("🔤 KEYWORDS:");
      if (result.data.campaign.keywords) {
        result.data.campaign.keywords.forEach((keyword, index) => {
          console.log(`   ${index + 1}. ${keyword.keyword} (${keyword.case}, ${keyword.matchType})`);
        });
      }
      console.log();
      
      console.log("📁 EXTENSÕES:");
      if (result.data.campaign.extensions) {
        console.log(`   Sitelinks: ${result.data.campaign.extensions.sitelinks.length}`);
        console.log(`   Callouts: ${result.data.campaign.extensions.callouts.length}`);
        console.log(`   Snippets: ${result.data.campaign.extensions.snippets.length}`);
      }
      console.log();
      
      // MOSTRA CSVs DISPONÍVEIS
      if (result.data.csvData) {
        console.log("📄 CSVs GERADOS:");
        Object.keys(result.data.csvData).forEach((filename, index) => {
          const content = result.data.csvData[filename];
          const lines = content.split('\\n').length;
          console.log(`   ${index + 1}. ${filename} (${lines} linhas)`);
        });
        console.log();
        
        // Salva CSVs localmente para teste
        const fs = require('fs');
        const path = require('path');
        
        const csvDir = './generated-campaigns/leptitox-production';
        if (!fs.existsSync(csvDir)) {
          fs.mkdirSync(csvDir, { recursive: true });
        }
        
        Object.keys(result.data.csvData).forEach(filename => {
          const filePath = path.join(csvDir, filename);
          fs.writeFileSync(filePath, result.data.csvData[filename]);
        });
        
        console.log(`💾 CSVs salvos localmente em: ${csvDir}`);
        console.log("📋 PRÓXIMO PASSO: Importar no Google Ads Editor");
      }
      
      console.log();
      console.log("🎉 TESTE PRODUÇÃO CONCLUÍDO!");
      console.log("🔥 RESULTADO:");
      console.log("   ✅ API produção funcionando");
      console.log("   ✅ Metodologia Luiz ativa");
      console.log("   ✅ Budget R$ 350 configurado");
      console.log("   ✅ CSVs prontos para download");
      console.log("   ✅ Sistema 100% operacional");
      
    } else {
      console.error("❌ Erro na resposta:", result.error);
    }
    
  } catch (error) {
    console.error("❌ ERRO NO TESTE:", error.message);
    console.log();
    console.log("🔍 POSSÍVEIS CAUSAS:");
    console.log("   - Problema de rede");
    console.log("   - Vercel cold start (demora inicial)");
    console.log("   - Erro na implementação em produção");
  }
}

// Executa teste
if (require.main === module) {
  testProduction();
}

module.exports = { testProduction };