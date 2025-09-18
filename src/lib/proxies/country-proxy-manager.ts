/**
 * Country Proxy Manager - Enterprise VPN/Proxy System
 * Sistema de proxies por país para competitive intelligence precisa
 * Integra com serviços VPN premium para simular usuários locais
 */

export interface ProxyConfig {
  country: string
  region?: string
  host: string
  port: number
  username?: string
  password?: string
  protocol: 'http' | 'https' | 'socks5'
  reliability: number // 0-100
  latency: number // ms
  isActive: boolean
}

export interface CountryProxyMapping {
  [countryCode: string]: ProxyConfig[]
}

export class CountryProxyManager {
  private proxiesByCountry: CountryProxyMapping = {}
  
  constructor() {
    this.initializeProxyMappings()
  }

  /**
   * PROXY MAPPING POR PAÍS - Configuração Empresarial
   * Para produção: integrar com NordVPN, ExpressVPN, ou Bright Data
   */
  private initializeProxyMappings() {
    this.proxiesByCountry = {
      // 🇮🇹 ITÁLIA - Target priority país
      'IT': [
        {
          country: 'IT',
          region: 'Rome',
          host: 'it-rome-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 95,
          latency: 80,
          isActive: true
        },
        {
          country: 'IT',
          region: 'Milan',
          host: 'it-milan-proxy2.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 93,
          latency: 85,
          isActive: true
        }
      ],

      // 🇵🇱 POLÔNIA
      'PL': [
        {
          country: 'PL',
          region: 'Warsaw',
          host: 'pl-warsaw-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 92,
          latency: 90,
          isActive: true
        }
      ],

      // 🇧🇷 BRASIL
      'BR': [
        {
          country: 'BR',
          region: 'São Paulo',
          host: 'br-saopaulo-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 88,
          latency: 120,
          isActive: true
        }
      ],

      // 🇺🇸 EUA
      'US': [
        {
          country: 'US',
          region: 'New York',
          host: 'us-newyork-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 98,
          latency: 50,
          isActive: true
        },
        {
          country: 'US',
          region: 'Los Angeles',
          host: 'us-la-proxy2.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 97,
          latency: 55,
          isActive: true
        }
      ],

      // 🇩🇪 ALEMANHA
      'DE': [
        {
          country: 'DE',
          region: 'Frankfurt',
          host: 'de-frankfurt-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 96,
          latency: 70,
          isActive: true
        }
      ],

      // 🇬🇧 REINO UNIDO
      'UK': [
        {
          country: 'UK',
          region: 'London',
          host: 'uk-london-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 94,
          latency: 75,
          isActive: true
        }
      ],

      // 🇨🇦 CANADÁ
      'CA': [
        {
          country: 'CA',
          region: 'Toronto',
          host: 'ca-toronto-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 91,
          latency: 90,
          isActive: true
        }
      ],

      // 🇫🇷 FRANÇA
      'FR': [
        {
          country: 'FR',
          region: 'Paris',
          host: 'fr-paris-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 93,
          latency: 85,
          isActive: true
        }
      ],

      // 🇪🇸 ESPANHA
      'ES': [
        {
          country: 'ES',
          region: 'Madrid',
          host: 'es-madrid-proxy1.vpnprovider.com',
          port: 8080,
          protocol: 'https',
          reliability: 90,
          latency: 100,
          isActive: true
        }
      ]
    }
  }

  /**
   * Obter melhor proxy para país específico
   */
  getBestProxyForCountry(countryCode: string): ProxyConfig | null {
    const proxies = this.proxiesByCountry[countryCode.toUpperCase()]
    
    if (!proxies || proxies.length === 0) {
      console.warn(`⚠️  No proxies configured for country: ${countryCode}`)
      return null
    }

    // Filtrar apenas proxies ativos
    const activeProxies = proxies.filter(p => p.isActive)
    
    if (activeProxies.length === 0) {
      console.warn(`⚠️  No active proxies for country: ${countryCode}`)
      return null
    }

    // Ordenar por reliability e latency
    const bestProxy = activeProxies.sort((a, b) => {
      const scoreA = a.reliability - (a.latency / 10)
      const scoreB = b.reliability - (b.latency / 10)
      return scoreB - scoreA
    })[0]

    console.log(`🌍 Selected proxy for ${countryCode}: ${bestProxy.region} (${bestProxy.reliability}% reliability, ${bestProxy.latency}ms)`)
    
    return bestProxy
  }

