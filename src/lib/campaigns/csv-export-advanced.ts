/**
 * Advanced CSV Export for Google Ads Editor
 * Generates professional CSV files ready for bulk import
 */

export interface CampaignExportData {
  campaign: {
    name: string
    budget: number
    currency: string
    locations: string[]
    languages: string[]
    biddingStrategy: string
    targetCpa?: number
  }
  keywords: Array<{
    keyword: string
    matchType: string
    maxCpc: number
    finalUrl: string
  }>
  ads: Array<{
    headlines: string[]
    descriptions: string[]
    finalUrl: string
    displayUrl: string
    path1?: string
    path2?: string
  }>
  extensions: {
    sitelinks?: Array<{
      text: string
      description1?: string
      description2?: string
      url: string
    }>
    callouts?: string[]
    snippets?: Array<{
      header: string
      values: string[]
    }>
  }
}

export class AdvancedCampaignExporter {
  /**
   * Generate all CSV files for a complete campaign
   */
  generateAllCSVs(data: CampaignExportData): {
    campaigns: string
    adGroups: string
    keywords: string
    ads: string
    sitelinks: string
    callouts: string
    snippets: string
  } {
    return {
      campaigns: this.generateCampaignsCSV(data),
      adGroups: this.generateAdGroupsCSV(data),
      keywords: this.generateKeywordsCSV(data),
      ads: this.generateAdsCSV(data),
      sitelinks: this.generateSitelinksCSV(data),
      callouts: this.generateCalloutsCSV(data),
      snippets: this.generateSnippetsCSV(data)
    }
  }

