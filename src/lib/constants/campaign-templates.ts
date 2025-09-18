// Campaign Builder Templates - Complete Specification Implementation

export interface HeadlineTemplate {
  id: number
  template: string
  type: 'fixed' | 'dynamic' | 'substitute'
  position?: number
  category: 'Preço' | 'Urgência' | 'Escassez' | 'Confiança' | 'Benefício' | 'Promocional' | 'Informativo'
}

export interface DescriptionTemplate {
  id: number
  template: string
  category: 'Promocional' | 'Informativo' | 'Benefício'
}

export interface SitelinkTemplate {
  id: number
  title: string
  description: string
  category: 'Product Information' | 'Purchase Process' | 'Shipping & Delivery' | 'Trust & Support' | 'Social Proof'
}

// HEADLINES - 31 templates total (7 fixed + 24 dynamic)
export const HEADLINE_TEMPLATES: HeadlineTemplate[] = [
  // DYNAMIC TEMPLATES (24 options)
  { id: 1, template: "{ProductName} Original", type: 'dynamic', category: 'Confiança' },
  { id: 2, template: "Compre {ProductName}", type: 'dynamic', category: 'Promocional' },
  { id: 3, template: "{ProductName} Oficial", type: 'dynamic', category: 'Confiança' },
  { id: 4, template: "Melhor Preço {ProductName}", type: 'dynamic', category: 'Preço' },
  { id: 5, template: "{ProductName} com Desconto", type: 'dynamic', category: 'Preço' },
  { id: 6, template: "Oferta {ProductName}", type: 'dynamic', category: 'Promocional' },
  { id: 7, template: "{ProductName} Entrega Rápida", type: 'dynamic', category: 'Benefício' },
  { id: 8, template: "Comprar {ProductName} Online", type: 'dynamic', category: 'Promocional' },
  { id: 9, template: "{ProductName} Promoção", type: 'dynamic', category: 'Promocional' },
  { id: 10, template: "Site Oficial {ProductName}", type: 'dynamic', category: 'Confiança' },
  { id: 11, template: "{ProductName} Direto", type: 'dynamic', category: 'Confiança' },
  { id: 12, template: "Loja Oficial {ProductName}", type: 'dynamic', category: 'Confiança' },
  { id: 13, template: "{ProductName} Genuíno", type: 'dynamic', category: 'Confiança' },
  { id: 14, template: "Super Oferta {ProductName}", type: 'dynamic', category: 'Promocional' },
  { id: 15, template: "{ProductName} Exclusivo", type: 'dynamic', category: 'Promocional' },
  { id: 16, template: "Melhor {ProductName}", type: 'dynamic', category: 'Preço' },
  { id: 17, template: "{ProductName} Premium", type: 'dynamic', category: 'Confiança' },
  { id: 18, template: "Oferta Única {ProductName}", type: 'dynamic', category: 'Escassez' },
  { id: 19, template: "{ProductName} Autêntico", type: 'dynamic', category: 'Confiança' },
  { id: 20, template: "Promoção {ProductName}", type: 'dynamic', category: 'Promocional' },
  { id: 21, template: "Desconto {ProductName}", type: 'dynamic', category: 'Preço' },
  { id: 22, template: "Oferta Especial {ProductName}", type: 'dynamic', category: 'Promocional' },
  { id: 23, template: "Melhores Preços {ProductName}", type: 'dynamic', category: 'Preço' },
  { id: 24, template: "Liquidação {ProductName}", type: 'dynamic', category: 'Preço' },

  // FIXED HEADLINES (Positions 5-7)
  { id: 25, template: "Frete Grátis", type: 'fixed', position: 5, category: 'Benefício' },
  { id: 26, template: "Desconto Exclusivo", type: 'fixed', position: 6, category: 'Preço' },
  { id: 27, template: "Site Oficial", type: 'fixed', position: 7, category: 'Confiança' },

  // SUBSTITUTE BANK (For when discount data is NOT available)
  { id: 28, template: "Melhor Preço", type: 'substitute', category: 'Preço' },
  { id: 29, template: "Loja Confiável", type: 'substitute', category: 'Confiança' },
  { id: 30, template: "Produto Original", type: 'substitute', category: 'Confiança' },
  { id: 31, template: "Entrega Segura", type: 'substitute', category: 'Confiança' },
  { id: 32, template: "Compre Hoje Desconto", type: 'substitute', category: 'Urgência' },
  { id: 33, template: "Oferta Por Tempo Limitado", type: 'substitute', category: 'Urgência' },
  { id: 34, template: "Aproveite Agora", type: 'substitute', category: 'Urgência' },
  { id: 35, template: "Últimas Unidades", type: 'substitute', category: 'Escassez' },
  { id: 36, template: "Promoção Imperdível", type: 'substitute', category: 'Promocional' },
  { id: 37, template: "Garanta Já Seu Desconto", type: 'substitute', category: 'Urgência' }
]

