/**
 * Producer Page Analyzer - Mock Version for Deployment
 * Temporarily returns mock data to avoid build errors
 */

import { ProducerAnalysis } from '@/types'

export class ProducerPageAnalyzer {
  
  /**
   * Análise da página do produtor - Mock version
   */
  async analyzeProducerPage(producerUrl: string): Promise<ProducerAnalysis> {
    console.log(`📊 Analyzing producer page: ${producerUrl} (mock mode)`)
    
    // Return mock data to avoid build errors
    return {
      designSystem: {
        colors: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#1f2937'
        },
        fonts: {
          primary: 'Inter, sans-serif',
          secondary: 'Roboto, sans-serif',
          sizes: {
            small: '14px',
            medium: '16px',
            large: '20px'
          }
        },
        spacing: {
          small: '8px',
          medium: '16px',
          large: '24px'
        },
        borderRadius: '8px',
        shadows: {
          light: '0 1px 3px rgba(0,0,0,0.1)',
          medium: '0 4px 6px rgba(0,0,0,0.1)',
          heavy: '0 10px 25px rgba(0,0,0,0.1)'
        }
      },
      content: {
        headline: 'Produto Revolucionário',
        subheadline: 'A solução que você estava procurando',
        productImages: ['/images/product-hero.jpg'],
        benefits: [
          'Resultados comprovados',
          'Facilidade de uso',
          'Suporte 24/7',
          'Garantia de satisfação'
        ],
        testimonials: [
          {
            name: 'João Silva',
            text: 'Produto incrível, recomendo!',
            rating: 5
          }
        ],
        price: 'R$ 97,00',
        guarantee: '30 dias de garantia incondicional',
        urgency: ['Oferta limitada - apenas hoje!'],
        ctaButtons: ['Comprar Agora', 'Garantir Minha Vaga']
      },
      layout: {
        structure: 'hero-benefits-testimonials-cta',
        sections: ['header', 'hero', 'benefits', 'testimonials', 'footer'],
        ctaPlacement: ['hero', 'testimonials', 'footer']
      }
    }
  }

  /**
   * Mock version of image metadata cleaning
   */
  async cleanImageMetadata(imageUrl: string, outputPath: string): Promise<void> {
    console.log(`🧹 Mock: Cleaning image metadata ${imageUrl} -> ${outputPath}`)
    // Mock implementation - no actual processing
    return Promise.resolve()
  }

  /**
   * Mock version of creating producer-inspired design
   */
  createProducerInspiredDesign(): any {
    console.log('🎨 Mock: Creating producer-inspired design')
    
    return {
      design: {
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#f59e0b'
        },
        layout: 'modern-clean',
        typography: 'professional'
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '8px',
        padding: '12px 24px',
        buttonStyle: {
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: '8px',
          padding: '12px 24px',
          fontWeight: '600'
        }
      },
      content: {
        headline: 'Produto Revolucionário',
        subheadline: 'A solução que você estava procurando',
        benefits: [
          'Resultados comprovados',
          'Facilidade de uso',
          'Suporte 24/7',
          'Garantia de satisfação'
        ],
        testimonials: [],
        price: 'R$ 97,00',
        guarantee: '30 dias de garantia incondicional',
        urgency: ['Oferta limitada - apenas hoje!'],
        ctaButtons: ['Comprar Agora']
      },
      images: {
        hero: '/images/product-hero.jpg',
        product: '/images/product-shot.jpg',
        testimonials: ['/images/testimonial-1.jpg'],
        guarantees: ['/images/guarantee-badge.jpg']
      }
    }
  }
}

export default ProducerPageAnalyzer