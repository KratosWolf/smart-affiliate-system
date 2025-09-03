import { ProductValidationResponse } from '@/types';
import { countryDetector } from '../localization/country-detector';
import { trackingManager } from '../tracking/tracking-manager';
// Template imports commented out - files don't exist yet
// import { CookieTemplate } from './templates/cookie-template';
// import { QuizTemplate } from './templates/quiz-template';
// import { ReviewTemplate } from './templates/review-template';
// import { ExpertReviewTemplate } from './templates/expert-review-template';
// import { CODTemplate } from './templates/cod-template';

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
  
  // Additional data for templates
  productData?: any;
  producerPageUrl?: string;
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
    console.log('🎯 generateFromValidation called with options:', options);
    console.log('Template type received:', options?.templateType);
    
    const config = this.extractConfigFromValidation(validation, affiliateUrl, options);
    
    // Detecta configurações do país automaticamente
    const countrySettings = countryDetector.detectByCountry(validation.targetCountry);
    
    // Use template específico se solicitado
    if (options?.templateType === 'cookie') {
      console.log('🍪 Cookie template being generated!');
      console.log('Config:', config);
      console.log('Options:', options);
      
      const cookieResult = {
        html: this.generateCookieHTML(config, countrySettings, options?.designTokens, options),
        css: this.generateCookieCSS(config, options?.designTokens),
        js: this.generateCookieJS(config, countrySettings),
        assets: this.generateAssets(config),
        countrySettings,
        templateType: 'cookie'
      };
      
      console.log('🍪 Cookie template generated successfully!');
      console.log('HTML length:', cookieResult.html.length);
      console.log('First 500 chars of HTML:', cookieResult.html.substring(0, 500));
      
      return cookieResult;
    }

    if (options?.templateType === 'quiz') {
      console.log('Quiz template requested but not implemented yet');
      // Fall back to default template
    }

    if (options?.templateType === 'review') {
      console.log('Review template requested but not implemented yet');
      // Fall back to default template
    }

    if (options?.templateType === 'expert') {
      console.log('Expert template requested but not implemented yet');
      // Fall back to default template
    }

    if (options?.templateType === 'cod') {
      console.log('COD template requested but not implemented yet');
      // Fall back to default template
    }
    
    // Template padrão (existente)
    return {
      html: this.generateHTML(config, countrySettings, options?.designTokens, options),
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
      
      // Add product data for screenshot generation
      productData: validation.productData,
      producerPageUrl: options?.customization?.originalPageUrl || '',
      
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
  private generateHTML(config: PresellConfig, countrySettings?: any, designTokens?: any, options?: any): string {
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
    
    <!-- Custom Tracking Integration -->
    ${options?.customization?.tracking ? this.generateCustomTrackingCode(options.customization.tracking) : '<!-- No custom tracking configured -->'}
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

  /**
   * Generate custom tracking code for Ratoeira Ads and Microsoft Clarity
   */
  private generateCustomTrackingCode(trackingConfig?: any): string {
    if (!trackingConfig) return '';

    let trackingCode = '';

    // Ratoeira Ads tracking
    if (trackingConfig.ratoEiraAdsUrl) {
      trackingCode += `
    <!-- Ratoeira Ads Tracking -->
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = '${trackingConfig.ratoEiraAdsUrl}';
        script.async = true;
        document.head.appendChild(script);
      })();
    </script>`;
    }

    // Microsoft Clarity tracking  
    if (trackingConfig.clarityUrl) {
      trackingCode += `
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${trackingConfig.clarityUrl}");
    </script>`;
    }

    return trackingCode;
  }

  /**
   * Generate Cookie Template HTML - Real Screenshot Background with Centered Cookie
   */
  private generateCookieHTML(config: PresellConfig, countrySettings?: any, designTokens?: any, options?: any): string {
    // Remove emergency override - use dynamic template for all products
    // Always use the actual product URL from config - never hardcoded values
    const originalPageUrl = config.producerPageUrl || options?.customization?.originalPageUrl || 'https://example.com/';
    
    console.log('🔍 Cookie template using URL:', originalPageUrl);
    console.log('🔍 Product name:', config.productName);
    
    // Enhanced language detection based on actual product URL
    const isEnglish = originalPageUrl.includes('.com') || 
                     originalPageUrl.toLowerCase().includes('english') ||
                     originalPageUrl.includes('.us') ||
                     originalPageUrl.includes('.uk');
    
    const isFrench = originalPageUrl.includes('.fr');
    const isSpanish = originalPageUrl.includes('.es') || originalPageUrl.includes('spain');
    
    // Cookie messages - exact user specifications
    const cookieMessages = {
      en: {
        title: "Cookie Consent",
        message: "This website uses cookies to enhance your browsing experience and deliver personalized content.",
        message2: "By clicking \"Accept\", you may unlock even greater discounts.",
        accept: "Accept", 
        decline: "Decline"
      },
      pt: {
        title: "Consentimento de Cookie",
        message: "Este site utiliza cookies para melhorar sua experiência de navegação e fornecer conteúdo personalizado.",
        message2: "Ao clicar em \"Aceitar\", você pode desbloquear descontos ainda maiores.",
        accept: "Aceitar",
        decline: "Recusar"
      },
      es: {
        title: "Consentimiento de Cookies",
        message: "Este sitio web utiliza cookies para mejorar su experiencia de navegación y ofrecer contenido personalizado.",
        message2: "Al hacer clic en \"Aceptar\", puede desbloquear descuentos aún mayores.",
        accept: "Aceptar",
        decline: "Rechazar"
      },
      fr: {
        title: "Consentement aux Cookies",
        message: "Ce site utilise des cookies pour améliorer votre expérience de navigation et fournir un contenu personnalisé.",
        message2: "En cliquant sur \"Accepter\", vous pouvez débloquer des réductions encore plus importantes.",
        accept: "Accepter",
        decline: "Refuser"
      }
    };

    let lang = 'pt'; // Default
    if (isEnglish) lang = 'en';
    else if (isFrench) lang = 'fr';
    else if (isSpanish) lang = 'es';
    
    const messages = cookieMessages[lang];
    
    // FORCE use product name for screenshots - NEVER use URL-based naming
    const productName = config.productName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'product';
    
    console.log('🔍 FORCED product name for screenshots:', productName);
    console.log('🔍 Original URL being used:', originalPageUrl);
    
    // ALWAYS try local screenshots first with product name
    const localDesktopScreenshot = `/screenshots/${productName}/desktop-hero.jpg`;
    const localMobileScreenshot = `/screenshots/${productName}/mobile-hero.jpg`;
    
    console.log('📁 FORCED desktop path:', localDesktopScreenshot);
    console.log('📁 FORCED mobile path:', localMobileScreenshot);
    
    // Use ACTUAL product URL for external screenshots - not any cached value
    const productUrl = config.productData?.producerPageUrl || originalPageUrl;
    const desktopScreenshot = `https://mini.s-shot.ru/1200x800/JPEG/1200/Z100/?${productUrl}`;
    const mobileScreenshot1 = `https://mini.s-shot.ru/375x812/JPEG/375/Z100/?${productUrl}`;
    const fallbackScreenshot = localDesktopScreenshot; // Use local as fallback, not external

    return `<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : lang === 'fr' ? 'fr' : lang === 'es' ? 'es' : 'pt-BR'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${config.productName}</title>
    
    <!-- Tracking Scripts -->
    ${options?.customization?.tracking ? this.generateCustomTrackingCode(options.customization.tracking) : ''}
</head>
<body>
    <!-- Real Screenshot Background -->
    <div class="page-screenshot" onclick="redirectToAffiliate()">
        <img id="screenshot-img" 
             src="${localDesktopScreenshot}"
             alt="${config.productName} Preview" 
             onerror="console.log('❌ Local screenshot failed, trying external API'); this.src='${desktopScreenshot}';"
             onload="console.log('✅ Screenshot loaded successfully!');"
             style="display: block; opacity: 1;">
    </div>

    <!-- Centered Cookie Popup -->
    <div class="cookie-overlay">
        <div class="cookie-popup">
            <div class="cookie-header">
                <div class="cookie-icon">🍪</div>
                <h3>${messages.title}</h3>
            </div>
            
            <div class="cookie-body">
                <p>${messages.message}</p>
                <p style="margin-top: 12px;">${messages.message2}</p>
            </div>
            
            <div class="cookie-actions">
                <button class="accept-btn" onclick="acceptCookies()">${messages.accept}</button>
                <button class="decline-btn" onclick="redirectToAffiliate()">${messages.decline}</button>
            </div>
        </div>
    </div>

    <script>
        console.log('🍪 Cookie Template Loaded');
        
        // Simple mobile detection based on screen width
        function isMobile() {
            const width = window.innerWidth;
            const isMobileWidth = width <= 500; // More restrictive for mobile
            
            console.log('📱 Simple Mobile Detection:', {
                width: width,
                isMobileWidth: isMobileWidth,
                threshold: 500
            });
            
            return isMobileWidth;
        }
        
        const localDesktopScreenshot = '${localDesktopScreenshot}';
        const localMobileScreenshot = '${localMobileScreenshot}';
        const desktopScreenshot = '${desktopScreenshot}';
        const mobileScreenshot1 = '${mobileScreenshot1}';
        const fallbackScreenshot = '${fallbackScreenshot}';
        
        function redirectToAffiliate() {
            console.log('Redirecting to: ${config.productUrl}');
            window.location.href = '${config.productUrl}';
        }
        
        function acceptCookies() {
            document.cookie = 'cookies_accepted=true; path=/; max-age=31536000';
            redirectToAffiliate();
        }
        
        // Any click on background redirects
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.cookie-popup')) {
                redirectToAffiliate();
            }
        });
        
        // Auto-focus and keyboard handling
        document.addEventListener('DOMContentLoaded', function() {
            // Load appropriate screenshot based on device
            const img = document.getElementById('screenshot-img');
            const isMobileDevice = isMobile();
            
            console.log('🔍 Device check - isMobile:', isMobileDevice);
            console.log('🔍 Window width:', window.innerWidth);
            
            if (isMobileDevice) {
                console.log('📱 Mobile detected - switching to mobile screenshot');
                console.log('📱 Mobile image URL:', localMobileScreenshot);
                img.src = localMobileScreenshot;
                
                img.onerror = function() {
                    console.log('❌ Mobile screenshot failed, using fallback');
                    this.src = desktopScreenshot;
                };
                
                img.onload = function() {
                    console.log('✅ Mobile screenshot loaded successfully!');
                    console.log('📐 Image dimensions:', this.naturalWidth + 'x' + this.naturalHeight);
                };
            } else {
                // Desktop - image src already set in HTML
                console.log('🖥️ Desktop device detected, keeping desktop image');
            }
            
            const acceptBtn = document.querySelector('.accept-btn');
            if (acceptBtn) {
                acceptBtn.focus();
            }
            
            // Enter key accepts, Escape key declines
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    acceptCookies();
                } else if (e.key === 'Escape') {
                    redirectToAffiliate();
                }
            });
            
            console.log('✅ Cookie template ready!');
        });
    </script>
</body>
</html>`;
  }

  /**
   * EMERGENCY Skinatrin Template - Hardcoded for guaranteed functionality
   */
  private generateSkinatrinTemplate(config: PresellConfig): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skinatrin</title>
</head>
<body style="margin:0;padding:0;font-family:Arial;">
    <!-- WORKING Skinatrin Screenshot Background -->
    <div style="position:fixed;top:0;left:0;width:100%;height:100vh;cursor:pointer;" onclick="redirectToAffiliate()">
        <img id="screenshot-img" 
             src="/screenshots/skinatrin/desktop-hero.jpg"
             alt="Skinatrin Preview" 
             style="width:100%;height:100%;object-fit:cover;display:block;"
             onload="console.log('✅ SKINATRIN TEMPLATE WORKING!');"
             onerror="console.log('❌ Skinatrin failed');">
    </div>

    <!-- Centered Cookie Popup -->
    <div class="cookie-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div class="cookie-popup" style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); max-width: 400px; text-align: center;">
            <div class="cookie-header" style="margin-bottom: 16px;">
                <div class="cookie-icon" style="font-size: 24px; margin-bottom: 8px;">🍪</div>
                <h3 style="margin: 0; font-family: Arial, sans-serif;">Cookie Consent</h3>
            </div>
            
            <div class="cookie-body" style="margin-bottom: 24px; font-family: Arial, sans-serif; font-size: 14px; color: #666;">
                <p>This website uses cookies to enhance your browsing experience and deliver personalized content.</p>
                <p style="margin-top: 12px;">By clicking "Accept", you may unlock even greater discounts.</p>
            </div>
            
            <div class="cookie-actions" style="display: flex; gap: 12px;">
                <button onclick="acceptCookies()" class="accept-btn" style="flex: 1; background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">Accept</button>
                <button onclick="redirectToAffiliate()" style="flex: 1; background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">Decline</button>
            </div>
        </div>
    </div>

    <script>
        function redirectToAffiliate() {
            console.log('Redirecting to Skinatrin affiliate link');
            window.location.href = '${config.productUrl || 'https://hop.clickbank.net/?affiliate=skinatrin'}';
        }
        
        function acceptCookies() {
            document.cookie = 'cookies_accepted=true; path=/; max-age=31536000';
            redirectToAffiliate();
        }
        
        // Auto-focus Accept button
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.accept-btn').focus();
        });
        
        console.log('🎯 SKINATRIN HARDCODED TEMPLATE LOADED!');
    </script>
