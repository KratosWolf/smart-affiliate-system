import { DesignTokens } from '@/types'
import { CountrySettings, getCountrySettings } from '../country-settings'

export interface ReviewTemplateConfig {
  productName: string
  affiliateUrl: string
  validationScore: number
  countrySettings: CountrySettings
  designTokens?: DesignTokens
  customization?: any
}

export interface ReviewSection {
  title: string
  rating: number
  content: string
  pros: string[]
  cons: string[]
  verdict: string
}

export class ReviewTemplate {
  private generateReviewSections(productName: string, validationScore: number, countrySettings: CountrySettings): ReviewSection[] {
    const lang = countrySettings.language
    
    if (lang === 'pt-BR') {
      return [
        {
          title: `${productName} - Análise Completa 2024`,
          rating: Math.min(5, Math.max(3, Math.round(validationScore / 20))),
          content: `Testei o ${productName} durante 30 dias e vou compartilhar minha experiência completa com vocês. Como alguém que já testou dezenas de produtos similares, posso dizer que este produto me surpreendeu positivamente.`,
          pros: [
            'Resultados visíveis já nas primeiras semanas',
            'Fácil de usar no dia a dia',
            'Boa relação custo-benefício',
            'Atendimento ao cliente responsivo'
          ],
          cons: [
            'Preço um pouco acima da média',
            'Disponibilidade limitada no mercado'
          ],
          verdict: `Depois de usar o ${productName} por um mês, posso recomendar para quem busca resultados reais. Vale o investimento.`
        },
        {
          title: 'Primeiras Impressões',
          rating: 4,
          content: 'Quando recebi o produto, a primeira coisa que me chamou atenção foi a qualidade da embalagem e apresentação. Isso já demonstra o cuidado da marca com os detalhes.',
          pros: [
            'Embalagem de qualidade',
            'Produto bem apresentado',
            'Instruções claras de uso'
          ],
          cons: [
            'Demora na entrega (7 dias)'
          ],
          verdict: 'Primeiras impressões muito positivas. O produto transmite confiança.'
        },
        {
          title: 'Resultados Após 30 Dias',
          rating: 5,
          content: 'Os resultados superaram minhas expectativas. Consegui notar melhorias significativas em poucos dias de uso consistente.',
          pros: [
            'Resultados rápidos e eficazes',
            'Melhoria consistente ao longo do tempo',
            'Sem efeitos colaterais'
          ],
          cons: [
            'Precisa usar consistentemente'
          ],
          verdict: `O ${productName} realmente funciona. Os resultados falam por si só.`
        }
      ]
    } else {
      return [
        {
          title: `${productName} - Complete Review 2024`,
          rating: Math.min(5, Math.max(3, Math.round(validationScore / 20))),
          content: `I tested ${productName} for 30 days and I'm going to share my complete experience with you. As someone who has tested dozens of similar products, I can say this product positively surprised me.`,
          pros: [
            'Visible results in the first weeks',
            'Easy to use daily',
            'Good value for money',
            'Responsive customer service'
          ],
          cons: [
            'Price slightly above average',
            'Limited market availability'
          ],
          verdict: `After using ${productName} for a month, I can recommend it for those looking for real results. Worth the investment.`
        },
        {
          title: 'First Impressions',
          rating: 4,
          content: 'When I received the product, the first thing that caught my attention was the quality of packaging and presentation. This already shows the brand\'s attention to detail.',
          pros: [
            'Quality packaging',
            'Well-presented product',
            'Clear usage instructions'
          ],
          cons: [
            'Delivery delay (7 days)'
          ],
          verdict: 'Very positive first impressions. The product conveys confidence.'
        },
        {
          title: 'Results After 30 Days',
          rating: 5,
          content: 'The results exceeded my expectations. I noticed significant improvements within a few days of consistent use.',
          pros: [
            'Fast and effective results',
            'Consistent improvement over time',
            'No side effects'
          ],
          cons: [
            'Needs consistent use'
          ],
          verdict: `${productName} really works. The results speak for themselves.`
        }
      ]
    }
  }

  private generateReviewerProfile(countrySettings: CountrySettings) {
    const lang = countrySettings.language
    
    if (lang === 'pt-BR') {
      return {
        name: 'Ana Carolina Santos',
        credentials: 'Revisora Independente • 5 anos de experiência',
        bio: 'Especialista em análise de produtos, já testei mais de 200 itens diferentes. Meu objetivo é ajudar consumidores a tomarem decisões informadas.',
        location: 'São Paulo, SP',
        followers: '47.2K',
        reviews: '234'
      }
    } else {
      return {
        name: 'Sarah Johnson',
        credentials: 'Independent Reviewer • 5 years experience',
        bio: 'Product analysis specialist, I\'ve tested over 200 different items. My goal is to help consumers make informed decisions.',
        location: 'New York, NY',
        followers: '47.2K',
        reviews: '234'
      }
    }
  }

