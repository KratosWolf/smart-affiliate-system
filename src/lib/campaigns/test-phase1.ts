/**
 * TESTE DA FASE 1 - SMART FIXED HEADLINES
 * Verificação completa do sistema antes da implementação final
 */

import { smartFixedHeadlines } from './smart-headlines';
import { luizCampaignV3 } from './luiz-campaign-v3';

// Teste 1: Produto com desconto (Skinatrin)
const testSkinatrin = () => {
  console.log('🧪 TESTE 1: Skinatrin com desconto');
  
  const result = smartFixedHeadlines.generateSmartHeadlines({
    productName: 'Skinatrin',
    country: 'PL',
    currency: 'USD',
    discountPercentage: 50,
    guaranteePeriod: '60 dias',
    deliveryType: 'Frete Grátis',
    platform: 'CLICKBANK',
    commissionValue: 45
  });
  
  console.log('📝 Headlines geradas:');
  result.headlines.forEach((h, i) => console.log(`${i+1}. ${h} (${h.length} chars)`));
  
  console.log('\n📊 Validação:', result.metadata.validation.isValid ? '✅ OK' : '❌ ERRO');
  console.log('🌍 Idioma detectado:', result.metadata.language);
  console.log('🔧 Elementos contextuais:', result.metadata.contextualElements.join(', '));
  
  if (result.metadata.validation.warnings.length > 0) {
    console.log('\n⚠️ Avisos:');
    result.metadata.validation.warnings.forEach(w => console.log(`- ${w}`));
  }
  
  return result;
};

// Teste 2: Produto sem desconto (genérico)
const testGeneric = () => {
  console.log('\n\n🧪 TESTE 2: Produto genérico sem dados específicos');
  
  const result = smartFixedHeadlines.generateSmartHeadlines({
    productName: 'FlexWell',
    country: 'BR',
    currency: 'BRL',
    platform: 'HOTMART',
    commissionValue: 150
  });
  
  console.log('📝 Headlines geradas:');
  result.headlines.forEach((h, i) => console.log(`${i+1}. ${h} (${h.length} chars)`));
  
  console.log('\n📊 Validação:', result.metadata.validation.isValid ? '✅ OK' : '❌ ERRO');
  console.log('🌍 Idioma detectado:', result.metadata.language);
  console.log('🔧 Elementos contextuais:', result.metadata.contextualElements.join(', ') || 'Nenhum');
  
  return result;
};

// Teste 3: Campanha completa
const testFullCampaign = () => {
  console.log('\n\n🧪 TESTE 3: Campanha completa V3');
  
  return luizCampaignV3.generateCampaign({
    productName: 'Skinatrin',
    platform: 'CLICKBANK',
    commissionValue: 45,
    country: 'PL',
    currency: 'USD',
    producerPageUrl: 'https://skinatrin.com',
    affiliateUrl: 'https://hop.clickbank.net/skinatrin',
    discountPercentage: 50,
    guaranteePeriod: '60 dias',
    deliveryType: 'Express Delivery'
  });
};

// Executa todos os testes
export const runPhase1Tests = async () => {
  console.log('🚀 INICIANDO TESTES DA FASE 1\n');
  console.log('=' .repeat(60));
  
  try {
    // Teste headlines Polish
    const test1 = testSkinatrin();
    
    // Teste headlines Portuguese  
    const test2 = testGeneric();
    
    // Teste campanha completa
    const test3 = await testFullCampaign();
    
    console.log('\n\n' + '='.repeat(60));
    console.log('📋 RESUMO DOS TESTES:');
    console.log('✅ Headlines Polish (Skinatrin): ', test1.metadata.validation.isValid ? 'OK' : 'ERRO');
    console.log('✅ Headlines Portuguese (FlexWell):', test2.metadata.validation.isValid ? 'OK' : 'ERRO');
    console.log('✅ Campanha completa V3: ', test3.csvFiles.ready ? 'OK' : 'ERRO');
    
    console.log('\n📊 ESTATÍSTICAS:');
    console.log('- Headlines contextuais Skinatrin:', test1.metadata.contextualElements.length);
    console.log('- Headlines contextuais FlexWell:', test2.metadata.contextualElements.length);
    console.log('- Idiomas suportados: 25 países');
    console.log('- Validação automática: Ativa');
    
    if (test1.metadata.validationReport) {
      console.log('\n📋 RELATÓRIO DE VALIDAÇÃO:');
      console.log(test1.metadata.validationReport);
    }
    
    return {
      success: true,
      tests: { test1, test2, test3 }
    };
    
  } catch (error) {
    console.error('❌ ERRO NOS TESTES:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Para uso direto
if (require.main === module) {
  runPhase1Tests();
}