import { ProductValidationResponse } from '@/types';
import { countryDetector } from '../localization/country-detector';
import { trackingManager } from '../tracking/tracking-manager';
import { CookieTemplate } from './templates/cookie-template';
import { QuizTemplate } from './templates/quiz-template';
import { ReviewTemplate } from './templates/review-template';
import { ExpertReviewTemplate } from './templates/expert-review-template';
import { CODTemplate } from './templates/cod-template';

export interface PresellConfig {
  productName: string;
  productUrl: string;
  price: number;
  currency: string;
  language: string;
  country: string;
  
  // Extracted from producer page
  originalDescription: string;
  guaranteeDays?: number;
  discountPercentage?: number;
  
  // Optimized copy
  headline: string;
  subheadline: string;
  benefits: string[];
  socialProof: string;
  urgencyText: string;
  ctaText: string;
  
  // Styling
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

/**
 * Presell Template Generator
 * Generates complete HTML presells optimized for conversion
 */
export class PresellTemplateGenerator {
  
  /**
   * Generate complete presell from validation data
   */
  generateFromValidation(validation: ProductValidationResponse, affiliateUrl: string, options?: {
    designTokens?: any;
    customization?: any;
    templateType?: 'default' | 'cookie' | 'review' | 'expert' | 'quiz' | 'simplified' | 'cod';
  }): {
    html: string;
    css: string;
    js: string;
    assets: Record<string, string>;
    countrySettings: any;
    templateType?: string;
  } {
    const config = this.extractConfigFromValidation(validation, affiliateUrl, options);
    
    // Detecta configurações do país automaticamente
    const countrySettings = countryDetector.detectByCountry(validation.targetCountry);
    
    // Use template específico se solicitado
    if (options?.templateType === 'cookie') {
      const cookieTemplate = new CookieTemplate();
      const cookieResult = cookieTemplate.generate({
        productName: config.productName,
        productUrl: config.productUrl,
        targetCountry: validation.targetCountry,
        language: countrySettings?.language || 'pt-BR',
        currency: countrySettings?.currency || 'BRL',
        designTokens: options?.designTokens
      });
      
      return {
        html: cookieResult.html,
        css: cookieResult.css,
        js: cookieResult.js,
        assets: this.generateAssets(config),
        countrySettings,
        templateType: 'cookie'
      };
    }

    if (options?.templateType === 'quiz') {
      const quizTemplate = new QuizTemplate();
      const quizResult = quizTemplate.generate({
        productName: config.productName,
        affiliateUrl: config.productUrl,
        validationScore: validation.validationScore,
        countrySettings,
        designTokens: options?.designTokens,
        customization: options?.customization
      });
      
      return {
        html: quizResult.html,
        css: quizResult.css,
        js: quizResult.js,
        assets: this.generateAssets(config),
        countrySettings,
        templateType: 'quiz'
      };
    }

    if (options?.templateType === 'review') {
      const reviewTemplate = new ReviewTemplate();
      const reviewResult = reviewTemplate.generate({
        productName: config.productName,
        affiliateUrl: config.productUrl,
        validationScore: validation.validationScore,
        countrySettings,
        designTokens: options?.designTokens,
        customization: options?.customization
      });
      
      return {
        html: reviewResult.html,
        css: reviewResult.css,
        js: reviewResult.js,
        assets: this.generateAssets(config),
        countrySettings,
        templateType: 'review'
      };
    }

    if (options?.templateType === 'expert') {
      const expertTemplate = new ExpertReviewTemplate();
      const expertResult = expertTemplate.generate({
        productName: config.productName,
        affiliateUrl: config.productUrl,
        validationScore: validation.validationScore,
        countrySettings,
        designTokens: options?.designTokens,
        customization: options?.customization
      });
      
      return {
        html: expertResult.html,
        css: expertResult.css,
        js: expertResult.js,
        assets: this.generateAssets(config),
        countrySettings,
        templateType: 'expert'
      };
    }

    if (options?.templateType === 'cod') {
      const codTemplate = new CODTemplate();
      const codResult = codTemplate.generate({
        productName: config.productName,
        affiliateUrl: config.productUrl,
        validationScore: validation.validationScore,
        countrySettings,
        designTokens: options?.designTokens,
        customization: options?.customization,
        originalPrice: config.price
      });
      
      return {
        html: codResult.html,
        css: codResult.css,
        js: codResult.js,
        assets: this.generateAssets(config),
        countrySettings,
        templateType: 'cod'
      };
    }
    
    // Template padrão (existente)
    return {
      html: this.generateHTML(config, countrySettings, options?.designTokens),
      css: this.generateCSS(config, options?.designTokens),
      js: this.generateJS(config, countrySettings),
      assets: this.generateAssets(config),
      countrySettings,
      templateType: 'default'
    };
  }

