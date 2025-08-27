/**
 * CSV Exporter - Gera arquivos CSV prontos para Google Ads
 * Formatos oficiais do Google Ads Editor
 */

import { CampaignStructure } from './campaign-builder';

export interface CSVExportResult {
  campaigns: string;
  adGroups: string; 
  keywords: string;
  ads: string;
  extensions: string;
  masterFile: string; // NOVO: Arquivo único com tudo
  filenames: {
    campaigns: string;
    adGroups: string;
    keywords: string;
    ads: string;
    extensions: string;
    masterFile: string; // NOVO: Nome do arquivo master
  };
}

export class CSVExporter {
  
  /**
   * Exporta campanha completa para CSVs do Google Ads
   */
  exportCampaign(campaign: CampaignStructure): CSVExportResult {
    const baseFilename = this.generateBaseFilename(campaign);
    
    return {
      campaigns: this.generateCampaignsCSV(campaign),
      adGroups: '', // Não usado na estrutura simplificada
      keywords: this.generateKeywordsCSV(campaign),
      ads: this.generateAdsCSV(campaign),
      extensions: this.generateExtensionsCSV(campaign),
      masterFile: this.generateMasterFileCSV(campaign), // NOVO: Arquivo único
      filenames: {
        campaigns: `${baseFilename}-campaigns.csv`,
        adGroups: '', // Não usado
        keywords: `${baseFilename}-keywords.csv`,
        ads: `${baseFilename}-ads.csv`,
        extensions: `${baseFilename}-extensions.csv`,
        masterFile: `${baseFilename}-COMPLETO.csv` // NOVO: Arquivo master com tudo
      }
    };
  }
  
  /**
   * Gera CSV de campanhas
   * Formato: Google Ads Editor - Campaigns
   */
  private generateCampaignsCSV(campaign: CampaignStructure): string {
    const headers = [
      'Campaign',
      'Budget',
      'Budget Type', 
      'Currency Code',
      'Campaign Type',
      'Networks',
      'Languages',
      'Locations',
      'Bid Strategy Type',
      'Target CPA'
    ].join(',');
    
    const row = [
      `"${campaign.campaign.name}"`,
      campaign.campaign.budget,
      'Daily',
      campaign.campaign.currency,
      'Search',
      'Google Search',
      `"${campaign.campaign.languages.join(';')}"`,
      `"${campaign.campaign.locations.join(';')}"`,
      campaign.campaign.biddingStrategy,
      campaign.campaign.targetCpa || ''
    ].join(',');
    
    return `${headers}\n${row}`;
  }
  
  /**
   * Gera CSV de grupos de anúncios  
   */
  private generateAdGroupsCSV(campaign: CampaignStructure): string {
    // Não usado na estrutura simplificada (1 Campaign = 1 Ad)
    return '';
  }
  
  /**
   * Gera CSV de palavras-chave
   */
  private generateKeywordsCSV(campaign: CampaignStructure): string {
    const headers = [
      'Campaign',
      'Ad Group', 
      'Keyword',
      'Match Type',
      'Max CPC',
      'Final URL'
    ].join(',');
    
    const rows = campaign.keywords.map(keyword => [
      `"${campaign.campaign.name}"`,
      `"${campaign.campaign.name}-AdGroup"`,
      `"${this.formatKeywordForMatchType(keyword.keyword, keyword.matchType)}"`,
      keyword.matchType,
      keyword.maxCpc,
      `"${keyword.finalUrl}"`
    ].join(','));
    
    return `${headers}\n${rows.join('\n')}`;
  }
  
