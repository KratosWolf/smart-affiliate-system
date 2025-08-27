import { DesignTokens } from '@/types'
import { CountrySettings, getCountrySettings } from '../country-settings'

export interface ExpertReviewTemplateConfig {
  productName: string
  affiliateUrl: string
  validationScore: number
  countrySettings: CountrySettings
  designTokens?: DesignTokens
  customization?: any
}

export interface ExpertAnalysis {
  category: string
  score: number
  analysis: string
  recommendation: string
}

export class ExpertReviewTemplate {
  private generateExpertProfile(countrySettings: CountrySettings) {
    const lang = countrySettings.language
    
    if (lang === 'pt-BR') {
      return {
        name: 'Dr. Ricardo Oliveira',
        title: 'PhD em Ciências da Saúde',
        credentials: [
          'Doutor pela USP com 15 anos de experiência',
          'Autor de 47 estudos científicos publicados',
          'Consultor de grandes laboratórios',
          'Membro da Associação Brasileira de Especialistas'
        ],
        bio: 'Especialista reconhecido internacionalmente, dedica sua carreira à análise rigorosa de produtos e tratamentos, sempre baseado em evidências científicas.',
        certifications: ['CRM 123.456-SP', 'PhD USP 2008', 'Certificação Internacional'],
        experience: '15+ anos',
        studies: '47 estudos',
        patients: '2.400+ pacientes'
      }
    } else {
      return {
        name: 'Dr. Michael Thompson',
        title: 'PhD in Health Sciences',
        credentials: [
          'PhD from Harvard with 15 years experience',
          'Author of 47 published scientific studies',
          'Consultant for major laboratories',
          'Member of International Experts Association'
        ],
        bio: 'Internationally recognized specialist, dedicates his career to rigorous product and treatment analysis, always based on scientific evidence.',
        certifications: ['MD License 123456', 'PhD Harvard 2008', 'International Certification'],
        experience: '15+ years',
        studies: '47 studies',
        patients: '2,400+ patients'
      }
    }
  }

  private generateExpertAnalysis(productName: string, validationScore: number, countrySettings: CountrySettings): ExpertAnalysis[] {
    const lang = countrySettings.language
    
    if (lang === 'pt-BR') {
      return [
        {
          category: 'Eficácia Científica',
          score: Math.min(10, Math.max(6, Math.round(validationScore / 10))),
          analysis: `Com base na literatura científica disponível e nos componentes ativos do ${productName}, os estudos indicam uma taxa de eficácia de 87% em casos similares. Os mecanismos de ação são bem documentados e validados pela comunidade científica.`,
          recommendation: 'Os dados científicos suportam o uso do produto conforme as diretrizes estabelecidas.'
        },
        {
          category: 'Segurança e Tolerabilidade',
          score: 9,
          analysis: 'A análise dos componentes revela um perfil de segurança excelente. Não foram identificadas interações medicamentosas significativas ou efeitos adversos graves nos estudos clínicos revisados.',
          recommendation: 'Produto apresenta segurança adequada para uso conforme instruções.'
        },
        {
          category: 'Qualidade e Procedência',
          score: 8,
          analysis: 'A fabricação segue padrões internacionais de qualidade (GMP). O controle de qualidade é rigoroso e todos os lotes passam por testes de pureza e potência.',
          recommendation: 'Qualidade farmacêutica comprovada e procedência confiável.'
        },
        {
          category: 'Custo-Benefício',
          score: 7,
          analysis: 'Quando comparado a alternativas similares no mercado, o produto apresenta uma relação custo-benefício favorável, considerando sua formulação e eficácia documentada.',
          recommendation: 'Investimento justificado pelos resultados esperados.'
        }
      ]
    } else {
      return [
        {
          category: 'Scientific Efficacy',
          score: Math.min(10, Math.max(6, Math.round(validationScore / 10))),
          analysis: `Based on available scientific literature and active components of ${productName}, studies indicate an efficacy rate of 87% in similar cases. The mechanisms of action are well documented and validated by the scientific community.`,
          recommendation: 'Scientific data supports product use according to established guidelines.'
        },
        {
          category: 'Safety and Tolerability',
          score: 9,
          analysis: 'Component analysis reveals an excellent safety profile. No significant drug interactions or serious adverse effects were identified in reviewed clinical studies.',
          recommendation: 'Product shows adequate safety for use according to instructions.'
        },
        {
          category: 'Quality and Source',
          score: 8,
          analysis: 'Manufacturing follows international quality standards (GMP). Quality control is rigorous and all batches undergo purity and potency testing.',
          recommendation: 'Proven pharmaceutical quality and reliable source.'
        },
        {
          category: 'Cost-Benefit',
          score: 7,
          analysis: 'Compared to similar market alternatives, the product presents favorable cost-benefit ratio, considering its formulation and documented efficacy.',
          recommendation: 'Investment justified by expected results.'
        }
      ]
    }
  }

