# Campaign Builder Redesign - Complete Specifications

## Overview
Complete redesign of the Campaign Builder with AI integration, competitive intelligence, and localized content generation using the Metodologia Luiz.

## Status: APPROVED - Ready for Implementation

## 1. INPUT FIELDS CONFIGURATION

### Current vs New Field Structure

#### REMOVE:
- ❌ Commission field (completely removed from UI)

#### KEEP AS-IS:
- ✅ Product Name
- ✅ Product URL
- ✅ Target Country (dropdown with flag + name + currency indicator)

#### MODIFY:
- 🔄 **Target CPA**: Change from number to string type for flexibility
- 🔄 **Keywords**: Enhanced AI suggestions based on competitive intelligence

#### ADD NEW:
1. **URL Base** (Text Input)
   - Purpose: Base URL for campaign tracking
   - Default: Empty
   - Required: Yes

2. **Currency** (Auto-filled Dropdown)
   - Auto-populated based on Target Country selection
   - Options: USD, EUR, BRL
   - Display format: "USD ($)" / "EUR (€)" / "BRL (R$)"
   - Required: Yes

3. **Tipo de Campanha** (Campaign Type Dropdown)
   - **Standard**: General campaigns
   - **COD** (Cash on Delivery): Payment on delivery
   - **Review**: Review-focused campaigns
   - **E-commerce**: Online store campaigns
   - **Produto Restrito**: Restricted products
   - Default: Standard
   - Required: Yes

## 2. CURRENCY CONVERSION SYSTEM

### Auto-Detection Logic:
```
Target Country → Currency Mapping:
- Brasil (BR) → BRL (R$)
- Estados Unidos (US) → USD ($)
- Canadá (CA) → USD ($)
- Reino Unido (UK) → EUR (€)
- França (FR) → EUR (€)
- Alemanha (DE) → EUR (€)
- Espanha (ES) → EUR (€)
- Itália (IT) → EUR (€)
- Portugal (PT) → EUR (€)
- [All other countries] → USD ($)
```

### API Integration:
- Real-time currency conversion API
- Fallback to cached rates if API fails
- Display converted prices in ad copy when applicable

## 3. AI INTEGRATION SPECIFICATIONS

### Primary AI Models:
1. **Claude (Anthropic)**: Primary for creative copywriting
2. **Gemini (Google)**: Secondary for competitive analysis
3. **MultiAI Orchestrator**: Coordinates both models

### AI Behavior Requirements:
- ✅ NO translation explanations in output
- ✅ NO "Google Ads compliant" comments
- ✅ Clean, ready-to-use copy only
- ✅ Character limit compliance built-in
- ✅ Automatic language adaptation based on Target Country
- ✅ Integration with competitive intelligence data

## 4. TEMPLATE DEFINITIONS

### 4.1 HEADLINES (30 characters max)
**Total: 31 templates (7 fixed + 24 dynamic)**

#### Fixed Headlines (Positions 5-7):
1. `"Frete Grátis"` (Position 5)
2. `"Desconto Exclusivo"` (Position 6)
3. `"Site Oficial"` (Position 7)

#### Dynamic Templates (24 options):
1. `"{ProductName} Original"`
2. `"Compre {ProductName}"`
3. `"{ProductName} Oficial"`
4. `"Melhor Preço {ProductName}"`
5. `"{ProductName} com Desconto"`
6. `"Oferta {ProductName}"`
7. `"{ProductName} Entrega Rápida"`
8. `"Comprar {ProductName} Online"`
9. `"{ProductName} Promoção"`
10. `"Site Oficial {ProductName}"`
11. `"{ProductName} Direto"`
12. `"Loja Oficial {ProductName}"`
13. `"{ProductName} Genuíno"`
14. `"Super Oferta {ProductName}"`
15. `"{ProductName} Exclusivo"`
16. `"Melhor {ProductName}"`
17. `"{ProductName} Premium"`
18. `"Oferta Única {ProductName}"`
19. `"{ProductName} Autêntico"`
20. `"Promoção {ProductName}"`
21. `"Desconto {ProductName}"`
22. `"Oferta Especial {ProductName}"`
23. `"Melhores Preços {ProductName}"`
24. `"Liquidação {ProductName}"`

