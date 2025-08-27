/**
 * Cookie Template - Falso aviso de cookies + redirect
 * Taxa de conversão: 8-12%
 * Estratégia: Qualquer clique redireciona para oferta
 */

import { ProductValidationResponse } from '@/types'
import { DesignTokens } from '../design/design-matcher'

export interface CookieTemplateConfig {
  productName: string
  productUrl: string
  originalPageUrl?: string
  targetCountry: string
  language: string
  currency: string
  designTokens?: DesignTokens
}

export class CookieTemplate {
  
  /**
   * Gera template Cookie completo
   */
  generate(config: CookieTemplateConfig): {
    html: string
    css: string
    js: string
    metadata: {
      templateType: 'cookie'
      conversionRate: string
      strategy: string
    }
  } {
    return {
      html: this.generateHTML(config),
      css: this.generateCSS(config),
      js: this.generateJS(config),
      metadata: {
        templateType: 'cookie',
        conversionRate: '8-12%',
        strategy: 'Falso aviso de cookies - qualquer clique redireciona'
      }
    }
  }
  
  /**
   * HTML do template Cookie
   */
  private generateHTML(config: CookieTemplateConfig): string {
    const translations = this.getTranslations(config.language)
    const mockDomain = this.generateMockDomain(config.productName)
    
    return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${translations.siteTitle} | ${config.productName}</title>
    
    <meta name="description" content="${translations.siteDescription}">
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Design matching styles -->
    ${this.generateDesignMatchingCSS(config.designTokens)}
</head>
<body>
    <!-- Fake Website Header -->
    <header class="fake-header">
        <div class="container">
            <div class="logo">
                <span class="logo-icon">📰</span>
                <span class="logo-text">${mockDomain}</span>
            </div>
            <nav class="fake-nav">
                <a href="#" onclick="redirect()">${translations.nav.home}</a>
                <a href="#" onclick="redirect()">${translations.nav.news}</a>
                <a href="#" onclick="redirect()">${translations.nav.health}</a>
                <a href="#" onclick="redirect()">${translations.nav.contact}</a>
            </nav>
        </div>
    </header>

    <!-- Fake Content to seem legitimate -->
    <main class="main-content">
        <div class="container">
            <article class="fake-article" onclick="redirect()">
                <h1>${translations.article.headline.replace('{{product}}', config.productName)}</h1>
                
                <div class="article-meta">
                    <span class="author">${translations.article.author}</span>
                    <span class="date">${this.getFormattedDate(config.language)}</span>
                    <span class="reading-time">${translations.article.readingTime}</span>
                </div>
                
                <div class="article-content">
                    <p>${translations.article.intro.replace('{{product}}', config.productName)}</p>
                    
                    <img src="https://via.placeholder.com/600x300/007bff/ffffff?text=${config.productName}" 
                         alt="${config.productName}" 
                         class="article-image"
                         onclick="redirect()">
                    
                    <p>${translations.article.body1.replace('{{product}}', config.productName)}</p>
                    
                    <blockquote onclick="redirect()">
                        <p>${translations.article.quote.replace('{{product}}', config.productName)}</p>
                        <cite>${translations.article.expert}</cite>
                    </blockquote>
                    
                    <p>${translations.article.body2.replace('{{product}}', config.productName)}</p>
                    
                    <div class="cta-section" onclick="redirect()">
                        <h3>${translations.article.ctaTitle}</h3>
                        <p>${translations.article.ctaText}</p>
                        <div class="fake-button">
                            ${translations.article.ctaButton}
                        </div>
                    </div>
                </div>
            </article>
            
            <!-- Fake sidebar -->
            <aside class="sidebar">
                <div class="sidebar-widget" onclick="redirect()">
                    <h4>${translations.sidebar.trending}</h4>
                    <ul>
                        <li onclick="redirect()">${translations.sidebar.news1}</li>
                        <li onclick="redirect()">${translations.sidebar.news2}</li>
                        <li onclick="redirect()">${translations.sidebar.news3}</li>
                    </ul>
                </div>
                
                <div class="sidebar-widget" onclick="redirect()">
                    <h4>${translations.sidebar.newsletter}</h4>
                    <p>${translations.sidebar.newsletterText}</p>
                    <div class="fake-form" onclick="redirect()">
                        <input type="email" placeholder="${translations.sidebar.emailPlaceholder}" readonly>
                        <button onclick="redirect()">${translations.sidebar.subscribe}</button>
                    </div>
                </div>
            </aside>
        </div>
    </main>

    <!-- Cookie Banner (TRAP) -->
    <div class="cookie-banner" id="cookieBanner">
        <div class="cookie-content">
            <div class="cookie-icon">🍪</div>
            <div class="cookie-text">
                <h3>${translations.cookie.title}</h3>
                <p>${translations.cookie.message}</p>
            </div>
            <div class="cookie-buttons">
                <button class="cookie-btn cookie-accept" onclick="redirect()">${translations.cookie.accept}</button>
                <button class="cookie-btn cookie-decline" onclick="redirect()">${translations.cookie.decline}</button>
                <button class="cookie-btn cookie-settings" onclick="redirect()">${translations.cookie.settings}</button>
            </div>
        </div>
    </div>

    <!-- Fake Footer -->
    <footer class="fake-footer" onclick="redirect()">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>${translations.footer.about}</h4>
                    <p>${translations.footer.aboutText}</p>
                </div>
                <div class="footer-section">
                    <h4>${translations.footer.links}</h4>
                    <ul>
                        <li><a href="#" onclick="redirect()">${translations.footer.privacy}</a></li>
                        <li><a href="#" onclick="redirect()">${translations.footer.terms}</a></li>
                        <li><a href="#" onclick="redirect()">${translations.footer.contact}</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${mockDomain}. ${translations.footer.rights}</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Redirect function - ANY click goes to offer
        function redirect() {
            // Track conversion
            if (window.track) {
                window.track('conversion', 'cookie_click', 'cookie_template', null, {
                    template: 'cookie',
                    product: '${config.productName}',
                    country: '${config.targetCountry}'
                });
            }
            
            // Small delay to ensure tracking
            setTimeout(() => {
                window.location.href = '${config.productUrl}';
            }, 100);
        }
        
        // Auto-show cookie banner after 2 seconds
        setTimeout(() => {
            document.getElementById('cookieBanner').style.display = 'flex';
        }, 2000);
        
        // Track page view
        if (window.track) {
            window.track('page', 'view', 'cookie_template', null, {
                template: 'cookie',
                product: '${config.productName}',
                country: '${config.targetCountry}'
            });
        }
        
        // Prevent right-click and text selection to maintain illusion
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
    </script>
</body>
</html>`
  }
  
  /**
   * CSS do template Cookie
   */
  private generateCSS(config: CookieTemplateConfig): string {
    const tokens = config.designTokens
    
    return `/* Cookie Template CSS */
:root {
    --primary-color: ${tokens?.colors?.primary || '#007bff'};
    --secondary-color: ${tokens?.colors?.secondary || '#6c757d'};
    --background-color: ${tokens?.colors?.background || '#ffffff'};
    --text-color: ${tokens?.colors?.text || '#333333'};
    --accent-color: ${tokens?.colors?.accent || '#28a745'};
    --border-radius: ${tokens?.layout?.borderRadius || '6px'};
    --font-family: ${tokens?.typography?.primaryFont || 'Arial, sans-serif'};
    --heading-font: ${tokens?.typography?.headingFont || 'Georgia, serif'};
}

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
    cursor: pointer;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Fake Header */
.fake-header {
    background: var(--background-color);
    border-bottom: 1px solid #e0e0e0;
    padding: 15px 0;
}

.fake-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
    cursor: pointer;
}

.logo-icon {
    font-size: 28px;
}

.fake-nav {
    display: flex;
    gap: 30px;
}

.fake-nav a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s ease;
}

