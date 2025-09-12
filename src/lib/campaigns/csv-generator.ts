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
   */
  generateAllCSVs(data: CSVCampaignData): Record<string, string> {
    // Extrai nome do produto e sanitiza
    const productName = this.sanitizeFileName(this.extractProductName(data.campaign.name));
    
    return {
      [`${productName}-campaign-structure.csv`]: this.generateCampaignCSV(data),
      [`${productName}-keywords.csv`]: this.generateKeywordsCSV(data),
      [`${productName}-ads.csv`]: this.generateAdsCSV(data),
      [`${productName}-sitelinks.csv`]: this.generateSitelinksCSV(data),
      [`${productName}-callouts.csv`]: this.generateCalloutsCSV(data),
      [`${productName}-snippets.csv`]: this.generateSnippetsCSV(data),
      [`${productName}-import-guide.md`]: this.generateImportGuide(data)
    };
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