  generate(config: ExpertReviewTemplateConfig): {
    html: string
    css: string
    js: string
    metadata: {
      templateType: 'expert-review'
      conversionRate: string
      strategy: string
    }
  } {
    const expert = this.generateExpertProfile(config.countrySettings)
    const analysis = this.generateExpertAnalysis(config.productName, config.validationScore, config.countrySettings)
    const lang = config.countrySettings.language
    
    const texts = lang === 'pt-BR' ? {
      reportTitle: 'RELATÓRIO CIENTÍFICO',
      analysisTitle: 'ANÁLISE ESPECIALIZADA',
      expertOpinion: 'PARECER DO ESPECIALISTA',
      methodology: 'METODOLOGIA',
      conclusion: 'CONCLUSÃO CIENTÍFICA',
      recommendation: 'RECOMENDAÇÃO',
      getProduct: 'ACESSAR PRODUTO ANALISADO',
      disclaimer: 'Este relatório é baseado em análise científica independente para fins educacionais.',
      publishedBy: 'Publicado por',
      reviewDate: 'Data da Análise',
      certifications: 'Certificações',
      experience: 'Experiência',
      studies: 'Estudos Publicados',
      patients: 'Pacientes Atendidos',
      downloadReport: 'Baixar Relatório Completo',
      shareReport: 'Compartilhar Relatório'
    } : {
      reportTitle: 'SCIENTIFIC REPORT',
      analysisTitle: 'SPECIALIZED ANALYSIS',
      expertOpinion: 'EXPERT OPINION',
      methodology: 'METHODOLOGY',
      conclusion: 'SCIENTIFIC CONCLUSION',
      recommendation: 'RECOMMENDATION',
      getProduct: 'ACCESS ANALYZED PRODUCT',
      disclaimer: 'This report is based on independent scientific analysis for educational purposes.',
      publishedBy: 'Published by',
      reviewDate: 'Analysis Date',
      certifications: 'Certifications',
      experience: 'Experience',
      studies: 'Published Studies',
      patients: 'Patients Treated',
      downloadReport: 'Download Full Report',
      shareReport: 'Share Report'
    }

    const primaryColor = config.designTokens?.colors?.primary || '#1E40AF'
    const backgroundColor = config.designTokens?.colors?.background || '#FFFFFF'
    const textColor = config.designTokens?.colors?.text || '#1F2937'
    const fontFamily = config.designTokens?.fonts?.primary || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'

    const avgScore = analysis.reduce((sum, item) => sum + item.score, 0) / analysis.length
    const finalRating = Math.round(avgScore * 10) / 10

    const html = `
<!DOCTYPE html>
<html lang="${config.countrySettings.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${texts.reportTitle}: ${config.productName} - ${expert.name}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Análise científica completa do ${config.productName} realizada por ${expert.name}, especialista com ${expert.experience} de experiência.">
    <meta name="keywords" content="${config.productName}, análise científica, especialista, ${expert.name}, relatório médico">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${expert.name}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${texts.reportTitle}: ${config.productName}">
    <meta property="og:description" content="Análise científica especializada realizada por ${expert.name}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="expert-report.jpg">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "mainEntity": {
        "@type": "MedicalCondition",
        "name": "${config.productName} Analysis"
      },
      "author": {
        "@type": "Person",
        "name": "${expert.name}",
        "jobTitle": "${expert.title}",
        "alumniOf": "USP"
      },
      "reviewedBy": {
        "@type": "Person",
        "name": "${expert.name}"
      },
      "lastReviewed": "${new Date().toISOString().split('T')[0]}"
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
            track('page_view', {template: 'expert-review', product: '${config.productName}'});
        })();
    </script>
    
    <style>
        ${this.generateCSS(primaryColor, backgroundColor, textColor, fontFamily)}
    </style>
</head>
<body>
    <!-- Header -->
    <header class="medical-header">
        <div class="container">
            <div class="header-content">
                <div class="medical-logo">
                    <div class="logo-icon">🏥</div>
                    <div class="logo-text">
                        <h1>Instituto de Análises Científicas</h1>
                        <p>Evidência • Ciência • Confiança</p>
                    </div>
                </div>
                <div class="header-badges">
                    <div class="badge">✅ ${lang === 'pt-BR' ? 'Análise Independente' : 'Independent Analysis'}</div>
                    <div class="badge">🔬 ${lang === 'pt-BR' ? 'Base Científica' : 'Scientific Based'}</div>
                </div>
            </div>
        </div>
    </header>

    <!-- Report Header -->
    <section class="report-header">
        <div class="container">
            <div class="report-classification">
                <span class="classification-label">${texts.reportTitle}</span>
                <span class="classification-number">REL-${Date.now().toString().slice(-6)}</span>
            </div>
            
            <h1 class="report-title">${texts.analysisTitle}: ${config.productName}</h1>
            
            <div class="report-meta">
                <div class="expert-profile">
                    <div class="expert-photo">
                        <img src="expert-photo.jpg" alt="${expert.name}">
                        <div class="verification-badge">✓</div>
                    </div>
                    <div class="expert-info">
                        <h2 class="expert-name">${expert.name}</h2>
                        <p class="expert-title">${expert.title}</p>
                        <div class="expert-credentials">
                            ${expert.credentials.map(cred => `<div class="credential">• ${cred}</div>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="report-stats">
                    <div class="stat-grid">
                        <div class="stat-item">
                            <strong>${expert.experience}</strong>
                            <span>${texts.experience}</span>
                        </div>
                        <div class="stat-item">
                            <strong>${expert.studies}</strong>
                            <span>${texts.studies}</span>
                        </div>
                        <div class="stat-item">
                            <strong>${expert.patients}</strong>
                            <span>${texts.patients}</span>
                        </div>
                    </div>
                    
                    <div class="report-info">
                        <div class="info-item">
                            <span class="info-label">${texts.reviewDate}:</span>
                            <span class="info-value">${new Date().toLocaleDateString(config.countrySettings.language)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">${texts.certifications}:</span>
                            <span class="info-value">${expert.certifications.join(', ')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Expert CTA -->
    <section class="expert-cta">
        <div class="container">
            <div class="cta-content">
                <div class="cta-text">
                    <h3>${lang === 'pt-BR' ? 'Produto Analisado com Base Científica' : 'Product Analyzed with Scientific Foundation'}</h3>
                    <p>${lang === 'pt-BR' ? 'Aprovação baseada em evidências e padrões internacionais' : 'Approval based on evidence and international standards'}</p>
                </div>
                <a href="${config.affiliateUrl}" class="expert-cta-button" onclick="trackEvent('expert_cta_click', {location: 'header'})">${texts.getProduct}</a>
            </div>
        </div>
    </section>

    <!-- Analysis Content -->
    <main class="analysis-content">
        <div class="container">
            <div class="content-layout">
                <!-- Main Analysis -->
                <div class="main-analysis">
                    <section class="overall-assessment">
                        <h2 class="section-title">${texts.expertOpinion}</h2>
                        
                        <div class="assessment-summary">
                            <div class="overall-score">
                                <div class="score-circle">
                                    <span class="score-number">${finalRating}</span>
                                    <span class="score-max">/10</span>
                                </div>
                                <div class="score-label">
                                    ${finalRating >= 8.5 ? (lang === 'pt-BR' ? 'EXCELENTE' : 'EXCELLENT') :
                                      finalRating >= 7.5 ? (lang === 'pt-BR' ? 'MUITO BOM' : 'VERY GOOD') :
                                      finalRating >= 6.5 ? (lang === 'pt-BR' ? 'BOM' : 'GOOD') : 
                                      (lang === 'pt-BR' ? 'REGULAR' : 'AVERAGE')}
                                </div>
                            </div>
                            
                            <div class="summary-text">
                                <p>${lang === 'pt-BR' ? 
                                    `Com base na análise científica rigorosa, o ${config.productName} apresenta evidências sólidas de eficácia e segurança. Os componentes ativos são bem documentados na literatura médica e os resultados observados estão em linha com as expectativas clínicas.` :
                                    `Based on rigorous scientific analysis, ${config.productName} presents solid evidence of efficacy and safety. Active components are well documented in medical literature and observed results are in line with clinical expectations.`}
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Detailed Analysis -->
                    ${analysis.map((item, index) => `
                    <section class="analysis-category">
                        <h3 class="category-title">${item.category}</h3>
                        
                        <div class="category-header">
                            <div class="category-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${item.score * 10}%"></div>
                                </div>
                                <span class="score-text">${item.score}/10</span>
                            </div>
                        </div>
                        
                        <div class="category-content">
                            <div class="analysis-text">
                                <h4>${lang === 'pt-BR' ? 'Análise:' : 'Analysis:'}</h4>
                                <p>${item.analysis}</p>
                            </div>
                            
                            <div class="recommendation-box">
                                <h4>${texts.recommendation}:</h4>
                                <p>${item.recommendation}</p>
                            </div>
                        </div>
                    </section>
                    `).join('')}

                    <!-- Methodology -->
                    <section class="methodology-section">
                        <h2 class="section-title">${texts.methodology}</h2>
                        
                        <div class="methodology-grid">
                            <div class="method-item">
                                <div class="method-icon">📊</div>
                                <h4>${lang === 'pt-BR' ? 'Revisão Bibliográfica' : 'Literature Review'}</h4>
                                <p>${lang === 'pt-BR' ? 'Análise de 127 estudos científicos revisados por pares' : 'Analysis of 127 peer-reviewed scientific studies'}</p>
                            </div>
                            
                            <div class="method-item">
                                <div class="method-icon">🔬</div>
                                <h4>${lang === 'pt-BR' ? 'Análise Laboratorial' : 'Laboratory Analysis'}</h4>
                                <p>${lang === 'pt-BR' ? 'Testes de pureza, potência e estabilidade realizados' : 'Purity, potency and stability tests performed'}</p>
                            </div>
                            
                            <div class="method-item">
                                <div class="method-icon">👥</div>
                                <h4>${lang === 'pt-BR' ? 'Dados Clínicos' : 'Clinical Data'}</h4>
                                <p>${lang === 'pt-BR' ? 'Avaliação de resultados em 2.400+ casos documentados' : 'Evaluation of results in 2,400+ documented cases'}</p>
                            </div>
                            
                            <div class="method-item">
                                <div class="method-icon">⚖️</div>
                                <h4>${lang === 'pt-BR' ? 'Análise Regulatória' : 'Regulatory Analysis'}</h4>
                                <p>${lang === 'pt-BR' ? 'Conformidade com padrões ANVISA e FDA verificada' : 'ANVISA and FDA standards compliance verified'}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Final Conclusion -->
                    <section class="final-conclusion">
                        <h2 class="section-title">${texts.conclusion}</h2>
                        
                        <div class="conclusion-content">
                            <div class="conclusion-text">
                                <p><strong>${lang === 'pt-BR' ? 'Parecer final:' : 'Final assessment:'}</strong> ${lang === 'pt-BR' ? 
                                    `O ${config.productName} demonstra eficácia clinicamente significativa com perfil de segurança adequado. A formulação é cientificamente fundamentada e os resultados observados justificam sua recomendação quando usado conforme as diretrizes estabelecidas.` :
                                    `${config.productName} demonstrates clinically significant efficacy with adequate safety profile. The formulation is scientifically grounded and observed results justify its recommendation when used according to established guidelines.`}
                                </p>
                                
                                <div class="expert-signature">
                                    <div class="signature-line">
                                        <img src="signature.png" alt="Assinatura" class="signature-img">
                                    </div>
                                    <div class="signature-info">
                                        <strong>${expert.name}</strong><br>
                                        ${expert.title}<br>
                                        ${expert.certifications[0]}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="conclusion-cta">
                                <a href="${config.affiliateUrl}" class="conclusion-button" onclick="trackEvent('expert_cta_click', {location: 'conclusion'})">${texts.getProduct}</a>
                                <p class="cta-note">${texts.disclaimer}</p>
                            </div>
                        </div>
                    </section>
                </div>
                
                <!-- Sidebar -->
                <aside class="report-sidebar">
                    <div class="sidebar-card expert-summary">
                        <h4>${lang === 'pt-BR' ? 'Sobre o Especialista' : 'About the Expert'}</h4>
                        <div class="expert-bio">
                            <p>${expert.bio}</p>
                        </div>
                        <div class="credentials-list">
                            <h5>${texts.certifications}:</h5>
                            ${expert.certifications.map(cert => `<div class="cert-item">✓ ${cert}</div>`).join('')}
                        </div>
                    </div>
                    
                    <div class="sidebar-card report-actions">
                        <h4>${lang === 'pt-BR' ? 'Ações do Relatório' : 'Report Actions'}</h4>
                        <div class="action-buttons">
                            <button class="action-btn download" onclick="downloadReport()">${texts.downloadReport}</button>
                            <button class="action-btn share" onclick="shareReport()">${texts.shareReport}</button>
                            <button class="action-btn print" onclick="window.print()">${lang === 'pt-BR' ? 'Imprimir Relatório' : 'Print Report'}</button>
                        </div>
                    </div>
                    
                    <div class="sidebar-card report-info">
                        <h4>${lang === 'pt-BR' ? 'Informações do Relatório' : 'Report Information'}</h4>
                        <div class="info-list">
                            <div class="info-row">
                                <span class="info-key">${lang === 'pt-BR' ? 'Código:' : 'Code:'}</span>
                                <span class="info-val">REL-${Date.now().toString().slice(-6)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-key">${lang === 'pt-BR' ? 'Data:' : 'Date:'}</span>
                                <span class="info-val">${new Date().toLocaleDateString(config.countrySettings.language)}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-key">${lang === 'pt-BR' ? 'Páginas:' : 'Pages:'}</span>
                                <span class="info-val">12</span>
                            </div>
                            <div class="info-row">
                                <span class="info-key">${lang === 'pt-BR' ? 'Idioma:' : 'Language:'}</span>
                                <span class="info-val">${lang === 'pt-BR' ? 'Português' : 'English'}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="medical-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <h3>Instituto de Análises Científicas</h3>
                    <p>${lang === 'pt-BR' ? 'Compromisso com a verdade científica' : 'Commitment to scientific truth'}</p>
                </div>
                
                <div class="footer-info">
                    <p>&copy; 2024 Instituto de Análises Científicas. ${lang === 'pt-BR' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
                    <p>${texts.disclaimer}</p>
                </div>
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
        templateType: 'expert-review',
        conversionRate: '8-11%',
        strategy: 'Medical/scientific authority review with professional credibility and detailed analysis'
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

/* Medical Header */
.medical-header {
    background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%);
    color: white;
    padding: 20px 0;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.medical-logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-icon {
    font-size: 3rem;
}

.logo-text h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 5px;
}

.logo-text p {
    font-size: 0.9rem;
    opacity: 0.9;
}

.header-badges {
    display: flex;
    gap: 15px;
}

.badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

/* Report Header */
.report-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 40px 0;
}

.report-classification {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.classification-label {
    background: ${primaryColor};
    color: white;
    padding: 8px 20px;
    border-radius: 25px;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.classification-number {
    font-family: 'Courier New', monospace;
    font-weight: 700;
    color: ${primaryColor};
    font-size: 1.1rem;
}

.report-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 30px;
    line-height: 1.2;
}

.report-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
}

.expert-profile {
    display: flex;
    gap: 20px;
}

.expert-photo {
    position: relative;
}

.expert-photo img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.verification-badge {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: #10b981;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    border: 2px solid white;
}

.expert-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 5px;
}

.expert-title {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 15px;
    font-weight: 500;
}

.expert-credentials {
    font-size: 0.85rem;
    color: #64748b;
}

.credential {
    margin-bottom: 3px;
}

.report-stats {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.stat-item {
    text-align: center;
    background: white;
    padding: 20px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-item strong {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 5px;
}

.stat-item span {
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.report-info {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

.info-label {
    font-weight: 600;
    color: #64748b;
}

.info-value {
    color: ${textColor};
}

/* Expert CTA */
.expert-cta {
    background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}cc);
    color: white;
    padding: 25px 0;
}

.cta-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
}

.cta-text h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 8px;
}

.cta-text p {
    font-size: 1rem;
    opacity: 0.9;
}

.expert-cta-button {
    background: white;
    color: ${primaryColor};
    padding: 15px 35px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.expert-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Analysis Content */
.analysis-content {
    padding: 60px 0;
}

.content-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 60px;
}

.main-analysis {
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${primaryColor};
    margin-bottom: 30px;
    border-bottom: 2px solid ${primaryColor};
    padding-bottom: 10px;
}

.overall-assessment {
    margin-bottom: 50px;
}

.assessment-summary {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 40px;
    align-items: center;
}

.overall-score {
    text-align: center;
}

.score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}cc);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.score-number {
    font-size: 2.5rem;
    font-weight: 700;
}

.score-max {
    font-size: 1.5rem;
    opacity: 0.8;
}

.score-label {
    font-size: 1rem;
    font-weight: 700;
    color: ${primaryColor};
    text-transform: uppercase;
    letter-spacing: 1px;
}

.summary-text p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: ${textColor};
}

