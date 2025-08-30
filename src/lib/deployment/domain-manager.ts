/**
 * Domain Management System
 * Gerencia múltiplos domínios independentes para cada produto
 */

export interface DomainConfig {
  product: string
  domain: string
  type: 'addon' | 'parked' | 'subdomain' | 'external'
  ftpUser: string
  ftpPassword?: string
  status: 'active' | 'pending' | 'expired'
  dnsPointing?: string
  sslStatus?: 'active' | 'pending' | 'none'
}

export class DomainManager {
  private domains: Map<string, DomainConfig>
  
  constructor() {
    // Configuração de domínios REAIS independentes
    this.domains = new Map([
      // EXEMPLO: Domínios que você vai criar/adicionar
      ['glicoshield', {
        product: 'glicoshield',
        domain: 'glicoshield-review-2025.com',  // Domínio independente
        type: 'addon',
        ftpUser: 'u973230760.glicoshield-review-2025.com',
        status: 'pending',
        dnsPointing: '147.79.84.17'
      }],
      
      ['nervecalm', {
        product: 'nervecalm',
        domain: 'nervecalm-official.com',  // Domínio independente
        type: 'addon',
        ftpUser: 'u973230760.nervecalm-official.com',
        status: 'pending',
        dnsPointing: '147.79.84.17'
      }],
      
      ['oxyscrema', {
        product: 'oxyscrema',
        domain: 'oxyscrema-truth.com',  // Domínio independente
        type: 'addon',
        ftpUser: 'u973230760.oxyscrema-truth.com',
        status: 'pending',
        dnsPointing: '147.79.84.17'
      }],
      
      // TEMPORÁRIO: Usar bestbargains24x7.com enquanto não tem domínios
      ['temp-glicoshield', {
        product: 'glicoshield',
        domain: 'bestbargains24x7.com/glicoshield',
        type: 'subdomain',
        ftpUser: 'u973230760.bestbargains24x7.com',
        status: 'active',
        dnsPointing: '147.79.84.17'
      }]
    ])
  }
  
  /**
   * Processo para adicionar novo domínio
   */
  async addNewDomain(product: string, domain: string): Promise<string> {
    console.log(`\n📋 INSTRUÇÕES PARA ADICIONAR DOMÍNIO: ${domain}\n`)
    console.log('═══════════════════════════════════════════════\n')
    
    console.log('PASSO 1: Comprar Domínio')
    console.log('─────────────────────────')
    console.log('• Namecheap: https://namecheap.com')
    console.log('• GoDaddy: https://godaddy.com')
    console.log('• Google Domains: https://domains.google')
    console.log(`• Sugestão de nome: ${domain}\n`)
    
    console.log('PASSO 2: Configurar DNS (escolha uma opção)')
    console.log('────────────────────────────────────────────')
    console.log('Opção A - Nameservers da Hostinger:')
    console.log('  • ns1.dns-parking.com')
    console.log('  • ns2.dns-parking.com\n')
    
    console.log('Opção B - Registro A (se usar Cloudflare):')
    console.log('  • Type: A')
    console.log('  • Name: @')
    console.log('  • Content: 147.79.84.17\n')
    
    console.log('PASSO 3: Adicionar na Hostinger')
    console.log('────────────────────────────')
    console.log('1. Acesse: https://hpanel.hostinger.com')
    console.log('2. Vá em: Domínios → Addon Domains')
    console.log(`3. Adicione: ${domain}`)
    console.log(`4. Diretório: /public_html/${product}`)
    console.log('5. Marque: ✓ Criar conta FTP\n')
    
    console.log('PASSO 4: Configurar FTP')
    console.log('───────────────────────')
    console.log(`• Usuário FTP: u973230760.${domain}`)
    console.log('• Criar senha forte')
    console.log('• Anotar credenciais\n')
    
    console.log('PASSO 5: Atualizar Sistema')
    console.log('──────────────────────────')
    console.log('Adicione ao arquivo .env.local:')
    console.log(`FTP_USER_${product.toUpperCase()}=u973230760.${domain}`)
    console.log(`FTP_PASS_${product.toUpperCase()}=sua_senha_aqui\n`)
    
    console.log('═══════════════════════════════════════════════\n')
    
    // Adicionar à configuração
    this.domains.set(product, {
      product,
      domain,
      type: 'addon',
      ftpUser: `u973230760.${domain}`,
      status: 'pending',
      dnsPointing: '147.79.84.17'
    })
    
    return `Domínio ${domain} adicionado à lista de pendentes`
  }
  
