/**
 * Image Generator - Cria variações automáticas de imagens para ads
 * Gera 4-8 variações: backgrounds, quantidades, blur para CBD
 */

import sharp from 'sharp'
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas'
import fetch from 'node-fetch'

export interface ImageVariationConfig {
  productName: string
  originalImageUrl: string
  productType: 'supplement' | 'cosmetic' | 'digital' | 'cbd' | 'general'
  targetAudience: 'women' | 'men' | 'unisex'
  style: 'modern' | 'medical' | 'organic' | 'tech' | 'classic'
  
  // Design matching tokens
  designTokens?: {
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
    }
    typography: {
      primaryFont: string
      headingFont: string
    }
    layout: {
      borderRadius: string
      shadowStyle: string
    }
  }
}

export interface ImageVariation {
  id: string
  name: string
  description: string
  imageBuffer: Buffer
  metadata: {
    width: number
    height: number
    format: string
    size: number
    variant: string
    optimizedForGoogle: boolean
  }
}

export class ImageGenerator {
  
  /**
   * Gera todas as variações de imagem para um produto
   */
  async generateVariations(config: ImageVariationConfig): Promise<ImageVariation[]> {
    console.log(`Generating image variations for ${config.productName}`)
    
    try {
      // 1. Download e processa imagem original
      const originalBuffer = await this.downloadImage(config.originalImageUrl)
      const originalImage = sharp(originalBuffer)
      const originalMetadata = await originalImage.metadata()
      
      // 2. Gera variações baseadas no tipo de produto
      const variations: ImageVariation[] = []
      
      // Variação 1: Imagem original limpa
      variations.push(await this.createCleanVariation(originalBuffer, config))
      
      // Variação 2: Com background gradient
      variations.push(await this.createGradientBackground(originalBuffer, config))
      
      // Variação 3: Com badges/seals
      variations.push(await this.createBadgeVariation(originalBuffer, config))
      
      // Variação 4: Quantity emphasis (múltiplas unidades)
      variations.push(await this.createQuantityVariation(originalBuffer, config))
      
      // Variação 5: Lifestyle/usage context
      variations.push(await this.createLifestyleVariation(originalBuffer, config))
      
      // Variação 6: Before/After style (supplements/cosmetics)
      if (['supplement', 'cosmetic', 'cbd'].includes(config.productType)) {
        variations.push(await this.createBeforeAfterVariation(originalBuffer, config))
      }
      
      // Variação 7: Blur version (para CBD compliance)
      if (config.productType === 'cbd') {
        variations.push(await this.createBlurredVariation(originalBuffer, config))
      }
      
      // Variação 8: Mobile-optimized square format
      variations.push(await this.createMobileSquareVariation(originalBuffer, config))
      
      console.log(`Generated ${variations.length} image variations`)
      return variations
      
    } catch (error) {
      console.error('Image generation failed:', error)
      return []
    }
  }
  