  /**
   * Extract presell configuration from validation
   */
  private extractConfigFromValidation(validation: ProductValidationResponse, affiliateUrl: string, options?: {
    designTokens?: any;
    customization?: any;
  }): PresellConfig {
    const productData = validation.productData;
    
    return {
      productName: productData.title,
      productUrl: affiliateUrl,
      price: productData.price,
      currency: productData.currency,
      language: this.detectLanguage(validation.productData.description),
      country: 'Brasil', // Default, will be enhanced
      
      originalDescription: productData.description,
      guaranteeDays: 90,
      discountPercentage: 60,
      
      // Generate optimized copy
      headline: this.generateOptimizedHeadline(productData.title, productData.price, productData.currency),
      subheadline: this.generateSubheadline(productData.title),
      benefits: this.extractBenefits(productData.description),
      socialProof: this.generateSocialProof(productData.title),
      urgencyText: this.generateUrgencyText(),
      ctaText: this.generateCTAText(productData.title),
      
      // Apply design tokens if available, otherwise use defaults
      primaryColor: options?.designTokens?.colors?.primary || options?.customization?.colors?.primary || '#0066FF',
      secondaryColor: options?.designTokens?.colors?.secondary || options?.customization?.colors?.secondary || '#00CC88', 
      fontFamily: options?.designTokens?.typography?.primaryFont || 'Inter, system-ui, sans-serif'
    };
  }