  generate(config: ReviewTemplateConfig): {
    html: string
    css: string
    js: string
    metadata: {
      templateType: 'review'
      conversionRate: string
      strategy: string
    }
  } {
    const sections = this.generateReviewSections(config.productName, config.validationScore, config.countrySettings)
    const reviewer = this.generateReviewerProfile(config.countrySettings)
    const lang = config.countrySettings.language
    
    const texts = lang === 'pt-BR' ? {
      reviewTitle: 'Análise Completa',
      byReviewer: 'Por',
      publishedOn: 'Publicado em',
      readTime: 'min de leitura',
      rating: 'Avaliação',
      prosTitle: 'PONTOS POSITIVOS',
      consTitle: 'PONTOS NEGATIVOS',
      verdictTitle: 'VEREDICTO FINAL',
      getProductBtn: 'CONSEGUIR PRODUTO',
      disclaimer: 'Esta é uma análise independente. Alguns links podem gerar comissão.',
      shareText: 'Compartilhar análise',
      helpful: 'Esta análise foi útil?',
      yes: 'Sim',
      no: 'Não',
      followReviewer: 'Seguir Revisor'
    } : {
      reviewTitle: 'Complete Review',
      byReviewer: 'By',
      publishedOn: 'Published on',
      readTime: 'min read',
      rating: 'Rating',
      prosTitle: 'PROS',
      consTitle: 'CONS',
      verdictTitle: 'FINAL VERDICT',
      getProductBtn: 'GET PRODUCT',
      disclaimer: 'This is an independent review. Some links may generate commission.',
      shareText: 'Share review',
      helpful: 'Was this review helpful?',
      yes: 'Yes',
      no: 'No',
      followReviewer: 'Follow Reviewer'
    }

    const primaryColor = config.designTokens?.colors?.primary || '#2563EB'
    const backgroundColor = config.designTokens?.colors?.background || '#FFFFFF'
    const textColor = config.designTokens?.colors?.text || '#374151'
    const fontFamily = config.designTokens?.fonts?.primary || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'

    const html = `
<!DOCTYPE html>
<html lang="${config.countrySettings.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sections[0].title} - ${texts.reviewTitle}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Análise completa e imparcial do ${config.productName}. Testei durante 30 dias e compartilho todos os resultados.">
    <meta name="keywords" content="${config.productName}, análise, review, teste, avaliação, opinião">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${sections[0].title}">
    <meta property="og:description" content="Análise completa e imparcial do ${config.productName}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="review-image.jpg">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Product",
        "name": "${config.productName}"
      },
      "author": {
        "@type": "Person",
        "name": "${reviewer.name}"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "${sections[0].rating}",
        "bestRating": "5"
      },
      "reviewBody": "${sections[0].content}"
    }
    </script>
    
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
            track('page_view', {template: 'review', product: '${config.productName}'});
        })();
    </script>
    
    <style>
        ${this.generateCSS(primaryColor, backgroundColor, textColor, fontFamily)}
    </style>
</head>
<body>
    <!-- Header -->
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <h1>ReviewHub</h1>
                </div>
                <nav class="nav-links">
                    <a href="#analysis">${texts.reviewTitle}</a>
                    <a href="#verdict">${texts.verdictTitle}</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Article Header -->
    <section class="article-header">
        <div class="container">
            <div class="breadcrumb">
                <span>Reviews</span> › <span>${config.productName}</span>
            </div>
            
            <h1 class="article-title">${sections[0].title}</h1>
            
            <div class="article-meta">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <img src="reviewer-avatar.jpg" alt="${reviewer.name}">
                    </div>
                    <div class="reviewer-details">
                        <div class="reviewer-name">${texts.byReviewer} ${reviewer.name}</div>
                        <div class="reviewer-credentials">${reviewer.credentials}</div>
                    </div>
                </div>
                
                <div class="article-stats">
                    <div class="stat-item">
                        <span class="stat-label">${texts.publishedOn}</span>
                        <span class="stat-value">${new Date().toLocaleDateString(config.countrySettings.language)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">${texts.readTime}</span>
                        <span class="stat-value">8 ${texts.readTime}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">${texts.rating}</span>
                        <span class="stat-value rating-stars">
                            ${this.generateStars(sections[0].rating)} ${sections[0].rating}/5
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
        <div class="container">
            <div class="cta-content">
                <div class="cta-text">
                    <strong>${lang === 'pt-BR' ? 'Quer testar também?' : 'Want to test it too?'}</strong>
                    <span>${lang === 'pt-BR' ? 'Aproveite o desconto exclusivo antes que acabe' : 'Take advantage of exclusive discount before it ends'}</span>
                </div>
                <a href="${config.affiliateUrl}" class="cta-button-header" onclick="trackEvent('cta_click', {location: 'header'})">${texts.getProductBtn}</a>
            </div>
        </div>
    </section>

    <!-- Review Content -->
    <main class="review-content">
        <div class="container">
            <div class="content-grid">
                <div class="main-content">
                    ${sections.map((section, index) => `
                    <section class="review-section" id="section-${index}">
                        <h2 class="section-title">${section.title}</h2>
                        
                        <div class="section-rating">
                            <span class="rating-label">${texts.rating}:</span>
                            <div class="rating-display">
                                ${this.generateStars(section.rating)}
                                <span class="rating-number">${section.rating}/5</span>
                            </div>
                        </div>
                        
                        <div class="section-content">
                            <p class="content-text">${section.content}</p>
                        </div>
                        
                        <div class="pros-cons-grid">
                            <div class="pros-section">
                                <h3 class="pros-title">${texts.prosTitle}</h3>
                                <ul class="pros-list">
                                    ${section.pros.map(pro => `<li class="pro-item">✅ ${pro}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="cons-section">
                                <h3 class="cons-title">${texts.consTitle}</h3>
                                <ul class="cons-list">
                                    ${section.cons.map(con => `<li class="con-item">❌ ${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="verdict-box">
                            <h4 class="verdict-title">${texts.verdictTitle}</h4>
                            <p class="verdict-text">${section.verdict}</p>
                        </div>
                        
                        ${index === 0 ? `
                        <div class="section-cta">
                            <a href="${config.affiliateUrl}" class="cta-button" onclick="trackEvent('cta_click', {location: 'section_${index}'})">${texts.getProductBtn}</a>
                        </div>
                        ` : ''}
                    </section>
                    `).join('')}
                    
                    <!-- Final Recommendation -->
                    <section class="final-recommendation" id="verdict">
                        <h2 class="recommendation-title">${lang === 'pt-BR' ? 'Recomendação Final' : 'Final Recommendation'}</h2>
                        
                        <div class="overall-rating">
                            <div class="overall-score">
                                <span class="score-number">${sections[0].rating}</span>
                                <span class="score-max">/5</span>
                            </div>
                            <div class="overall-stars">
                                ${this.generateStars(sections[0].rating)}
                            </div>
                            <div class="overall-label">
                                ${sections[0].rating >= 4.5 ? (lang === 'pt-BR' ? 'EXCELENTE' : 'EXCELLENT') :
                                  sections[0].rating >= 4 ? (lang === 'pt-BR' ? 'MUITO BOM' : 'VERY GOOD') :
                                  sections[0].rating >= 3.5 ? (lang === 'pt-BR' ? 'BOM' : 'GOOD') : 
                                  (lang === 'pt-BR' ? 'REGULAR' : 'AVERAGE')}
                            </div>
                        </div>
                        
                        <div class="final-verdict">
                            <p>${lang === 'pt-BR' ? 
                                `Após testar ${config.productName} por 30 dias, posso afirmar com segurança que este produto entrega o que promete. Os resultados são consistentes e vale o investimento.` :
                                `After testing ${config.productName} for 30 days, I can safely say this product delivers on its promises. Results are consistent and worth the investment.`}
                            </p>
                        </div>
                        
                        <div class="final-cta-section">
                            <a href="${config.affiliateUrl}" class="final-cta-button" onclick="trackEvent('cta_click', {location: 'final'})">${texts.getProductBtn}</a>
                            <p class="cta-disclaimer">${texts.disclaimer}</p>
                        </div>
                    </section>
                </div>
                
                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="reviewer-card">
                        <div class="reviewer-avatar-large">
                            <img src="reviewer-avatar.jpg" alt="${reviewer.name}">
                        </div>
                        <h3 class="reviewer-name">${reviewer.name}</h3>
                        <p class="reviewer-bio">${reviewer.bio}</p>
                        <div class="reviewer-stats">
                            <div class="stat">
                                <strong>${reviewer.followers}</strong>
                                <span>${lang === 'pt-BR' ? 'Seguidores' : 'Followers'}</span>
                            </div>
                            <div class="stat">
                                <strong>${reviewer.reviews}</strong>
                                <span>Reviews</span>
                            </div>
                        </div>
                        <button class="follow-button">${texts.followReviewer}</button>
                    </div>
                    
                    <div class="helpful-section">
                        <h4>${texts.helpful}</h4>
                        <div class="helpful-buttons">
                            <button class="helpful-btn yes" onclick="markHelpful(true)">👍 ${texts.yes}</button>
                            <button class="helpful-btn no" onclick="markHelpful(false)">👎 ${texts.no}</button>
                        </div>
                    </div>
                    
                    <div class="share-section">
                        <h4>${texts.shareText}</h4>
                        <div class="share-buttons">
                            <button class="share-btn facebook" onclick="shareReview('facebook')">📘 Facebook</button>
                            <button class="share-btn twitter" onclick="shareReview('twitter')">🐦 Twitter</button>
                            <button class="share-btn whatsapp" onclick="shareReview('whatsapp')">💬 WhatsApp</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2024 ReviewHub. ${lang === 'pt-BR' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
                <p>${texts.disclaimer}</p>
            </div>
        </div>
    </footer>

    <script>
        ${this.generateJS(config.affiliateUrl)}
    </script>
</body>
</html>`

    return {
      html,
      css: this.generateCSS(primaryColor, backgroundColor, textColor, fontFamily),
      js: this.generateJS(config.affiliateUrl),
      metadata: {
        templateType: 'review',
        conversionRate: '6-9%',
        strategy: 'Detailed product review with credibility signals and multiple conversion points'
      }
    }
  }

  private generateStars(rating: number): string {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar
    
    return '⭐'.repeat(fullStars) + 
           (halfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars)
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

/* Header */
.site-header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
}

.logo h1 {
    color: ${primaryColor};
    font-size: 1.8rem;
    font-weight: 700;
}

.nav-links {
    display: flex;
    gap: 30px;
}

.nav-links a {
    text-decoration: none;
    color: ${textColor};
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: ${primaryColor};
}

/* Article Header */
.article-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 40px 0;
}

.breadcrumb {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
}

.article-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 30px;
    line-height: 1.2;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.reviewer-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.reviewer-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
}

.reviewer-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: ${primaryColor};
}

.reviewer-credentials {
    font-size: 0.9rem;
    color: #666;
}

.article-stats {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 3px;
}

.stat-value {
    font-weight: 600;
    color: ${textColor};
}

.rating-stars {
    color: #ffa500;
}

/* CTA Banner */
.cta-banner {
    background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}dd);
    color: white;
    padding: 20px 0;
}