  /**
   * Download image from URL
   */
  private async downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    
    const buffer = await response.buffer()
    return buffer
  }
  
  /**
   * Variação 1: Imagem original limpa e otimizada
   */
  private async createCleanVariation(
    originalBuffer: Buffer, 
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const optimized = await sharp(originalBuffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ 
        quality: 90,
        progressive: true
      })
      .toBuffer()
    
    const metadata = await sharp(optimized).metadata()
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-clean`,
      name: 'Imagem Limpa Original',
      description: 'Versão otimizada da imagem original do produto',
      imageBuffer: optimized,
      metadata: {
        width: metadata.width!,
        height: metadata.height!,
        format: 'jpeg',
        size: optimized.length,
        variant: 'clean',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 2: Com background gradient matching design tokens
   */
  private async createGradientBackground(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')
    
    // Cria gradient baseado nos design tokens
    const primaryColor = config.designTokens?.colors.primary || '#007bff'
    const secondaryColor = config.designTokens?.colors.secondary || '#6c757d'
    
    const gradient = ctx.createLinearGradient(0, 0, 800, 800)
    gradient.addColorStop(0, this.lightenColor(primaryColor, 0.8))
    gradient.addColorStop(1, this.lightenColor(secondaryColor, 0.8))
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 800)
    
    // Adiciona a imagem do produto no centro
    const productImage = await loadImage(originalBuffer)
    const size = Math.min(600, productImage.width, productImage.height)
    const x = (800 - size) / 2
    const y = (800 - size) / 2
    
    ctx.drawImage(productImage, x, y, size, size)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-gradient`,
      name: 'Com Background Gradient',
      description: 'Versão com fundo gradiente matching da página original',
      imageBuffer: buffer,
      metadata: {
        width: 800,
        height: 800,
        format: 'jpeg',
        size: buffer.length,
        variant: 'gradient',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 3: Com badges e seals de confiança
   */
  private async createBadgeVariation(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')
    
    // Background branco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 800)
    
    // Adiciona produto no centro
    const productImage = await loadImage(originalBuffer)
    const size = 500
    const x = (800 - size) / 2
    const y = (800 - size) / 2
    
    ctx.drawImage(productImage, x, y, size, size)
    
    // Adiciona badges
    this.drawBadge(ctx, 50, 50, 'ORIGINAL', '#28a745')
    this.drawBadge(ctx, 650, 50, 'GARANTIA', '#007bff')
    this.drawBadge(ctx, 50, 650, 'FRETE GRÁTIS', '#ffc107')
    this.drawBadge(ctx, 600, 650, '90 DIAS', '#dc3545')
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-badges`,
      name: 'Com Badges de Confiança',
      description: 'Versão com selos de garantia, original e frete grátis',
      imageBuffer: buffer,
      metadata: {
        width: 800,
        height: 800,
        format: 'jpeg',
        size: buffer.length,
        variant: 'badges',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 4: Ênfase em quantidade (múltiplas unidades)
   */
  private async createQuantityVariation(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')
    
    // Background
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, 800, 800)
    
    // Adiciona 3 produtos com efeito de profundidade
    const productImage = await loadImage(originalBuffer)
    const size = 200
    
    // Produto traseiro (mais escuro)
    ctx.globalAlpha = 0.6
    ctx.drawImage(productImage, 450, 200, size, size)
    
    // Produto meio
    ctx.globalAlpha = 0.8
    ctx.drawImage(productImage, 350, 250, size, size)
    
    // Produto frente (destaque)
    ctx.globalAlpha = 1
    ctx.drawImage(productImage, 250, 300, size, size)
    
    // Adiciona texto de quantidade
    ctx.font = 'bold 48px Arial'
    ctx.fillStyle = config.designTokens?.colors.primary || '#007bff'
    ctx.textAlign = 'center'
    ctx.fillText('COMBO 3X', 400, 600)
    
    ctx.font = 'bold 32px Arial'
    ctx.fillStyle = '#28a745'
    ctx.fillText('ECONOMIZE MAIS', 400, 650)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-quantity`,
      name: 'Ênfase em Quantidade',
      description: 'Versão mostrando múltiplas unidades para economia',
      imageBuffer: buffer,
      metadata: {
        width: 800,
        height: 800,
        format: 'jpeg',
        size: buffer.length,
        variant: 'quantity',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 5: Contexto lifestyle
   */
  private async createLifestyleVariation(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')
    
    // Background com contexto baseado no público-alvo
    let bgColor = '#f8f9fa'
    if (config.targetAudience === 'women') {
      bgColor = '#fff0f5' // Soft pink
    } else if (config.targetAudience === 'men') {
      bgColor = '#f0f8ff' // Light blue
    }
    
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, 800, 800)
    
    // Adiciona elementos de contexto (simulado por formas)
    this.drawLifestyleElements(ctx, config)
    
    // Produto no centro
    const productImage = await loadImage(originalBuffer)
    const size = 300
    const x = (800 - size) / 2
    const y = (800 - size) / 2
    
    ctx.drawImage(productImage, x, y, size, size)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-lifestyle`,
      name: 'Contexto Lifestyle',
      description: 'Versão com elementos de estilo de vida do público-alvo',
      imageBuffer: buffer,
      metadata: {
        width: 800,
        height: 800,
        format: 'jpeg',
        size: buffer.length,
        variant: 'lifestyle',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 6: Estilo antes/depois
   */
  private async createBeforeAfterVariation(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const canvas = createCanvas(800, 400) // Formato horizontal
    const ctx = canvas.getContext('2d')
    
    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 400)
    
    // Divide em dois lados
    ctx.fillStyle = '#ffebee' // Light red for "before"
    ctx.fillRect(0, 0, 400, 400)
    
    ctx.fillStyle = '#e8f5e8' // Light green for "after"
    ctx.fillRect(400, 0, 400, 400)
    
    // Labels
    ctx.font = 'bold 32px Arial'
    ctx.fillStyle = '#d32f2f'
    ctx.textAlign = 'center'
    ctx.fillText('ANTES', 200, 50)
    
    ctx.fillStyle = '#388e3c'
    ctx.fillText('DEPOIS', 600, 50)
    
    // Produto no lado "depois"
    const productImage = await loadImage(originalBuffer)
    ctx.drawImage(productImage, 450, 100, 200, 200)
    
    // Adiciona elementos visuais de melhoria
    this.drawProgressArrow(ctx, 320, 200)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-before-after`,
      name: 'Estilo Antes/Depois',
      description: 'Versão mostrando transformação/resultado',
      imageBuffer: buffer,
      metadata: {
        width: 800,
        height: 400,
        format: 'jpeg',
        size: buffer.length,
        variant: 'before-after',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 7: Versão com blur (CBD compliance)
   */
  private async createBlurredVariation(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const blurred = await sharp(originalBuffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .blur(2) // Slight blur for compliance
      .jpeg({ quality: 85 })
      .toBuffer()
    
    // Adiciona overlay de texto para CBD compliance
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')
    
    const blurredImage = await loadImage(blurred)
    ctx.drawImage(blurredImage, 0, 0)
    
    // Overlay de compliance
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 700, 800, 100)
    
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('18+ APENAS. USO RESPONSÁVEL.', 400, 735)
    ctx.fillText('CONSULTE UM MÉDICO.', 400, 765)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-cbd-compliant`,
      name: 'CBD Compliant (Blurred)',
      description: 'Versão com blur e avisos para compliance CBD',
      imageBuffer: buffer,
      metadata: {
        width: 800,
        height: 800,
        format: 'jpeg',
        size: buffer.length,
        variant: 'cbd-compliant',
        optimizedForGoogle: true
      }
    }
  }
  
  /**
   * Variação 8: Formato quadrado mobile-optimized
   */
  private async createMobileSquareVariation(
    originalBuffer: Buffer,
    config: ImageVariationConfig
  ): Promise<ImageVariation> {
    const mobile = await sharp(originalBuffer)
      .resize(600, 600, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ 
        quality: 90,
        progressive: true 
      })
      .toBuffer()
    
    const canvas = createCanvas(600, 600)
    const ctx = canvas.getContext('2d')
    
    const mobileImage = await loadImage(mobile)
    ctx.drawImage(mobileImage, 0, 0)
    
    // Adiciona elementos mobile-friendly
    ctx.fillStyle = config.designTokens?.colors.primary || '#007bff'
    ctx.fillRect(0, 0, 600, 80)
    
    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('OFERTA MÓVEL', 300, 50)
    
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    
    return {
      id: `${config.productName.toLowerCase().replace(/\s+/g, '-')}-mobile`,
      name: 'Mobile Square Format',
      description: 'Versão otimizada para dispositivos móveis',
      imageBuffer: buffer,
      metadata: {
        width: 600,
        height: 600,
        format: 'jpeg',
        size: buffer.length,
        variant: 'mobile',
        optimizedForGoogle: true
      }
    }
  }
  
  // Helper methods
  
  private lightenColor(color: string, factor: number): string {
    // Simple color lightening - in real implementation would use proper color manipulation
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const newR = Math.min(255, Math.floor(r + (255 - r) * factor))
    const newG = Math.min(255, Math.floor(g + (255 - g) * factor))
    const newB = Math.min(255, Math.floor(b + (255 - b) * factor))
    
    return `rgb(${newR}, ${newG}, ${newB})`
  }
  
  private drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string): void {
    ctx.fillStyle = color
    ctx.fillRect(x, y, 120, 40)
    
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(text, x + 60, y + 25)
  }
  
  private drawLifestyleElements(ctx: CanvasRenderingContext2D, config: ImageVariationConfig): void {
    // Adiciona elementos decorativos baseados no público
    ctx.fillStyle = config.designTokens?.colors.accent || '#28a745'
    
    if (config.targetAudience === 'women') {
      // Elementos femininos (círculos decorativos)
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(100 + i * 150, 100, 20, 0, 2 * Math.PI)
        ctx.fill()
      }
    } else if (config.targetAudience === 'men') {
      // Elementos masculinos (quadrados)
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(100 + i * 180, 80, 40, 40)
      }
    }
  }
  
  private drawProgressArrow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.strokeStyle = '#4caf50'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 60, y)
    ctx.lineTo(x + 45, y - 15)
    ctx.moveTo(x + 60, y)
    ctx.lineTo(x + 45, y + 15)
    ctx.stroke()
  }
  
  /**
   * Remove metadados EXIF para Google Ads compliance
   */
  async cleanImageMetadata(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer)
      .withMetadata({}) // Remove all metadata
      .jpeg({ quality: 90 })
      .toBuffer()
  }
  
  /**
   * Otimiza todas as variações para Google Ads
   */
  async optimizeForGoogleAds(variations: ImageVariation[]): Promise<ImageVariation[]> {
    return Promise.all(
      variations.map(async (variation) => {
        const optimizedBuffer = await this.cleanImageMetadata(variation.imageBuffer)
        
        return {
          ...variation,
          imageBuffer: optimizedBuffer,
          metadata: {
            ...variation.metadata,
            size: optimizedBuffer.length,
            optimizedForGoogle: true
          }
        }
      })
    )
  }
}

// Export singleton
export const imageGenerator = new ImageGenerator()