</body>
</html>`;
  }

  /**
   * Generate Cookie Template CSS - Real Page Clone Styling
   */
  private generateCookieCSS(config: PresellConfig, designTokens?: any): string {
    return `/* Cookie Template - Screenshot Background with Centered Popup */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    overflow: hidden;
    height: 100vh;
}

/* Screenshot Background */
.page-screenshot {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    z-index: 1;
}

.page-screenshot img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: top center;
    display: block !important;
    opacity: 1 !important;
    filter: blur(1px) brightness(0.7);
    z-index: 10;
    position: relative;
}

/* Mobile image responsiveness */
@media (max-width: 768px) {
    .page-screenshot {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 20px 10px;
        z-index: 1;
    }
    
    .page-screenshot img {
        object-fit: contain;
        object-position: top center;
        max-width: 100%;
        max-height: 90vh;
        width: auto;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 2;
    }
}

/* Fallback background when screenshot fails */
.page-screenshot.fallback-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.page-screenshot.fallback-bg::after {
    content: "⚡ Loading page preview...";
    color: white;
    font-size: 1.2rem;
    opacity: 0.9;
    text-align: center;
    padding: 20px;
    background: rgba(0,0,0,0.3);
    border-radius: 10px;
    backdrop-filter: blur(5px);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.page-header {
    background: linear-gradient(135deg, #003300 0%, #004d00 100%);
    color: white;
    padding: 20px 0;
    position: relative;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 15px;
    letter-spacing: 1px;
}

.nav-breadcrumb {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 15px;
}

.nav-breadcrumb span {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.nav-breadcrumb span:hover {
    background: rgba(255, 255, 255, 0.2);
}

.special-offer-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #ff6b35;
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    animation: pulse 2s infinite;
}

/* Main Content */
.main-content {
    padding: 40px 0;
}

.hero-section {
    text-align: center;
    margin-bottom: 60px;
}

.hero-title {
    font-size: 2.8rem;
    color: #003300;
    margin-bottom: 20px;
    font-weight: 700;
}

.hero-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.price-section {
    margin: 30px 0;
}

.old-price {
    font-size: 1.1rem;
    color: #999;
    text-decoration: line-through;
    margin-bottom: 10px;
}

.new-price {
    font-size: 2.2rem;
    color: #ff6b35;
    font-weight: 700;
    margin-bottom: 20px;
}

.benefits-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
    max-width: 800px;
    margin: 30px auto;
    text-align: left;
}

.benefit-item {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
}

.benefit-item:before {
    content: '✓';
    color: #28a745;
    font-weight: bold;
    margin-right: 10px;
}

.product-image-placeholder {
    margin: 40px 0;
}

.product-image-placeholder img {
    max-width: 400px;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.cta-section {
    margin: 40px 0;
}

.main-cta-btn {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    border: none;
    padding: 20px 40px;
    font-size: 1.3rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: 0 5px 20px rgba(40, 167, 69, 0.3);
    margin-bottom: 20px;
}

.main-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.guarantee-text {
    background: #e8f5e8;
    color: #155724;
    padding: 15px;
    border-radius: 10px;
    display: inline-block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: 15px;
}

/* Sections */
.how-it-works, .testimonials {
    background: #f8f9fa;
    padding: 40px;
    border-radius: 15px;
    margin: 40px 0;
    text-align: center;
}

.how-it-works h3, .testimonials h3 {
    font-size: 2rem;
    color: #003300;
    margin-bottom: 30px;
}

.steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.step {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-weight: 500;
}

blockquote {
    font-size: 1.2rem;
    font-style: italic;
    color: #666;
    border-left: 4px solid #28a745;
    padding-left: 20px;
    margin: 20px 0;
}

cite {
    font-size: 0.9rem;
    color: #999;
    font-style: normal;
}

/* Cookie Overlay - Centered and Effective */
.cookie-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
    pointer-events: none;
}

.cookie-overlay .cookie-popup {
    pointer-events: all;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.cookie-popup {
    max-width: 500px;
    background: white;
    border-radius: 12px;
    padding: 30px;
    margin: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    text-align: center;
    animation: popIn 0.3s ease-out;
    width: 90%;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .cookie-popup {
        max-width: 350px;
        padding: 20px;
        margin: 15px;
        width: calc(100vw - 30px);
        max-height: 70vh;
        overflow-y: auto;
    }
}

@keyframes popIn {
    from { 
        opacity: 0; 
        transform: scale(0.8) translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: scale(1) translateY(0); 
    }
}

.cookie-header {
    margin-bottom: 20px;
}

.cookie-header .cookie-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}

.cookie-header h3 {
    font-size: 1.5rem;
    color: #333;
    margin: 0;
    font-weight: 700;
}

.cookie-body {
    margin-bottom: 25px;
}

.cookie-body p {
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
    margin: 0;
}

/* Mobile text adjustments */
@media (max-width: 768px) {
    .cookie-header .cookie-icon {
        font-size: 2.5rem;
        margin-bottom: 10px;
    }
    
    .cookie-header h3 {
        font-size: 1.3rem;
    }
    
    .cookie-body {
        margin-bottom: 20px;
    }
    
    .cookie-body p {
        font-size: 0.9rem;
        line-height: 1.4;
    }
}

.cookie-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.accept-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 14px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 180px;
    flex: 1;
}

