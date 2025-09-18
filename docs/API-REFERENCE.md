# 🔌 API REFERENCE - SMART AFFILIATE SYSTEM

## 🎯 **GOOGLE ADS FOCUS - APIs Testadas e Funcionando**

**Base URL Local**: `http://localhost:3847`  
**Base URL Produção**: `https://smartaffiliatesystem.site`

---

## 📊 **CAMPAIGN BUILDER API** ✅ 100% Funcional

### **Endpoint**: `POST /api/v1/campaign`

**Descrição**: Gera campanhas Google Ads com CSV pronto para import

**Payload Exemplo**:
```json
{
  "productName": "GlicoShield",
  "targetCountry": "US",
  "platform": "SMARTADV",
  "commissionValue": 100,
  "currency": "USD",
  "productDescription": "Blood sugar support supplement",
  "discountPercentage": 50,
  "productPrice": 49,
  "guaranteePeriod": "60 days",
  "deliveryType": "Free Shipping",
  "exportFormat": "csv",
  "useLuizMethod": true
}
```

**Response Exemplo**:
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "campaign-1757704680138-5o7k5he1f",
      "name": "GlicoShield - US - 2025-09-12 - SMARTADV - $100",
      "budget": 70,
      "targetCpa": 45,
      "locations": ["US"],
      "status": "draft"
    },
    "keywords": [
      {"text": "glicoshield", "matchType": "BROAD"},
      {"text": "GLICOSHIELD", "matchType": "BROAD"}
    ],
    "csvData": {
      "campaignStructure": "Campaign,Campaign Type,Status,Budget...",
      "keywords": "Keyword,Match Type,Status...",
      "ads": "Headlines,Descriptions...",
      "sitelinks": "Sitelink,Category...",
      "callouts": "Callout,Category...",
      "snippets": "Snippet,Category..."
    },
    "methodology": "LUIZ_OFFICIAL"
  }
}
```

**Metodologia Luiz Implementada**:
- ✅ 12 Headlines contextuais
- ✅ 4 Descriptions otimizadas
- ✅ Keywords: `productname` + `PRODUCTNAME`
- ✅ Budget automático: max(70, comissão * 3.5)
- ✅ CPA Target: 45% da comissão
- ✅ 6 CSVs prontos para Google Ads

---

## 🎨 **PRESELL GENERATOR API** ✅ 90% Funcional

### **Endpoint**: `POST /api/v1/presell`

**Descrição**: Gera presells HTML completas otimizadas para conversão

**Payload Exemplo**:
```json
{
  "validation": {
    "id": "test-123",
    "productName": "GlicoShield",
    "productUrl": "https://go.hotmart.com/test123",
    "targetCountry": "US",
    "validationScore": 85,
    "status": "completed",
    "productData": {
      "title": "GlicoShield",
      "description": "Blood sugar support supplement",
      "price": 49,
      "currency": "USD",
      "images": [],
      "category": "Health"
    }
  },
  "affiliateUrl": "https://go.hotmart.com/test123",
  "template": "cookie",
  "exportFormat": "html"
}
```

**Response Exemplo**:
```json
{
  "success": true,
  "data": {
    "productName": "GlicoShield",
    "targetCountry": "US",
    "validationScore": 85,
    "generated": {
      "html": "<!DOCTYPE html>...",
      "css": "/* Optimized CSS */...",
      "js": "// Conversion tracking JS...",
      "assets": {
        "tracking_setup.txt": "# Tracking setup guide",
        "seo_meta_tags.txt": "# SEO optimization guide"
      }
    },
    "optimization": {
      "mobileOptimized": true,
      "seoOptimized": true,
      "conversionOptimized": true,
      "loadTimeOptimized": true
    }
  }
}
```

**Template Disponível**:
- ✅ **cookie**: Template otimizado com countdown, social proof, mobile-first

---

## 🔍 **VALIDATION API** ✅ 85% Funcional

### **Endpoint**: `POST /api/v1/validation`

**Descrição**: Valida produtos usando Google Search API

**Payload Exemplo**:
```json
{
  "productName": "GlicoShield",
  "targetCountry": "US",
  "productUrl": "https://example.com/product"
}
```

---

## 🕵️ **DISCOVERY MINING API** ⚠️ 70% Funcional

### **Endpoint**: `POST /api/v1/discovery`

**Descrição**: Minera produtos em canais YouTube (regra 5-7+ vezes)

**Status**: Necessita melhorias para produtos não-óbvios

---

## 🧠 **INTELLIGENCE API** ⚠️ 60% Funcional  

### **Endpoint**: `POST /api/v1/intelligence`

**Descrição**: Análise de mercado e competidores

**Status**: Será merged com Discovery Mining

---

## 📸 **SCREENSHOTS API** ✅ 100% Funcional

### **Endpoint**: `POST /api/capture-screenshot`

**Descrição**: Captura screenshots de páginas de produtos

---

## 🔄 **CHANNEL CONVERTER API** ❌ 30% Funcional

### **Endpoint**: `POST /api/convert-channels`

**Descrição**: Converte canais entre formatos

**Status**: Necessita correção

---

## 🚀 **DEPLOYMENT API** ✅ 90% Funcional

### **Endpoint**: `POST /api/v1/ftp-deploy`

**Descrição**: Deploy automático FTP para Hostinger

---

## 📊 **TRACKING API** ✅ 85% Funcional

### **Endpoint**: `POST /api/v1/tracking`

**Descrição**: Sistema de tracking de conversões

---

## 🔧 **HEALTH CHECK API** ✅ 100% Funcional

### **Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-09-12T19:30:00.000Z",
  "version": "1.4.1",
  "environment": "production"
}
```

---

## 🛡️ **CÓDIGOS DE ERRO PADRONIZADOS**

```json
{
  "success": false,
  "error": "Descrição do erro em português",
  "code": "ERROR_CODE",
  "details": {
    "field": "campo com problema",
    "expected": "valor esperado",
    "received": "valor recebido"
  }
}
```

**Códigos Comuns**:
- `VALIDATION_REQUIRED`: Dados de validação obrigatórios
- `PRODUCT_NOT_FOUND`: Produto não encontrado
- `API_RATE_LIMIT`: Limite de API excedido
- `INVALID_COUNTRY`: País não suportado
- `GENERATION_FAILED`: Falha na geração

---

## 🔑 **AUTENTICAÇÃO**

**Local**: Sem autenticação necessária  
**Produção**: Headers de segurança automáticos via Nginx

---

## 📈 **RATE LIMITS**

- **Local**: Ilimitado
- **Produção**: 
  - Google APIs: 1000ms delay entre calls
  - Other APIs: 100 req/min por IP

---

## 🧪 **COMO TESTAR**

### **Campaign Builder**
```bash
curl -X POST http://localhost:3847/api/v1/campaign \
  -H "Content-Type: application/json" \
  -d '{"productName": "Test", "targetCountry": "US", "platform": "SMARTADV", "commissionValue": 100, "exportFormat": "csv", "useLuizMethod": true}'
```

### **Health Check**
```bash
curl http://localhost:3847/api/health
```

---

## 📝 **LOGS E DEBUGGING**

**Local**: Console output no terminal  
**Produção**: Logs em `/opt/smart-affiliate-system/app.log`

```bash
# Ver logs produção
tail -f /opt/smart-affiliate-system/app.log
```

---

**📅 Última atualização**: 12 September 2025  
**🔖 Versão API**: v1.4.1  
**📍 Status**: APIs principais testadas e funcionando