#### Conditional Headlines Logic (OPTION 3 - APPROVED):
**When discount data IS available:**
- Use positions 5-7 as specified above

**When discount data is NOT available:**
- Position 5: Select from substitute bank
- Position 6: Select from substitute bank
- Position 7: Keep "Site Oficial" (always fixed)

**Substitute Bank for Positions 5-6:**
1. `"Melhor Preço"`
2. `"Loja Confiável"`
3. `"Produto Original"`
4. `"Entrega Segura"`
5. `"Compre Hoje Desconto"`
6. `"Oferta Por Tempo Limitado"`
7. `"Aproveite Agora"`
8. `"Últimas Unidades"`
9. `"Promoção Imperdível"`
10. `"Garanta Já Seu Desconto"`

### 4.2 DESCRIPTIONS (90 characters max)
**Total: 9 templates**

1. `"Compre {ProductName} original com frete grátis. Oferta por tempo limitado!"`
2. `"Desconto exclusivo em {ProductName}. Site oficial com entrega rápida."`
3. `"{ProductName} com melhor preço garantido. Compre agora no site oficial!"`
4. `"Oferta especial {ProductName} - Frete grátis para todo Brasil. Aproveite!"`
5. `"Site oficial {ProductName}. Produto original com garantia e desconto exclusivo."`
6. `"Comprar {ProductName} nunca foi tão fácil. Melhor preço e entrega rápida."`
7. `"{ProductName} original direto da loja oficial. Frete grátis acima de R$99."`
8. `"Promoção imperdível {ProductName}. Desconto especial por tempo limitado!"`
9. `"Loja oficial {ProductName} - Produto genuíno, frete grátis e melhor preço."`

### 4.3 SITELINKS (25 characters title / 35 characters description)
**Total: 39 options**

#### Category: Product Information (6 options)
1. **Title:** `"Sobre {ProductName}"` / **Desc:** `"Conheça todos os benefícios"`
2. **Title:** `"Como Funciona"` / **Desc:** `"Veja o passo a passo completo"`
3. **Title:** `"Benefícios"` / **Desc:** `"Descubra todas as vantagens"`
4. **Title:** `"Ingredientes"` / **Desc:** `"Fórmula natural e segura"`
5. **Title:** `"Modo de Uso"` / **Desc:** `"Instruções detalhadas de uso"`
6. **Title:** `"Composição"` / **Desc:** `"Veja a composição completa"`

#### Category: Purchase Process (8 options)
7. **Title:** `"Comprar Agora"` / **Desc:** `"Adquira com desconto exclusivo"`
8. **Title:** `"Ofertas Especiais"` / **Desc:** `"Promoções por tempo limitado"`
9. **Title:** `"Formas de Pagamento"` / **Desc:** `"Cartão, PIX ou boleto"`
10. **Title:** `"Parcele sem Juros"` / **Desc:** `"Até 12x no cartão de crédito"`
11. **Title:** `"Desconto à Vista"` / **Desc:** `"15% off pagamento à vista"`
12. **Title:** `"Kits com Desconto"` / **Desc:** `"Compre mais e pague menos"`
13. **Title:** `"Cupom de Desconto"` / **Desc:** `"Use o código e ganhe 20% off"`
14. **Title:** `"Cashback"` / **Desc:** `"Ganhe dinheiro de volta"`

