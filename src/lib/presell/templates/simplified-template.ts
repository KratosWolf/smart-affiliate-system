/**
 * Simplified Template
 * Versão ultra-simplificada baseada na página do produtor
 * Mantém design system e elementos essenciais
 */

import { PresellConfig } from '../template-generator'

export class SimplifiedTemplate {
  
  generate(config: PresellConfig, producerAnalysis?: any): string {
    // Este template é GERADO DINAMICAMENTE baseado na análise da página do produtor
    // Usa cores, fontes e estilo extraídos automaticamente
    
    return `
<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <title>${config.headline}</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${config.fontFamily};
            background-color: #ffffff;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Hero mínimo */
        .hero {
            text-align: center;
            padding: 40px 20px;
        }
        
        h1 {
            font-size: 2rem;
            color: ${config.primaryColor};
            margin-bottom: 15px;
            font-weight: bold;
        }
        
        .subheadline {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
        }
        
        /* CTA Button - Estilo do produtor */
        .cta-button {
            display: inline-block;
            background: ${config.primaryColor};
            color: white;
            padding: 15px 40px;
            font-size: 1.1rem;
            font-weight: bold;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            transition: all 0.3s;
            cursor: pointer;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        /* Benefits simples */
        .benefits {
            margin: 40px 0;
        }
        
        .benefit-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        
        .benefit-icon {
            font-size: 1.5rem;
            color: ${config.primaryColor};
            margin-right: 15px;
        }
        
        /* Urgência discreta */
        .urgency-bar {
            background: linear-gradient(90deg, #ff6b6b 0%, #ffd93d 100%);
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: bold;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        /* Garantia */
        .guarantee {
            background: #e8f5e9;
            border: 2px solid #4caf50;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        
        .guarantee-badge {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        /* Footer mínimo */
        .footer {
            text-align: center;
            padding: 20px;
            margin-top: 50px;
            border-top: 1px solid #eee;
            font-size: 0.9rem;
            color: #666;
        }
        
        /* Mobile */
        @media (max-width: 768px) {
            h1 {
                font-size: 1.5rem;
            }
            
            .cta-button {
                display: block;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <!-- Barra de Urgência (Opcional) -->
    ${config.urgencyText ? `
    <div class="urgency-bar">
        ⚡ ${config.urgencyText}
    </div>
    ` : ''}
    
    <div class="container">
        <!-- Hero Section -->
        <div class="hero">
            <h1>${config.headline}</h1>
            <p class="subheadline">${config.subheadline}</p>
            
            <!-- CTA Principal -->
            <a href="${config.productUrl}" class="cta-button" onclick="trackClick('main')">
                ${config.ctaText}
            </a>
        </div>
        
        <!-- Benefits Simples -->
        <div class="benefits">
            ${config.benefits.slice(0, 5).map(benefit => `
            <div class="benefit-item">
                <span class="benefit-icon">✅</span>
                <span>${benefit}</span>
            </div>
            `).join('')}
        </div>
        
        <!-- CTA Meio -->
        <div style="text-align: center;">
            <a href="${config.productUrl}" class="cta-button" onclick="trackClick('middle')">
                Quero Aproveitar Agora →
            </a>
        </div>
        
        <!-- Garantia -->
        ${config.guaranteeDays ? `
        <div class="guarantee">
            <div class="guarantee-badge">🛡️</div>
            <strong>Garantia de ${config.guaranteeDays} Dias</strong>
            <p>Teste sem riscos. Se não gostar, devolvemos seu dinheiro.</p>
        </div>
        ` : ''}
        
        <!-- Social Proof -->
        ${config.socialProof ? `
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 10px;">
            <p style="font-size: 1.1rem; color: #666;">
                ${config.socialProof}
            </p>
        </div>
        ` : ''}
        
        <!-- CTA Final -->
        <div style="text-align: center; margin-top: 40px;">
            <a href="${config.productUrl}" class="cta-button" onclick="trackClick('footer')">
                Garantir Minha Vaga Agora
            </a>
            
            ${config.discountPercentage ? `
            <p style="color: #666; margin-top: 10px;">
                <s>De R$ ${(config.price * 1.5).toFixed(2)}</s> 
                por apenas <strong style="color: ${config.primaryColor}; font-size: 1.3rem;">
                    R$ ${config.price.toFixed(2)}
                </strong>
            </p>
            ` : ''}
        </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <p>© 2025 - Todos os direitos reservados</p>
        <p>
            <a href="/privacy" style="color: #666;">Privacidade</a> | 
            <a href="/terms" style="color: #666;">Termos</a> | 
            <a href="/contact" style="color: #666;">Contato</a>
        </p>
    </div>
    
    <!-- Tracking -->
    <script>
        function trackClick(position) {
            // Google Analytics / Facebook Pixel
            console.log('Click tracked:', position);
            
            // Delay para tracking
            setTimeout(() => {
                window.location.href = '${config.productUrl}';
            }, 100);
            
            return false;
        }
        
        // Urgency countdown (opcional)
        ${config.urgencyText ? `
        let timeLeft = 900; // 15 minutos
        setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const urgencyBar = document.querySelector('.urgency-bar');
            if (urgencyBar && timeLeft > 0) {
                urgencyBar.innerHTML = '⚡ Oferta expira em: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            }
        }, 1000);
        ` : ''}
    </script>
</body>
</html>
    `
  }
}