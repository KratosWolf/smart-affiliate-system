/**
 * Sistema de Detecção Automática de Idioma/Moeda por País
 * Usado para gerar presells na moeda e idioma corretos
 */

export interface CountrySettings {
  country: string;
  language: string;
  currency: string;
  locale: string;
  timezone: string;
  // Google Ads specific
  adWordsCountryCode: string;
  adWordsLanguageCode: string;
  // Common words for copy optimization  
  commonWords: {
    buy: string;
    now: string;
    free: string;
    guarantee: string;
    discount: string;
    limited: string;
    today: string;
    official: string;
  };
  // Number formats
  numberFormat: {
    decimal: string;
    thousands: string;
    currencyPosition: 'before' | 'after';
  };
}

const COUNTRY_DATABASE: Record<string, CountrySettings> = {
  'Brasil': {
    country: 'Brasil',
    language: 'pt-BR',
    currency: 'BRL',
    locale: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    adWordsCountryCode: '2076',
    adWordsLanguageCode: '1014',
    commonWords: {
      buy: 'comprar',
      now: 'agora',
      free: 'grátis',
      guarantee: 'garantia',
      discount: 'desconto',
      limited: 'limitado',
      today: 'hoje',
      official: 'oficial'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'before'
    }
  },
  
  'Polônia': {
    country: 'Polônia',
    language: 'pl',
    currency: 'PLN',
    locale: 'pl-PL',
    timezone: 'Europe/Warsaw',
    adWordsCountryCode: '2616',
    adWordsLanguageCode: '1045',
    commonWords: {
      buy: 'kup',
      now: 'teraz',
      free: 'za darmo',
      guarantee: 'gwarancja',
      discount: 'zniżka',
      limited: 'ograniczone',
      today: 'dziś',
      official: 'oficjalna'
    },
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currencyPosition: 'after'
    }
  },
  
  'Estados Unidos': {
    country: 'Estados Unidos',
    language: 'en-US',
    currency: 'USD',
    locale: 'en-US',
    timezone: 'America/New_York',
    adWordsCountryCode: '2840',
    adWordsLanguageCode: '1033',
    commonWords: {
      buy: 'buy',
      now: 'now',
      free: 'free',
      guarantee: 'guarantee',
      discount: 'discount',
      limited: 'limited',
      today: 'today',
      official: 'official'
    },
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currencyPosition: 'before'
    }
  },
  
  'Alemanha': {
    country: 'Alemanha',
    language: 'de-DE',
    currency: 'EUR',
    locale: 'de-DE',
    timezone: 'Europe/Berlin',
    adWordsCountryCode: '2276',
    adWordsLanguageCode: '1031',
    commonWords: {
      buy: 'kaufen',
      now: 'jetzt',
      free: 'kostenlos',
      guarantee: 'garantie',
      discount: 'rabatt',
      limited: 'begrenzt',
      today: 'heute',
      official: 'offiziell'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'after'
    }
  },
  
  'França': {
    country: 'França',
    language: 'fr-FR',
    currency: 'EUR',
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    adWordsCountryCode: '2250',
    adWordsLanguageCode: '1036',
    commonWords: {
      buy: 'acheter',
      now: 'maintenant',
      free: 'gratuit',
      guarantee: 'garantie',
      discount: 'remise',
      limited: 'limité',
      today: 'aujourd\'hui',
      official: 'officiel'
    },
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currencyPosition: 'after'
    }
  },
  
  'Espanha': {
    country: 'Espanha',
    language: 'es-ES',
    currency: 'EUR',
    locale: 'es-ES',
    timezone: 'Europe/Madrid',
    adWordsCountryCode: '2724',
    adWordsLanguageCode: '1034',
    commonWords: {
      buy: 'comprar',
      now: 'ahora',
      free: 'gratis',
      guarantee: 'garantía',
      discount: 'descuento',
      limited: 'limitado',
      today: 'hoy',
      official: 'oficial'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'after'
    }
  },
  
  'Portugal': {
    country: 'Portugal',
    language: 'pt-PT',
    currency: 'EUR',
    locale: 'pt-PT',
    timezone: 'Europe/Lisbon',
    adWordsCountryCode: '2620',
    adWordsLanguageCode: '2070',
    commonWords: {
      buy: 'comprar',
      now: 'agora',
      free: 'grátis',
      guarantee: 'garantia',
      discount: 'desconto',
      limited: 'limitado',
      today: 'hoje',
      official: 'oficial'
    },
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currencyPosition: 'after'
    }
  }
};

export class CountryDetector {
  
  /**
   * Detecta configurações automáticas por país
   */
  detectByCountry(countryName: string): CountrySettings {
    // Normaliza nome do país
    const normalizedCountry = this.normalizeCountryName(countryName);
    
    // Busca na database
    const settings = COUNTRY_DATABASE[normalizedCountry];
    
    if (!settings) {
      console.warn(`País não encontrado: ${countryName}. Usando padrão Brasil.`);
      return COUNTRY_DATABASE['Brasil'];
    }
    
    return settings;
  }
  