.fake-nav a:hover {
    color: var(--primary-color);
}

/* Main Content */
.main-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    padding: 40px 0;
    min-height: 70vh;
}

.fake-article {
    cursor: pointer;
}

.fake-article h1 {
    font-family: var(--heading-font);
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 20px;
    color: var(--text-color);
}

.article-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    color: var(--secondary-color);
    font-size: 14px;
}

.article-content p {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 1.7;
}

.article-image {
    width: 100%;
    max-width: 600px;
    height: 300px;
    object-fit: cover;
    border-radius: var(--border-radius);
    margin: 30px 0;
    cursor: pointer;
}

blockquote {
    background: #f8f9fa;
    border-left: 4px solid var(--primary-color);
    padding: 20px;
    margin: 30px 0;
    font-style: italic;
    cursor: pointer;
}

blockquote cite {
    display: block;
    margin-top: 10px;
    font-weight: bold;
    color: var(--primary-color);
}

.cta-section {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    padding: 30px;
    border-radius: var(--border-radius);
    text-align: center;
    margin: 30px 0;
    cursor: pointer;
}

.cta-section h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

.fake-button {
    background: white;
    color: var(--primary-color);
    padding: 15px 30px;
    border-radius: var(--border-radius);
    font-weight: bold;
    display: inline-block;
    margin-top: 15px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.fake-button:hover {
    transform: translateY(-2px);
}

/* Sidebar */
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.sidebar-widget {
    background: #f8f9fa;
    padding: 20px;
    border-radius: var(--border-radius);
    cursor: pointer;
}

.sidebar-widget h4 {
    margin-bottom: 15px;
    color: var(--primary-color);
}

.sidebar-widget ul {
    list-style: none;
}

.sidebar-widget li {
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
}

.sidebar-widget li:hover {
    color: var(--primary-color);
}

.fake-form {
    margin-top: 15px;
}

.fake-form input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    margin-bottom: 10px;
    cursor: pointer;
}