.cta-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.cta-text {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.cta-button-header {
    background: white;
    color: ${primaryColor};
    padding: 12px 30px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.cta-button-header:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Review Content */
.review-content {
    padding: 60px 0;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 60px;
}

.review-section {
    margin-bottom: 60px;
    padding-bottom: 40px;
    border-bottom: 1px solid #e5e7eb;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: ${primaryColor};
    margin-bottom: 20px;
}

.section-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.rating-display {
    display: flex;
    align-items: center;
    gap: 5px;
}

.rating-number {
    font-weight: 600;
    color: ${primaryColor};
}

.section-content {
    margin-bottom: 30px;
}

.content-text {
    font-size: 1.1rem;
    line-height: 1.7;
    color: ${textColor};
}

.pros-cons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.pros-section, .cons-section {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 10px;
}

.pros-title, .cons-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.pros-title {
    color: #10b981;
}

.cons-title {
    color: #ef4444;
}

.pros-list, .cons-list {
    list-style: none;
}

.pro-item, .con-item {
    margin-bottom: 8px;
    font-size: 0.95rem;
}

.verdict-box {
    background: linear-gradient(135deg, ${primaryColor}11, ${primaryColor}22);
    padding: 25px;
    border-radius: 10px;
    border-left: 4px solid ${primaryColor};
    margin-bottom: 30px;
}

.verdict-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${primaryColor};
    margin-bottom: 10px;
}

.verdict-text {
    font-size: 1rem;
    line-height: 1.6;
    color: ${textColor};
}

.section-cta {
    text-align: center;
}

.cta-button {
    display: inline-block;
    background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}dd);
    color: white;
    padding: 15px 40px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Final Recommendation */