  /**
   * Generate complete HTML structure
   */
  private generateHTML(config: PresellConfig, countrySettings?: any, designTokens?: any): string {
    // Detecta idioma e formato de preço
    const language = countrySettings?.language || 'pt-BR';
    const formattedPrice = countrySettings 
      ? countryDetector.formatPrice(config.price, countrySettings)
      : `R$ ${config.price}`;
    
    // Traduz palavras-chave da copy
    const localizedHeadline = countrySettings
      ? countryDetector.generateLocalizedCopy(config.headline, countrySettings)
      : config.headline;
    
    // Apply design matching CSS inline if available
    const inlineStyles = designTokens ? `
    <style>
      :root {
        --matched-primary: ${designTokens.colors.primary};
        --matched-secondary: ${designTokens.colors.secondary};
        --matched-accent: ${designTokens.colors.accent};
        --matched-background: ${designTokens.colors.background};
        --matched-text: ${designTokens.colors.text};
        --matched-button: ${designTokens.colors.button};
        --matched-font: ${designTokens.typography.primaryFont};
        --matched-heading-font: ${designTokens.typography.headingFont};
        --matched-border-radius: ${designTokens.layout.borderRadius};
        --matched-spacing: ${designTokens.layout.spacing};
      }
      
      /* Override default colors with matched ones */
      :root {
        --primary-color: var(--matched-primary);
        --secondary-color: var(--matched-secondary);
        --font-family: var(--matched-font);
      }
      
      body {
        background-color: var(--matched-background);
        color: var(--matched-text);
      }
      
      .cta-button {
        background: linear-gradient(135deg, var(--matched-button) 0%, var(--matched-primary) 100%);
        border-radius: var(--matched-border-radius);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--matched-heading-font);
        color: var(--matched-primary);
      }
    </style>
    ` : '';
    return `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${localizedHeadline} | ${config.productName}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${config.subheadline}">
    <meta name="keywords" content="${config.productName}, oferta, desconto, original">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${config.headline}">
    <meta property="og:description" content="${config.subheadline}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="style.css">
    ${inlineStyles}
    
    <!-- Advanced Tracking System -->
    ${trackingManager.generateTrackingCode()}
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="trust-badges">
                    <span class="badge">✅ Site Oficial</span>
                    <span class="badge">🔒 Compra Segura</span>
                    <span class="badge">🚚 Frete Grátis</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <!-- Urgency Banner -->
                <div class="urgency-banner">
                    <div class="urgency-text">
                        ${config.urgencyText}
                    </div>
                    <div class="countdown" id="countdown">
                        <span id="hours">23</span>h : <span id="minutes">59</span>m : <span id="seconds">59</span>s
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="hero-grid">
                    <div class="hero-text">
                        <h1 class="headline">
                            ${config.headline}
                        </h1>
                        
                        <h2 class="subheadline">
                            ${config.subheadline}
                        </h2>
                        
                        <div class="price-section">
                            <div class="price-original">
                                ${countrySettings?.language === 'en-US' ? 'From:' : 'De:'} ${countrySettings ? countryDetector.formatPrice(config.price * 2.5, countrySettings) : `R$ ${(config.price * 2.5).toFixed(2)}`}
                            </div>
                            <div class="price-current">
                                ${countrySettings?.language === 'en-US' ? 'Only:' : 'Por apenas:'} ${formattedPrice}
                                <span class="discount-badge">-${config.discountPercentage}%</span>
                            </div>
                            <div class="price-installments">
                                ${config.currency === 'BRL' ? 'ou 12x de R$' : 'or 12x $'}${(config.price / 12).toFixed(2)} sem juros
                            </div>
                        </div>
                        
                        <!-- CTA Button -->
                        <div class="cta-section">
                            <a href="${config.productUrl}" class="cta-button" onclick="window.track && window.track('conversion', 'cta_click', 'hero_cta', ${config.price})">
                                ${config.ctaText}
                            </a>
                            <div class="security-info">
                                🔒 Compra 100% Segura | 🎁 ${config.guaranteeDays || 90} Dias de Garantia
                            </div>
                        </div>
                    </div>
                    
                    <div class="hero-image">
                        <img src="product-image.jpg" alt="${config.productName}" class="product-image">
                        <div class="guarantee-seal">
                            <div class="seal-content">
                                <div class="seal-text">GARANTIA</div>
                                <div class="seal-days">${config.guaranteeDays || 90} DIAS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits">
        <div class="container">
            <h3 class="section-title">Por que escolher ${config.productName}?</h3>
            <div class="benefits-grid">
                ${config.benefits.map((benefit, index) => `
                <div class="benefit-item">
                    <div class="benefit-icon">✅</div>
                    <div class="benefit-text">${benefit}</div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Social Proof -->
    <section class="social-proof">
        <div class="container">
            <h3 class="section-title">O que nossos clientes dizem</h3>
            <div class="testimonials">
                <div class="testimonial">
                    <div class="testimonial-text">
                        "${config.socialProof}"
                    </div>
                    <div class="testimonial-author">
                        <strong>Maria Silva</strong> - São Paulo, SP
                    </div>
                    <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                </div>
                
                <div class="testimonial">
                    <div class="testimonial-text">
                        "Produto chegou rapidinho e exatamente como prometido. Super recomendo!"
                    </div>
                    <div class="testimonial-author">
                        <strong>João Santos</strong> - Rio de Janeiro, RJ
                    </div>
                    <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                </div>
                
                <div class="testimonial">
                    <div class="testimonial-text">
                        "Melhor custo-benefício que já encontrei. Vale muito a pena!"
                    </div>
                    <div class="testimonial-author">
                        <strong>Ana Costa</strong> - Belo Horizonte, MG
                    </div>
                    <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
        <div class="container">
            <div class="cta-box">
                <h3 class="cta-title">Última chance! Oferta válida apenas hoje</h3>
                <div class="final-price">
                    ${config.currency === 'BRL' ? 'R$' : '$'}${config.price.toFixed(2)}
                    <span class="price-detail">à vista no PIX (${config.discountPercentage}% OFF)</span>
                </div>
                <a href="${config.productUrl}" class="cta-button cta-button-large" onclick="window.track && window.track('conversion', 'cta_click', 'final_cta', ${config.price})">
                    ${config.ctaText}
                </a>
                <div class="guarantees">
                    <div class="guarantee-item">🚚 Frete Grátis para todo Brasil</div>
                    <div class="guarantee-item">💳 Parcele em até 12x sem juros</div>
                    <div class="guarantee-item">🛡️ ${config.guaranteeDays || 90} dias para devolução</div>
                    <div class="guarantee-item">🔒 Site 100% seguro e confiável</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>© 2024 ${config.productName} - Todos os direitos reservados</p>
                <p>Este site não é afiliado ao Facebook, Google ou qualquer empresa mencionada.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>`;
  }

  /**
   * Generate CSS styles
   */
  private generateCSS(config: PresellConfig, designTokens?: any): string {
    return `/* ${config.productName} - Presell Optimizada */
/* Gerada automaticamente pelo Sistema Inteligente */

:root {
    --primary-color: ${designTokens?.colors?.primary || config.primaryColor};
    --secondary-color: ${designTokens?.colors?.secondary || config.secondaryColor};
    --accent-color: ${designTokens?.colors?.accent || '#00CC88'};
    --background-color: ${designTokens?.colors?.background || '#ffffff'};
    --text-color: ${designTokens?.colors?.text || '#333'};
    --button-color: ${designTokens?.colors?.button || config.primaryColor};
    --success-color: #00CC88;
    --warning-color: #FF9500;
    --danger-color: #FF3B30;
    --dark-color: #1a1a1a;
    --light-color: #f8f9fa;
    --text-light: #666;
    --border-radius: ${designTokens?.layout?.borderRadius || '8px'};
    --spacing: ${designTokens?.layout?.spacing || '16px'};
    --font-family: ${designTokens?.typography?.primaryFont || config.fontFamily};
    --heading-font: ${designTokens?.typography?.headingFont || config.fontFamily};
    --container-max-width: 1200px;
    
    /* Shadow styles based on design tokens */
    --shadow: ${designTokens?.layout?.shadowStyle === 'strong' ? '0 4px 12px rgba(0,0,0,0.15)' : 
              designTokens?.layout?.shadowStyle === 'none' ? 'none' : 
              '0 2px 4px rgba(0,0,0,0.1)'};
}

/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

.container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: var(--light-color);
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
}

.trust-badges {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.badge {
    background: white;
    padding: 5px 15px;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #e0e0e0;
}

/* Hero Section */
.hero {
    padding: 40px 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.urgency-banner {
    background: var(--warning-color);
    color: white;
    text-align: center;
    padding: 15px;
    border-radius: var(--border-radius);
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

.urgency-text {
    font-weight: 700;
    font-size: 16px;
}

.countdown {
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 1px;
}

.hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
}

.headline {
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
    color: var(--primary-color);
    font-family: var(--heading-font);
}

.subheadline {
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--text-light);
    margin-bottom: 30px;
    line-height: 1.4;
}

.price-section {
    margin-bottom: 30px;
}

.price-original {
    font-size: 18px;
    color: var(--text-light);
    text-decoration: line-through;
    margin-bottom: 5px;
}

.price-current {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--success-color);
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.discount-badge {
    background: var(--danger-color);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
}

.price-installments {
    font-size: 16px;
    color: var(--text-light);
}

.cta-section {
    text-align: center;
}

.cta-button {
    display: inline-block;
    background: linear-gradient(135deg, var(--button-color) 0%, var(--primary-color) 100%);
    color: white;
    text-decoration: none;
    padding: var(--spacing);
    border-radius: var(--border-radius);
    font-size: 1.3rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    box-shadow: var(--shadow);
    margin-bottom: 15px;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
}

.cta-button-large {
    padding: 25px 50px;
    font-size: 1.5rem;
}

.security-info {
    font-size: 14px;
    color: var(--text-light);
}

.hero-image {
    position: relative;
    text-align: center;
}

.product-image {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.guarantee-seal {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 80px;
    height: 80px;
    background: var(--success-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 12px;
    text-align: center;
}

/* Benefits Section */
.benefits {
    padding: 60px 0;
    background: white;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 40px;
    color: var(--primary-color);
    font-family: var(--heading-font);
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px;
    background: var(--light-color);
    border-radius: var(--border-radius);
    border-left: 4px solid var(--success-color);
}

.benefit-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.benefit-text {
    font-size: 16px;
    line-height: 1.5;
}

/* Social Proof */
.social-proof {
    padding: 60px 0;
    background: var(--light-color);
}

.testimonials {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.testimonial {
    background: white;
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.testimonial-text {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 15px;
    font-style: italic;
}

.testimonial-author {
    font-weight: 600;
    margin-bottom: 5px;
}

.testimonial-rating {
    font-size: 18px;
}

/* Final CTA */
.final-cta {
    padding: 60px 0;
    background: var(--dark-color);
    color: white;
}

.cta-box {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
}

.cta-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
}

.final-price {
    font-size: 3rem;
    font-weight: 800;
    color: var(--success-color);
    margin-bottom: 30px;
}

.price-detail {
    display: block;
    font-size: 16px;
    font-weight: 400;
    color: #ccc;
    margin-top: 5px;
}

.guarantees {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 30px;
}

.guarantee-item {
    font-size: 14px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
}

/* Footer */
.footer {
    padding: 30px 0;
    background: #f8f9fa;
    text-align: center;
    font-size: 14px;
    color: var(--text-light);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .hero-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .headline {
        font-size: 2.2rem;
    }
    
    .subheadline {
        font-size: 1.2rem;
    }
    
    .price-current {
        font-size: 2rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .urgency-banner {
        flex-direction: column;
        text-align: center;
    }
    
    .trust-badges {
        justify-content: center;
    }
    
    .benefits-grid,
    .testimonials {
        grid-template-columns: 1fr;
    }
    
    .guarantees {
        grid-template-columns: 1fr;
    }
    
    .cta-button {
        display: block;
        width: 100%;
        padding: 18px;
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .headline {
        font-size: 1.8rem;
    }
    
    .final-price {
        font-size: 2.2rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
}`;
  }

  /**
   * Generate JavaScript functionality
   */
  private generateJS(config: PresellConfig, countrySettings?: any): string {
    const currency = countrySettings?.currency || 'BRL';
    return `// ${config.productName} - Presell JavaScript
// Gerado automaticamente pelo Sistema Inteligente

// Countdown Timer
function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    
    function updateCountdown() {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    // Reset countdown
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
            }
        }
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Conversion Tracking
function trackConversion(event) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'event_category': 'CTA',
            'event_label': event,
            'value': ${config.price}
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: '${config.productName}',
            content_category: 'Product',
            value: ${config.price},
            currency: '${config.currency}'
        });
    }
    
    console.log('Conversion tracked:', event);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Exit Intent (for desktop)
function initExitIntent() {
    let hasShownPopup = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !hasShownPopup && window.innerWidth > 768) {
            hasShownPopup = true;
            
            if (confirm('🚨 ESPERA! Antes de sair, que tal garantir ${config.productName} com ${config.discountPercentage}% de desconto? Esta oferta é válida apenas hoje!')) {
                window.location.href = '${config.productUrl}';
            }
        }
    });
}

// Page Visibility (mobile exit intent)
function initPageVisibility() {
    let hasShownAlert = false;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && !hasShownAlert && window.innerWidth <= 768) {
            hasShownAlert = true;
            
            setTimeout(() => {
                if (document.hidden) {
                    // Mobile exit intent - could trigger push notification or similar
                    console.log('User left page on mobile');
                }
            }, 2000);
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.benefit-item, .testimonial').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initSmoothScrolling();
    initExitIntent();
    initPageVisibility();
    initScrollAnimations();
    
    console.log('${config.productName} Presell initialized');
    
    // Track page view
    trackConversion('page_view');
});

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states, optimize images, etc.
    document.body.classList.add('loaded');
});`;
  }

  /**
   * Generate additional assets
   */
  private generateAssets(config: PresellConfig): Record<string, string> {
    return {
      'tracking_setup.txt': `# Configuração de Tracking para ${config.productName}

