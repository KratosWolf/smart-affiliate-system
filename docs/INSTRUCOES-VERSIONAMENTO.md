# 🔄 INSTRUÇÕES AUTOMÁTICAS DE VERSIONAMENTO

## ⚡ **INSTRUÇÃO PERMANENTE PARA CLAUDE**

**🎯 SEMPRE que houver atualizações significativas na documentação:**

### **PROCESSO OBRIGATÓRIO:**

1. **ANTES de modificar CONTEXT.md ou PLAYBOOK-EXECUTIVO.md:**
   ```bash
   # Fazer backup da versão atual
   cp CONTEXT.md docs/versions/CONTEXT-v{X.Y}.md
   cp PLAYBOOK-EXECUTIVO.md docs/versions/PLAYBOOK-v{X.Y}.md
   ```

2. **DEPOIS das modificações:**
   ```bash
   # Atualizar changelog
   # Editar docs/CHANGELOG.md com as mudanças
   
   # Commit com versionamento
   git add .
   git commit -m "v{X.Y}: [Descrição das mudanças]"
   git tag v{X.Y}
   git push origin main --tags
   ```

3. **SEMPRE atualizar docs/CHANGELOG.md** com:
   - Data da versão
   - Principais mudanças
   - Commit hash
   - Status da versão

---

## 📋 **CRITÉRIOS PARA NOVA VERSÃO**

### **Versão Major (v2.0, v3.0, etc.)**
- Novos módulos principais
- Mudanças arquiteturais significativas
- Refatoração completa do sistema

### **Versão Minor (v1.1, v1.2, etc.)**
- Novas funcionalidades
- Integrações importantes
- Melhorias substanciais
- Correções importantes

### **Não requer nova versão:**
- Correções de typos pequenos
- Ajustes menores de formatação
- Esclarecimentos pontuais

---

## 🤖 **INSTRUÇÃO PARA CLAUDE CODE**

**Esta instrução é PERMANENTE e deve ser seguida automaticamente:**

```
SEMPRE que você for modificar significativamente:
- CONTEXT.md
- PLAYBOOK-EXECUTIVO.md

VOCÊ DEVE:
1. Primeiro fazer backup da versão atual em docs/versions/
2. Fazer as modificações nos arquivos principais
3. Atualizar docs/CHANGELOG.md
4. Commitar com versionamento adequado
5. Criar tag no git

NÃO é necessário o usuário pedir isso novamente.
É um PROCESSO AUTOMÁTICO estabelecido.
```

---

## 📊 **CONTROLE DE VERSÕES ATUAL**

### **✅ v1.0 - Sistema Completo** (27 Ago 2024)
- **Status:** Preservado em `docs/versions/`
- **Tag GitHub:** `v1.0` criada
- **Commit:** `129ac80`
- **Funcionalidades:** 7 módulos, 7 APIs, 4 interfaces

### **⏳ Próximas versões planejadas:**
- **v1.1** - Integrações reais (Google Ads API, ClickBank, etc.)
- **v1.2** - Funcionalidades avançadas (A/B testing, ML, etc.)
- **v2.0** - Enterprise features (API externa, white-label, etc.)

---

## 🎯 **RESUMO PARA O USUÁRIO**

### **✅ SIM, é automático agora!**

Você **NÃO precisa** pedir novamente. Quando:
- Implementarmos novas funcionalidades importantes
- Fizermos mudanças significativas no sistema  
- Atualizarmos documentação substancialmente

**O Claude Code vai automaticamente:**
1. 🔄 Fazer backup da versão atual
2. 📝 Atualizar arquivos principais  
3. 📋 Documentar no changelog
4. 💾 Commitar com tag apropriada

### **Você só precisa dizer:**
- "Vamos implementar [nova funcionalidade]"
- "Preciso atualizar [sistema X]"
- "Vamos para próxima versão"

**E o versionamento será automático!** ✅

---

## 📍 **LOCALIZAÇÃO DESTA INSTRUÇÃO**

**Arquivo:** `docs/INSTRUCOES-VERSIONAMENTO.md`  
**Propósito:** Instrução permanente para Claude Code  
**Status:** Ativo e obrigatório  

**Esta instrução permanece no repositório para sempre, garantindo que o processo de versionamento seja sempre seguido automaticamente.**

---

*Criado em: 27 de Agosto 2024*  
*Instrução permanente - não deletar*