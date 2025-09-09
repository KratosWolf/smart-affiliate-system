// Cookie Consent Template - Real Implementation
// Language-adapted cookie consent page with detected producer language

import { DesignTokens, ProducerAnalysis } from '@/types'

interface CookieTexts {
  title: string
  subtitle: string
  cookieNotice: string
  acceptButton: string
  declineButton: string
  privacyText: string
  analyticsText: string
  marketingText: string
  necessaryText: string
  learnMore: string
}

const COOKIE_TEXTS: Record<string, CookieTexts> = {
  pl: {
    title: 'Ustawienia Cookies',
    subtitle: 'Szanujemy Twoją prywatność',
    cookieNotice: 'Ta strona używa plików cookie, aby poprawić Twoje doświadczenie przeglądania i dostarczyć spersonalizowane treści.',
    acceptButton: 'Akceptuję wszystkie',
    declineButton: 'Tylko niezbędne',
    privacyText: 'Klikając "Akceptuję wszystkie", wyrażasz zgodę na przechowywanie plików cookie na Twoim urządzeniu w celu poprawy nawigacji, analizy użytkowania strony i wsparcia naszych działań marketingowych.',
    analyticsText: 'Pliki cookie analityczne pomagają nam zrozumieć, jak odwiedzający korzystają z naszej strony.',
    marketingText: 'Pliki cookie marketingowe są używane do śledzenia odwiedzających na stronach internetowych w celu wyświetlania reklam.',
    necessaryText: 'Niezbędne pliki cookie są absolutnie niezbędne do prawidłowego funkcjonowania strony internetowej.',
    learnMore: 'Dowiedz się więcej'
  },
  en: {
    title: 'Cookie Settings',
    subtitle: 'We respect your privacy',
    cookieNotice: 'This website uses cookies to enhance your browsing experience and deliver personalized content.',
    acceptButton: 'Accept All',
    declineButton: 'Necessary Only',
    privacyText: 'By clicking "Accept All", you consent to the storage of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.',
    analyticsText: 'Analytics cookies help us understand how visitors interact with our website.',
    marketingText: 'Marketing cookies are used to track visitors across websites to display relevant advertisements.',
    necessaryText: 'Necessary cookies are absolutely essential for the website to function properly.',
    learnMore: 'Learn More'
  },
  pt: {
    title: 'Configurações de Cookies',
    subtitle: 'Respeitamos sua privacidade',
    cookieNotice: 'Este site usa cookies para melhorar sua experiência de navegação e fornecer conteúdo personalizado.',
    acceptButton: 'Aceitar Todos',
    declineButton: 'Apenas Necessários',
    privacyText: 'Ao clicar em "Aceitar Todos", você consente com o armazenamento de cookies em seu dispositivo para melhorar a navegação, analisar o uso do site e auxiliar em nossos esforços de marketing.',
    analyticsText: 'Cookies analíticos nos ajudam a entender como os visitantes interagem com nosso site.',
    marketingText: 'Cookies de marketing são usados para rastrear visitantes em sites para exibir anúncios relevantes.',
    necessaryText: 'Cookies necessários são absolutamente essenciais para o funcionamento adequado do site.',
    learnMore: 'Saiba Mais'
  },
  es: {
    title: 'Configuración de Cookies',
    subtitle: 'Respetamos tu privacidad',
    cookieNotice: 'Este sitio web utiliza cookies para mejorar tu experiencia de navegación y proporcionar contenido personalizado.',
    acceptButton: 'Aceptar Todo',
    declineButton: 'Solo Necesarias',
    privacyText: 'Al hacer clic en "Aceptar Todo", consientes el almacenamiento de cookies en tu dispositivo para mejorar la navegación, analizar el uso del sitio y ayudar en nuestros esfuerzos de marketing.',
    analyticsText: 'Las cookies analíticas nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.',
    marketingText: 'Las cookies de marketing se utilizan para rastrear visitantes en sitios web para mostrar anuncios relevantes.',
    necessaryText: 'Las cookies necesarias son absolutamente esenciales para que el sitio web funcione correctamente.',
    learnMore: 'Aprende Más'
  }
}