.analysis-category {
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #e2e8f0;
}

.category-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: ${primaryColor};
    margin-bottom: 20px;
}

.category-header {
    margin-bottom: 20px;
}

.category-score {
    display: flex;
    align-items: center;
    gap: 15px;
}

.score-bar {
    flex: 1;
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
}

.score-fill {
    height: 100%;
    background: linear-gradient(45deg, #10b981, #059669);
    border-radius: 6px;
    transition: width 1s ease;
}

.score-text {
    font-weight: 700;
    color: ${primaryColor};
    min-width: 50px;
}

.category-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

.analysis-text h4 {
    color: ${primaryColor};
    margin-bottom: 10px;
    font-size: 1rem;
    font-weight: 600;
}

.analysis-text p {
    line-height: 1.6;
    color: ${textColor};
}

.recommendation-box {
    background: linear-gradient(135deg, ${primaryColor}11, ${primaryColor}22);
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid ${primaryColor};
}

.recommendation-box h4 {
    color: ${primaryColor};
    margin-bottom: 10px;
    font-size: 1rem;
    font-weight: 600;
}

.recommendation-box p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${textColor};
}

.methodology-section {
    margin: 50px 0;
}

.methodology-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.method-item {
    background: #f8fafc;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
}

.method-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
}

.method-item h4 {
    color: ${primaryColor};
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.method-item p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
}

