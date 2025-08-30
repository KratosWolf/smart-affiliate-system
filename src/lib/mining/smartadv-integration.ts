/**
 * SmartADV Integration - Produtos mais vendidos
 * Integra com dados do SmartADV para descobrir produtos hot
 */

export interface SmartAdvProduct {
  name: string
  category: string
  commission: number
  popularity: number
  isExclusive: boolean
}

export class SmartAdvIntegration {
  
  /**
   * Lista de produtos populares do SmartADV
   * TODO: Integrar com API real quando disponível
   */
  private popularProducts: SmartAdvProduct[] = [
    // Você pode adicionar via print/screenshot
    { name: 'Glucosense', category: 'Supplements', commission: 45, popularity: 95, isExclusive: true },
    { name: 'NerveCalm', category: 'Supplements', commission: 40, popularity: 88, isExclusive: true },
    { name: 'GlicoShield', category: 'Supplements', commission: 50, popularity: 92, isExclusive: true },
    { name: 'GutDrops', category: 'Supplements', commission: 35, popularity: 85, isExclusive: true },
  ]
  
  /**
   * Obtém produtos mais vendidos para usar como queries
   */
  getTopProducts(): string[] {
    return this.popularProducts
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10) // Top 10
      .map(product => product.name)
  }
  
  /**
   * Obtém apenas produtos exclusivos (mais valiosos)
   */
  getExclusiveProducts(): string[] {
    return this.popularProducts
      .filter(product => product.isExclusive)
      .sort((a, b) => b.commission - a.commission)
      .map(product => product.name)
  }
  
  /**
   * Adiciona novos produtos descobertos via screenshot/print
   */
  addProductsFromScreenshot(products: SmartAdvProduct[]): void {
    for (const product of products) {
      // Evita duplicatas
      if (!this.popularProducts.find(p => p.name === product.name)) {
        this.popularProducts.push(product)
        console.log(`📸 Added product from screenshot: ${product.name} (${product.popularity}% popularity)`)
      }
    }
  }
  
  /**
   * Verifica se produto é conhecido do SmartADV
   */
  isKnownProduct(productName: string): boolean {
    return this.popularProducts.some(p => 
      p.name.toLowerCase() === productName.toLowerCase()
    )
  }
  
  /**
   * Obtém informações do produto se conhecido
   */
  getProductInfo(productName: string): SmartAdvProduct | null {
    return this.popularProducts.find(p => 
      p.name.toLowerCase() === productName.toLowerCase()
    ) || null
  }
}

export default SmartAdvIntegration