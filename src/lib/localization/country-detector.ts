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
  },
  
  // English-speaking markets
  'Canadá': {
    country: 'Canadá',
    language: 'en-CA',
    currency: 'CAD',
    locale: 'en-CA',
    timezone: 'America/Toronto',
    adWordsCountryCode: '2124',
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
  
  'Reino Unido': {
    country: 'Reino Unido',
    language: 'en-GB',
    currency: 'GBP',
    locale: 'en-GB',
    timezone: 'Europe/London',
    adWordsCountryCode: '2826',
    adWordsLanguageCode: '2057',
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
  
  'Austrália': {
    country: 'Austrália',
    language: 'en-AU',
    currency: 'AUD',
    locale: 'en-AU',
    timezone: 'Australia/Sydney',
    adWordsCountryCode: '2036',
    adWordsLanguageCode: '3081',
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
  
  // Major European markets
  'Itália': {
    country: 'Itália',
    language: 'it-IT',
    currency: 'EUR',
    locale: 'it-IT',
    timezone: 'Europe/Rome',
    adWordsCountryCode: '2380',
    adWordsLanguageCode: '1040',
    commonWords: {
      buy: 'acquista',
      now: 'ora',
      free: 'gratis',
      guarantee: 'garanzia',
      discount: 'sconto',
      limited: 'limitato',
      today: 'oggi',
      official: 'ufficiale'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'after'
    }
  },
  
  'Holanda': {
    country: 'Holanda',
    language: 'nl-NL',
    currency: 'EUR',
    locale: 'nl-NL',
    timezone: 'Europe/Amsterdam',
    adWordsCountryCode: '2528',
    adWordsLanguageCode: '1043',
    commonWords: {
      buy: 'kopen',
      now: 'nu',
      free: 'gratis',
      guarantee: 'garantie',
      discount: 'korting',
      limited: 'beperkt',
      today: 'vandaag',
      official: 'officieel'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'before'
    }
  },
  
  'Bélgica': {
    country: 'Bélgica',
    language: 'nl-BE',
    currency: 'EUR',
    locale: 'nl-BE',
    timezone: 'Europe/Brussels',
    adWordsCountryCode: '2056',
    adWordsLanguageCode: '2067',
    commonWords: {
      buy: 'kopen',
      now: 'nu',
      free: 'gratis',
      guarantee: 'garantie',
      discount: 'korting',
      limited: 'beperkt',
      today: 'vandaag',
      official: 'officieel'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'before'
    }
  },
  
  'Suécia': {
    country: 'Suécia',
    language: 'sv-SE',
    currency: 'SEK',
    locale: 'sv-SE',
    timezone: 'Europe/Stockholm',
    adWordsCountryCode: '2752',
    adWordsLanguageCode: '1053',
    commonWords: {
      buy: 'köp',
      now: 'nu',
      free: 'gratis',
      guarantee: 'garanti',
      discount: 'rabatt',
      limited: 'begränsad',
      today: 'idag',
      official: 'officiell'
    },
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currencyPosition: 'after'
    }
  },
  
  'Noruega': {
    country: 'Noruega',
    language: 'nb-NO',
    currency: 'NOK',
    locale: 'nb-NO',
    timezone: 'Europe/Oslo',
    adWordsCountryCode: '2578',
    adWordsLanguageCode: '1044',
    commonWords: {
      buy: 'kjøp',
      now: 'nå',
      free: 'gratis',
      guarantee: 'garanti',
      discount: 'rabatt',
      limited: 'begrenset',
      today: 'i dag',
      official: 'offisiell'
    },
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currencyPosition: 'after'
    }
  },
  
  'Dinamarca': {
    country: 'Dinamarca',
    language: 'da-DK',
    currency: 'DKK',
    locale: 'da-DK',
    timezone: 'Europe/Copenhagen',
    adWordsCountryCode: '2208',
    adWordsLanguageCode: '1030',
    commonWords: {
      buy: 'køb',
      now: 'nu',
      free: 'gratis',
      guarantee: 'garanti',
      discount: 'rabat',
      limited: 'begrænset',
      today: 'i dag',
      official: 'officiel'
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currencyPosition: 'after'
    }
  },
  
  'Suíça': {
    country: 'Suíça',
    language: 'de-CH',
    currency: 'CHF',
    locale: 'de-CH',
    timezone: 'Europe/Zurich',
    adWordsCountryCode: '2756',
    adWordsLanguageCode: '2055',
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
      decimal: '.',
      thousands: '\'',
      currencyPosition: 'before'
    }
  },
  
  'Áustria': {
    country: 'Áustria',
    language: 'de-AT',
    currency: 'EUR',
    locale: 'de-AT',
    timezone: 'Europe/Vienna',
    adWordsCountryCode: '2040',
    adWordsLanguageCode: '3079',
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
      currencyPosition: 'before'
    }
  },
  
  // Latin America
  'Argentina': {
    country: 'Argentina',
    language: 'es-AR',
    currency: 'ARS',
    locale: 'es-AR',
    timezone: 'America/Buenos_Aires',
    adWordsCountryCode: '2032',
    adWordsLanguageCode: '11274',
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
      currencyPosition: 'before'
    }
  },
  
  'Chile': {
    country: 'Chile',
    language: 'es-CL',
    currency: 'CLP',
    locale: 'es-CL',
    timezone: 'America/Santiago',
    adWordsCountryCode: '2152',
    adWordsLanguageCode: '13322',
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
      currencyPosition: 'before'
    }
  },
  
  'Colômbia': {
    country: 'Colômbia',
    language: 'es-CO',
    currency: 'COP',
    locale: 'es-CO',
    timezone: 'America/Bogota',
    adWordsCountryCode: '2170',
    adWordsLanguageCode: '9226',
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
      currencyPosition: 'before'
    }
  },
  
  'Peru': {
    country: 'Peru',
    language: 'es-PE',
    currency: 'PEN',
    locale: 'es-PE',
    timezone: 'America/Lima',
    adWordsCountryCode: '2604',
    adWordsLanguageCode: '10250',
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
      decimal: '.',
      thousands: ',',
      currencyPosition: 'before'
    }
  },
  
  'México': {
    country: 'México',
    language: 'es-MX',
    currency: 'MXN',
    locale: 'es-MX',
    timezone: 'America/Mexico_City',
    adWordsCountryCode: '2484',
    adWordsLanguageCode: '8202',
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
      decimal: '.',
      thousands: ',',
      currencyPosition: 'before'
    }
  },
  
  'Uruguai': {
    country: 'Uruguai',
    language: 'es-UY',
    currency: 'UYU',
    locale: 'es-UY',
    timezone: 'America/Montevideo',
    adWordsCountryCode: '2858',
    adWordsLanguageCode: '14346',
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
      currencyPosition: 'before'
    }
  },
  
  'Equador': {
    country: 'Equador',
    language: 'es-EC',
    currency: 'USD',
    locale: 'es-EC',
    timezone: 'America/Guayaquil',
    adWordsCountryCode: '2218',
    adWordsLanguageCode: '12298',
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
      decimal: '.',
      thousands: ',',
      currencyPosition: 'before'
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
        '.ca': 'Canadá',
        '.uk': 'Reino Unido',
        '.co.uk': 'Reino Unido',
        '.au': 'Austrália',
        '.com.au': 'Austrália',
        '.de': 'Alemanha',
        '.fr': 'França',
        '.es': 'Espanha',
        '.pt': 'Portugal',
        '.it': 'Itália',
        '.nl': 'Holanda',
        '.be': 'Bélgica',
        '.se': 'Suécia',
        '.no': 'Noruega',
        '.dk': 'Dinamarca',
        '.ch': 'Suíça',
        '.at': 'Áustria',
        '.ar': 'Argentina',
        '.cl': 'Chile',
        '.co': 'Colômbia',
        '.pe': 'Peru',
        '.mx': 'México',
        '.uy': 'Uruguai',
        '.ec': 'Equador'
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
      'united states': 'Estados Unidos',
      'canada': 'Canadá',
      'uk': 'Reino Unido',
      'united kingdom': 'Reino Unido',
      'great britain': 'Reino Unido',
      'britain': 'Reino Unido',
      'england': 'Reino Unido',
      'australia': 'Austrália',
      'germany': 'Alemanha',
      'france': 'França',
      'spain': 'Espanha',
      'brazil': 'Brasil',
      'portugal': 'Portugal',
      'italy': 'Itália',
      'netherlands': 'Holanda',
      'holland': 'Holanda',
      'belgium': 'Bélgica',
      'sweden': 'Suécia',
      'norway': 'Noruega',
      'denmark': 'Dinamarca',
      'switzerland': 'Suíça',
      'austria': 'Áustria',
      'argentina': 'Argentina',
      'chile': 'Chile',
      'colombia': 'Colômbia',
      'peru': 'Peru',
      'mexico': 'México',
      'uruguay': 'Uruguai',
      'ecuador': 'Equador'
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