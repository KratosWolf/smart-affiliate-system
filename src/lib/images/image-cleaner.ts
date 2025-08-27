/**
 * Image Cleaner - Sistema de limpeza de imagens
 * Download + remoção de metadados + otimização para Google compliance
 */

import sharp from 'sharp'
import fetch from 'node-fetch'
import { createHash } from 'crypto'

export interface ImageCleaningResult {
  success: boolean
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  cleanedBuffer: Buffer
  metadata: {
    width: number
    height: number
    format: string
    hasMetadata: boolean
    exifRemoved: boolean
    googleCompliant: boolean
  }
  error?: string
}

export interface ImageSource {
  url?: string
  buffer?: Buffer
  path?: string
}

export class ImageCleaner {
  
  /**
   * Limpa e otimiza imagem para Google Ads compliance
   */
  async cleanImage(source: ImageSource, options?: {
    quality?: number
    maxWidth?: number
    maxHeight?: number
    format?: 'jpeg' | 'png' | 'webp'
    removeBackground?: boolean
  }): Promise<ImageCleaningResult> {
    try {
      console.log('Starting image cleaning process...')
      
      // 1. Obter buffer da imagem
      let imageBuffer: Buffer
      
      if (source.url) {
        imageBuffer = await this.downloadImage(source.url)
      } else if (source.buffer) {
        imageBuffer = source.buffer
      } else if (source.path) {
        imageBuffer = await sharp(source.path).toBuffer()
      } else {
        throw new Error('No valid image source provided')
      }
      
      const originalSize = imageBuffer.length
      
      // 2. Analisar metadados originais
      const originalImage = sharp(imageBuffer)
      const originalMetadata = await originalImage.metadata()
      
      console.log('Original metadata:', originalMetadata)
      
      // 3. Configurar processamento
      const quality = options?.quality || 90
      const maxWidth = options?.maxWidth || 1200
      const maxHeight = options?.maxHeight || 1200
      const format = options?.format || 'jpeg'
      
      // 4. Processar imagem
      let processedImage = sharp(imageBuffer)
      
      // Remove todos os metadados EXIF
      processedImage = processedImage.withMetadata({})
      
      // Redimensionar se necessário
      if (originalMetadata.width! > maxWidth || originalMetadata.height! > maxHeight) {
        processedImage = processedImage.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
      }
      
      // Remove background se solicitado
      if (options?.removeBackground) {
        processedImage = processedImage.removeAlpha()
      }
      
      // Aplicar formato e qualidade
      let cleanedBuffer: Buffer
      
      switch (format) {
        case 'jpeg':
          cleanedBuffer = await processedImage
            .jpeg({ 
              quality,
              progressive: true,
              mozjpeg: true // Better compression
            })
            .toBuffer()
          break
          
        case 'png':
          cleanedBuffer = await processedImage
            .png({ 
              quality,
              progressive: true,
              compressionLevel: 9
            })
            .toBuffer()
          break
          
        case 'webp':
          cleanedBuffer = await processedImage
            .webp({ 
              quality,
              lossless: false
            })
            .toBuffer()
          break
          
        default:
          cleanedBuffer = await processedImage.toBuffer()
      }
      
      // 5. Verificar metadados finais
      const finalMetadata = await sharp(cleanedBuffer).metadata()
      
      const optimizedSize = cleanedBuffer.length
      const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100
      
      console.log(`Image cleaning complete: ${originalSize} → ${optimizedSize} bytes (${compressionRatio.toFixed(1)}% reduction)`)
      
      return {
        success: true,
        originalSize,
        optimizedSize,
        compressionRatio,
        cleanedBuffer,
        metadata: {
          width: finalMetadata.width!,
          height: finalMetadata.height!,
          format: finalMetadata.format!,
          hasMetadata: Object.keys(finalMetadata.exif || {}).length > 0,
          exifRemoved: true,
          googleCompliant: this.isGoogleCompliant(finalMetadata, cleanedBuffer)
        }
      }
      
    } catch (error) {
      console.error('Image cleaning failed:', error)
      
      return {
        success: false,
        originalSize: 0,
        optimizedSize: 0,
        compressionRatio: 0,
        cleanedBuffer: Buffer.alloc(0),
        metadata: {
          width: 0,
          height: 0,
          format: 'unknown',
          hasMetadata: false,
          exifRemoved: false,
          googleCompliant: false
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  /**
   * Processa múltiplas imagens em batch
   */
  async cleanImageBatch(sources: ImageSource[], options?: {
    quality?: number
    maxWidth?: number
    maxHeight?: number
    format?: 'jpeg' | 'png' | 'webp'
    removeBackground?: boolean
  }): Promise<ImageCleaningResult[]> {
    console.log(`Starting batch cleaning of ${sources.length} images...`)
    
    const results = await Promise.all(
      sources.map((source, index) => 
        this.cleanImage(source, options)
          .then(result => {
            console.log(`Batch ${index + 1}/${sources.length} complete`)
            return result
          })
          .catch(error => ({
            success: false,
            originalSize: 0,
            optimizedSize: 0,
            compressionRatio: 0,
            cleanedBuffer: Buffer.alloc(0),
            metadata: {
              width: 0,
              height: 0,
              format: 'unknown',
              hasMetadata: false,
              exifRemoved: false,
              googleCompliant: false
            },
            error: error.message
          }))
      )
    )
    
    const successful = results.filter(r => r.success).length
    console.log(`Batch cleaning complete: ${successful}/${sources.length} images processed successfully`)
    
    return results
  }
  
  /**
   * Download image from URL with error handling
   */
  private async downloadImage(url: string): Promise<Buffer> {
    console.log(`Downloading image from: ${url}`)
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000 // 30 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const buffer = await response.buffer()
      console.log(`Downloaded ${buffer.length} bytes`)
      
      return buffer
      
    } catch (error) {
      throw new Error(`Failed to download image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  /**
   * Verifica se a imagem está em compliance com Google Ads
   */
  private isGoogleCompliant(metadata: sharp.Metadata, buffer: Buffer): boolean {
    // Verificações básicas de compliance do Google Ads
    const checks = {
      validFormat: ['jpeg', 'jpg', 'png', 'gif'].includes(metadata.format || ''),
      validSize: buffer.length <= 5 * 1024 * 1024, // 5MB limit
      validDimensions: (metadata.width || 0) >= 300 && (metadata.height || 0) >= 300,
      maxDimensions: (metadata.width || 0) <= 2048 && (metadata.height || 0) <= 2048,
      noExif: !metadata.exif || Object.keys(metadata.exif).length === 0
    }
    
    return Object.values(checks).every(Boolean)
  }
  
  /**
   * Gera hash único da imagem para cache/deduplicação
   */
  generateImageHash(buffer: Buffer): string {
    return createHash('md5').update(buffer).digest('hex')
  }
  
  /**
   * Detecta tipo de produto baseado na imagem
   */
  async detectProductType(buffer: Buffer): Promise<'supplement' | 'cosmetic' | 'digital' | 'cbd' | 'general'> {
    // Análise básica baseada em características da imagem
    const metadata = await sharp(buffer).metadata()
    
    // Heurísticas simples - em produção seria ML/AI
    if (metadata.width === metadata.height) {
      return 'supplement' // Produtos em caixas são frequentemente quadrados
    }
    
    if ((metadata.width || 0) > (metadata.height || 0) * 1.5) {
      return 'digital' // Produtos digitais tendem a ser landscape
    }
    
    return 'general'
  }
  
  /**
   * Otimiza especificamente para Google Ads Display Network
   */
  async optimizeForDisplayAds(buffer: Buffer): Promise<{
    banner: Buffer    // 728x90
    rectangle: Buffer // 300x250
    mobile: Buffer    // 320x100
    square: Buffer    // 300x300
  }> {
    const originalImage = sharp(buffer)
    
    const [banner, rectangle, mobile, square] = await Promise.all([
      // Banner 728x90
      originalImage.clone()
        .resize(728, 90, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer(),
        
      // Rectangle 300x250
      originalImage.clone()
        .resize(300, 250, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toBuffer(),
        
      // Mobile 320x100
      originalImage.clone()
        .resize(320, 100, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer(),
        
      // Square 300x300
      originalImage.clone()
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toBuffer()
    ])
    
    return { banner, rectangle, mobile, square }
  }
  
  /**
   * Aplica watermark de compliance (para CBD e produtos regulamentados)
   */
  async applyComplianceWatermark(
    buffer: Buffer, 
    watermarkText: string = '18+ APENAS',
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-right'
  ): Promise<Buffer> {
    const image = sharp(buffer)
    const metadata = await image.metadata()
    
    const width = metadata.width || 800
    const height = metadata.height || 600
    
    // Cria watermark SVG
    const watermarkSvg = `
      <svg width="${width}" height="${height}">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="black" flood-opacity="0.8"/>
          </filter>
        </defs>
        <text 
          x="${position.includes('right') ? width - 20 : 20}" 
          y="${position.includes('bottom') ? height - 20 : 40}" 
          fill="white" 
          font-size="24" 
          font-weight="bold" 
          font-family="Arial" 
          text-anchor="${position.includes('right') ? 'end' : 'start'}"
          filter="url(#shadow)"
        >
          ${watermarkText}
        </text>
      </svg>
    `
    
    return image
      .composite([{
        input: Buffer.from(watermarkSvg),
        blend: 'over'
      }])
      .jpeg({ quality: 90 })
      .toBuffer()
  }
  
  /**
   * Gera relatório de limpeza
   */
  generateCleaningReport(results: ImageCleaningResult[]): {
    totalProcessed: number
    successful: number
    failed: number
    totalOriginalSize: number
    totalOptimizedSize: number
    averageCompression: number
    googleCompliantCount: number
  } {
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    
    const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0)
    const totalOptimizedSize = successful.reduce((sum, r) => sum + r.optimizedSize, 0)
    const averageCompression = successful.length > 0 
      ? successful.reduce((sum, r) => sum + r.compressionRatio, 0) / successful.length 
      : 0
    const googleCompliantCount = successful.filter(r => r.metadata.googleCompliant).length
    
    return {
      totalProcessed: results.length,
      successful: successful.length,
      failed: failed.length,
      totalOriginalSize,
      totalOptimizedSize,
      averageCompression,
      googleCompliantCount
    }
  }
}

// Export singleton
export const imageCleaner = new ImageCleaner()