  /**
   * Listar todos os domínios e seus status
   */
  listDomains(): void {
    console.log('\n🌐 DOMÍNIOS CONFIGURADOS')
    console.log('═══════════════════════════════════════\n')
    
    const active = []
    const pending = []
    const temporary = []
    
    this.domains.forEach((config, key) => {
      const entry = `• ${config.domain} (${config.product})`
      
      if (config.status === 'active' && config.type === 'addon') {
        active.push(entry)
      } else if (config.status === 'pending') {
        pending.push(entry)
      } else if (config.type === 'subdomain') {
        temporary.push(entry)
      }
    })
    
    if (active.length > 0) {
      console.log('✅ ATIVOS (Domínios Próprios):')
      active.forEach(d => console.log(d))
      console.log()
    }
    
    if (pending.length > 0) {
      console.log('⏳ PENDENTES (Aguardando Configuração):')
      pending.forEach(d => console.log(d))
      console.log()
    }
    
    if (temporary.length > 0) {
      console.log('🔄 TEMPORÁRIOS (Subpastas):')
      temporary.forEach(d => console.log(d))
      console.log()
    }
    
    console.log('═══════════════════════════════════════\n')
  }
  
  /**
   * Sugestões de domínios para um produto
   */
  suggestDomains(product: string): string[] {
    const year = new Date().getFullYear()
    const suggestions = [
      `${product}-review-${year}.com`,
      `${product}-official.com`,
      `${product}-truth.com`,
      `get-${product}.com`,
      `try-${product}.com`,
      `${product}-results.com`,
      `${product}-discount.com`,
      `best-${product}.com`,
      `${product}-supplement.com`,
      `${product}-benefits.com`
    ]
    
    console.log(`\n💡 SUGESTÕES DE DOMÍNIO PARA: ${product.toUpperCase()}`)
    console.log('────────────────────────────────────')
    suggestions.forEach((domain, i) => {
      console.log(`${i + 1}. ${domain}`)
    })
    console.log()
    
    return suggestions
  }
  
  /**
   * Verifica disponibilidade (simulado)
   */
  async checkAvailability(domain: string): Promise<void> {
    console.log(`\n🔍 Para verificar disponibilidade de: ${domain}\n`)
    console.log('Use um destes serviços:')
    console.log('• https://www.namecheap.com/domains/domain-name-search/')
    console.log('• https://domains.google.com/registrar/search')
    console.log('• https://who.is/')
    console.log()
  }
  
  /**
   * Retorna configuração FTP para um produto
   */
  getFTPConfig(product: string): DomainConfig | undefined {
    // Primeiro tenta domínio próprio
    let config = this.domains.get(product)
    
    // Se não encontrar, tenta temporário
    if (!config) {
      config = this.domains.get(`temp-${product}`)
    }
    
    return config
  }
  
  /**
   * Instruções para migrar de subpasta para domínio próprio
   */
  migrateToOwnDomain(product: string, newDomain: string): void {
    console.log(`\n📦 MIGRAÇÃO: ${product} → ${newDomain}`)
    console.log('═══════════════════════════════════════')
    console.log('\n1. Configure o novo domínio (veja addNewDomain)')
    console.log('2. Copie arquivos da subpasta para novo domínio')
    console.log('3. Atualize links de afiliado')
    console.log('4. Redirecione tráfego antigo (301 redirect)')
    console.log('5. Atualize campanhas Google Ads')
    console.log('6. Monitore por 48h')
    console.log('\nComando para copiar via FTP:')
    console.log(`npm run migrate --from=temp-${product} --to=${product}`)
    console.log()
  }
}

// Exportar instância
export const domainManager = new DomainManager()