.fake-form button {
    width: 100%;
    background: var(--primary-color);
    color: white;
    padding: 10px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
}

/* Cookie Banner (TRAP) */
.cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    color: white;
    padding: 20px;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: slideUp 0.5s ease;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.cookie-content {
    display: flex;
    align-items: center;
    gap: 20px;
    max-width: 1200px;
    flex-wrap: wrap;
}

.cookie-icon {
    font-size: 2rem;
}

.cookie-text h3 {
    margin-bottom: 5px;
}

.cookie-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.cookie-btn {
    padding: 10px 20px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.cookie-accept {
    background: var(--accent-color);
    color: white;
}

.cookie-decline {
    background: #dc3545;
    color: white;
}

.cookie-settings {
    background: var(--secondary-color);
    color: white;
}

.cookie-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Fake Footer */
.fake-footer {
    background: #2c3e50;
    color: white;
    padding: 40px 0 20px;
    cursor: pointer;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-bottom: 20px;
}

.footer-section h4 {
    margin-bottom: 15px;
    color: var(--accent-color);
}

.footer-section ul {
    list-style: none;
}

.footer-section li {
    margin-bottom: 8px;
}

.footer-section a {
    color: #bdc3c7;
    text-decoration: none;
    cursor: pointer;
}

.footer-section a:hover {
    color: white;
}

.footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #34495e;
    color: #bdc3c7;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .fake-header .container {
        flex-direction: column;
        gap: 15px;
    }
    
    .fake-nav {
        gap: 15px;
        font-size: 14px;
    }
    
    .fake-article h1 {
        font-size: 1.8rem;
    }
    
    .cookie-content {
        flex-direction: column;
        text-align: center;
    }
    
    .cookie-buttons {
        justify-content: center;
    }
}`
  }
  
  /**
   * JavaScript do template Cookie
   */
  private generateJS(config: CookieTemplateConfig): string {
    return `// Cookie Template JavaScript
console.log('Cookie Template loaded for ${config.productName}');