#### Category: Shipping & Delivery (8 options)
15. **Title:** `"Frete Grátis"` / **Desc:** `"Entrega gratuita em todo país"`
16. **Title:** `"Entrega Expressa"` / **Desc:** `"Receba em até 2 dias úteis"`
17. **Title:** `"Rastrear Pedido"` / **Desc:** `"Acompanhe sua encomenda"`
18. **Title:** `"Entrega Rápida"` / **Desc:** `"Prazo de entrega reduzido"`
19. **Title:** `"Regiões Atendidas"` / **Desc:** `"Entregamos em todo território"`
20. **Title:** `"Envio Imediato"` / **Desc:** `"Postado em até 24 horas"`
21. **Title:** `"Opções de Entrega"` / **Desc:** `"Normal, expressa ou agendada"`
22. **Title:** `"Frete Calculado"` / **Desc:** `"Calcule o frete por CEP"`

#### Category: Trust & Support (9 options)
23. **Title:** `"Garantia"` / **Desc:** `"30 dias para devolução"`
24. **Title:** `"Suporte 24h"` / **Desc:** `"Atendimento sempre disponível"`
25. **Title:** `"Política de Troca"` / **Desc:** `"Troca fácil e sem burocracia"`
26. **Title:** `"Empresa Confiável"` / **Desc:** `"Mais de 10 anos no mercado"`
27. **Title:** `"Certificações"` / **Desc:** `"Produtos certificados"`
28. **Title:** `"Segurança"` / **Desc:** `"Site seguro e protegido"`
29. **Title:** `"Privacidade"` / **Desc:** `"Seus dados estão seguros"`
30. **Title:** `"Devolução Grátis"` / **Desc:** `"Não gostou? Devolvemos grátis"`
31. **Title:** `"Chat Online"` / **Desc:** `"Fale conosco agora mesmo"`

#### Category: Social Proof (8 options)
32. **Title:** `"Depoimentos"` / **Desc:** `"Veja o que dizem os clientes"`
33. **Title:** `"Avaliações"` / **Desc:** `"5 estrelas dos consumidores"`
34. **Title:** `"Casos de Sucesso"` / **Desc:** `"Histórias reais de clientes"`
35. **Title:** `"Antes e Depois"` / **Desc:** `"Veja os resultados reais"`
36. **Title:** `"Prêmios Recebidos"` / **Desc:** `"Produto premiado nacional"`
37. **Title:** `"Mídia e Imprensa"` / **Desc:** `"Falaram sobre nós na TV"`
38. **Title:** `"Influenciadores"` / **Desc:** `"Aprovado por especialistas"`
39. **Title:** `"Comunidade"` / **Desc:** `"Junte-se aos usuários"`

### 4.4 CALLOUTS (25 characters max)
**Total: 17 options**

1. `"Frete Grátis"`
2. `"Entrega Rápida"`
3. `"Site Oficial"`
4. `"Melhor Preço"`
5. `"Desconto Exclusivo"`
6. `"Garantia 30 dias"`
7. `"Suporte 24h"`
8. `"Sem Taxa Extra"`
9. `"Produto Original"`
10. `"Cashback"`
11. `"Parcela sem Juros"`
12. `"Devolução Grátis"`
13. `"Empresa Confiável"`
14. `"Atendimento VIP"`
15. `"Entrega Expressa"`
16. `"Compra Segura"`
17. `"Oferta Limitada"`

### 4.5 SNIPPETS (25 characters max)
**Total: 29 options**

1. `"Site Oficial"`
2. `"Melhor Preço"`
3. `"Frete Grátis"`
4. `"Entrega Rápida"`
5. `"Produto Original"`
6. `"Desconto Exclusivo"`
7. `"Garantia Total"`
8. `"Suporte 24h"`
9. `"Sem Taxa"`
10. `"Cashback"`
11. `"Parcele sem Juros"`
12. `"Devolução Grátis"`
13. `"Empresa Confiável"`
14. `"Compra Protegida"`
15. `"Certificado"`
16. `"Premiado"`
17. `"Recomendado"`
18. `"Mais Vendido"`
19. `"Novidade"`
20. `"Exclusivo"`
21. `"Limitado"`
22. `"Promoção"`
23. `"Oferta Especial"`
24. `"Liquidação"`
25. `"Imperdível"`
26. `"Aproveite"`
27. `"Últimas Unidades"`
28. `"Por Tempo Limitado"`
29. `"Não Perca"`