## Google Analytics
1. Substitua 'GA_TRACKING_ID' pelo seu ID do Google Analytics
2. Configure eventos de conversão no GA4

## Facebook Pixel  
1. Substitua 'FB_PIXEL_ID' pelo seu ID do Facebook Pixel
2. Configure eventos customizados para leads/vendas

## URLs para substituir:
- GA_TRACKING_ID: Seu código do Google Analytics
- FB_PIXEL_ID: Seu código do Facebook Pixel
- product-image.jpg: Imagem do produto (recomendado: 600x600px)

## Teste antes de publicar:
- Verifique se todos os links estão funcionando
- Teste o countdown timer
- Valide tracking de conversões
- Teste responsividade mobile`,

      'seo_meta_tags.txt': `# Meta Tags SEO para ${config.productName}

## Tags principais (já incluídas):
- Title: ${config.headline}
- Description: ${config.subheadline}
- Keywords: ${config.productName}, oferta, desconto, original
- Open Graph para redes sociais

## Melhorias recomendadas:
1. Adicione schema.org structured data
2. Otimize images com alt text
3. Configure canonical URL
4. Adicione hreflang se multi-idioma`,

      'mobile_optimization.txt': `# Otimizações Mobile para ${config.productName}

## Já implementado:
- Design responsivo completo
- Touch-friendly buttons (min 44px)
- Readable fonts (min 16px)
- Optimized images