  /**
   * Gera CSV de anúncios
   */
  private generateAdsCSV(campaign: CampaignStructure): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Headline 1',
      'Headline 2', 
      'Headline 3',
      'Description Line 1',
      'Description Line 2',
      'Final URL',
      'Display URL'
    ].join(',');
    
    const rows = campaign.ads.map(ad => [
      `"${campaign.campaign.name}"`,
      `"${campaign.campaign.name}-AdGroup"`,
      `"${ad.headlines[0] || ''}"`,
      `"${ad.headlines[1] || ''}"`,
      `"${ad.headlines[2] || ''}"`,
      `"${ad.descriptions[0] || ''}"`,
      `"${ad.descriptions[1] || ''}"`,
      `"${ad.finalUrl}"`,
      `"${ad.displayUrl}"`
    ].join(','));
    
    return `${headers}\n${rows.join('\n')}`;
  }
  
  /**
   * Gera CSV de extensões
   */
  private generateExtensionsCSV(campaign: CampaignStructure): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Extension Type',
      'Extension Text',
      'Extension URL'
    ].join(',');
    
    const rows = campaign.extensions.map(extension => [
      `"${campaign.campaign.name}"`,
      `"${campaign.campaign.name}-AdGroup"`,
      extension.type,
      `"${extension.text}"`,
      `"${extension.url || ''}"`
    ].join(','));
    
    return `${headers}\n${rows.join('\n')}`;
  }
  
  /**
   * NOVO: Gera arquivo master com tudo em um CSV só
   */
  private generateMasterFileCSV(campaign: CampaignStructure): string {
    const sections = [];
    
    // Seção 1: Informações da Campanha
    sections.push('# CAMPANHA GOOGLE ADS - ARQUIVO COMPLETO');
    sections.push('# Gerado pelo Sistema Inteligente de Marketing para Afiliados');
    sections.push(`# Produto: ${campaign.metadata.productName}`);
    sections.push(`# País: ${campaign.metadata.country}`);
    sections.push(`# Data: ${new Date().toLocaleDateString('pt-BR')}`);
    sections.push('');
    
    // Seção 2: Configurações da Campanha
    sections.push('## CONFIGURAÇÕES DA CAMPANHA');
    sections.push('Campo,Valor');
    sections.push(`Nome da Campanha,"${campaign.campaign.name}"`);
    sections.push(`Orçamento Diário,${campaign.campaign.budget} ${campaign.campaign.currency}`);
    sections.push(`Estratégia de Lance,${campaign.campaign.biddingStrategy}`);
    sections.push(`CPA Alvo,${campaign.campaign.targetCpa} ${campaign.campaign.currency}`);
    sections.push(`Localização,${campaign.metadata.country}`);
    sections.push('');
    
    // Seção 3: Palavras-chave
    sections.push('## PALAVRAS-CHAVE');
    sections.push('Keyword,Tipo,CPC Máximo,URL Final');
    campaign.keywords.forEach(keyword => {
      sections.push([
        `"${this.formatKeywordForMatchType(keyword.keyword, keyword.matchType)}"`,
        keyword.matchType,
        `${keyword.maxCpc} ${campaign.campaign.currency}`,
        `"${keyword.finalUrl}"`
      ].join(','));
    });
    sections.push('');
    
    // Seção 4: Anúncios
    sections.push('## ANÚNCIOS');
    sections.push('Tipo,Texto,Caracteres');
    campaign.ads.forEach((ad, adIndex) => {
      sections.push(`# Anúncio ${adIndex + 1}`);
      ad.headlines.forEach((headline, hIndex) => {
        sections.push(`Headline ${hIndex + 1},"${headline}",${headline.length}`);
      });
      ad.descriptions.forEach((desc, dIndex) => {
        sections.push(`Description ${dIndex + 1},"${desc}",${desc.length}`);
      });
      sections.push(`URL Final,"${ad.finalUrl}",`);
      sections.push(`URL Display,"${ad.displayUrl}",`);
    });
    sections.push('');
    
    // Seção 5: Extensões
    sections.push('## EXTENSÕES');
    sections.push('Tipo,Texto,URL');
    campaign.extensions.forEach(extension => {
      sections.push([
        extension.type,
        `"${extension.text}"`,
        `"${extension.url || ''}"`
      ].join(','));
    });
    sections.push('');
    
    // Seção 6: Instruções de Uso
    sections.push('## COMO USAR ESTE ARQUIVO');
    sections.push('Instrução,Detalhes');
    sections.push('"1. Login Google Ads","Acesse ads.google.com e faça login"');
    sections.push('"2. Nova Campanha","Clique em + Nova Campanha"');
    sections.push('"3. Tipo","Escolha: Pesquisa"');
    sections.push('"4. Objetivo","Escolha: Conversões ou Tráfego"');
    sections.push(`"5. Nome","Use: ${campaign.campaign.name}"`);
    sections.push(`"6. Orçamento","Configure: ${campaign.campaign.budget} ${campaign.campaign.currency}/dia"`);
    sections.push('"7. Lances","Escolha: CPA alvo ou Maximizar conversões"');
    sections.push(`"8. Localização","Configure: ${campaign.metadata.country}"`);
    sections.push('"9. Palavras-chave","Copie as keywords da seção acima"');
    sections.push('"10. Anúncios","Copie headlines e descriptions"');
    sections.push('"11. Extensões","Adicione callouts da seção extensões"');
    sections.push('"12. Revisar","Confira tudo antes de ativar"');
    sections.push('');
    
    // Seção 7: Métricas Esperadas  
    sections.push('## MÉTRICAS ESPERADAS');
    sections.push('Métrica,Valor Estimado');
    sections.push(`Score de Viabilidade,${campaign.metadata.validationScore}%`);
    sections.push(`CPA Estimado,${campaign.metadata.estimatedCpa} ${campaign.campaign.currency}`);
    const avgCpc = campaign.keywords.length > 0 ? campaign.keywords[0].maxCpc : 2.0;
    sections.push(`Cliques por Dia,${Math.round(campaign.campaign.budget / avgCpc)}`);
    sections.push(`Conversões por Dia,${Math.round((campaign.campaign.budget / avgCpc) * 0.03)}`);
    
    return sections.join('\n');
  }

  /**
   * Gera arquivo ZIP com todos os CSVs
   */
  async exportAsZip(campaign: CampaignStructure): Promise<Buffer> {
    // Em um ambiente real, usaríamos uma lib como JSZip
    // Por enquanto, retornamos os dados para download individual
    throw new Error('ZIP export não implementado ainda. Use CSVs individuais.');
  }
  
  /**
   * Gera resumo da campanha para revisão
   */
  generateSummary(campaign: CampaignStructure): string {
    const summary = `
# RESUMO DA CAMPANHA GERADA

## 📊 CONFIGURAÇÕES GERAIS
- **Campanha:** ${campaign.campaign.name}
- **Orçamento:** ${campaign.campaign.budget} ${campaign.campaign.currency}/dia
- **Estratégia:** ${campaign.campaign.biddingStrategy}
- **CPA Alvo:** ${campaign.campaign.targetCpa} ${campaign.campaign.currency}
- **País:** ${campaign.metadata.country}

## 🎯 PALAVRAS-CHAVE (${campaign.keywords.length})
${campaign.keywords.map(k => `- ${this.formatKeywordForMatchType(k.keyword, k.matchType)} (${k.matchType}, CPC máx: ${k.maxCpc})`).join('\n')}

## 📝 ANÚNCIOS
### Headlines:
${campaign.ads[0].headlines.map((h, i) => `${i+1}. "${h}" (${h.length} chars)`).join('\n')}

### Descriptions:
${campaign.ads[0].descriptions.map((d, i) => `${i+1}. "${d}" (${d.length} chars)`).join('\n')}

## 🔗 EXTENSÕES (${campaign.extensions.length})
${campaign.extensions.map(e => `- ${e.type}: "${e.text}"`).join('\n')}

## 📈 MÉTRICAS ESPERADAS
- **Score de Viabilidade:** ${campaign.metadata.validationScore}%
- **CPA Estimado:** ${campaign.metadata.estimatedCpa} ${campaign.campaign.currency}
- **Gerado em:** ${new Date(campaign.metadata.generatedAt).toLocaleString('pt-BR')}

---
**✅ PRÓXIMOS PASSOS:**
1. Revisar configurações acima
2. Fazer download dos CSVs
3. Fazer upload no Google Ads
4. Ativar campanha para teste
`;
    
    return summary.trim();
  }
  
  // Helper methods
  
  private generateBaseFilename(campaign: CampaignStructure): string {
    const productName = campaign.metadata.productName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const country = campaign.metadata.country.toLowerCase().replace(/[^a-z0-9]/g, '');
    const date = new Date().toISOString().split('T')[0];
    
    return `${productName}-${country}-${date}`;
  }
  
  private formatKeywordForMatchType(keyword: string, matchType: string): string {
    switch (matchType) {
      case 'EXACT':
        return `[${keyword}]`;
      case 'PHRASE':
        return `"${keyword}"`;
      case 'BROAD':
      default:
        return keyword;
    }
  }
  
  /**
   * Valida se os dados estão dentro dos limites do Google Ads
   */
  validateCampaign(campaign: CampaignStructure): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Valida headlines (máx 30 chars)
    campaign.ads.forEach((ad, adIndex) => {
      ad.headlines.forEach((headline, hIndex) => {
        if (headline.length > 30) {
          errors.push(`Anúncio ${adIndex+1}, Headline ${hIndex+1}: "${headline}" tem ${headline.length} caracteres (máx: 30)`);
        }
      });
      
      // Valida descriptions (máx 90 chars)  
      ad.descriptions.forEach((desc, dIndex) => {
        if (desc.length > 90) {
          errors.push(`Anúncio ${adIndex+1}, Description ${dIndex+1}: tem ${desc.length} caracteres (máx: 90)`);
        }
      });
    });
    
    // Valida orçamento mínimo
    if (campaign.campaign.budget < 1) {
      errors.push(`Orçamento muito baixo: ${campaign.campaign.budget} (mínimo: 1.00)`);
    }
    
    // Valida keywords
    if (campaign.keywords.length === 0) {
      errors.push('Nenhuma palavra-chave definida');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton
export const csvExporter = new CSVExporter();