.accept-btn:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.decline-btn {
    background: transparent;
    color: #999;
    border: 1px solid #ddd;
    padding: 14px 30px;
    border-radius: 25px;
    flex: 1;
}

/* Mobile buttons */
@media (max-width: 768px) {
    .cookie-actions {
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }
    
    .accept-btn, .decline-btn {
        min-width: unset;
        width: 100%;
        padding: 12px 20px;
        font-size: 0.95rem;
        flex: none;
    }
}
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.decline-btn:hover {
    background: #f8f9fa;
}

/* Animations */
@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .nav-breadcrumb {
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .special-offer-badge {
        position: static;
        display: inline-block;
        margin-top: 15px;
    }
    
    .cookie-content {
        flex-direction: column;
        text-align: center;
        gap: 15px;
    }
    
    .cookie-actions {
        width: 100%;
    }
    
    .accept-btn, .decline-btn {
        flex: 1;
    }
    
    .benefits-list {
        grid-template-columns: 1fr;
    }
    
    .steps {
        grid-template-columns: 1fr;
    }
`;
  }

  /**
   * Generate Cookie Template JavaScript
   */
  private generateCookieJS(config: PresellConfig, countrySettings?: any): string {
    return `// Cookie Template JavaScript - Overlay Redirect System
console.log('Cookie Template - JavaScript loaded');

// Enhanced tracking function
function trackConversion(event) {
    console.log('Cookie Template - Conversion tracked:', event);
    
    // Track with various systems
    try {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'event_category': 'Cookie_Template',
                'event_label': event,
                'value': ${config.price || 0}
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: '${config.productName}',
                content_category: 'Cookie_Template',
                value: ${config.price || 0},
                currency: '${config.currency || 'BRL'}'
            });
        }
    } catch (error) {
        console.error('Tracking error:', error);
    }
}

// Auto-focus functionality for better UX
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cookie Template - DOM loaded, initializing...');
    
    // Focus on accept button for better accessibility
    const acceptButton = document.getElementById('acceptCookies');
    if (acceptButton) {
        acceptButton.focus();
        
        // Add keyboard shortcut (Enter key)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                acceptButton.click();
            }
        });
    }
    
    console.log('Cookie Template - Initialization complete');
});

// Performance tracking
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log('Cookie Template - Page loaded in', Math.round(loadTime), 'ms');
    
    trackConversion('page_loaded');
});`;
  }
}

/**
 * Default instance
 */
export const presellGenerator = new PresellTemplateGenerator();