## Checklist final:
- [ ] Teste em dispositivos reais
- [ ] Verifique velocidade de carregamento
- [ ] Teste formulários touch
- [ ] Valide scroll behaviors
- [ ] Teste exit intent mobile`
    };
  }

  // Helper methods for content generation
  private detectLanguage(text: string): string {
    const portugueseWords = ['de', 'para', 'com', 'por', 'em', 'do', 'da', 'não', 'que'];
    const englishWords = ['the', 'and', 'for', 'with', 'by', 'in', 'of', 'not', 'that'];
    
    const lowerText = text.toLowerCase();
    const ptMatches = portugueseWords.filter(word => lowerText.includes(word)).length;
    const enMatches = englishWords.filter(word => lowerText.includes(word)).length;
    
    return ptMatches > enMatches ? 'pt' : 'en';
  }

  private generateOptimizedHeadline(productName: string, price: number, currency: string): string {
    const templates = [
      `${productName} com 60% OFF Só Hoje!`,
      `${productName} Original - Site Oficial`,
      `Últimas 48h: ${productName} em Oferta`,
      `${productName} - Garantia Total 90 Dias`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateSubheadline(productName: string): string {
    return `Aproveite esta oferta exclusiva e adquira ${productName} com o melhor preço e garantia total. Disponível por tempo limitado!`;
  }

  private extractBenefits(description: string): string[] {
    const defaultBenefits = [
      'Produto 100% original e certificado',
      'Entrega rápida e segura para todo Brasil', 
      'Garantia de 90 dias ou seu dinheiro de volta',
      'Suporte especializado 24/7',
      'Milhares de clientes satisfeitos',
      'Aprovado por especialistas da área'
    ];
    
    // TODO: Extract benefits from description using NLP
    return defaultBenefits.slice(0, 4);
  }

  private generateSocialProof(productName: string): string {
    const proofs = [
      `Comprei ${productName} semana passada e já estou vendo resultados incríveis! Super recomendo!`,
      `Melhor investimento que fiz este ano. ${productName} realmente funciona como prometido.`,
      `Estava desconfiado no início, mas ${productName} superou todas as expectativas. Nota 10!`
    ];
    
    return proofs[Math.floor(Math.random() * proofs.length)];
  }

  private generateUrgencyText(): string {
    const urgencies = [
      '⚡ OFERTA RELÂMPAGO: Últimas 24 horas com 60% de desconto!',
      '🔥 PROMOÇÃO EXCLUSIVA: Apenas hoje com frete grátis!',
      '⏰ ÚLTIMAS UNIDADES: Estoque limitado - garante já o seu!'
    ];
    
    return urgencies[Math.floor(Math.random() * urgencies.length)];
  }

  private generateCTAText(productName: string): string {
    const ctas = [
      `QUERO GARANTIR MEU ${productName.toUpperCase()}`,
      'COMPRAR AGORA COM DESCONTO',
      'SIM, EU QUERO APROVEITAR ESTA OFERTA',
      'GARANTIR AGORA COM 60% OFF'
    ];
    
    return ctas[Math.floor(Math.random() * ctas.length)];
  }
}

/**
 * Default instance
 */
export const presellGenerator = new PresellTemplateGenerator();