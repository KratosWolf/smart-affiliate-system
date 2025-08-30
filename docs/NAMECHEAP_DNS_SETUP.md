# 🌐 DNS Configuration - Namecheap → Hostinger

## Fluxo Completo: Compra → Configuração → Deploy

### PASSO 1: Comprar Domínio na Namecheap
1. Acesse: https://www.namecheap.com
2. Busque o domínio sugerido
3. Compre (anual recomendado)
4. **IMPORTANTE**: NÃO ative WhoisGuard Premium (desnecessário)

### PASSO 2: Configurar DNS (2 Opções)

#### OPÇÃO A: Nameservers da Hostinger (MAIS FÁCIL)
```
1. Na Namecheap, vá em Domain List → Manage
2. Em "Nameservers", selecione "Custom DNS"
3. Adicione:
   - ns1.dns-parking.com
   - ns2.dns-parking.com
4. Save Changes
5. Aguarde 1-24h para propagação

✅ VANTAGEM: Hostinger gerencia tudo automaticamente
```

#### OPÇÃO B: DNS Records Manuais (CONTROLE TOTAL)
```
1. Na Namecheap: Domain List → Manage → Advanced DNS
2. Adicione estes records:

Type    Host    Value               TTL
──────────────────────────────────────
A       @       147.79.84.17       1800
A       www     147.79.84.17       1800
CNAME   *       @                  1800

3. Delete records antigos se houver
4. Save Changes
5. Aguarde 1-6h para propagação

✅ VANTAGEM: Você controla DNS + pode usar Cloudflare
```

### PASSO 3: Adicionar na Hostinger
```
1. hPanel: https://hpanel.hostinger.com
2. Domínios → Addon Domains
3. Clique "Add Domain"
4. Insira: seunovo-dominio.com
5. Subdomínio: (deixe igual ao domínio)
6. Diretório: /public_html/nome-do-produto
7. ✓ Create FTP account
8. Submit
```

### PASSO 4: Configurar FTP Específico
```
1. Na Hostinger: Websites → FTP Accounts
2. Encontre: u973230760.seunovo-dominio.com
3. Clique "Change Password"
4. Crie senha forte: Ex: Produto2025#Ftp!
5. Salve as credenciais
```

### PASSO 5: Testar Configuração
```bash
# No sistema, teste:
npm run test-domain --domain=seunovo-dominio.com
```

## 🔧 Automação que EU FAÇO para você:

### Que o Sistema Faz Automaticamente:
- ✅ Cria todas as pastas via FTP
- ✅ Upload da pre-sell completa
- ✅ .htaccess para SEO
- ✅ robots.txt
- ✅ SSL via AutoSSL da Hostinger
- ✅ Compressão e cache
- ✅ Estrutura otimizada

### Que VOCÊ faz (1x apenas):
- 🔸 Comprar domínio na Namecheap
- 🔸 Seguir o passo-a-passo do DNS (5 min)
- 🔸 Adicionar como Addon Domain na Hostinger (3 min)
- 🔸 Me passar as credenciais FTP do novo domínio

## 📋 Template de Informações

Depois de configurar, me passe:

```
Produto: GlicoShield
Domínio: glicoshield-review-2025.com
FTP User: u973230760.glicoshield-review-2025.com
FTP Pass: [senha que você criou]
Status DNS: Propagado ✅
```

## ⚡ Sugestões de Domínios para seus Produtos:

### GlicoShield:
- glicoshield-review-2025.com ⭐
- glicoshield-official.com
- glicoshield-truth.com
- get-glicoshield.com

### NerveCalm:
- nervecalm-official-2025.com ⭐
- nervecalm-results.com
- nervecalm-review.com
- try-nervecalm.com

### GutDrops:
- gutdrops-review-2025.com ⭐
- gutdrops-official.com
- gutdrops-benefits.com
- get-gutdrops.com

### OxyScrema:
- oxyscrema-truth-2025.com ⭐
- oxyscrema-official.com
- oxyscrema-review.com
- try-oxyscrema.com

## 🚨 Troubleshooting

### "Site não carrega"
- Aguarde até 48h para DNS
- Teste: https://dnschecker.org
- Force HTTPS: https://seudominio.com

### "Erro 404"
- Verifique diretório no Addon Domain
- Confirme se index.html foi enviado
- Check .htaccess syntax

### "FTP não conecta"
- Confirme credenciais
- Teste via FileZilla primeiro
- Verifique se domínio foi propagado

## 💡 Pro Tips

1. **Compre .com sempre** (melhor para ads)
2. **Use ano no domínio** (evita domínios antigos)
3. **Ative SSL automático** na Hostinger
4. **Teste mobile-friendly** sempre
5. **Configure Analytics** após deploy

---

**RESUMO**: Você compra + configura DNS (8 min). Eu faço todo resto automaticamente! 🚀