# 🤖 AI Campaign Builder - Instruções Completas

## 🎯 OBJETIVO
Criar um sistema limpo e funcional que gera campanhas Google Ads em qualquer idioma usando 100% AI, sem fallbacks complexos.

## 📋 REQUISITOS BASEADOS NOS TESTES

### ✅ INPUT OBRIGATÓRIO:
- **Nome do Produto**: ex: Rectin
- **País de Targeting**: ex: Hungary 🇭🇺
- **Plataforma de Afiliado**: ex: DR Cash
- **Valor da Comissão**: ex: 30
- **Moeda da Comissão**: ex: USD
- **URL Base**: ex: https://0z15y.doctormurin.com/l

### ✅ OUTPUT ESPERADO:
4 arquivos CSV em húngaro (ou idioma do país):
1. **Headlines.csv** - 15 headlines em húngaro
2. **Sitelinks.csv** - 6 sitelinks em húngaro
3. **Snippets.csv** - 2 snippets em húngaro
4. **Descriptions.csv** - 4 descriptions em húngaro

### ✅ IDIOMAS TESTADOS:
- **Hungary (HU)** → Húngaro
- **Germany (DE)** → Alemão
- **Spain (ES)** → Espanhol
- **Poland (PL)** → Polonês

## 🏗️ ARQUITETURA NOVA

### 📁 ESTRUTURA DE ARQUIVOS:
```
src/
├── app/
│   ├── ai-campaign-builder/
│   │   └── page.tsx                    # Interface limpa
│   └── api/
│       └── v1/
│           └── ai-campaign-builder/
│               └── route.ts             # API principal
├── lib/
│   ├── ai/
│   │   └── campaign-ai-generator.ts     # Gerador AI limpo
│   └── constants/
│       └── countries-languages.ts      # Mapeamento país→idioma
```

### 🎯 PRINCÍPIOS:
1. **1 API endpoint** - sem múltiplos geradores
2. **AI direto** - Claude/Gemini traduz tudo
3. **Sem fallbacks** - funciona ou retorna erro claro
4. **Código simples** - máximo 200 linhas por arquivo

## 🔧 IMPLEMENTAÇÃO STEP-BY-STEP

### PASSO 1: Criar Mapeamento País→Idioma
```typescript
// src/lib/constants/countries-languages.ts
export const COUNTRY_LANGUAGE_MAP = {
  'HU': 'hu-HU', // Hungarian
  'DE': 'de-DE', // German
  'ES': 'es-ES', // Spanish
  'PL': 'pl-PL', // Polish
  'FR': 'fr-FR', // French
  'IT': 'it-IT', // Italian
  // ... mais países
}
```

### PASSO 2: Criar Gerador AI Limpo
```typescript
// src/lib/ai/campaign-ai-generator.ts
export class CampaignAIGenerator {
  async generateCampaign(data: CampaignInput): Promise<CampaignCSVs> {
    // 1. Mapear país→idioma
    // 2. Gerar via AI (Claude/Gemini)
    // 3. Retornar CSVs no idioma correto
  }
}
```

### PASSO 3: Criar API Endpoint
```typescript
// src/app/api/v1/ai-campaign-builder/route.ts
export async function POST(request: Request) {
  // 1. Validar input
  // 2. Chamar CampaignAIGenerator
  // 3. Retornar CSVs
}
```

### PASSO 4: Criar Interface
```typescript
// src/app/ai-campaign-builder/page.tsx
export default function AICampaignBuilder() {
  // Interface limpa com 6 campos
  // Botão "Gerar Campanha"
  // Download dos 4 CSVs
}
```

## 🧪 TESTES OBRIGATÓRIOS

### ✅ TESTE 1: Hungary + Rectin
**Input:**
- Produto: Rectin
- País: Hungary
- Comissão: USD 30

**Expected Output:**
- Headlines: "Rectin Eredeti", "Vásároljon Rectin"
- Sitelinks: "Hol Vásárolhat Rectin-t", "Vásárlás a Weboldalon"
- Snippets: "Ingyenes Privát Szállítás", "Fél Áras Ajánlat"

### ✅ TESTE 2: Germany + Rectin
**Expected Output:**
- Headlines em alemão
- Sitelinks em alemão
- Snippets em alemão

## 🚀 COMANDOS DE DEPLOY

```bash
# Testar localmente
npm run dev
# Abrir: http://localhost:3000/ai-campaign-builder

# Deploy para produção
git add .
git commit -m "feat: AI Campaign Builder - sistema limpo e funcional"
git push origin main

# Deploy VPS
SSHPASS='CQK6njr3wjthvp2dmf' sshpass -e ssh root@161.97.145.169 "
cd /opt/smart-affiliate-system
git pull origin main
npm run build
pm2 restart smart-affiliate-system
"
```

## ✅ CHECKLIST DE VERIFICAÇÃO

### 🔍 DESENVOLVIMENTO:
- [ ] API `/api/v1/ai-campaign-builder` criada
- [ ] Interface `/ai-campaign-builder` criada
- [ ] Gerador AI implementado
- [ ] Mapeamento país→idioma funcionando

### 🧪 TESTES LOCAIS:
- [ ] Hungary + Rectin = CSVs húngaros
- [ ] Germany + Rectin = CSVs alemães
- [ ] Sem erros no console
- [ ] Download de 4 arquivos CSV

### 🚀 PRODUÇÃO:
- [ ] Deploy funcionando
- [ ] Site carregando: https://smartaffiliatesystem.site/ai-campaign-builder
- [ ] Teste final: Hungary + Rectin = sucesso

## 🎯 RESULTADO FINAL

**URL:** https://smartaffiliatesystem.site/ai-campaign-builder

**Funcionalidade:**
1. Usuário preenche 6 campos
2. Clica "Gerar Campanha"
3. Aguarda 3-5 segundos
4. Baixa 4 CSVs no idioma correto
5. **100% sucesso** - sem inglês para países não-ingleses

---

**📅 Data:** 18 Janeiro 2025
**🎯 Status:** Pronto para implementação
**⏱️ Tempo estimado:** 2-3 horas

*Este documento garante que o AI Campaign Builder será criado do zero, funcionando perfeitamente, sem a complexidade do sistema anterior.*