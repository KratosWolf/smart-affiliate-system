/**
 * GERADOR DE CSVs PARA GOOGLE ADS EDITOR
 * Formatos específicos para import manual - METODOLOGIA LUIZ
 */

export interface CSVCampaignData {
  campaign: {
    name: string;
    budget: number;
    targetCpa: number;
    currency: string;
  };
  keywords: Array<{
    keyword: string;
    matchType: string;
    case: string;
  }>;
  headlines: string[];
  descriptions: string[];
  sitelinks: Array<{ text: string; category: string }>;
  callouts: Array<{ text: string; category: string }>;
  snippets: Array<{ text: string; category: string }>;
  affiliateUrl: string;
}

export class GoogleAdsCSVGenerator {

  /**
   * GERA TODOS OS ARQUIVOS CSV COM NOME DO PRODUTO
   * Inclui versões originais + traduções para revisão
   */
  generateAllCSVs(data: CSVCampaignData, targetLanguage?: string): Record<string, string> {
    // Extrai nome do produto e sanitiza
    const productName = this.sanitizeFileName(this.extractProductName(data.campaign.name));
    
    const files: Record<string, string> = {
      // Arquivos originais (para Google Ads)
      [`${productName}-campaign-structure.csv`]: this.generateCampaignCSV(data),
      [`${productName}-keywords.csv`]: this.generateKeywordsCSV(data),
      [`${productName}-ads.csv`]: this.generateAdsCSV(data),
      [`${productName}-sitelinks.csv`]: this.generateSitelinksCSV(data),
      [`${productName}-callouts.csv`]: this.generateCalloutsCSV(data),
      [`${productName}-snippets.csv`]: this.generateSnippetsCSV(data),
      [`${productName}-import-guide.md`]: this.generateImportGuide(data)
    };

    // 🌍 GERAR VERSÕES TRADUZIDAS PARA REVISÃO (se não for português/inglês)
    if (targetLanguage && !['pt', 'pt-BR', 'en', 'en-US'].includes(targetLanguage)) {
      const translatedData = this.createTranslatedData(data, targetLanguage);
      
      files[`${productName}-ads-PT.csv`] = this.generateAdsCSV(translatedData);
      files[`${productName}-review-guide-PT.md`] = this.generateReviewGuide(data, translatedData, targetLanguage);
    }

    return files;
  }

  /**
   * EXTRAI NOME DO PRODUTO DA CAMPANHA
   */
  private extractProductName(campaignName: string): string {
    // Campaign name format: "PRODUTO - PAÍS - DATA - PLATAFORMA - COMISSÃO"
    const parts = campaignName.split(' - ');
    return parts[0] || 'Produto';
  }

  /**
   * SANITIZA NOME PARA ARQUIVO
   */
  private sanitizeFileName(name: string): string {
    return name
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
      .substring(0, 20);
  }

  /**
   * 1. CAMPAIGN STRUCTURE CSV
   */
  private generateCampaignCSV(data: CSVCampaignData): string {
    const headers = [
      'Campaign',
      'Campaign Type', 
      'Status',
      'Budget',
      'Budget Type',
      'Bid Strategy',
      'Target CPA',
      'Currency',
      'Language',
      'Location'
    ];

    const row = [
      data.campaign.name,
      'Search',
      'Active',
      data.campaign.budget.toString(),
      'Daily',
      'Target CPA',
      data.campaign.targetCpa.toString(),
      data.campaign.currency,
      'Portuguese',
      'Brazil'
    ];

    return this.formatCSV([headers, row]);
  }

