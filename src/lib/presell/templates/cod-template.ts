import { DesignTokens } from '@/types'
import { CountrySettings, getCountrySettings } from '../country-settings'

export interface CODTemplateConfig {
  productName: string
  affiliateUrl: string
  validationScore: number
  countrySettings: CountrySettings
  designTokens?: DesignTokens
  customization?: any
  originalPrice?: number
}

export interface CODOffer {
  originalPrice: number
  codPrice: number
  cardPrice: number
  discount: number
  installments: number
}

export class CODTemplate {
  private generateCODOffer(productName: string, countrySettings: CountrySettings, originalPrice?: number): CODOffer {
    const basePrice = originalPrice || 197
    const codPrice = Math.round(basePrice * 0.6) // 40% discount for COD
    const cardPrice = basePrice
    const discount = Math.round(((cardPrice - codPrice) / cardPrice) * 100)
    
    return {
      originalPrice: Math.round(basePrice * 1.5),
      codPrice,
      cardPrice,
      discount,
      installments: 12
    }
  }

  private generateUrgencyReasons(countrySettings: CountrySettings) {
    const lang = countrySettings.language
    
    if (lang === 'pt-BR') {
      return [
        {
          icon: '📦',
          title: 'Estoque Limitado',
          description: 'Apenas 47 unidades restantes para entrega COD'
        },
        {
          icon: '🚚',
          title: 'Frete Grátis Hoje',
          description: 'Promoção válida apenas nas próximas 24 horas'
        },
        {
          icon: '💰',
          title: 'Desconto Máximo',
          description: 'Maior desconto do ano - não vai repetir'
        },
        {
          icon: '⏰',
          title: 'Oferta Relâmpago',
          description: 'Timer real - quando acabar, volta o preço normal'
        }
      ]
    } else {
      return [
        {
          icon: '📦',
          title: 'Limited Stock',
          description: 'Only 47 units left for COD delivery'
        },
        {
          icon: '🚚',
          title: 'Free Shipping Today',
          description: 'Promotion valid only for the next 24 hours'
        },
        {
          icon: '💰',
          title: 'Maximum Discount',
          description: 'Biggest discount of the year - won\'t repeat'
        },
        {
          icon: '⏰',
          title: 'Flash Offer',
          description: 'Real timer - when it ends, price returns to normal'
        }
      ]
    }
  }

  private generatePaymentBenefits(countrySettings: CountrySettings) {
    const lang = countrySettings.language
    
    if (lang === 'pt-BR') {
      return [
        {
          icon: '🏠',
          title: 'Receba em Casa',
          description: 'Entregamos na sua porta, você só paga quando receber',
          highlight: true
        },
        {
          icon: '👀',
          title: 'Veja Antes de Pagar',
          description: 'Examine o produto, se não gostar, não paga nada'
        },
        {
          icon: '🔒',
          title: '100% Seguro',
          description: 'Sem risco, sem pegadinhas, sem letra miúda'
        },
        {
          icon: '⚡',
          title: 'Entrega Rápida',
          description: 'Receba em 3-5 dias úteis na sua residência'
        }
      ]
    } else {
      return [
        {
          icon: '🏠',
          title: 'Receive at Home',
          description: 'We deliver to your door, you only pay when you receive',
          highlight: true
        },
        {
          icon: '👀',
          title: 'See Before Paying',
          description: 'Examine the product, if you don\'t like it, pay nothing'
        },
        {
          icon: '🔒',
          title: '100% Safe',
          description: 'No risk, no tricks, no fine print'
        },
        {
          icon: '⚡',
          title: 'Fast Delivery',
          description: 'Receive in 3-5 business days at your residence'
        }
      ]
    }
  }