## 5. COMPETITIVE INTELLIGENCE SYSTEM

### Multi-Browser Search Strategy:
1. **Chrome** (Desktop)
2. **Firefox** (Desktop)
3. **Safari** (Desktop)
4. **Edge** (Desktop)
5. **Chrome Mobile** (Android simulation)
6. **Safari Mobile** (iOS simulation)

### Data Collection Points:
- ✅ Competitor ad copy and positioning
- ✅ Pricing strategies and offers
- ✅ Headlines and messaging patterns
- ✅ Sitelinks and extensions used
- ✅ Landing page analysis
- ✅ Ad placement patterns
- ✅ Ads Transparency data monitoring

### Integration Points:
- Feed insights into AI headline generation
- Inform pricing strategy recommendations
- Generate competitive positioning suggestions
- Monitor competitor changes in real-time

## 6. BILINGUAL CSV EXPORT SYSTEM

### Dual Export Strategy:
1. **Standard Google Ads CSVs** (for direct upload)
2. **Consolidated Bilingual CSV** (for validation and control)

### Consolidated CSV Structure:
| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| **Tipo** | Categoria do conteúdo | "Headlines", "Descriptions", "Sitelinks", etc. |
| **Conteúdo_Local** | Texto no idioma de destino | "Najlepsza Cena" (polonês) |
| **Caracteres** | Contagem de caracteres | "13" |
| **Categoria** | Tipo de apelo | "Preço", "Urgência", "Escassez", "Confiança" |
| **Conteúdo_EN** | Tradução em inglês | "Best Price" |
| **Posição** | Posição no template | "Fixo 5", "Dinâmico 3", etc. |

### Example Output (Polonia/Polish):
```csv
Tipo,Conteúdo_Local,Caracteres,Categoria,Conteúdo_EN,Posição
Headlines,Najlepsza Cena,13,Preço,Best Price,Fixo 5
Headlines,Bezpłatna Dostawa,17,Benefício,Free Shipping,Fixo 1
Headlines,Kup Dziś Zniżka,15,Urgência,Buy Today Discount,Substituto 5
Headlines,Ostatnie Sztuki,15,Escassez,Last Units,Substituto 8
Descriptions,Kup oryginalny {ProductName} z bezpłatną dostawą,52,Promocional,Buy original {ProductName} with free shipping,Template 1
Sitelinks - Title,Informacje o Produkcie,21,Informativo,Product Information,Template 1
Sitelinks - Desc,Poznaj wszystkie korzyści,25,Benefício,Learn all benefits,Template 1
Callouts,Oficjalna Strona,16,Confiança,Official Site,Template 3
Snippets,Najlepsza Cena,13,Preço,Best Price,Template 2
```

### Categories Mapping:
- **Preço**: Price-related appeals
- **Urgência**: Time-sensitive offers
- **Escassez**: Scarcity/limited availability
- **Confiança**: Trust and credibility
- **Benefício**: Product benefits
- **Promocional**: General promotional content
- **Informativo**: Information/educational content

### File Generation:
- **Standard CSVs**: `campaign_headlines_PL.csv`, `campaign_descriptions_PL.csv`, etc.
- **Consolidated**: `campaign_master_control_PL_EN.csv`
- **Auto-naming**: Based on target country code

## 7. TRACKING & ANALYTICS SYSTEM

### Google Ads Integration:
- **Dynamic Keyword Insertion**: `{KeyWord:Default Text}`
- **Location Insertion**: `{Location:Default Location}`
- **Campaign-level tracking parameters**
- **Conversion tracking setup**

### Custom Tracking:
- **UTM Parameters**: Auto-generated based on campaign data
- **Click ID Tracking**: Google Click ID (GCLID) integration
- **Conversion Attribution**: Cross-device tracking
- **Performance Metrics**: Real-time campaign monitoring