// Additional tracking and behavior
document.addEventListener('DOMContentLoaded', function() {
    // Track template load
    if (window.track) {
        window.track('template', 'load', 'cookie_template', null, {
            product: '${config.productName}',
            country: '${config.targetCountry}',
            timestamp: Date.now()
        });
    }
    
    // Add subtle animations to increase engagement
    const elements = document.querySelectorAll('.fake-article, .sidebar-widget');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Fake loading simulation for realism
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Track mouse movement for engagement metrics
let mouseMoves = 0;
document.addEventListener('mousemove', function() {
    mouseMoves++;
    if (mouseMoves === 10) { // After 10 mouse moves
        if (window.track) {
            window.track('engagement', 'mouse_active', 'cookie_template');
        }
    }
});

// Track scroll engagement
let hasScrolled = false;
window.addEventListener('scroll', function() {
    if (!hasScrolled) {
        hasScrolled = true;
        if (window.track) {
            window.track('engagement', 'scroll', 'cookie_template');
        }
    }
});`
  }
  
  /**
   * Gera CSS para design matching
   */
  private generateDesignMatchingCSS(designTokens?: DesignTokens): string {
    if (!designTokens) return ''
    
    return `<style>
      /* Design Matching Override */
      :root {
        --matched-primary: ${designTokens.colors.primary};
        --matched-secondary: ${designTokens.colors.secondary};
        --matched-background: ${designTokens.colors.background};
        --matched-text: ${designTokens.colors.text};
        --matched-accent: ${designTokens.colors.accent};
        --matched-font: ${designTokens.typography.primaryFont};
        --matched-heading-font: ${designTokens.typography.headingFont};
        --matched-border-radius: ${designTokens.layout.borderRadius};
      }
    </style>`
  }
  
  /**
   * Gera domínio falso baseado no produto
   */
  private generateMockDomain(productName: string): string {
    const domains = [
      `${productName.toLowerCase()}-news.com`,
      `health-${productName.toLowerCase()}.net`,
      `daily-${productName.toLowerCase()}.org`,
      `${productName.toLowerCase()}-review.com`,
      `wellness-${productName.toLowerCase()}.info`
    ]
    
    return domains[Math.floor(Math.random() * domains.length)]
  }
  
  /**
   * Formata data baseada no idioma
   */
  private getFormattedDate(language: string): string {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    
    return date.toLocaleDateString(language, options)
  }
  
  /**
   * Traduções por idioma
   */
  private getTranslations(language: string) {
    const translations: Record<string, any> = {
      'pt-BR': {
        siteTitle: 'Portal de Saúde',
        siteDescription: 'As últimas notícias em saúde e bem-estar',
        nav: {
          home: 'Início',
          news: 'Notícias',
          health: 'Saúde',
          contact: 'Contato'
        },
        article: {
          headline: 'Especialistas Revelam: {{product}} Está Revolucionando o Tratamento Natural',
          author: 'Dr. Maria Santos',
          readingTime: '5 min de leitura',
          intro: 'Um novo estudo comprova a eficácia de {{product}} em casos reais. Milhares de pessoas já experimentaram resultados surpreendentes.',
          body1: 'Depois de meses de pesquisa, finalmente temos evidências concretas sobre {{product}}. O que descobrimos vai surpreender você.',
          quote: 'Em 20 anos de carreira médica, raramente vi algo tão promissor quanto {{product}}. Os resultados falam por si só.',
          expert: 'Dr. João Silva - Especialista em Medicina Natural',
          body2: 'Se você está procurando uma solução natural e eficaz, {{product}} pode ser exatamente o que você precisa. Veja os detalhes completos.',
          ctaTitle: 'Acesso Exclusivo Disponível',
          ctaText: 'Por tempo limitado, você pode ter acesso ao {{product}} com desconto especial.',
          ctaButton: 'Ver Oferta Exclusiva →'
        },
        sidebar: {
          trending: 'Mais Lidas',
          news1: 'Nova descoberta revoluciona tratamento natural',
          news2: 'Estudo comprova eficácia de método inovador',
          news3: 'Especialistas recomendam nova abordagem',
          newsletter: 'Newsletter',
          newsletterText: 'Receba as últimas novidades em saúde',
          emailPlaceholder: 'Seu email aqui',
          subscribe: 'Inscrever'
        },
        cookie: {
          title: 'Cookies e Privacidade',
          message: 'Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de privacidade.',
          accept: 'Aceitar Todos',
          decline: 'Recusar',
          settings: 'Configurar'
        },
        footer: {
          about: 'Sobre Nós',
          aboutText: 'Portal dedicado às últimas descobertas em saúde e bem-estar.',
          links: 'Links Úteis',
          privacy: 'Política de Privacidade',
          terms: 'Termos de Uso',
          contact: 'Contato',
          rights: 'Todos os direitos reservados.'
        }
      },
      
      'en-US': {
        siteTitle: 'Health Portal',
        siteDescription: 'Latest news in health and wellness',
        nav: {
          home: 'Home',
          news: 'News',
          health: 'Health',
          contact: 'Contact'
        },
        article: {
          headline: 'Experts Reveal: {{product}} is Revolutionizing Natural Treatment',
          author: 'Dr. Maria Santos',
          readingTime: '5 min read',
          intro: 'A new study proves the effectiveness of {{product}} in real cases. Thousands of people have already experienced surprising results.',
          body1: 'After months of research, we finally have concrete evidence about {{product}}. What we discovered will surprise you.',
          quote: 'In 20 years of medical career, I have rarely seen something as promising as {{product}}. The results speak for themselves.',
          expert: 'Dr. John Silva - Natural Medicine Specialist',
          body2: 'If you are looking for a natural and effective solution, {{product}} might be exactly what you need. See the complete details.',
          ctaTitle: 'Exclusive Access Available',
          ctaText: 'For a limited time, you can access {{product}} with special discount.',
          ctaButton: 'See Exclusive Offer →'
        },
        sidebar: {
          trending: 'Trending',
          news1: 'New discovery revolutionizes natural treatment',
          news2: 'Study proves effectiveness of innovative method',
          news3: 'Experts recommend new approach',
          newsletter: 'Newsletter',
          newsletterText: 'Get the latest health news',
          emailPlaceholder: 'Your email here',
          subscribe: 'Subscribe'
        },
        cookie: {
          title: 'Cookies and Privacy',
          message: 'This site uses cookies to improve your experience. By continuing to browse, you agree to our privacy policy.',
          accept: 'Accept All',
          decline: 'Decline',
          settings: 'Settings'
        },
        footer: {
          about: 'About Us',
          aboutText: 'Portal dedicated to the latest discoveries in health and wellness.',
          links: 'Useful Links',
          privacy: 'Privacy Policy',
          terms: 'Terms of Use',
          contact: 'Contact',
          rights: 'All rights reserved.'
        }
      }
    }
    
    return translations[language] || translations['en-US']
  }
}

// Export singleton
export const cookieTemplate = new CookieTemplate()