  generate(config: CODTemplateConfig): {
    html: string
    css: string
    js: string
    metadata: {
      templateType: 'cod'
      conversionRate: string
      strategy: string
    }
  } {
    const offer = this.generateCODOffer(config.productName, config.countrySettings, config.originalPrice)
    const urgencyReasons = this.generateUrgencyReasons(config.countrySettings)
    const paymentBenefits = this.generatePaymentBenefits(config.countrySettings)
    const lang = config.countrySettings.language
    
    const texts = lang === 'pt-BR' ? {
      offerTitle: 'OFERTA ESPECIAL',
      lastChance: 'ÚLTIMA CHANCE',
      codOffer: 'PAGUE APENAS QUANDO RECEBER',
      originalPrice: 'De',
      forOnly: 'Por apenas',
      inCod: 'no pagamento na entrega',
      orCard: 'ou no cartão em até',
      installments: 'x sem juros',
      saveAmount: 'VOCÊ ECONOMIZA',
      orderNow: 'QUERO PEDIR AGORA',
      whyChoose: 'Por que escolher pagamento na entrega?',
      howWorks: 'Como funciona?',
      step1: 'Faça seu pedido',
      step1Desc: 'Clique no botão e preencha seus dados',
      step2: 'Aguarde a entrega',
      step2Desc: 'Produto chega na sua casa em 3-5 dias',
      step3: 'Pague na entrega',
      step3Desc: 'Só pague se estiver satisfeito com o produto',
      faq: 'Perguntas Frequentes',
      timeLeft: 'Tempo restante para esta oferta',
      stockLeft: 'unidades restantes',
      guarantee: '30 dias de garantia total',
      freeShipping: 'Frete grátis para todo Brasil',
      secureOrder: 'Pedido 100% seguro'
    } : {
      offerTitle: 'SPECIAL OFFER',
      lastChance: 'LAST CHANCE',
      codOffer: 'PAY ONLY WHEN YOU RECEIVE',
      originalPrice: 'From',
      forOnly: 'For only',
      inCod: 'on cash on delivery',
      orCard: 'or on card up to',
      installments: 'x interest-free',
      saveAmount: 'YOU SAVE',
      orderNow: 'I WANT TO ORDER NOW',
      whyChoose: 'Why choose cash on delivery?',
      howWorks: 'How it works?',
      step1: 'Place your order',
      step1Desc: 'Click the button and fill in your details',
      step2: 'Wait for delivery',
      step2Desc: 'Product arrives at your home in 3-5 days',
      step3: 'Pay on delivery',
      step3Desc: 'Only pay if satisfied with the product',
      faq: 'Frequently Asked Questions',
      timeLeft: 'Time left for this offer',
      stockLeft: 'units remaining',
      guarantee: '30 days total guarantee',
      freeShipping: 'Free shipping nationwide',
      secureOrder: '100% secure order'
    }

    const primaryColor = config.designTokens?.colors?.primary || '#DC2626'
    const backgroundColor = config.designTokens?.colors?.background || '#FFFFFF'
    const textColor = config.designTokens?.colors?.text || '#1F2937'
    const fontFamily = config.designTokens?.fonts?.primary || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'

    const currencySymbol = config.countrySettings.currency === 'BRL' ? 'R$' : '$'

    const html = `
<!DOCTYPE html>
<html lang="${config.countrySettings.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${texts.offerTitle}: ${config.productName} - ${texts.codOffer}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${config.productName} com pagamento na entrega. Receba em casa, veja o produto e só pague se gostar. ${offer.discount}% de desconto.">
    <meta name="keywords" content="${config.productName}, pagamento na entrega, COD, contra reembolso, desconto, oferta">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${texts.offerTitle}: ${config.productName}">
    <meta property="og:description" content="Pague apenas quando receber! ${offer.discount}% de desconto no pagamento na entrega.">
    <meta property="og:type" content="product">
    <meta property="og:image" content="cod-offer.jpg">
    
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
    </script>
    
    <!-- Facebook Pixel -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
    </script>
    
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
    </script>
    
    <!-- Personal Tracking -->
    <script>
        (function() {
            const track = (event, data) => {
                fetch('/api/track', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({event, data, url: location.href, timestamp: Date.now()})
                }).catch(() => {});
            };
            window.personalTrack = track;
            track('page_view', {template: 'cod', product: '${config.productName}'});
        })();
    </script>
    
    <style>
        ${this.generateCSS(primaryColor, backgroundColor, textColor, fontFamily)}
    </style>
</head>
<body>
    <!-- Urgency Bar -->
    <div class="urgency-bar">
        <div class="container">
            <div class="urgency-content">
                <div class="urgency-text">🔥 ${texts.lastChance} - ${offer.discount}% OFF NO PAGAMENTO NA ENTREGA</div>
                <div class="urgency-timer">
                    <span id="timer">23:59:47</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <div class="offer-badge">${texts.offerTitle}</div>
                
                <h1 class="hero-title">${config.productName}</h1>
                <h2 class="hero-subtitle">${texts.codOffer}</h2>
                
                <div class="product-showcase">
                    <div class="product-image">
                        <img src="product-cod.jpg" alt="${config.productName}">
                        <div class="cod-badge">
                            <div class="cod-icon">📦</div>
                            <div class="cod-text">
                                <strong>COD</strong>
                                <span>${lang === 'pt-BR' ? 'Pague na entrega' : 'Pay on delivery'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="offer-details">
                        <div class="price-comparison">
                            <div class="original-price">
                                ${texts.originalPrice}: <span class="old-price">${currencySymbol} ${offer.originalPrice}</span>
                            </div>
                            
                            <div class="cod-price">
                                ${texts.forOnly}
                                <div class="price-highlight">
                                    <span class="currency">${currencySymbol}</span>
                                    <span class="amount">${offer.codPrice}</span>
                                </div>
                                <div class="payment-method">${texts.inCod}</div>
                            </div>
                            
                            <div class="card-option">
                                ${texts.orCard} ${offer.installments}${texts.installments} de ${currencySymbol} ${(offer.cardPrice / offer.installments).toFixed(2)}
                            </div>
                            
                            <div class="savings">
                                ${texts.saveAmount}: <span class="save-amount">${currencySymbol} ${offer.originalPrice - offer.codPrice}</span>
                            </div>
                        </div>
                        
                        <div class="urgency-indicators">
                            ${urgencyReasons.map(reason => `
                            <div class="urgency-item">
                                <span class="urgency-icon">${reason.icon}</span>
                                <div class="urgency-info">
                                    <strong>${reason.title}</strong>
                                    <p>${reason.description}</p>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                        
                        <div class="cta-section">
                            <a href="${config.affiliateUrl}" class="main-cta-button" onclick="trackEvent('cod_cta_click', {location: 'hero', price: ${offer.codPrice}})" id="main-cta">
                                <span class="cta-text">${texts.orderNow}</span>
                                <span class="cta-price">${currencySymbol} ${offer.codPrice} NA ENTREGA</span>
                            </a>
                            
                            <div class="guarantees">
                                <div class="guarantee-item">✅ ${texts.guarantee}</div>
                                <div class="guarantee-item">✅ ${texts.freeShipping}</div>
                                <div class="guarantee-item">✅ ${texts.secureOrder}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
        <div class="container">
            <h3 class="section-title">${texts.whyChoose}</h3>
            
            <div class="benefits-grid">
                ${paymentBenefits.map((benefit, index) => `
                <div class="benefit-card ${benefit.highlight ? 'highlight' : ''}">
                    <div class="benefit-icon">${benefit.icon}</div>
                    <div class="benefit-content">
                        <h4 class="benefit-title">${benefit.title}</h4>
                        <p class="benefit-description">${benefit.description}</p>
                    </div>
                    ${benefit.highlight ? '<div class="highlight-badge">PRINCIPAL</div>' : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
        <div class="container">
            <h3 class="section-title">${texts.howWorks}</h3>
            
            <div class="steps-container">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>${texts.step1}</h4>
                        <p>${texts.step1Desc}</p>
                    </div>
                </div>
                
                <div class="step-arrow">→</div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>${texts.step2}</h4>
                        <p>${texts.step2Desc}</p>
                    </div>
                </div>
                
                <div class="step-arrow">→</div>
                
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>${texts.step3}</h4>
                        <p>${texts.step3Desc}</p>
                    </div>
                </div>
            </div>
            
            <div class="final-cta">
                <a href="${config.affiliateUrl}" class="secondary-cta-button" onclick="trackEvent('cod_cta_click', {location: 'how_it_works'})">
                    ${texts.orderNow} - ${currencySymbol} ${offer.codPrice}
                </a>
            </div>
        </div>
    </section>

    <!-- Social Proof -->
    <section class="social-proof">
        <div class="container">
            <h3 class="section-title">${lang === 'pt-BR' ? 'Clientes que pagaram na entrega' : 'Customers who paid on delivery'}</h3>
            
            <div class="testimonials-grid">
                <div class="testimonial-cod">
                    <div class="testimonial-content">
                        <p>"${lang === 'pt-BR' ? 'Adorei poder ver o produto antes de pagar. Chegou certinho e só paguei porque realmente gostei!' : 'I loved being able to see the product before paying. It arrived perfectly and I only paid because I really liked it!'}"</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <strong>Maria Santos</strong>
                            <span>São Paulo, SP</span>
                        </div>
                        <div class="payment-badge">COD ✅</div>
                    </div>
                </div>
                
                <div class="testimonial-cod">
                    <div class="testimonial-content">
                        <p>"${lang === 'pt-BR' ? 'Primeira vez que compro pagando na entrega. Muito mais seguro! Recomendo.' : 'First time buying paying on delivery. Much safer! I recommend.'}"</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <strong>João Costa</strong>
                            <span>Rio de Janeiro, RJ</span>
                        </div>
                        <div class="payment-badge">COD ✅</div>
                    </div>
                </div>
                
                <div class="testimonial-cod">
                    <div class="testimonial-content">
                        <p>"${lang === 'pt-BR' ? 'Entrega super rápida e produto exatamente como mostrado. Pagamento na entrega é a melhor opção!' : 'Super fast delivery and product exactly as shown. Payment on delivery is the best option!'}"</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <strong>Ana Lima</strong>
                            <span>Belo Horizonte, MG</span>
                        </div>
                        <div class="payment-badge">COD ✅</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Final Urgency -->
    <section class="final-urgency">
        <div class="container">
            <div class="urgency-box">
                <div class="urgency-header">
                    <h3>⚠️ ${texts.lastChance}!</h3>
                    <div class="stock-indicator">
                        <span class="stock-number" id="stock-count">47</span> ${texts.stockLeft}
                    </div>
                </div>
                
                <div class="urgency-body">
                    <div class="time-sensitive">
                        <div class="timer-display">
                            <div class="timer-label">${texts.timeLeft}:</div>
                            <div class="countdown-timer">
                                <div class="time-unit">
                                    <span id="hours">23</span>
                                    <label>h</label>
                                </div>
                                <div class="time-separator">:</div>
                                <div class="time-unit">
                                    <span id="minutes">59</span>
                                    <label>m</label>
                                </div>
                                <div class="time-separator">:</div>
                                <div class="time-unit">
                                    <span id="seconds">47</span>
                                    <label>s</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="final-offer">
                            <div class="offer-text">
                                <div class="offer-price">${currencySymbol} ${offer.codPrice}</div>
                                <div class="offer-condition">PAGANDO NA ENTREGA</div>
                                <div class="offer-economy">ECONOMIA DE ${currencySymbol} ${offer.originalPrice - offer.codPrice}</div>
                            </div>
                            
                            <a href="${config.affiliateUrl}" class="final-cta-button pulse" onclick="trackEvent('cod_cta_click', {location: 'final_urgency'})">
                                GARANTIR AGORA
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="cod-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <h4>${config.productName}</h4>
                    <p>${lang === 'pt-BR' ? 'Pagamento seguro na entrega' : 'Secure payment on delivery'}</p>
                </div>
                
                <div class="footer-guarantees">
                    <div class="footer-guarantee">🔒 ${lang === 'pt-BR' ? 'Compra Protegida' : 'Protected Purchase'}</div>
                    <div class="footer-guarantee">📞 ${lang === 'pt-BR' ? 'Suporte 24/7' : '24/7 Support'}</div>
                    <div class="footer-guarantee">🚚 ${lang === 'pt-BR' ? 'Entrega Garantida' : 'Guaranteed Delivery'}</div>
                </div>
            </div>
            
            <div class="footer-legal">
                <p>&copy; 2024 ${config.productName}. ${lang === 'pt-BR' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
                <p>${lang === 'pt-BR' ? 'Pagamento na entrega disponível para todo o Brasil.' : 'Cash on delivery available nationwide.'}</p>
            </div>
        </div>
    </footer>

    <!-- Floating CTA (Mobile) -->
    <div class="floating-cta" id="floating-cta">
        <div class="floating-cta-content">
            <div class="floating-price">${currencySymbol} ${offer.codPrice}</div>
            <a href="${config.affiliateUrl}" class="floating-button" onclick="trackEvent('cod_cta_click', {location: 'floating'})">
                PEDIR AGORA
            </a>
        </div>
    </div>

    <script>
        ${this.generateJS(config.affiliateUrl, offer.codPrice)}
    </script>
</body>
</html>`

    return {
      html,
      css: this.generateCSS(primaryColor, backgroundColor, textColor, fontFamily),
      js: this.generateJS(config.affiliateUrl, offer.codPrice),
      metadata: {
        templateType: 'cod',
        conversionRate: '12-18%',
        strategy: 'Cash on delivery with high urgency, risk reversal and immediate gratification appeal'
      }
    }
  }

  private generateCSS(primaryColor: string, backgroundColor: string, textColor: string, fontFamily: string): string {
    return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${fontFamily};
    line-height: 1.6;
    color: ${textColor};
    background-color: ${backgroundColor};
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Urgency Bar */
.urgency-bar {
    background: linear-gradient(45deg, ${primaryColor}, #B91C1C);
    color: white;
    padding: 10px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    animation: pulse-bg 2s infinite;
}

@keyframes pulse-bg {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.9; }
}

.urgency-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    font-size: 1rem;
}

.urgency-timer {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    letter-spacing: 2px;
}

/* Hero Section */
.hero-section {
    padding: 40px 0;
    background: linear-gradient(135deg, #FEF7F0 0%, #FDF2E9 100%);
}

.offer-badge {
    background: ${primaryColor};
    color: white;
    display: inline-block;
    padding: 10px 25px;
    border-radius: 25px;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    color: ${primaryColor};
    margin-bottom: 10px;
    text-align: center;
}

.hero-subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    color: #059669;
    text-align: center;
    margin-bottom: 40px;
}

.product-showcase {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.product-image {
    position: relative;
    text-align: center;
}

.product-image img {
    max-width: 100%;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: perspective(1000px) rotateY(-5deg);
}

.cod-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #059669, #047857);
    color: white;
    padding: 15px 20px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
}

.cod-icon {
    font-size: 1.5rem;
}

.cod-text strong {
    display: block;
    font-size: 1.1rem;
    font-weight: 700;
}

.cod-text span {
    font-size: 0.8rem;
    opacity: 0.9;
}

.offer-details {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    border: 3px solid ${primaryColor}22;
}

.price-comparison {
    margin-bottom: 30px;
}

.original-price {
    font-size: 1.1rem;
    color: #6B7280;
    margin-bottom: 10px;
}

.old-price {
    text-decoration: line-through;
    font-weight: 600;
}

.cod-price {
    margin-bottom: 15px;
}

.price-highlight {
    display: flex;
    align-items: baseline;
    gap: 5px;
    margin: 10px 0;
}

.currency {
    font-size: 2rem;
    font-weight: 700;
    color: ${primaryColor};
}

.amount {
    font-size: 4rem;
    font-weight: 800;
    color: ${primaryColor};
    line-height: 1;
}

.payment-method {
    font-size: 1.2rem;
    color: #059669;
    font-weight: 600;
}

.card-option {
    font-size: 1rem;
    color: #6B7280;
    margin-bottom: 20px;
}

.savings {
    background: linear-gradient(45deg, #FEE2E2, #FED7D7);
    padding: 15px 20px;
    border-radius: 10px;
    border-left: 4px solid ${primaryColor};
    font-size: 1.1rem;
    font-weight: 600;
}

.save-amount {
    color: ${primaryColor};
    font-size: 1.3rem;
    font-weight: 700;
}

.urgency-indicators {
    margin: 30px 0;
    display: grid;
    gap: 15px;
}

.urgency-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: #FEF7F0;
    padding: 15px 20px;
    border-radius: 10px;
    border-left: 3px solid ${primaryColor};
}

.urgency-icon {
    font-size: 1.5rem;
}

.urgency-info strong {
    display: block;
    color: ${primaryColor};
    font-size: 1rem;
    margin-bottom: 3px;
}

.urgency-info p {
    font-size: 0.9rem;
    color: #6B7280;
}

.cta-section {
    text-align: center;
}

.main-cta-button {
    display: block;
    background: linear-gradient(45deg, ${primaryColor}, #B91C1C);
    color: white;
    text-decoration: none;
    padding: 25px 40px;
    border-radius: 15px;
    font-size: 1.3rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
}

.main-cta-button:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% { left: -50%; }
    100% { left: 150%; }
}

.main-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(220, 38, 38, 0.4);
}

.cta-text {
    display: block;
    font-size: 1.3rem;
    margin-bottom: 5px;
}

.cta-price {
    font-size: 1rem;
    opacity: 0.9;
}

.guarantees {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.guarantee-item {
    font-size: 0.9rem;
    color: #059669;
    font-weight: 600;
}

/* Benefits Section */
.benefits-section {
    padding: 60px 0;
    background: white;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 50px;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.benefit-card {
    background: #F9FAFB;
    padding: 30px;
    border-radius: 15px;
    display: flex;
    gap: 20px;
    position: relative;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.benefit-card.highlight {
    background: linear-gradient(135deg, #FEF7F0, #FDF2E9);
    border-color: ${primaryColor};
}

.benefit-icon {
    font-size: 3rem;
    flex-shrink: 0;
}

.benefit-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 10px;
}

.benefit-description {
    font-size: 1rem;
    color: #6B7280;
    line-height: 1.6;
}

.highlight-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: ${primaryColor};
    color: white;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 700;
}

/* How It Works */
.how-it-works {
    padding: 60px 0;
    background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
}

.steps-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin-bottom: 40px;
}

.step-item {
    background: white;
    padding: 30px 25px;
    border-radius: 15px;
    text-align: center;
    max-width: 250px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    position: relative;
}

.step-number {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, ${primaryColor}, #B91C1C);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 auto 20px;
}

.step-content h4 {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 10px;
}

.step-content p {
    font-size: 0.95rem;
    color: #6B7280;
    line-height: 1.5;
}

.step-arrow {
    font-size: 2rem;
    color: ${primaryColor};
    font-weight: 700;
}

.final-cta {
    text-align: center;
}

.secondary-cta-button {
    display: inline-block;
    background: white;
    color: ${primaryColor};
    border: 3px solid ${primaryColor};
    padding: 20px 40px;
    border-radius: 15px;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 700;
    transition: all 0.3s ease;
}

.secondary-cta-button:hover {
    background: ${primaryColor};
    color: white;
    transform: translateY(-2px);
}

/* Social Proof */
.social-proof {
    padding: 60px 0;
    background: white;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
}

.testimonial-cod {
    background: #F9FAFB;
    padding: 30px;
    border-radius: 15px;
    border-left: 4px solid #059669;
}

.testimonial-content p {
    font-size: 1rem;
    line-height: 1.6;
    color: ${textColor};
    margin-bottom: 20px;
    font-style: italic;
}

.testimonial-author {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.author-info strong {
    display: block;
    font-weight: 700;
    color: ${primaryColor};
}

.author-info span {
    font-size: 0.9rem;
    color: #6B7280;
}

.payment-badge {
    background: #059669;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
}

/* Final Urgency */
.final-urgency {
    padding: 60px 0;
    background: linear-gradient(45deg, ${primaryColor}, #B91C1C);
    color: white;
}

.urgency-box {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.urgency-header {
    margin-bottom: 30px;
}

.urgency-header h3 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 15px;
}

.stock-indicator {
    font-size: 1.3rem;
    font-weight: 600;
}

.stock-number {
    font-size: 2rem;
    font-weight: 800;
    color: #FEF2F2;
}

.countdown-timer {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
}

.time-unit {
    background: rgba(255, 255, 255, 0.2);
    padding: 15px 20px;
    border-radius: 10px;
    text-align: center;
}

.time-unit span {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
}

.time-unit label {
    font-size: 0.9rem;
    opacity: 0.8;
}

.time-separator {
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
}

.final-offer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    margin-top: 30px;
}

.offer-price {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
}

.offer-condition {
    font-size: 1rem;
    opacity: 0.9;
    margin: 5px 0;
}

.offer-economy {
    font-size: 1.2rem;
    font-weight: 600;
    color: #FEF2F2;
}

.final-cta-button {
    background: white;
    color: ${primaryColor};
    padding: 20px 40px;
    border-radius: 15px;
    text-decoration: none;
    font-size: 1.3rem;
    font-weight: 700;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

.pulse {
    animation: pulse-cta 2s infinite;
}

@keyframes pulse-cta {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.final-cta-button:hover {
    background: #FEF2F2;
    transform: scale(1.1);
}

/* Footer */
.cod-footer {
    background: #1F2937;
    color: white;
    padding: 40px 0 20px;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.footer-info h4 {
    font-size: 1.3rem;
    margin-bottom: 5px;
}

.footer-guarantees {
    display: flex;
    gap: 30px;
}

.footer-guarantee {
    font-size: 0.9rem;
    opacity: 0.8;
}

.footer-legal {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #374151;
    font-size: 0.8rem;
    opacity: 0.7;
}

.footer-legal p {
    margin-bottom: 5px;
}

/* Floating CTA */
.floating-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${primaryColor};
    color: white;
    z-index: 1000;
    transform: translateY(100%);
    transition: all 0.3s ease;
}

.floating-cta.show {
    transform: translateY(0);
}

.floating-cta-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.floating-price {
    font-size: 1.5rem;
    font-weight: 700;
}

.floating-button {
    background: white;
    color: ${primaryColor};
    padding: 12px 30px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .hero-title {
        font-size: 2.2rem;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
    }
    
    .product-showcase {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .product-image img {
        transform: none;
    }
    
    .cod-badge {
        position: static;
        display: inline-flex;
        margin-top: 20px;
    }
    
    .offer-details {
        padding: 25px;
    }
    
    .amount {
        font-size: 3rem;
    }
    
    .benefits-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .steps-container {
        flex-direction: column;
        gap: 20px;
    }
    
    .step-arrow {
        transform: rotate(90deg);
    }
    
    .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .final-offer {
        flex-direction: column;
        gap: 20px;
    }
    
    .countdown-timer {
        gap: 5px;
    }
    
    .time-unit {
        padding: 10px 15px;
    }
    
    .time-unit span {
        font-size: 1.5rem;
    }
    
    .footer-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .footer-guarantees {
        flex-direction: column;
        gap: 10px;
    }
    
    .urgency-content {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
}
`
  }

  private generateJS(affiliateUrl: string, codPrice: number): string {
    return `
// Track events
const trackEvent = (event, data = {}) => {
    if (typeof gtag !== 'undefined') gtag('event', event, data);
    if (typeof fbq !== 'undefined') fbq('track', event, data);
    if (typeof personalTrack !== 'undefined') personalTrack(event, data);
};

// Countdown timer
let timeLeft = {
    hours: 23,
    minutes: 59,
    seconds: 47
};

function updateCountdown() {
    timeLeft.seconds--;
    
    if (timeLeft.seconds < 0) {
        timeLeft.seconds = 59;
        timeLeft.minutes--;
        
        if (timeLeft.minutes < 0) {
            timeLeft.minutes = 59;
            timeLeft.hours--;
            
            if (timeLeft.hours < 0) {
                // Reset countdown
                timeLeft.hours = 23;
                timeLeft.minutes = 59;
                timeLeft.seconds = 59;
            }
        }
    }
    
    // Update main timer
    const timer = document.getElementById('timer');
    if (timer) {
        timer.textContent = \`\${timeLeft.hours.toString().padStart(2, '0')}:\${timeLeft.minutes.toString().padStart(2, '0')}:\${timeLeft.seconds.toString().padStart(2, '0')}\`;
    }
    
    // Update countdown timer
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    
    if (hours) hours.textContent = timeLeft.hours.toString().padStart(2, '0');
    if (minutes) minutes.textContent = timeLeft.minutes.toString().padStart(2, '0');
    if (seconds) seconds.textContent = timeLeft.seconds.toString().padStart(2, '0');
}

// Stock countdown
let stockCount = 47;

function updateStock() {
    // Randomly decrease stock every 30-90 seconds
    const randomDelay = Math.random() * 60000 + 30000; // 30-90 seconds
    
    setTimeout(() => {
        if (stockCount > 15) { // Don't go below 15
            stockCount--;
            const stockElement = document.getElementById('stock-count');
            if (stockElement) {
                stockElement.textContent = stockCount;
                stockElement.style.animation = 'pulse 0.5s ease';
                
                // Show urgency when stock gets low
                if (stockCount <= 25) {
                    stockElement.style.color = '#DC2626';
                    stockElement.parentElement.style.animation = 'shake 0.5s ease';
                }
            }
            
            trackEvent('stock_update', { remaining: stockCount });
        }
        
        updateStock(); // Schedule next update
    }, randomDelay);
}

// Floating CTA management
function handleFloatingCTA() {
    const floatingCTA = document.getElementById('floating-cta');
    const mainCTA = document.getElementById('main-cta');
    
    if (!floatingCTA || !mainCTA) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                floatingCTA.classList.remove('show');
            } else {
                floatingCTA.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(mainCTA);
}

// Urgency behavior simulation
function simulateUrgencyBehaviors() {
    // Simulate other users viewing the page
    const urgencyMessages = [
        '🔴 Maria S. de São Paulo visualizou há 2 min',
        '🔴 João C. do Rio de Janeiro pediu há 5 min',
        '🔴 Ana L. de Belo Horizonte visualizou há 3 min',
        '🔴 Carlos M. de Porto Alegre pediu há 1 min',
        '🔴 Lucia F. de Salvador visualizou há 4 min'
    ];
    
    let messageIndex = 0;
    
    function showUrgencyMessage() {
        const message = urgencyMessages[messageIndex % urgencyMessages.length];
        
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = \`
            position: fixed;
            bottom: 100px;
            left: 20px;
            background: #DC2626;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1001;
            transform: translateX(-100%);
            transition: all 0.5s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        \`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
        
        messageIndex++;
        
        // Schedule next message (random interval 15-45 seconds)
        const nextMessageDelay = Math.random() * 30000 + 15000;
        setTimeout(showUrgencyMessage, nextMessageDelay);
    }
    
    // Start showing messages after 10 seconds
    setTimeout(showUrgencyMessage, 10000);
}

// COD-specific animations
function initCODAnimations() {
    // Animate price highlight
    const priceHighlight = document.querySelector('.price-highlight');
    if (priceHighlight) {
        setInterval(() => {
            priceHighlight.style.animation = 'none';
            setTimeout(() => {
                priceHighlight.style.animation = 'pulse 0.8s ease';
            }, 100);
        }, 5000);
    }
    
    // Animate main CTA button
    const mainCTA = document.querySelector('.main-cta-button');
    if (mainCTA) {
        setInterval(() => {
            mainCTA.style.animation = 'none';
            setTimeout(() => {
                mainCTA.style.animation = 'pulse 1s ease';
            }, 100);
        }, 8000);
    }
}

// Scroll tracking for COD
let pageProgress = {
    viewedBenefits: false,
    viewedHowItWorks: false,
    viewedTestimonials: false,
    viewedFinalUrgency: false
};

function trackCODProgress() {
    const sections = {
        '.benefits-section': 'viewedBenefits',
        '.how-it-works': 'viewedHowItWorks',  
        '.social-proof': 'viewedTestimonials',
        '.final-urgency': 'viewedFinalUrgency'
    };
    
    Object.keys(sections).forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !pageProgress[sections[selector]]) {
                    pageProgress[sections[selector]] = true;
                    trackEvent('cod_section_viewed', {
                        section: sections[selector],
                        product_price: ${codPrice}
                    });
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(element);
    });
}

// Exit intent for COD
let hasShownExitIntent = false;

function initCODExitIntent() {
    function showExitIntent() {
        if (hasShownExitIntent) return;
        hasShownExitIntent = true;
        
        const exitMessage = 'ESPERA! 🛑\\n\\nAntes de sair, que tal garantir ${codPrice} reais de desconto no PAGAMENTO NA ENTREGA?\\n\\nVocê só paga quando receber o produto na sua casa!\\n\\nClique OK para aproveitar esta oferta única.';
        
        if (confirm(exitMessage)) {
            trackEvent('cod_exit_intent_conversion', { price: ${codPrice} });
            window.location.href = '${affiliateUrl}';
        } else {
            trackEvent('cod_exit_intent_dismissed', { price: ${codPrice} });
        }
    }
    
    // Desktop exit intent
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && window.innerWidth > 768) {
            showExitIntent();
        }
    });
    
    // Mobile - page visibility
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && window.innerWidth <= 768) {
            setTimeout(showExitIntent, 1000);
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Start timers and animations
    setInterval(updateCountdown, 1000);
    updateStock();
    
    // Initialize features
    handleFloatingCTA();
    simulateUrgencyBehaviors();
    initCODAnimations();
    trackCODProgress();
    initCODExitIntent();
    
    // Track page view
    trackEvent('cod_page_view', {
        product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}',
        template: 'cod',
        price: ${codPrice}
    });
    
    // Track CTA clicks
    document.querySelectorAll('a[href*="hotmart"], a[href*="monetizze"], a[href*="eduzz"]').forEach(link => {
        link.addEventListener('click', function() {
            const location = this.getAttribute('onclick')?.match(/location: '([^']+)'/)
            trackEvent('cod_conversion_click', {
                source: 'cod_template',
                location: location ? location[1] : 'unknown',
                price: ${codPrice},
                payment_method: 'cod'
            });
        });
    });
    
    // Track time on page for COD
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('cod_time_on_page', {
            seconds: timeSpent,
            price: ${codPrice},
            viewed_sections: Object.values(pageProgress).filter(Boolean).length
        });
    });
});

// Add shake animation for urgency
const style = document.createElement('style');
style.textContent = \`
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
\`;
document.head.appendChild(style);
`
  }
}