// DESCRIPTIONS - 9 templates (90 characters max)
export const DESCRIPTION_TEMPLATES: DescriptionTemplate[] = [
  { id: 1, template: "Compre {ProductName} original com frete grátis. Oferta por tempo limitado!", category: 'Promocional' },
  { id: 2, template: "Desconto exclusivo em {ProductName}. Site oficial com entrega rápida.", category: 'Promocional' },
  { id: 3, template: "{ProductName} com melhor preço garantido. Compre agora no site oficial!", category: 'Promocional' },
  { id: 4, template: "Oferta especial {ProductName} - Frete grátis para todo Brasil. Aproveite!", category: 'Promocional' },
  { id: 5, template: "Site oficial {ProductName}. Produto original com garantia e desconto exclusivo.", category: 'Informativo' },
  { id: 6, template: "Comprar {ProductName} nunca foi tão fácil. Melhor preço e entrega rápida.", category: 'Benefício' },
  { id: 7, template: "{ProductName} original direto da loja oficial. Frete grátis acima de R$99.", category: 'Benefício' },
  { id: 8, template: "Promoção imperdível {ProductName}. Desconto especial por tempo limitado!", category: 'Promocional' },
  { id: 9, template: "Loja oficial {ProductName} - Produto genuíno, frete grátis e melhor preço.", category: 'Informativo' }
]

// SITELINKS - 39 options (25 char title / 35 char description)
export const SITELINK_TEMPLATES: SitelinkTemplate[] = [
  // Product Information (6 options)
  { id: 1, title: "Sobre {ProductName}", description: "Conheça todos os benefícios", category: 'Product Information' },
  { id: 2, title: "Como Funciona", description: "Veja o passo a passo completo", category: 'Product Information' },
  { id: 3, title: "Benefícios", description: "Descubra todas as vantagens", category: 'Product Information' },
  { id: 4, title: "Ingredientes", description: "Fórmula natural e segura", category: 'Product Information' },
  { id: 5, title: "Modo de Uso", description: "Instruções detalhadas de uso", category: 'Product Information' },
  { id: 6, title: "Composição", description: "Veja a composição completa", category: 'Product Information' },

  // Purchase Process (8 options)
  { id: 7, title: "Comprar Agora", description: "Adquira com desconto exclusivo", category: 'Purchase Process' },
  { id: 8, title: "Ofertas Especiais", description: "Promoções por tempo limitado", category: 'Purchase Process' },
  { id: 9, title: "Formas de Pagamento", description: "Cartão, PIX ou boleto", category: 'Purchase Process' },
  { id: 10, title: "Parcele sem Juros", description: "Até 12x no cartão de crédito", category: 'Purchase Process' },
  { id: 11, title: "Desconto à Vista", description: "15% off pagamento à vista", category: 'Purchase Process' },
  { id: 12, title: "Kits com Desconto", description: "Compre mais e pague menos", category: 'Purchase Process' },
  { id: 13, title: "Cupom de Desconto", description: "Use o código e ganhe 20% off", category: 'Purchase Process' },
  { id: 14, title: "Cashback", description: "Ganhe dinheiro de volta", category: 'Purchase Process' },

  // Shipping & Delivery (8 options)
  { id: 15, title: "Frete Grátis", description: "Entrega gratuita em todo país", category: 'Shipping & Delivery' },
  { id: 16, title: "Entrega Expressa", description: "Receba em até 2 dias úteis", category: 'Shipping & Delivery' },
  { id: 17, title: "Rastrear Pedido", description: "Acompanhe sua encomenda", category: 'Shipping & Delivery' },
  { id: 18, title: "Entrega Rápida", description: "Prazo de entrega reduzido", category: 'Shipping & Delivery' },
  { id: 19, title: "Regiões Atendidas", description: "Entregamos em todo território", category: 'Shipping & Delivery' },
  { id: 20, title: "Envio Imediato", description: "Postado em até 24 horas", category: 'Shipping & Delivery' },
  { id: 21, title: "Opções de Entrega", description: "Normal, expressa ou agendada", category: 'Shipping & Delivery' },
  { id: 22, title: "Frete Calculado", description: "Calcule o frete por CEP", category: 'Shipping & Delivery' },

  // Trust & Support (9 options)
  { id: 23, title: "Garantia", description: "30 dias para devolução", category: 'Trust & Support' },
  { id: 24, title: "Suporte 24h", description: "Atendimento sempre disponível", category: 'Trust & Support' },
  { id: 25, title: "Política de Troca", description: "Troca fácil e sem burocracia", category: 'Trust & Support' },
  { id: 26, title: "Empresa Confiável", description: "Mais de 10 anos no mercado", category: 'Trust & Support' },
  { id: 27, title: "Certificações", description: "Produtos certificados", category: 'Trust & Support' },
  { id: 28, title: "Segurança", description: "Site seguro e protegido", category: 'Trust & Support' },
  { id: 29, title: "Privacidade", description: "Seus dados estão seguros", category: 'Trust & Support' },
  { id: 30, title: "Devolução Grátis", description: "Não gostou? Devolvemos grátis", category: 'Trust & Support' },
  { id: 31, title: "Chat Online", description: "Fale conosco agora mesmo", category: 'Trust & Support' },

  // Social Proof (8 options)
  { id: 32, title: "Depoimentos", description: "Veja o que dizem os clientes", category: 'Social Proof' },
  { id: 33, title: "Avaliações", description: "5 estrelas dos consumidores", category: 'Social Proof' },
  { id: 34, title: "Casos de Sucesso", description: "Histórias reais de clientes", category: 'Social Proof' },
  { id: 35, title: "Antes e Depois", description: "Veja os resultados reais", category: 'Social Proof' },
  { id: 36, title: "Prêmios Recebidos", description: "Produto premiado nacional", category: 'Social Proof' },
  { id: 37, title: "Mídia e Imprensa", description: "Falaram sobre nós na TV", category: 'Social Proof' },
  { id: 38, title: "Influenciadores", description: "Aprovado por especialistas", category: 'Social Proof' },
  { id: 39, title: "Comunidade", description: "Junte-se aos usuários", category: 'Social Proof' }
]