.final-conclusion {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 40px;
    border-radius: 15px;
    margin-top: 40px;
}

.conclusion-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: center;
}

.conclusion-text {
    font-size: 1.1rem;
    line-height: 1.7;
}

.expert-signature {
    margin-top: 30px;
    display: flex;
    align-items: center;
    gap: 20px;
}

.signature-img {
    height: 60px;
    width: auto;
}

.signature-info {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.4;
}

.conclusion-cta {
    text-align: center;
}

.conclusion-button {
    display: inline-block;
    background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}cc);
    color: white;
    padding: 20px 40px;
    border-radius: 30px;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    margin-bottom: 15px;
}

.conclusion-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cta-note {
    font-size: 0.8rem;
    color: #64748b;
    font-style: italic;
}

/* Sidebar */
.report-sidebar {
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: sticky;
    top: 120px;
    height: fit-content;
}

.sidebar-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.sidebar-card h4 {
    color: ${primaryColor};
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 15px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 10px;
}

.expert-bio p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: ${textColor};
    margin-bottom: 15px;
}

.credentials-list h5 {
    font-size: 0.9rem;
    color: ${primaryColor};
    margin-bottom: 10px;
}

.cert-item {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 5px;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.action-btn.download {
    background: ${primaryColor};
    color: white;
}

.action-btn.share {
    background: #10b981;
    color: white;
}

.action-btn.print {
    background: #64748b;
    color: white;
}

.action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.info-list {
    font-size: 0.9rem;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

.info-key {
    color: #64748b;
    font-weight: 500;
}

.info-val {
    color: ${textColor};
    font-weight: 600;
}

/* Footer */
.medical-footer {
    background: #1e293b;
    color: white;
    padding: 40px 0;
    margin-top: 60px;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-logo h3 {
    font-size: 1.3rem;
    margin-bottom: 8px;
}

.footer-logo p {
    font-size: 0.9rem;
    opacity: 0.8;
}

.footer-info {
    text-align: right;
}

.footer-info p {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 5px;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .medical-logo {
        flex-direction: column;
        gap: 10px;
    }
    
    .header-badges {
        flex-direction: column;
        gap: 10px;
    }
    
    .report-title {
        font-size: 2rem;
    }
    
    .report-meta {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .expert-profile {
        flex-direction: column;
        text-align: center;
    }
    
    .stat-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .cta-content {
        flex-direction: column;
        text-align: center;
    }
    
    .content-layout {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .report-sidebar {
        order: -1;
        position: static;
    }
    
    .main-analysis {
        padding: 25px;
    }
    
    .assessment-summary {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
    }
    
    .category-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .methodology-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .conclusion-content {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
    }
    
    .footer-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .footer-info {
        text-align: center;
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

// Download report functionality
function downloadReport() {
    trackEvent('expert_report_download', {
        product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}',
        expert: 'Dr. Ricardo Oliveira'
    });
    
    // Create a temporary link to download
    const reportContent = document.documentElement.outerHTML;
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-cientifico.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Share report functionality  
function shareReport() {
    trackEvent('expert_report_share', {
        product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}'
    });
    
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Confira esta análise científica completa',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

// Animate score bars on scroll
function animateScoreBars() {
    const scoreBars = document.querySelectorAll('.score-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    scoreBars.forEach(bar => observer.observe(bar));
}

// Reading progress tracking
let readingStartTime = Date.now();
let maxScrollDepth = 0;

function trackReadingProgress() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track reading milestones
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
            trackEvent('reading_milestone', { depth: '25%' });
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
            trackEvent('reading_milestone', { depth: '50%' });
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
            trackEvent('reading_milestone', { depth: '75%' });
        } else if (maxScrollDepth >= 100) {
            const readingTime = Math.round((Date.now() - readingStartTime) / 1000);
            trackEvent('report_completed', { 
                reading_time: readingTime,
                scroll_depth: maxScrollDepth
            });
        }
    }
}

// Credibility signals animation
function animateCredibilitySignals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.method-item, .stat-item, .analysis-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Expert signature animation
function showExpertSignature() {
    const signature = document.querySelector('.signature-img');
    if (signature) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    signature.style.opacity = '1';
                    signature.style.transform = 'scale(1)';
                }
            });
        }, { threshold: 0.5 });
        
        signature.style.opacity = '0';
        signature.style.transform = 'scale(0.8)';
        signature.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(signature);
    }
}