  /**
   * Generate Campaigns CSV
   */
  private generateCampaignsCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Budget',
      'Budget type',
      'Campaign Type',
      'Networks',
      'Languages',
      'Locations',
      'Bid Strategy Type',
      'Target CPA',
      'Campaign Status'
    ]

    const row = [
      data.campaign.name,
      data.campaign.budget,
      'Daily',
      'Search',
      'Google search;Search partners',
      data.campaign.languages.join(';'),
      data.campaign.locations.join(';'),
      'Target CPA', // METODOLOGIA LUIZ: Target CPA confirmado
      data.campaign.targetCpa || '',
      'Enabled'
    ]

    return this.arrayToCSV([headers, row])
  }

  /**
   * Generate Ad Groups CSV
   */
  private generateAdGroupsCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Max CPC',
      'Display Network Custom Bid Type',
      'Ad Group Type',
      'Ad Group Status'
    ]

    // Create thematic ad groups based on keywords
    const adGroups = this.categorizeKeywords(data.keywords)
    
    const rows = Object.entries(adGroups).map(([groupName, keywords]) => {
      const avgCpc = keywords.reduce((sum, k) => sum + k.maxCpc, 0) / keywords.length
      return [
        data.campaign.name,
        groupName,
        avgCpc.toFixed(2),
        '',
        'Default',
        'Enabled'
      ]
    })

    return this.arrayToCSV([headers, ...rows])
  }

  /**
   * Generate Keywords CSV
   */
  private generateKeywordsCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Keyword',
      'Criterion Type',
      'Max CPC',
      'Final URL',
      'Status'
    ]

    const adGroups = this.categorizeKeywords(data.keywords)
    const rows: string[][] = []

    Object.entries(adGroups).forEach(([groupName, keywords]) => {
      keywords.forEach(keyword => {
        rows.push([
          data.campaign.name,
          groupName,
          this.formatKeywordForCSV(keyword.keyword, keyword.matchType),
          'Keyword',
          keyword.maxCpc.toFixed(2),
          keyword.finalUrl,
          'Enabled'
        ])
      })
    })

    return this.arrayToCSV([headers, ...rows])
  }

  /**
   * Generate Responsive Search Ads CSV
   */
  private generateAdsCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Ad Group',
      'Ad type',
      'Ad status',
      'Headline 1',
      'Headline 2',
      'Headline 3',
      'Headline 4',
      'Headline 5',
      'Headline 6',
      'Headline 7',
      'Headline 8',
      'Headline 9',
      'Headline 10',
      'Headline 11',
      'Headline 12',
      'Headline 13',
      'Headline 14',
      'Headline 15',
      'Description 1',
      'Description 2',
      'Description 3',
      'Description 4',
      'Path 1',
      'Path 2',
      'Final URL'
    ]

    const adGroups = this.categorizeKeywords(data.keywords)
    const rows: string[][] = []

    Object.keys(adGroups).forEach(groupName => {
      data.ads.forEach(ad => {
        const headlines = [...ad.headlines]
        const descriptions = [...ad.descriptions]
        
        // Pad arrays to match required columns
        while (headlines.length < 15) headlines.push('')
        while (descriptions.length < 4) descriptions.push('')

        rows.push([
          data.campaign.name,
          groupName,
          'Responsive search ad',
          'Enabled',
          ...headlines,
          ...descriptions,
          ad.path1 || '',
          ad.path2 || '',
          ad.finalUrl
        ])
      })
    })

    return this.arrayToCSV([headers, ...rows])
  }

  /**
   * Generate Sitelinks CSV
   */
  private generateSitelinksCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Sitelink text',
      'Description line 1',
      'Description line 2',
      'Final URL',
      'Status'
    ]

    if (!data.extensions.sitelinks || data.extensions.sitelinks.length === 0) {
      // Generate default sitelinks
      const defaultSitelinks = [
        { text: 'Oferta Especial', description1: 'Desconto exclusivo', description2: 'Por tempo limitado', url: data.ads[0]?.finalUrl || '' },
        { text: 'Frete Grátis', description1: 'Entrega rápida', description2: 'Para todo Brasil', url: data.ads[0]?.finalUrl || '' },
        { text: 'Garantia Total', description1: '30 dias de garantia', description2: 'Satisfação garantida', url: data.ads[0]?.finalUrl || '' },
        { text: 'Compre Agora', description1: 'Estoque limitado', description2: 'Aproveite hoje', url: data.ads[0]?.finalUrl || '' }
      ]
      data.extensions.sitelinks = defaultSitelinks
    }

    const rows = data.extensions.sitelinks.map(sitelink => [
      data.campaign.name,
      sitelink.text,
      sitelink.description1 || '',
      sitelink.description2 || '',
      sitelink.url,
      'Enabled'
    ])

    return this.arrayToCSV([headers, ...rows])
  }

  /**
   * Generate Callouts CSV
   */
  private generateCalloutsCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Callout text',
      'Status'
    ]

    const callouts = data.extensions.callouts || [
      'Entrega Rápida',
      'Melhor Preço',
      'Qualidade Garantida',
      '100% Natural',
      'Sem Efeitos Colaterais',
      'Resultados Comprovados'
    ]

    const rows = callouts.map(callout => [
      data.campaign.name,
      callout,
      'Enabled'
    ])

    return this.arrayToCSV([headers, ...rows])
  }

  /**
   * Generate Structured Snippets CSV
   */
  private generateSnippetsCSV(data: CampaignExportData): string {
    const headers = [
      'Campaign',
      'Type',
      'Values',
      'Status'
    ]

    const snippets = data.extensions.snippets || [
      { header: 'Marcas', values: ['Premium', 'Original', 'Certificado'] },
      { header: 'Serviços', values: ['Entrega Expressa', 'Suporte 24h', 'Garantia'] }
    ]

    const rows = snippets.map(snippet => [
      data.campaign.name,
      snippet.header,
      snippet.values.join(';'),
      'Enabled'
    ])

    return this.arrayToCSV([headers, ...rows])
  }

  /**
   * Categorize keywords into ad groups
   */
  private categorizeKeywords(keywords: any[]): { [key: string]: any[] } {
    const groups: { [key: string]: any[] } = {
      'Marca': [],
      'Genérico': [],
      'Competidor': [],
      'Long Tail': []
    }

    keywords.forEach(keyword => {
      const kw = keyword.keyword.toLowerCase()
      
      if (kw.split(' ').length >= 4) {
        groups['Long Tail'].push(keyword)
      } else if (kw.includes('vs') || kw.includes('melhor que')) {
        groups['Competidor'].push(keyword)
      } else if (kw.split(' ').length === 1) {
        groups['Marca'].push(keyword)
      } else {
        groups['Genérico'].push(keyword)
      }
    })

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key]
    })

    return groups
  }

  /**
   * Format keyword for CSV based on match type
   */
  private formatKeywordForCSV(keyword: string, matchType: string): string {
    switch (matchType.toLowerCase()) {
      case 'exact':
        return `[${keyword}]`
      case 'phrase':
        return `"${keyword}"`
      case 'broad':
        return `+${keyword.split(' ').join(' +')}`
      default:
        return keyword
    }
  }

  /**
   * Convert array to CSV string
   */
  private arrayToCSV(data: any[][]): string {
    return data.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const value = String(cell || '')
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    ).join('\n')
  }

  /**
   * Create a ZIP file with all CSVs
   */
  async createCampaignZip(data: CampaignExportData): Promise<Blob> {
    // This would require a ZIP library like JSZip
    // For now, return concatenated CSVs
    const csvs = this.generateAllCSVs(data)
    const allContent = Object.entries(csvs)
      .map(([name, content]) => `--- ${name.toUpperCase()}.csv ---\n${content}`)
      .join('\n\n')
    
    return new Blob([allContent], { type: 'text/csv' })
  }
}

export const campaignExporter = new AdvancedCampaignExporter()