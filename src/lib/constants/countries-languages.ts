/**
 * 🌍 MAPEAMENTO PAÍS → IDIOMA
 * Baseado nos testes realizados pelo usuário
 */

export interface CountryInfo {
  code: string
  name: string
  flag: string
  language: string
  languageCode: string
}

export const COUNTRY_LANGUAGE_MAP: Record<string, CountryInfo> = {
  // Testados pelo usuário
  'HU': {
    code: 'HU',
    name: 'Hungria',
    flag: '🇭🇺',
    language: 'Húngaro',
    languageCode: 'hu-HU'
  },
  'DE': {
    code: 'DE',
    name: 'Alemanha',
    flag: '🇩🇪',
    language: 'Alemão',
    languageCode: 'de-DE'
  },
  'ES': {
    code: 'ES',
    name: 'Espanha',
    flag: '🇪🇸',
    language: 'Espanhol',
    languageCode: 'es-ES'
  },
  'PL': {
    code: 'PL',
    name: 'Polônia',
    flag: '🇵🇱',
    language: 'Polonês',
    languageCode: 'pl-PL'
  },

  // Países adicionais
  'BR': {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    language: 'Português',
    languageCode: 'pt-BR'
  },
  'US': {
    code: 'US',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    language: 'Inglês',
    languageCode: 'en-US'
  },
  'FR': {
    code: 'FR',
    name: 'França',
    flag: '🇫🇷',
    language: 'Francês',
    languageCode: 'fr-FR'
  },
  'IT': {
    code: 'IT',
    name: 'Itália',
    flag: '🇮🇹',
    language: 'Italiano',
    languageCode: 'it-IT'
  },
  'PT': {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    language: 'Português',
    languageCode: 'pt-PT'
  },
  'MX': {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    language: 'Espanhol',
    languageCode: 'es-MX'
  }
}

export const COUNTRIES_LIST = Object.values(COUNTRY_LANGUAGE_MAP)

export function getLanguageForCountry(countryCode: string): string {
  return COUNTRY_LANGUAGE_MAP[countryCode]?.languageCode || 'en-US'
}

export function getCountryInfo(countryCode: string): CountryInfo | null {
  return COUNTRY_LANGUAGE_MAP[countryCode] || null
}