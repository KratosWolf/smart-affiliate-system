/**
 * Producer Page Analyzer
 * Analisa a página do produtor para extrair design system e conteúdo
 */

import puppeteer from 'puppeteer'
import sharp from 'sharp'
import crypto from 'crypto'

export interface ProducerPageAnalysis {
  url: string
  designSystem: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    fontFamily: string
    fontSize: string
    buttonStyle: {
      backgroundColor: string
      textColor: string
      borderRadius: string
      padding: string
    }
  }
  content: {
    headline: string
    subheadline: string
    productImages: string[]
    benefits: string[]
    testimonials: any[]
    price: string
    guarantee: string
    urgency: string[]
    ctaButtons: string[]
  }
  layout: {
    heroSection: boolean
    videoPresent: boolean
    testimonialSection: boolean
    faqSection: boolean
    footerLinks: string[]
  }
}

export class ProducerPageAnalyzer {
  
  /**
   * Analisa página do produtor ANTES de criar qualquer pre-sell
   */
  async analyzePage(producerUrl: string): Promise<ProducerPageAnalysis> {
    console.log('🔍 Analyzing producer page:', producerUrl)
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    try {
      const page = await browser.newPage()
      await page.goto(producerUrl, { waitUntil: 'networkidle2' })
      
      // Extrair design system
      const designSystem = await page.evaluate(() => {
        const getComputedColor = (selector: string, property: string) => {
          const element = document.querySelector(selector)
          if (element) {
            return window.getComputedStyle(element).getPropertyValue(property)
          }
          return null
        }
        
        // Cores principais
        const primaryButton = document.querySelector('button, .btn, [class*="button"]')
        const body = document.body
        
        // Fontes
        const bodyFont = window.getComputedStyle(body).fontFamily
        const fontSize = window.getComputedStyle(body).fontSize
        
        // Botão CTA principal
        const buttonStyle = primaryButton ? {
          backgroundColor: window.getComputedStyle(primaryButton).backgroundColor,
          textColor: window.getComputedStyle(primaryButton).color,
          borderRadius: window.getComputedStyle(primaryButton).borderRadius,
          padding: window.getComputedStyle(primaryButton).padding
        } : null
        
        return {
          primaryColor: getComputedColor('h1, h2', 'color') || '#333',
          secondaryColor: getComputedColor('a', 'color') || '#007bff',
          backgroundColor: window.getComputedStyle(body).backgroundColor || '#fff',
          fontFamily: bodyFont || 'sans-serif',
          fontSize: fontSize || '16px',
          buttonStyle: buttonStyle || {
            backgroundColor: '#28a745',
            textColor: '#fff',
            borderRadius: '5px',
            padding: '10px 20px'
          }
        }
      })
      
      // Extrair conteúdo
      const content = await page.evaluate(() => {
        // Headlines
        const headline = document.querySelector('h1')?.textContent?.trim() || ''
        const subheadline = document.querySelector('h2')?.textContent?.trim() || ''
        
        // Imagens do produto
        const productImages = Array.from(document.querySelectorAll('img'))
          .filter(img => img.src && !img.src.includes('logo') && !img.src.includes('icon'))
          .map(img => img.src)
          .slice(0, 5) // Máximo 5 imagens
        
        // Benefits/Features
        const benefits = Array.from(document.querySelectorAll('li'))
          .map(li => li.textContent?.trim())
          .filter(text => text && text.length > 10 && text.length < 200)
          .slice(0, 10)
        
        // Preço
        const priceRegex = /\$\d+|\d+\.\d{2}|USD \d+|R\$ \d+/gi
        const prices = document.body.innerText.match(priceRegex) || []
        const price = prices[0] || ''
        
        // Garantia
        const guaranteeRegex = /\d+[\s-]?day|garantia|guarantee|money back/gi
        const guarantees = document.body.innerText.match(guaranteeRegex) || []
        const guarantee = guarantees[0] || ''
        
        // Urgência/Escassez
        const urgencyWords = ['limited', 'only', 'today', 'now', 'hurry', 'last chance', 'expires']
        const urgency = urgencyWords
          .map(word => {
            const regex = new RegExp(`.*${word}.*`, 'gi')
            const matches = document.body.innerText.match(regex)
            return matches ? matches[0].substring(0, 100) : null
          })
          .filter(Boolean)
        
        // CTAs
        const ctaButtons = Array.from(document.querySelectorAll('button, .btn, [class*="button"]'))
          .map(btn => btn.textContent?.trim())
          .filter(text => text && text.length < 50)
          .slice(0, 5)
        
        return {
          headline,
          subheadline,
          productImages,
          benefits,
          testimonials: [], // Simplified for now
          price,
          guarantee,
          urgency,
          ctaButtons
        }
      })
      
      // Analisar layout
      const layout = await page.evaluate(() => {
        return {
          heroSection: !!document.querySelector('[class*="hero"], header'),
          videoPresent: !!document.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]'),
          testimonialSection: !!document.querySelector('[class*="testimonial"], [class*="review"]'),
          faqSection: !!document.querySelector('[class*="faq"], [class*="question"]'),
          footerLinks: Array.from(document.querySelectorAll('footer a'))
            .map(a => a.textContent?.trim())
            .filter(text => text)
            .slice(0, 10)
        }
      })
      
      // Fazer screenshots se necessário
      await page.screenshot({ path: '/tmp/producer-page.png', fullPage: false })
      
      return {
        url: producerUrl,
        designSystem,
        content,
        layout
      }
      
    } finally {
      await browser.close()
    }
  }
  
  /**
   * Limpa metadados de imagens baixadas do site do produtor
   * CRÍTICO: Remove EXIF, metadados, e qualquer informação rastreável
   */
  async cleanImageMetadata(imageUrl: string, outputPath: string): Promise<void> {
    console.log('🧹 Cleaning image metadata:', imageUrl)
    
    try {
      // Baixar imagem
      const response = await fetch(imageUrl)
      const buffer = await response.arrayBuffer()
      
      // Usar sharp para limpar metadados e reprocessar
      await sharp(Buffer.from(buffer))
        .rotate() // Auto-rotate baseado em EXIF
        .removeMetadata() // REMOVE TODOS OS METADADOS
        .jpeg({ quality: 85 }) // Recomprimir para garantir limpeza
        .toFile(outputPath)
      
      // Adicionar hash único para evitar cache/tracking
      const hash = crypto.randomBytes(8).toString('hex')
      const finalPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, `-${hash}.$1`)
      
      // Renomear com hash
      const fs = require('fs').promises
      await fs.rename(outputPath, finalPath)
      
      console.log('✅ Image cleaned and saved:', finalPath)
      
    } catch (error) {
      console.error('❌ Error cleaning image:', error)
      throw error
    }
  }
  
  /**
   * Gera template "Simplified" baseado na página do produtor
   */
  generateSimplifiedTemplate(analysis: ProducerPageAnalysis): string {
    const { designSystem, content } = analysis
    
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.headline}</title>
    
    <!-- Design System Extraído -->
    <style>
        :root {
            --primary-color: ${designSystem.primaryColor};
            --secondary-color: ${designSystem.secondaryColor};
            --bg-color: ${designSystem.backgroundColor};
            --font-family: ${designSystem.fontFamily};
            --font-size: ${designSystem.fontSize};
            
            --btn-bg: ${designSystem.buttonStyle.backgroundColor};
            --btn-color: ${designSystem.buttonStyle.textColor};
            --btn-radius: ${designSystem.buttonStyle.borderRadius};
            --btn-padding: ${designSystem.buttonStyle.padding};
        }
        
        body {
            font-family: var(--font-family);
            font-size: var(--font-size);
            background-color: var(--bg-color);
            color: var(--primary-color);
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1 {
            color: var(--primary-color);
            font-size: 2.5em;
            margin-bottom: 0.5em;
        }
        
        h2 {
            color: var(--secondary-color);
            font-size: 1.5em;
        }
        
        .cta-button {
            background-color: var(--btn-bg);
            color: var(--btn-color);
            border-radius: var(--btn-radius);
            padding: var(--btn-padding);
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            display: inline-block;
            text-decoration: none;
            margin: 20px 0;
            transition: opacity 0.3s;
        }
        
        .cta-button:hover {
            opacity: 0.9;
        }
        
        .benefits {
            list-style: none;
            padding: 0;
        }
        
        .benefits li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .benefits li:before {
            content: "✓ ";
            color: var(--secondary-color);
            font-weight: bold;
            margin-right: 10px;
        }
        
        .urgency {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .guarantee {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero Section Simplificado -->
        <h1>${content.headline}</h1>
        <h2>${content.subheadline}</h2>
        
        <!-- CTA Principal -->
        <a href="%%AFFILIATE_LINK%%" class="cta-button">
            ${content.ctaButtons[0] || 'Quero Conhecer Agora'}
        </a>
        
        <!-- Benefits -->
        <h3>Principais Benefícios:</h3>
        <ul class="benefits">
            ${content.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
        
        <!-- Urgência (se houver) -->
        ${content.urgency.length > 0 ? `
        <div class="urgency">
            <strong>⚠️ Atenção:</strong> ${content.urgency[0]}
        </div>
        ` : ''}
        
        <!-- CTA Secundário -->
        <div style="text-align: center;">
            <a href="%%AFFILIATE_LINK%%" class="cta-button">
                ${content.ctaButtons[1] || 'Garantir Minha Vaga'}
            </a>
        </div>
        
        <!-- Garantia -->
        ${content.guarantee ? `
        <div class="guarantee">
            <h3>🛡️ Garantia</h3>
            <p>${content.guarantee}</p>
        </div>
        ` : ''}
        
        <!-- CTA Final -->
        <div style="text-align: center; margin-top: 50px;">
            <a href="%%AFFILIATE_LINK%%" class="cta-button">
                ${content.ctaButtons[2] || 'Acessar Oferta Especial'}
            </a>
            ${content.price ? `<p>Por apenas ${content.price}</p>` : ''}
        </div>
    </div>
    
    <!-- Tracking -->
    <script>
        // Tracking pixels aqui
    </script>
</body>
</html>
    `
  }
}