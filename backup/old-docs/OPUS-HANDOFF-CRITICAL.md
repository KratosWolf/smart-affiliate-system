# 🚨 OPUS HANDOFF - DOCUMENTO CRÍTICO
**Data**: 05 Setembro 2025 - 11:30 AM
**Modelo Atual**: Sonnet 3.5
**Próximo Modelo**: OPUS (quando disponível)

## 🌐 **INFORMAÇÕES ESSENCIAIS DO PROJETO**

### **URLs e Acessos:**
- **Produção**: https://smartaffiliatesystem.site
- **GitHub**: https://github.com/KratosWolf/smart-affiliate-system
- **VPS**: 161.97.145.169 (Hostinger/Contabo)
- **SSH**: `root` / senha: `CQK6njr3wjthvp2dmf`
- **FTP Hostinger**: bestbargains24x7.com
- **Local Dev**: localhost:3001 (porta 3000 em uso)

### **Credenciais Importantes:**
```bash
# SSH VPS
SSHPASS='CQK6njr3wjthvp2dmf' sshpass -e ssh root@161.97.145.169

# FTP Hostinger
FTP_HOST=mediumblue-monkey-640112.hostingersite.com
FTP_USER=u973230760.bestbargains24x7.com
FTP_PASSWORD=FTPBestBargains2025#Main!
```

---

## 🔴 **PROBLEMAS ATUAIS CRÍTICOS**

### **1. Templates não selecionam (CRÍTICO)**
- **Problema**: Click no Cookie Template (e outros) não funciona
- **Causa**: Conversão de onClick para Link components quebrou seleção
- **Arquivo**: `/src/app/presell-generator/page.tsx`
- **Status**: ❌ NÃO RESOLVIDO

### **2. Ciclo de Quebra-Conserta**
- Consertando navegação → quebrou seleção de templates
- Consertando CSP → quebrou algo mais
- Padrão recorrente de regressões

---

## 📝 **MUDANÇAS REALIZADAS HOJE (05/09)**

### **1. Botões de Navegação (PARCIALMENTE RESOLVIDO)**
**Commit**: `2a99498` - "fix: Convert onClick handlers to Link components"
- **Arquivos**: 
  - `src/app/page.tsx` - Module cards
  - `src/app/dashboard-guide/page.tsx` - Tab navigation
- **Mudança**: onClick → Link components
- **Resultado**: Navegação funciona, mas quebrou outros clicks

### **2. Playbook Atualizado (RESOLVIDO)**
**Commit**: `5181692` - "docs: Update Playbook with complete Presell workflow"
- **Arquivo**: `src/app/dashboard-guide/page.tsx`
- **Adições**:
  - 5 templates com CVR rates
  - Fluxo detalhado Presell Generator
  - Multi-geo (23 países)
  - Analytics integrado

### **3. sshpass Path Fix (RESOLVIDO)**
**Commit**: `ca207e7` - "fix: Add full path to sshpass for macOS"
- **Arquivo**: `src/lib/deployment/vps-flexible-deploy.ts`
- **Mudança**: Adicionado `/opt/homebrew/bin/sshpass` para macOS
- **Resultado**: Deploy FTP deve funcionar

---

## 🔄 **ESTADO ATUAL DO SISTEMA**

### **✅ FUNCIONANDO:**
- Site online em https://smartaffiliatesystem.site
- Navegação principal (dashboard buttons)
- Playbook com informações completas
- FTP deploy (sshpass corrigido)
- VPS rodando com npm run dev

### **❌ NÃO FUNCIONANDO:**
- **Template selection** no Presell Generator
- Qualquer onClick que precisa de useState
- Possíveis outros componentes interativos

### **⚠️ PARCIALMENTE FUNCIONANDO:**
- Botões - alguns funcionam (Link), outros não (onClick)

---

## 🛠️ **COMO RESTAURAR VPS SE NECESSÁRIO**

```bash
# 1. Conectar ao VPS
SSHPASS='CQK6njr3wjthvp2dmf' sshpass -e ssh root@161.97.145.169

# 2. Atualizar código
cd /opt/smart-affiliate-system
git pull origin main

# 3. Matar processos antigos
pkill -f node

# 4. Limpar cache se necessário
rm -rf .next

# 5. Iniciar servidor
npm run dev > app.log 2>&1 &

# 6. Verificar se está rodando
curl -I http://localhost:3000
```

---

## 📋 **TAREFAS PENDENTES PARA OPUS**

### **PRIORIDADE 1 - CRÍTICO:**
1. **Consertar seleção de templates** no Presell Generator
   - Restaurar onClick handlers onde necessário
   - Manter Link apenas para navegação real
   - Testar TODOS os cliques antes de declarar resolvido

### **PRIORIDADE 2 - IMPORTANTE:**
2. **Revisar todas mudanças de botões**
   - Identificar onde Link funciona vs onde onClick é necessário
   - Implementar solução híbrida se necessário

### **PRIORIDADE 3 - MELHORIA:**
3. **Criar suite de testes**
   - Prevenir regressões futuras
   - Validar todas funcionalidades principais

---

## 🚀 **INSTRUÇÕES PARA NOVA SESSÃO**

### **Para iniciar nova conversa com OPUS:**

1. **Abrir nova janela do Claude Code**
2. **Navegar para o diretório**:
   ```bash
   cd /Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system
   ```

3. **Primeira mensagem para o Opus**:
   ```
   Preciso consertar o Smart Affiliate System. 
   Site: https://smartaffiliatesystem.site
   
   PROBLEMA CRÍTICO: Templates não selecionam no Presell Generator.
   
   Leia OPUS-HANDOFF-CRITICAL.md para contexto completo.
   
   GitHub: https://github.com/KratosWolf/smart-affiliate-system
   VPS: 161.97.145.169 (senha no arquivo)
   ```

4. **Verificar estado atual**:
   - Site está online?
   - Templates selecionam?
   - Botões funcionam?

---

## 📁 **ARQUIVOS IMPORTANTES PARA CONSULTA**

1. **CLAUDE.md** - Instruções gerais do projeto
2. **OPUS-HANDOFF-CRITICAL.md** - Este arquivo (contexto da sessão)
3. **BUTTON-FIX-COMPLETE-REPORT.md** - Detalhes das correções de botões
4. **FINAL-SYSTEM-STATUS-REPORT.md** - Status geral do sistema
5. **src/app/presell-generator/page.tsx** - Onde templates não funcionam
6. **src/app/dashboard-guide/page.tsx** - Playbook atualizado

---

## 🔧 **CONFIGURAÇÃO LOCAL**

```bash
# Servidor local rodando em:
http://localhost:3001

# Para iniciar localmente:
npm run dev

# APIs configuradas em .env.local:
GOOGLE_API_KEY=AIzaSyDGtmJOvV4yLvQZX-o2V2Gl2TF0xvZUGRU
REMOVEBG_API_KEY=RDKyALFbkDxS5ovoNLbt1T75
```

---

## 💡 **LIÇÕES APRENDIDAS**

1. **NÃO converter todos onClick para Link indiscriminadamente**
2. **Testar TODAS funcionalidades após mudanças**
3. **Mudanças globais são perigosas - preferir correções cirúrgicas**
4. **Sonnet tem dificuldade com visão holística do sistema**

---

**🚨 IMPORTANTE**: Este documento contém TUDO necessário para continuar o trabalho. 
O Opus deve conseguir resolver os problemas com estas informações.

**Última atualização**: 05/09/2025 - 11:35 AM
**Status**: Sistema parcialmente funcional, aguardando correções do Opus