  /**
   * Detecta configurações por URL (se disponível)
   */
  detectByUrl(url: string): CountrySettings | null {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // TLDs específicos
      const tldMap: Record<string, string> = {
        '.br': 'Brasil',
        '.pl': 'Polônia',
        '.com': 'Estados Unidos',
        '.de': 'Alemanha',
        '.fr': 'França',
        '.es': 'Espanha',
        '.pt': 'Portugal'
      };
      
      for (const [tld, country] of Object.entries(tldMap)) {
        if (domain.endsWith(tld)) {
          return this.detectByCountry(country);
        }
      }
      
      // Subdomínios específicos
      const subdomainMap: Record<string, string> = {
        'br.': 'Brasil',
        'pl.': 'Polônia',
        'us.': 'Estados Unidos',
        'de.': 'Alemanha',
        'fr.': 'França',
        'es.': 'Espanha',
        'pt.': 'Portugal'
      };
      
      for (const [subdomain, country] of Object.entries(subdomainMap)) {
        if (domain.includes(subdomain)) {
          return this.detectByCountry(country);
        }
      }
      
      return null;
      
    } catch (error) {
      console.error('Erro ao detectar país por URL:', error);
      return null;
    }
  }
  
  /**
   * Formata preço de acordo com as configurações do país
   */
  formatPrice(amount: number, settings: CountrySettings): string {
    const { currency, numberFormat } = settings;
    
    // Formata número
    const formattedNumber = amount
      .toFixed(2)
      .replace('.', '|DECIMAL|')
      .replace(/\B(?=(\d{3})+(?!\d))/g, numberFormat.thousands)
      .replace('|DECIMAL|', numberFormat.decimal);
    
    // Adiciona símbolo da moeda
    const currencySymbols: Record<string, string> = {
      'BRL': 'R$',
      'PLN': 'zł',
      'USD': '$',
      'EUR': '€'
    };
    
    const symbol = currencySymbols[currency] || currency;
    
    return numberFormat.currencyPosition === 'before' 
      ? `${symbol} ${formattedNumber}`
      : `${formattedNumber} ${symbol}`;
  }
  
  /**
   * Traduz palavras-chave para o idioma do país
   */
  translateKeywords(keywords: string[], settings: CountrySettings): string[] {
    const { commonWords } = settings;
    
    const translationMap: Record<string, keyof typeof commonWords> = {
      'buy': 'buy',
      'comprar': 'buy',
      'now': 'now',
      'agora': 'now',
      'free': 'free',
      'gratis': 'free',
      'guarantee': 'guarantee',
      'garantia': 'guarantee',
      'discount': 'discount',
      'desconto': 'discount',
      'limited': 'limited',
      'limitado': 'limited',
      'today': 'today',
      'hoje': 'today',
      'official': 'official',
      'oficial': 'official'
    };
    
    return keywords.map(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      const translationKey = translationMap[lowerKeyword];
      
      return translationKey ? commonWords[translationKey] : keyword;
    });
  }
  
  /**
   * Gera copy localizada para headlines/descrições
   */
  generateLocalizedCopy(template: string, settings: CountrySettings): string {
    const { commonWords } = settings;
    
    let localizedCopy = template;
    
    // Substitui placeholders
    const placeholders: Record<string, string> = {
      '{BUY}': commonWords.buy,
      '{NOW}': commonWords.now,
      '{FREE}': commonWords.free,
      '{GUARANTEE}': commonWords.guarantee,
      '{DISCOUNT}': commonWords.discount,
      '{LIMITED}': commonWords.limited,
      '{TODAY}': commonWords.today,
      '{OFFICIAL}': commonWords.official
    };
    
    Object.entries(placeholders).forEach(([placeholder, translation]) => {
      localizedCopy = localizedCopy.replace(new RegExp(placeholder, 'gi'), translation);
    });
    
    return localizedCopy;
  }
  
  /**
   * Obtém configurações de timezone para campanhas
   */
  getTimezoneSettings(settings: CountrySettings) {
    return {
      timezone: settings.timezone,
      locale: settings.locale,
      // Horários ideais para cada região (baseado em fuso)
      peakHours: this.getPeakHours(settings.timezone),
      workingDays: this.getWorkingDays(settings.country)
    };
  }
  
  /**
   * Lista todos os países suportados
   */
  getSupportedCountries(): string[] {
    return Object.keys(COUNTRY_DATABASE);
  }
  
  /**
   * Exporta configurações para Google Ads API
   */
  getAdWordsConfig(settings: CountrySettings) {
    return {
      countryCode: settings.adWordsCountryCode,
      languageCode: settings.adWordsLanguageCode,
      currency: settings.currency,
      timezone: settings.timezone
    };
  }
  
  // Private methods
  
  private normalizeCountryName(countryName: string): string {
    // Remove emojis de bandeira
    const cleaned = countryName.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
    
    // Mapeia variações comuns
    const variations: Record<string, string> = {
      'poland': 'Polônia',
      'usa': 'Estados Unidos',
      'us': 'Estados Unidos',
      'germany': 'Alemanha',
      'france': 'França',
      'spain': 'Espanha',
      'brazil': 'Brasil',
      'portugal': 'Portugal'
    };
    
    return variations[cleaned.toLowerCase()] || cleaned;
  }
  
  private getPeakHours(timezone: string): number[] {
    // Horários de pico baseados no fuso (formato 24h)
    const peaksByTimezone: Record<string, number[]> = {
      'America/Sao_Paulo': [10, 11, 14, 15, 19, 20], // Brasil
      'Europe/Warsaw': [9, 10, 13, 14, 18, 19], // Polônia
      'America/New_York': [10, 11, 14, 15, 19, 20], // EUA
      'Europe/Berlin': [9, 10, 13, 14, 18, 19], // Alemanha
      'Europe/Paris': [9, 10, 13, 14, 18, 19], // França
      'Europe/Madrid': [10, 11, 14, 15, 19, 20], // Espanha
      'Europe/Lisbon': [9, 10, 13, 14, 18, 19] // Portugal
    };
    
    return peaksByTimezone[timezone] || [10, 11, 14, 15, 19, 20];
  }
  
  private getWorkingDays(country: string): number[] {
    // Dias da semana (1=Segunda, 7=Domingo)
    // A maioria dos países: Segunda-Sexta
    return [1, 2, 3, 4, 5];
  }
}

// Export singleton
export const countryDetector = new CountryDetector();