## 7. LANGUAGE & LOCALIZATION

### Supported Languages:
- **Portuguese (BR)**: Brasil
- **Portuguese (PT)**: Portugal
- **English (US)**: United States, Canada
- **English (UK)**: United Kingdom
- **Spanish (ES)**: Spain
- **Spanish (LATAM)**: Mexico, Argentina, Colombia, Chile
- **French (FR)**: France
- **German (DE)**: Germany, Austria
- **Italian (IT)**: Italy

### Localization Features:
- Currency-appropriate messaging
- Cultural adaptation of offers
- Local shipping/delivery terms
- Country-specific trust signals
- Regulatory compliance per region

## 8. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure ✅ READY
- Input field modifications
- Currency system implementation
- Basic AI integration
- Template system setup

### Phase 2: AI Enhancement
- MultiAI Orchestrator integration
- Competitive intelligence connection
- Advanced localization features
- Performance optimization

### Phase 3: Advanced Features
- Real-time competitive monitoring
- Advanced analytics dashboard
- A/B testing framework
- Automated optimization suggestions

## 9. TECHNICAL SPECIFICATIONS

### Frontend Changes:
- **File**: `src/components/campaign/CampaignForm.tsx`
- **Modifications**: Remove commission field, add new fields
- **New Components**: Currency selector, Campaign type dropdown

### Backend Changes:
- **File**: `src/app/api/v1/campaign/route.ts`
- **Modifications**: Updated validation, AI integration
- **New Services**: Currency converter, Template selector

### AI Integration:
- **File**: `src/lib/ai/multi-ai-orchestrator.ts`
- **Status**: ✅ Fixed and working
- **Features**: Clean output parsing, no explanatory text

### Database Schema Updates:
```typescript
interface CampaignData {
  // Existing fields
  productName: string;
  productUrl: string;
  targetCountry: string;
  keywords: string[];
  targetCpa: string; // Changed from number to string

  // New fields
  urlBase: string;
  currency: 'USD' | 'EUR' | 'BRL';
  campaignType: 'Standard' | 'COD' | 'Review' | 'E-commerce' | 'Produto Restrito';

  // Generated content
  headlines: string[];
  descriptions: string[];
  sitelinks: Array<{title: string, description: string}>;
  callouts: string[];
  snippets: string[];
}
```

## 10. VALIDATION RULES

### Field Validation:
- **Product Name**: 1-50 characters
- **Product URL**: Valid URL format
- **URL Base**: Valid URL format
- **Target CPA**: Numeric string with currency prefix
- **Keywords**: 1-20 keywords, max 80 chars each

### Content Validation:
- **Headlines**: Exactly 30 characters
- **Descriptions**: Exactly 90 characters
- **Sitelinks**: Title 25 chars, Description 35 chars
- **Callouts**: Exactly 25 characters
- **Snippets**: Exactly 25 characters

### AI Output Validation:
- No translation explanations
- No compliance comments
- Character limits enforced
- Language consistency
- Template compliance

## 11. SUCCESS METRICS

### Performance KPIs:
- **AI Generation Accuracy**: >95% character limit compliance
- **Template Coverage**: 100% template utilization
- **Localization Quality**: Language-appropriate content
- **Competitive Intelligence**: Real-time data freshness
- **User Experience**: <3 seconds generation time

### Business Metrics:
- Campaign creation time reduction
- Ad performance improvement
- Cost per acquisition optimization
- User satisfaction scores

---

## APPROVED FOR IMPLEMENTATION
**Date**: Current Session
**Status**: ✅ All specifications confirmed
**Next Step**: Create development branch and begin implementation

**Key Decision**: Option 3 (Substitute Bank) approved for conditional headlines

---

*This document preserves all work completed in the specification phase and serves as the definitive guide for Campaign Builder redesign implementation.*