  /**
   * Obter múltiplos proxies para rotação
   */
  getProxiesForCountry(countryCode: string, maxCount: number = 3): ProxyConfig[] {
    const proxies = this.proxiesByCountry[countryCode.toUpperCase()]
    
    if (!proxies || proxies.length === 0) {
      return []
    }

    return proxies
      .filter(p => p.isActive)
      .sort((a, b) => b.reliability - a.reliability)
      .slice(0, maxCount)
  }

  /**
   * Verificar se proxy está disponível para país
   */
  hasProxyForCountry(countryCode: string): boolean {
    const proxies = this.proxiesByCountry[countryCode.toUpperCase()]
    return proxies && proxies.some(p => p.isActive)
  }

  /**
   * Construir URL do proxy para Puppeteer
   */
  buildProxyUrl(proxy: ProxyConfig): string {
    if (proxy.username && proxy.password) {
      return `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
    }
    return `${proxy.protocol}://${proxy.host}:${proxy.port}`
  }

  /**
   * Health check dos proxies (para monitoramento)
   */
  async healthCheckProxy(proxy: ProxyConfig): Promise<boolean> {
    try {
      // Em produção: fazer request real de teste
      console.log(`🔍 Health checking proxy: ${proxy.region} (${proxy.host})`)
      
      // Mock check - em produção, fazer request real
      const isHealthy = Math.random() > 0.1 // 90% success rate
      
      if (!isHealthy) {
        console.warn(`❌ Proxy health check failed: ${proxy.region}`)
        proxy.isActive = false
      }
      
      return isHealthy
    } catch (error) {
      console.error(`❌ Proxy health check error:`, error)
      proxy.isActive = false
      return false
    }
  }

  /**
   * Adicionar proxy dinâmico (para integração com serviços VPN)
   */
  addDynamicProxy(countryCode: string, proxy: ProxyConfig) {
    const country = countryCode.toUpperCase()
    
    if (!this.proxiesByCountry[country]) {
      this.proxiesByCountry[country] = []
    }
    
    this.proxiesByCountry[country].push(proxy)
    console.log(`✅ Added dynamic proxy for ${country}: ${proxy.region}`)
  }

  /**
   * Integração com serviços VPN enterprise
   * TODO: Implementar para NordVPN API, ExpressVPN API, Bright Data
   */
  async integrateWithVPNService(service: 'nordvpn' | 'expressvpn' | 'brightdata'): Promise<void> {
    console.log(`🔄 Integrating with ${service} VPN service...`)
    
    switch (service) {
      case 'nordvpn':
        await this.integrateNordVPN()
        break
      case 'expressvpn':
        await this.integrateExpressVPN()
        break
      case 'brightdata':
        await this.integrateBrightData()
        break
    }
  }

  // TODO: Implementar integrações reais com APIs dos provedores
  private async integrateNordVPN(): Promise<void> {
    // NordVPN API integration
    console.log('🔄 NordVPN integration - TODO: implement with real API')
  }

  private async integrateExpressVPN(): Promise<void> {
    // ExpressVPN API integration  
    console.log('🔄 ExpressVPN integration - TODO: implement with real API')
  }

  private async integrateBrightData(): Promise<void> {
    // Bright Data (ex-Luminati) API integration
    console.log('🔄 Bright Data integration - TODO: implement with real API')
  }

  /**
   * Obter estatísticas dos proxies
   */
  getProxyStats(): { [country: string]: { total: number, active: number, avgReliability: number } } {
    const stats: { [country: string]: { total: number, active: number, avgReliability: number } } = {}
    
    Object.entries(this.proxiesByCountry).forEach(([country, proxies]) => {
      const active = proxies.filter(p => p.isActive)
      const avgReliability = active.length > 0 
        ? active.reduce((sum, p) => sum + p.reliability, 0) / active.length 
        : 0
      
      stats[country] = {
        total: proxies.length,
        active: active.length,
        avgReliability: Math.round(avgReliability)
      }
    })
    
    return stats
  }

  /**
   * Rotação automática de proxies para evitar detecção
   */
  getRandomProxyForCountry(countryCode: string): ProxyConfig | null {
    const proxies = this.getProxiesForCountry(countryCode)
    
    if (proxies.length === 0) {
      return null
    }
    
    // Seleção aleatória ponderada por reliability
    const totalReliability = proxies.reduce((sum, p) => sum + p.reliability, 0)
    const randomValue = Math.random() * totalReliability
    
    let currentSum = 0
    for (const proxy of proxies) {
      currentSum += proxy.reliability
      if (randomValue <= currentSum) {
        return proxy
      }
    }
    
    // Fallback para o primeiro proxy
    return proxies[0]
  }
}