export const cookieTemplate = {
  name: 'Cookie Consent Template',
  description: 'Language-adapted cookie consent page based on producer page language detection',
  
  generateTemplate: (producerAnalysis: ProducerAnalysis, designTokens?: DesignTokens) => {
    const language = producerAnalysis.language.detected || 'en'
    const texts = COOKIE_TEXTS[language] || COOKIE_TEXTS.en
    const colors = producerAnalysis.designSystem.colors
    const fonts = producerAnalysis.designSystem.fonts

    const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${texts.title}</title>
    <style>
        ${generateCSS(colors, fonts, texts)}
    </style>
</head>
<body>
    <div class="cookie-overlay">
        <div class="cookie-container">
            <div class="cookie-header">
                <div class="cookie-icon">🍪</div>
                <h1 class="cookie-title">${texts.title}</h1>
                <p class="cookie-subtitle">${texts.subtitle}</p>
            </div>
            
            <div class="cookie-content">
                <p class="cookie-notice">${texts.cookieNotice}</p>
                
                <div class="cookie-categories">
                    <div class="cookie-category">
                        <div class="category-header">
                            <input type="checkbox" id="necessary" checked disabled>
                            <label for="necessary">${texts.necessaryText}</label>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <input type="checkbox" id="analytics" checked>
                            <label for="analytics">${texts.analyticsText}</label>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <input type="checkbox" id="marketing" checked>
                            <label for="marketing">${texts.marketingText}</label>
                        </div>
                    </div>
                </div>
                
                <p class="privacy-text">${texts.privacyText}</p>
            </div>
            
            <div class="cookie-actions">
                <button class="btn-decline" onclick="handleDecline()">${texts.declineButton}</button>
                <button class="btn-accept" onclick="handleAccept()">${texts.acceptButton}</button>
            </div>
            
            <div class="cookie-footer">
                <a href="#" class="learn-more">${texts.learnMore}</a>
            </div>
        </div>
    </div>

    <script>
        ${generateJavaScript(language)}
    </script>
</body>
</html>`

    return {
      html,
      css: generateCSS(colors, fonts, texts),
      config: { 
        type: 'cookie',
        language,
        confidence: producerAnalysis.language.confidence
      }
    }
  }
}

function generateCSS(colors: any, fonts: any, texts: CookieTexts): string {
  return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: ${fonts.primary || 'Inter, system-ui, -apple-system, sans-serif'};
        background: linear-gradient(135deg, ${colors.background || '#f8fafc'} 0%, ${colors.primary || '#3b82f6'}15 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .cookie-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }

    .cookie-container {
        background: ${colors.background || '#ffffff'};
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid ${colors.primary || '#3b82f6'}20;
        position: relative;
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .cookie-header {
        text-align: center;
        margin-bottom: 24px;
    }

    .cookie-icon {
        font-size: 48px;
        margin-bottom: 16px;
        display: block;
    }

    .cookie-title {
        font-size: 24px;
        font-weight: 700;
        color: ${colors.text || '#1f2937'};
        margin-bottom: 8px;
        font-family: ${fonts.primary || 'Inter, sans-serif'};
    }

    .cookie-subtitle {
        font-size: 16px;
        color: ${colors.text || '#6b7280'};
        font-weight: 500;
    }

    .cookie-content {
        margin-bottom: 24px;
    }

    .cookie-notice {
        font-size: 15px;
        line-height: 1.6;
        color: ${colors.text || '#374151'};
        margin-bottom: 20px;
    }

    .cookie-categories {
        margin-bottom: 20px;
    }

    .cookie-category {
        margin-bottom: 12px;
        padding: 12px;
        background: ${colors.background || '#f9fafb'};
        border-radius: 8px;
        border: 1px solid ${colors.primary || '#e5e7eb'}30;
    }

    .category-header {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .category-header input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: ${colors.primary || '#3b82f6'};
    }

    .category-header label {
        font-size: 14px;
        color: ${colors.text || '#374151'};
        font-weight: 500;
        line-height: 1.4;
    }

    .privacy-text {
        font-size: 13px;
        line-height: 1.5;
        color: ${colors.text || '#6b7280'};
        background: ${colors.background || '#f3f4f6'};
        padding: 12px;
        border-radius: 8px;
        border-left: 3px solid ${colors.primary || '#3b82f6'};
    }

    .cookie-actions {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
    }

    .btn-decline,
    .btn-accept {
        flex: 1;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid;
        font-family: ${fonts.primary || 'Inter, sans-serif'};
    }

    .btn-decline {
        background: transparent;
        color: ${colors.text || '#374151'};
        border-color: ${colors.text || '#d1d5db'};
    }

    .btn-decline:hover {
        background: ${colors.text || '#f3f4f6'};
    }

    .btn-accept {
        background: ${colors.primary || '#3b82f6'};
        color: white;
        border-color: ${colors.primary || '#3b82f6'};
    }

    .btn-accept:hover {
        background: ${colors.secondary || '#2563eb'};
        border-color: ${colors.secondary || '#2563eb'};
        transform: translateY(-1px);
    }

    .cookie-footer {
        text-align: center;
    }

    .learn-more {
        color: ${colors.primary || '#3b82f6'};
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
    }

    .learn-more:hover {
        text-decoration: underline;
    }

    @media (max-width: 480px) {
        .cookie-container {
            padding: 24px;
            margin: 16px;
        }
        
        .cookie-actions {
            flex-direction: column;
        }
        
        .cookie-title {
            font-size: 20px;
        }
    }
  `
}

function generateJavaScript(language: string): string {
  return `
    function handleAccept() {
        // Set cookies for all categories
        setCookie('cookieConsent', 'all', 365);
        setCookie('analytics', 'true', 365);
        setCookie('marketing', 'true', 365);
        
        // Send acceptance event
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
            });
        }
        
        // Close modal
        closeModal();
        
        // Optional: redirect to main page
        // window.location.href = '/';
    }

    function handleDecline() {
        // Set cookies for necessary only
        setCookie('cookieConsent', 'necessary', 365);
        setCookie('analytics', 'false', 365);
        setCookie('marketing', 'false', 365);
        
        // Send decline event
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
        
        // Close modal
        closeModal();
    }

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    }

    function closeModal() {
        const overlay = document.querySelector('.cookie-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    // Handle individual category toggles
    document.addEventListener('DOMContentLoaded', function() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#necessary)');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Update the accept button text based on selections
                updateAcceptButton();
            });
        });
    });

    function updateAcceptButton() {
        const analytics = document.getElementById('analytics').checked;
        const marketing = document.getElementById('marketing').checked;
        const acceptBtn = document.querySelector('.btn-accept');
        
        if (analytics && marketing) {
            acceptBtn.textContent = '${COOKIE_TEXTS[language]?.acceptButton || COOKIE_TEXTS.en.acceptButton}';
        } else {
            acceptBtn.textContent = 'Accept Selected';
        }
    }
  `
}

export default cookieTemplate