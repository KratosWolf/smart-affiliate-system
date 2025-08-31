# 🎯 ESTRATÉGIA DE CAMPANHAS v1.2 - ATUALIZADA

## ⚡ **NOVA FILOSOFIA: SIMPLES E AGRESSIVA**

### 💰 **Budget Strategy (ATUALIZADO)**
- **Budget Mínimo:** R$ 350,00 (fixo para todos os testes)
- **Budget Máximo:** R$ 1.750,00 (5x o inicial)
- **CPA Target:** até 110% da margem estimada (mais agressivo que antes)
- **Conversão USD:** ~$64 (assumindo 1 USD = 5.5 BRL)

### 📊 **Estrutura Confirmada**
```
1 Campaign = 1 Ad
├── Campaign: "ProductName - Country - Teste CPA"
├── Budget: R$ 350,00 (fixo)
├── Target CPA: 110% da margem
├── Keywords: 3-5 palavras (exact/phrase/broad)
└── Ad: 1 Responsive Search Ad
```

**IMPORTANTE:** NÃO múltiplas campanhas por anúncio (estrutura simples)

### 🚀 **Scaling Automático**
```javascript
const scalingRules = {
  scaleUp: {
    condition: "ROI > 2.0",
    action: "Aumenta 20% budget",
    frequency: "A cada 24h"
  },
  scaleDown: {
    condition: "ROI < 0.5", 
    action: "Pausa campanha",
    frequency: "A cada 12h"
  },
  maxBudget: "R$ 1.750,00 (5x inicial)"
}
```

### 🎪 **Budget Progression Example**
```
Dia 1: R$ 350,00 (inicial)
Dia 2: R$ 420,00 (ROI > 2.0 → +20%)
Dia 3: R$ 504,00 (ROI > 2.0 → +20%)
Dia 4: R$ 604,80 (ROI > 2.0 → +20%)
Dia 5: R$ 725,76 (ROI > 2.0 → +20%)
...
Max: R$ 1.750,00 (limite)
```

## 🏗️ **Implementação Técnica**

### 1. Campaign Builder Updates
```typescript
interface CampaignBudget {
  dailyBudget: 350; // FIXO em R$
  targetCpa: margin * 1.1; // 110% da margem
  scalingStrategy: {
    minBudget: 350;
    maxBudget: 1750; // 5x inicial
    scaleThreshold: 2.0; // ROI
    scaleIncrement: 0.2; // 20%
  };
}
```

### 2. Keyword Strategy
```javascript
const keywords = [
  `[${productName}]`, // Exact match
  `"${productName} review"`, // Phrase match
  `${productName}`, // Broad match
  `"${productName} scam"`, // Brand defense
  `"best ${category}"` // Category terms
];
```

### 3. Ad Copy Framework
```javascript
const adStructure = {
  headlines: [
    `${productName}® Official - 60% Off Today`,
    `${productName} Reviews - Real Results 2025`,
    `Is ${productName} Scam? Truth Revealed`
  ],
  descriptions: [
    `Limited offer: Get ${productName} with 90-day guarantee.`,
    `See why 10,000+ customers chose ${productName} over alternatives.`
  ]
};
```

## 📋 **Workflow Operacional**

### Fase 1: Setup (5 min)
1. ✅ Produto validado (score > 70)
2. ✅ Budget: R$ 350,00 configurado
3. ✅ CPA target: 110% margem calculada
4. ✅ Keywords geradas (3-5)
5. ✅ Ad copy otimizada

### Fase 2: Launch (1 min)
1. ✅ Campanha criada no Google Ads
2. ✅ Tracking configurado
3. ✅ CSV exportado
4. ✅ Presell linkada

### Fase 3: Monitoring (24h)
1. ✅ ROI tracking ativo
2. ✅ Auto-scaling em standby
3. ✅ Kill rule monitorada
4. ✅ Performance alerts

### Fase 4: Scaling (ongoing)
- ROI > 2.0 → +20% budget automático
- ROI < 0.5 → Pausa automática
- Budget cap: R$ 1.750,00

## 🎯 **KPIs de Sucesso**

### Métricas Primárias
- **Target ROI:** > 2.0 (200%)
- **Target CPA:** ≤ 110% da margem
- **Budget Utilization:** 90-100%
- **Campaign Uptime:** > 80%

### Métricas Secundárias
- **CTR:** > 2% (Google Ads Search)
- **Conversion Rate:** > 1%
- **Quality Score:** ≥ 7/10
- **Time to First Sale:** < 48h

## 🔧 **Configurações Técnicas**

### Google Ads Settings
```javascript
const campaignSettings = {
  campaignType: "SEARCH",
  biddingStrategy: "TARGET_CPA",
  budget: 350, // R$ or $64 USD
  targetCpa: commission * 1.1,
  locations: ["Brazil", "United States"],
  languages: ["Portuguese", "English"],
  adSchedule: "24/7",
  deviceBidAdjustments: {
    mobile: "+20%",
    desktop: "baseline",
    tablet: "-10%"
  }
};
```

### Tracking Configuration
```javascript
const tracking = {
  conversionAction: "Purchase",
  conversionValue: commission,
  countingType: "ONE_PER_CLICK",
  attributionModel: "LAST_CLICK",
  lookbackWindow: "30 days"
};
```

## 📝 **Checklist de Lançamento**

### Pre-Launch
- [ ] Budget R$ 350,00 configurado
- [ ] CPA 110% margem definida
- [ ] Keywords pesquisadas e validadas
- [ ] Ad copy character-perfect
- [ ] Presell page funcionando
- [ ] Tracking pixels instalados

### Launch Day
- [ ] Campanha aprovada Google Ads
- [ ] Primeiro clique registrado
- [ ] Tracking funcionando
- [ ] ROI dashboard ativo

### Post-Launch (48h)
- [ ] Primeiras métricas coletadas
- [ ] Performance vs target analisada
- [ ] Scaling rules aplicadas
- [ ] Otimizações necessárias identificadas

---

## 💡 **Próximos Upgrades**

### v1.3 Features Planejadas
1. **Multi-Geo Scaling** - Clone campanhas vencedoras para outros países
2. **Creative Rotation** - A/B test automático de ad copy
3. **Competitor Monitoring** - Alertas quando concorrentes lançam novos ads
4. **Smart Bidding** - ML para otimização de lances
5. **Budget Optimization** - Redistribuição automática entre campanhas

### Integrations Roadmap
- [ ] Facebook Ads (opcional)
- [ ] TikTok Ads (futuro)
- [ ] Microsoft Ads (Bing)
- [ ] Amazon DSP (produtos físicos)

---

**RESUMO EXECUTIVO:** Estratégia simplificada com budget fixo R$ 350,00, CPA agressivo 110% margem, estrutura 1:1, scaling automático baseado em ROI 2.0+. Sistema pronto para produção imediata.