// Time spent on sections tracking
let sectionTimes = {};

function trackSectionTime() {
    const sections = document.querySelectorAll('.analysis-category, .methodology-section, .final-conclusion');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.className;
            
            if (entry.isIntersecting) {
                sectionTimes[sectionId] = Date.now();
            } else if (sectionTimes[sectionId]) {
                const timeSpent = Math.round((Date.now() - sectionTimes[sectionId]) / 1000);
                if (timeSpent > 3) { // Only track if spent more than 3 seconds
                    trackEvent('section_time', {
                        section: sectionId,
                        seconds: timeSpent
                    });
                }
                delete sectionTimes[sectionId];
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
}

// Professional behavior simulation
function simulateProfessionalBehavior() {
    // Simulate report verification
    setTimeout(() => {
        const verificationBadge = document.querySelector('.verification-badge');
        if (verificationBadge) {
            verificationBadge.style.animation = 'pulse 2s infinite';
        }
    }, 3000);
    
    // Add professional styling to key elements
    document.querySelectorAll('.score-number').forEach(score => {
        score.addEventListener('mouseenter', () => {
            score.style.transform = 'scale(1.1)';
            score.style.transition = 'transform 0.3s ease';
        });
        
        score.addEventListener('mouseleave', () => {
            score.style.transform = 'scale(1)';
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Track initial page view
    trackEvent('expert_report_view', {
        product: '${affiliateUrl.includes('hotmart') ? 'hotmart_product' : 'product'}',
        expert: 'Dr. Ricardo Oliveira',
        report_type: 'scientific_analysis'
    });
    
    // Initialize animations and behaviors
    animateScoreBars();
    animateCredibilitySignals();
    showExpertSignature();
    trackSectionTime();
    simulateProfessionalBehavior();
    
    // Track scrolling
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(trackReadingProgress, 100);
    });
    
    // Track CTA interactions
    document.querySelectorAll('a[href*="hotmart"], a[href*="monetizze"], a[href*="eduzz"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const readingTime = Math.round((Date.now() - readingStartTime) / 1000);
            trackEvent('expert_conversion_click', {
                source: 'expert_report',
                reading_time: readingTime,
                scroll_depth: maxScrollDepth,
                location: this.getAttribute('onclick') || 'unknown'
            });
        });
    });
    
    // Track page exit
    window.addEventListener('beforeunload', () => {
        const totalTime = Math.round((Date.now() - readingStartTime) / 1000);
        trackEvent('expert_report_exit', {
            total_time: totalTime,
            max_scroll: maxScrollDepth
        });
    });
});

// Add professional pulse animation
const style = document.createElement('style');
style.textContent = \`
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
\`;
document.head.appendChild(style);
`
  }
}