.final-recommendation {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    margin-bottom: 60px;
}

.recommendation-title {
    font-size: 2rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 30px;
}

.overall-rating {
    margin-bottom: 30px;
}

.overall-score {
    font-size: 4rem;
    font-weight: 700;
    color: ${primaryColor};
    line-height: 1;
}

.score-max {
    font-size: 2rem;
    color: #666;
}

.overall-stars {
    font-size: 2rem;
    margin: 10px 0;
}

.overall-label {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${primaryColor};
    text-transform: uppercase;
    letter-spacing: 1px;
}

.final-verdict {
    font-size: 1.2rem;
    line-height: 1.6;
    color: ${textColor};
    margin-bottom: 30px;
}

.final-cta-button {
    display: inline-block;
    background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}dd);
    color: white;
    padding: 20px 50px;
    border-radius: 30px;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    margin-bottom: 15px;
}

.final-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.cta-disclaimer {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
}

/* Sidebar */
.sidebar {
    position: sticky;
    top: 100px;
    height: fit-content;
}

.reviewer-card {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 30px;
}

.reviewer-avatar-large img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
}

.reviewer-card .reviewer-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${primaryColor};
    margin-bottom: 10px;
}

.reviewer-bio {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
    margin-bottom: 20px;
}

.reviewer-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.stat {
    text-align: center;
}