  /**
   * 2. KEYWORDS CSV (MINÚSCULA + MAIÚSCULA)
   */
  private generateKeywordsCSV(data: CSVCampaignData): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Keyword',
      'Criterion Type',
      'Max CPC',
      'Final URL',
      'Match Type',
      'Status'
    ];

    const rows = data.keywords.map(keyword => [
      data.campaign.name,
      `${data.campaign.name} - Ad Group`,
      keyword.keyword,
      'Keyword',
      '2.50', // CPC padrão
      data.affiliateUrl,
      'Broad match',
      'Active'
    ]);

    return this.formatCSV([headers, ...rows]);
  }

  /**
   * 3. ADS CSV (HEADLINES + DESCRIPTIONS)
   */
  private generateAdsCSV(data: CSVCampaignData): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Ad Type',
      'Status',
      'Final URL',
      ...Array.from({length: 15}, (_, i) => `Headline ${i + 1}`),
      ...Array.from({length: 4}, (_, i) => `Description ${i + 1}`)
    ];

    // Preenche headlines (máximo 15)
    const headlineValues = Array.from({length: 15}, (_, i) => 
      data.headlines[i] || ''
    );

    // Preenche descriptions (máximo 4)
    const descriptionValues = Array.from({length: 4}, (_, i) => 
      data.descriptions[i] || ''
    );

    const row = [
      data.campaign.name,
      `${data.campaign.name} - Ad Group`,
      'Responsive Search Ad',
      'Active',
      data.affiliateUrl,
      ...headlineValues,
      ...descriptionValues
    ];

    return this.formatCSV([headers, row]);
  }

  /**
   * 4. SITELINKS CSV
   */
  private generateSitelinksCSV(data: CSVCampaignData): string {
    const headers = [
      'Campaign',
      'Extension Type',
      'Sitelink Text',
      'Sitelink URL',
      'Status',
      'Category'
    ];

    const rows = data.sitelinks.map(sitelink => [
      data.campaign.name,
      'Sitelink',
      sitelink.text,
      data.affiliateUrl,
      'Active',
      sitelink.category
    ]);

    return this.formatCSV([headers, ...rows]);
  }

  /**
   * 5. CALLOUTS CSV
   */
  private generateCalloutsCSV(data: CSVCampaignData): string {
    const headers = [
      'Campaign',
      'Extension Type',
      'Callout Text',
      'Status',
      'Category'
    ];

    const rows = data.callouts.map(callout => [
      data.campaign.name,
      'Callout',
      callout.text,
      'Active',
      callout.category
    ]);

    return this.formatCSV([headers, ...rows]);
  }

  /**
   * 6. STRUCTURED SNIPPETS CSV
   */
  private generateSnippetsCSV(data: CSVCampaignData): string {
    const headers = [
      'Campaign',
      'Extension Type',
      'Snippet Header',
      'Snippet Value',
      'Status',
      'Category'
    ];

    const rows = data.snippets.map(snippet => [
      data.campaign.name,
      'Structured Snippet',
      'Offers', // Header padrão
      snippet.text,
      'Active',
      snippet.category
    ]);

    return this.formatCSV([headers, ...rows]);
  }

  /**
   * 7. GUIA DE IMPORTAÇÃO
   */
  private generateImportGuide(data: CSVCampaignData): string {
    return `# 📋 GUIA DE IMPORTAÇÃO - GOOGLE ADS EDITOR

## 🎯 CAMPANHA: ${data.campaign.name}

### ⚙️ CONFIGURAÇÕES:
- **Budget:** ${data.campaign.currency} ${data.campaign.budget}/dia
- **CPA Target:** ${data.campaign.currency} ${data.campaign.targetCpa}
- **Estrutura:** 1 Campaign = 1 Ad Group = 1 Ad

### 📁 ARQUIVOS GERADOS:
1. **campaign-structure.csv** - Configurações da campanha
2. **keywords.csv** - Keywords (${data.keywords.length} palavras)
3. **ads.csv** - Anúncios (${data.headlines.length} headlines, ${data.descriptions.length} descriptions)
4. **sitelinks.csv** - Sitelinks (${data.sitelinks.length} extensões)
5. **callouts.csv** - Callouts (${data.callouts.length} extensões)
6. **snippets.csv** - Structured Snippets (${data.snippets.length} extensões)

### 📝 PASSO A PASSO:

#### 1. ABRIR GOOGLE ADS EDITOR
- Baixe e abra o Google Ads Editor
- Faça login na sua conta Google Ads
- Baixe dados da conta (se necessário)

#### 2. IMPORTAR CAMPANHA
1. **File → Import → From file**
2. Selecione **campaign-structure.csv**
3. Confirme mapeamento de campos
4. Clique em **Import**

#### 3. IMPORTAR KEYWORDS
1. **File → Import → From file**
2. Selecione **keywords.csv**
3. Confirme mapeamento de campos
4. Clique em **Import**

#### 4. IMPORTAR ANÚNCIOS
1. **File → Import → From file**
2. Selecione **ads.csv**
3. Confirme mapeamento de campos
4. Clique em **Import**

#### 5. IMPORTAR EXTENSÕES
1. Repita processo para:
   - **sitelinks.csv**
   - **callouts.csv** 
   - **snippets.csv**

#### 6. REVISAR ANTES DE PUBLICAR
- ✅ Verificar todos os headlines (máximo 30 caracteres)
- ✅ Verificar descriptions (máximo 90 caracteres)
- ✅ Confirmar URLs funcionando
- ✅ Validar extensões carregadas
- ✅ Testar anúncio preview

#### 7. PUBLICAR
1. **Account → Post Changes**
2. Aguardar aprovação Google Ads
3. Monitorar performance inicial

### ⚠️ CHECKLIST FINAL:
- [ ] Budget R$ 350,00 configurado
- [ ] CPA target ${data.campaign.targetCpa} definido
- [ ] ${data.keywords.length} keywords importadas (minúscula + MAIÚSCULA)
- [ ] ${data.headlines.length} headlines validadas
- [ ] ${data.descriptions.length} descriptions validadas
- [ ] ${data.sitelinks.length} sitelinks ativas
- [ ] ${data.callouts.length} callouts ativas
- [ ] ${data.snippets.length} snippets ativas
- [ ] URL de afiliado testada: ${data.affiliateUrl}

### 🚀 APÓS PUBLICAÇÃO:
1. **Monitorar aprovação** (24-48h)
2. **Verificar impressões** iniciais
3. **Acompanhar métricas** primeiras 72h
4. **Scaling automático** quando ROI > 2.0

---
**📌 IMPORTANTE:** Esta campanha segue a metodologia testada do Luiz. Não alterar estrutura sem aprovação.`;
  }

  /**
   * 🌍 CRIAR DADOS TRADUZIDOS PARA REVISÃO
   */
  private createTranslatedData(originalData: CSVCampaignData, targetLanguage: string): CSVCampaignData {
    return {
      ...originalData,
      // Traduzir headlines para português (placeholder - pode ser integrado com AI)
      headlines: originalData.headlines.map(headline => `[PT] ${headline}`),
      
      // Traduzir descriptions para português
      descriptions: originalData.descriptions.map(desc => `[PT] ${desc}`),
      
      // Traduzir sitelinks
      sitelinks: originalData.sitelinks.map(link => ({
        ...link,
        text: `[PT] ${link.text}`
      })),
      
      // Traduzir callouts
      callouts: originalData.callouts.map(callout => ({
        ...callout,
        text: `[PT] ${callout.text}`
      })),
      
      // Traduzir snippets
      snippets: originalData.snippets.map(snippet => ({
        ...snippet,
        text: `[PT] ${snippet.text}`
      }))
    };
  }

  /**
   * 📋 GERAR GUIA DE REVISÃO COMPARATIVO
   */
  private generateReviewGuide(originalData: CSVCampaignData, translatedData: CSVCampaignData, targetLanguage: string): string {
    const languageName = this.getLanguageName(targetLanguage);
    
    return `# 🔍 GUIA DE REVISÃO - CAMPANHA ${languageName.toUpperCase()}

## 📊 RESUMO DA CAMPANHA
- **Produto:** ${originalData.campaign.name}
- **Idioma Original:** ${languageName}
- **Moeda:** ${originalData.campaign.currency}
- **Budget Diário:** ${originalData.campaign.currency} ${originalData.campaign.budget}
- **CPA Target:** ${originalData.campaign.currency} ${originalData.campaign.targetCpa}

## 🎯 HEADLINES COMPARATIVO

### ${languageName} (Original) → Português (Revisão)

${originalData.headlines.map((original, i) => 
`**${i + 1}.** ${original}  
→ [PT] ${this.translateToPortuguese(original)}`
).join('\n\n')}

## 📝 DESCRIPTIONS COMPARATIVO

${originalData.descriptions.map((original, i) => 
`**${i + 1}.** ${original}  
→ [PT] ${this.translateToPortuguese(original)}`
).join('\n\n')}

## 🔗 EXTENSÕES

### Sitelinks
${originalData.sitelinks.map((sitelink, i) => 
`${i + 1}. **${sitelink.text}** → [PT] ${this.translateToPortuguese(sitelink.text)}`
).join('\n')}

### Callouts  
${originalData.callouts.map((callout, i) => 
`${i + 1}. **${callout.text}** → [PT] ${this.translateToPortuguese(callout.text)}`
).join('\n')}

### Snippets
${originalData.snippets.map((snippet, i) => 
`${i + 1}. **${snippet.text}** → [PT] ${this.translateToPortuguese(snippet.text)}`
).join('\n')}

## ✅ CHECKLIST DE QUALIDADE

### Headlines
${originalData.headlines.map((headline, i) => 
`- [ ] **${i + 1}.** "${headline}" (${headline.length} chars) - ${headline.length <= 30 ? '✅' : '❌'}`
).join('\n')}

### Descriptions
${originalData.descriptions.map((desc, i) => 
`- [ ] **${i + 1}.** "${desc}" (${desc.length} chars) - ${desc.length <= 90 ? '✅' : '❌'}`
).join('\n')}

## 📁 ARQUIVOS GERADOS

### Para Google Ads (${languageName})
1. **${this.sanitizeFileName(this.extractProductName(originalData.campaign.name))}-ads.csv** - Anúncios originais
2. **${this.sanitizeFileName(this.extractProductName(originalData.campaign.name))}-keywords.csv** - Keywords
3. **${this.sanitizeFileName(this.extractProductName(originalData.campaign.name))}-campaign-structure.csv** - Estrutura

### Para Revisão (Português)  
1. **${this.sanitizeFileName(this.extractProductName(originalData.campaign.name))}-ads-PT.csv** - Anúncios traduzidos
2. **${this.sanitizeFileName(this.extractProductName(originalData.campaign.name))}-review-guide-PT.md** - Este guia

## ⚠️ IMPORTANTE

- **USE OS ARQUIVOS ORIGINAIS** (sem -PT) no Google Ads
- **USE OS ARQUIVOS -PT** apenas para revisar a qualidade
- Verifique se todas as traduções fazem sentido no contexto
- Confirme que headlines não passam de 30 caracteres
- Confirme que descriptions não passam de 90 caracteres

---
**🎯 Status:** Campanha pronta para upload no Google Ads em ${languageName}`;
  }

  /**
   * 🗣️ TRADUÇÃO SIMPLES PARA PORTUGUÊS (placeholder)
   */
  private translateToPortuguese(text: string): string {
    // Placeholder - pode ser integrado com Gemini Flash para tradução real
    const translations: Record<string, string> = {
      // Italiano
      'Compra': 'Comprar',
      'Ora': 'Agora',
      'Prezzo Migliore': 'Melhor Preço',
      'Originale': 'Original',
      'Offerta Speciale': 'Oferta Especial',
      'Spedizione Gratuita': 'Frete Grátis',
      'Garanzia': 'Garantia',
      'naturale con garanzia': 'natural com garantia',
      'spedizione gratuita': 'frete grátis',
      
      // Alemão
      'Kaufen': 'Comprar',
      'Jetzt': 'Agora',
      'Bester Preis': 'Melhor Preço',
      'Original': 'Original',
      'Sonderangebot': 'Oferta Especial',
      
      // Espanhol
      'Comprar': 'Comprar',
      'Ahora': 'Agora',
      'Mejor Precio': 'Melhor Preço',
      'Oferta Especial': 'Oferta Especial',
      'Envío Gratis': 'Frete Grátis'
    };

    let translated = text;
    Object.entries(translations).forEach(([original, portuguese]) => {
      translated = translated.replace(new RegExp(original, 'gi'), portuguese);
    });

    return translated;
  }

  /**
   * 🌍 OBTER NOME DO IDIOMA
   */
  private getLanguageName(languageCode: string): string {
    const names: Record<string, string> = {
      'it': 'Italiano',
      'it-IT': 'Italiano',
      'de': 'Alemão',
      'de-DE': 'Alemão',
      'es': 'Espanhol',
      'es-ES': 'Espanhol',
      'fr': 'Francês',
      'fr-FR': 'Francês',
      'pl': 'Polonês',
      'pl-PL': 'Polonês'
    };

    return names[languageCode] || languageCode.toUpperCase();
  }

  /**
   * UTILITY: FORMATAR CSV
   */
  private formatCSV(rows: string[][]): string {
    return rows
      .map(row => 
        row.map(cell => 
          // Escape vírgulas e aspas
          cell.includes(',') || cell.includes('"') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
      .join('\n');
  }
}

// Export singleton
export const csvGenerator = new GoogleAdsCSVGenerator();