// CALLOUTS - 17 options (25 characters max)
export const CALLOUT_TEMPLATES: string[] = [
  "Frete Grátis",
  "Entrega Rápida",
  "Site Oficial",
  "Melhor Preço",
  "Desconto Exclusivo",
  "Garantia 30 dias",
  "Suporte 24h",
  "Sem Taxa Extra",
  "Produto Original",
  "Cashback",
  "Parcela sem Juros",
  "Devolução Grátis",
  "Empresa Confiável",
  "Atendimento VIP",
  "Entrega Expressa",
  "Compra Segura",
  "Oferta Limitada"
]

// SNIPPETS - 29 options (25 characters max)
export const SNIPPET_TEMPLATES: string[] = [
  "Site Oficial",
  "Melhor Preço",
  "Frete Grátis",
  "Entrega Rápida",
  "Produto Original",
  "Desconto Exclusivo",
  "Garantia Total",
  "Suporte 24h",
  "Sem Taxa",
  "Cashback",
  "Parcele sem Juros",
  "Devolução Grátis",
  "Empresa Confiável",
  "Compra Protegida",
  "Certificado",
  "Premiado",
  "Recomendado",
  "Mais Vendido",
  "Novidade",
  "Exclusivo",
  "Limitado",
  "Promoção",
  "Oferta Especial",
  "Liquidação",
  "Imperdível",
  "Aproveite",
  "Últimas Unidades",
  "Por Tempo Limitado",
  "Não Perca"
]

// CAMPAIGN TYPES
export const CAMPAIGN_TYPES = [
  { value: 'Standard', label: 'Standard - Campanhas gerais', available: true },
  { value: 'COD', label: 'COD - Cash on Delivery (Pagamento na Entrega)', available: true },
  { value: 'Review', label: 'Review - Focadas em avaliações (Em breve)', available: false },
  { value: 'E-commerce', label: 'E-commerce - Lojas online (Em breve)', available: false },
  { value: 'Produto Restrito', label: 'Produto Restrito - Produtos especiais (Em breve)', available: false }
] as const

// COD-SPECIFIC TEMPLATES (Cash on Delivery adaptations)
export const COD_HEADLINE_ADAPTATIONS: string[] = [
  "Pague na Entrega", // Pay on Delivery
  "Sem Cartão", // No Card Required
  "Pagamento Seguro", // Secure Payment
  "COD Disponível", // COD Available
  "Entrega e Pagamento", // Delivery & Payment
  "Zero Risco", // Zero Risk
  "Teste Sem Pagar", // Test Without Paying
  "Sem Antecipação", // No Advance Payment
  "Pagamento na Porta", // Payment at Door
  "Confiança Total" // Total Trust
]

export const COD_DESCRIPTION_ADAPTATIONS: string[] = [
  "Pague apenas na entrega do produto. Sem risco, compra 100% segura!",
  "Cash on Delivery disponível. Teste o produto antes de pagar definitivamente.",
  "Pagamento na entrega - máxima segurança. Receba, confira e pague depois.",
  "COD: Pague somente quando receber. Sistema seguro para sua tranquilidade.",
  "Sem cartão, sem antecipação. Pague apenas quando o produto chegar em casa."
]

export const COD_CALLOUTS: string[] = [
  "Pague na Entrega",
  "COD Disponível",
  "Sem Cartão",
  "Zero Risco",
  "Pagamento Seguro",
  "Teste Primeiro",
  "Sem Antecipação",
  "Confiança Total"
]

// HELPER FUNCTIONS
export function getHeadlinesByType(type: 'fixed' | 'dynamic' | 'substitute'): HeadlineTemplate[] {
  return HEADLINE_TEMPLATES.filter(h => h.type === type)
}

export function getFixedHeadlines(): HeadlineTemplate[] {
  return HEADLINE_TEMPLATES.filter(h => h.type === 'fixed').sort((a, b) => (a.position || 0) - (b.position || 0))
}

export function getSubstituteHeadlines(): HeadlineTemplate[] {
  return HEADLINE_TEMPLATES.filter(h => h.type === 'substitute')
}

export function getSitelinksByCategory(category: string): SitelinkTemplate[] {
  return SITELINK_TEMPLATES.filter(s => s.category === category)
}