.stat strong {
    display: block;
    font-size: 1.5rem;
    color: ${primaryColor};
}

.stat span {
    font-size: 0.85rem;
    color: #666;
}

.follow-button {
    background: ${primaryColor};
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.follow-button:hover {
    background: ${primaryColor}dd;
    transform: translateY(-1px);
}

.helpful-section, .share-section {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.helpful-section h4, .share-section h4 {
    color: ${primaryColor};
    margin-bottom: 15px;
    font-size: 1rem;
}

.helpful-buttons {
    display: flex;
    gap: 10px;
}

.helpful-btn {
    flex: 1;
    padding: 10px;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.helpful-btn:hover {
    border-color: ${primaryColor};
    background: ${primaryColor}11;
}

.share-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.share-btn {
    padding: 8px 15px;
    border: none;
    background: #f3f4f6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.share-btn:hover {
    background: #e5e7eb;
}

/* Footer */
.site-footer {
    background: #1f2937;
    color: white;
    padding: 40px 0;
    text-align: center;
}

.footer-content p {
    margin-bottom: 10px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .article-title {
        font-size: 2rem;
    }
    
    .article-meta {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .article-stats {
        gap: 15px;
    }
    
    .cta-content {
        flex-direction: column;
        text-align: center;
    }
    
    .content-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .pros-cons-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .nav-links {
        display: none;
    }
    
    .sidebar {
        position: static;
        order: -1;
    }
}
`
  }

  private generateJS(affiliateUrl: string): string {
    return `
// Track events
const trackEvent = (event, data = {}) => {
    if (typeof gtag !== 'undefined') gtag('event', event, data);
    if (typeof fbq !== 'undefined') fbq('track', event, data);
    if (typeof personalTrack !== 'undefined') personalTrack(event, data);
};

// Mark review as helpful
function markHelpful(helpful) {
    const buttons = document.querySelectorAll('.helpful-btn');
    buttons.forEach(btn => btn.style.opacity = '0.5');
    
    const selectedBtn = helpful ? document.querySelector('.helpful-btn.yes') : document.querySelector('.helpful-btn.no');
    if (selectedBtn) {
        selectedBtn.style.opacity = '1';
        selectedBtn.style.background = '#10b981';
        selectedBtn.style.color = 'white';
        selectedBtn.style.borderColor = '#10b981';
    }
    
    trackEvent('review_helpful', {helpful, product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}'});
}

// Share review
function shareReview(platform) {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
            break;
        case 'twitter':
            shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
            break;
        case 'whatsapp':
            shareUrl = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        trackEvent('review_shared', {platform, product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}'});
    }
}

// Smooth scroll to sections
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

// Reading progress indicator
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = \`
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2563EB, #3B82F6);
        z-index: 1000;
        transition: width 0.1s ease;
    \`;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    createReadingProgress();
    
    // Track page view
    trackEvent('review_page_view', {
        product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}',
        scroll_depth: 0
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track every 25%
                trackEvent('scroll_depth', {depth: maxScroll});
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {seconds: timeSpent});
    });
});

// CTA conversion tracking
document.querySelectorAll('a[href*="hotmart"], a[href*="monetizze"], a[href*="eduzz"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('conversion_click', {
            source: 'review_template',
            location: this.getAttribute('onclick') || 'unknown'
        });
    });
});
`
  }
}