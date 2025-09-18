// Language mapping for different countries
export const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  // Europe
  'DE': 'de-DE', // Germany - German
  'FR': 'fr-FR', // France - French
  'ES': 'es-ES', // Spain - Spanish
  'IT': 'it-IT', // Italy - Italian ⭐️
  'AT': 'de-AT', // Austria - German
  'NL': 'nl-NL', // Netherlands - Dutch
  'BE': 'nl-BE', // Belgium - Dutch/French
  'PL': 'pl-PL', // Poland - Polish
  'UK': 'en-GB', // United Kingdom - English
  'GB': 'en-GB', // United Kingdom - English (alternative)
  'CH': 'de-CH', // Switzerland - German (main)
  'DK': 'da-DK', // Denmark - Danish
  'SE': 'sv-SE', // Sweden - Swedish
  'NO': 'no-NO', // Norway - Norwegian
  'FI': 'fi-FI', // Finland - Finnish
  'CZ': 'cs-CZ', // Czech Republic - Czech
  'HU': 'hu-HU', // Hungary - Hungarian
  'RO': 'ro-RO', // Romania - Romanian
  'BG': 'bg-BG', // Bulgaria - Bulgarian
  'PT': 'pt-PT', // Portugal - Portuguese
  'TR': 'tr-TR', // Turkey - Turkish

  // Americas
  'US': 'en-US', // United States - English
  'CA': 'en-CA', // Canada - English (main)
  'BR': 'pt-BR', // Brazil - Portuguese
  'MX': 'es-MX', // Mexico - Spanish
  'AR': 'es-AR', // Argentina - Spanish
  'CL': 'es-CL', // Chile - Spanish
  'CO': 'es-CO', // Colombia - Spanish
  'PE': 'es-PE', // Peru - Spanish

  // Asia Pacific
  'JP': 'ja-JP', // Japan - Japanese
  'AU': 'en-AU', // Australia - English
  'NZ': 'en-NZ', // New Zealand - English
  'SG': 'en-SG', // Singapore - English
  'HK': 'en-HK', // Hong Kong - English
  'KR': 'ko-KR', // South Korea - Korean
  'TH': 'th-TH', // Thailand - Thai
  'MY': 'en-MY', // Malaysia - English
  'ID': 'id-ID', // Indonesia - Indonesian
  'PH': 'en-PH', // Philippines - English
  'VN': 'vi-VN', // Vietnam - Vietnamese
  'IN': 'en-IN', // India - English
  'CN': 'zh-CN', // China - Chinese

  // Middle East & Africa
  'IL': 'he-IL', // Israel - Hebrew
  'SA': 'ar-SA', // Saudi Arabia - Arabic
  'AE': 'ar-AE', // UAE - Arabic
  'ZA': 'en-ZA', // South Africa - English
  'EG': 'ar-EG', // Egypt - Arabic
  'NG': 'en-NG', // Nigeria - English
}

// Language display names
export const LANGUAGE_NAMES: Record<string, string> = {
  'de-DE': 'Deutsch',
  'fr-FR': 'Français', 
  'es-ES': 'Español',
  'it-IT': 'Italiano', // ⭐️
  'pt-BR': 'Português (Brasil)',
  'pt-PT': 'Português (Portugal)', 
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'en-CA': 'English (Canada)',
  'en-AU': 'English (Australia)',
  'pl-PL': 'Polski',
  'nl-NL': 'Nederlands',
  'da-DK': 'Dansk',
  'sv-SE': 'Svenska',
  'no-NO': 'Norsk',
  'fi-FI': 'Suomi',
  'cs-CZ': 'Čeština',
  'hu-HU': 'Magyar',
  'ro-RO': 'Română',
  'bg-BG': 'Български',
  'tr-TR': 'Türkçe',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'zh-CN': '中文',
  'ar-SA': 'العربية',
  'he-IL': 'עברית',
  'th-TH': 'ไทย',
  'vi-VN': 'Tiếng Việt',
  'id-ID': 'Bahasa Indonesia',
  'de-AT': 'Deutsch (Österreich)',
  'de-CH': 'Deutsch (Schweiz)',
  'nl-BE': 'Nederlands (België)',
  'es-MX': 'Español (México)',
  'es-AR': 'Español (Argentina)',
  'es-CL': 'Español (Chile)',
  'es-CO': 'Español (Colombia)',  
  'es-PE': 'Español (Perú)',
  'en-NZ': 'English (New Zealand)',
  'en-SG': 'English (Singapore)',
  'en-HK': 'English (Hong Kong)',
  'en-MY': 'English (Malaysia)',
  'en-PH': 'English (Philippines)',
  'en-IN': 'English (India)',
  'en-ZA': 'English (South Africa)',
  'en-NG': 'English (Nigeria)',
  'ar-AE': 'العربية (الإمارات)',
  'ar-EG': 'العربية (مصر)'
}

// Get language for a country code
export function getLanguageForCountry(countryCode: string): string {
  const code = countryCode.toUpperCase().trim()
  return COUNTRY_LANGUAGE_MAP[code] || 'en-US' // Default to English US
}

// Get language display name
export function getLanguageName(languageCode: string): string {
  return LANGUAGE_NAMES[languageCode] || languageCode
}

// Get 2-letter language code (for AI translation)
export function getLanguageCode(languageCode: string): string {
  return languageCode.split('-')[0] // 'it-IT' -> 'it'
}

// Italian headlines templates for AI system
export const ITALIAN_HEADLINES_TEMPLATES = [
  'Compra {product} Ora',
  '{product} - Prezzo Migliore', 
  '{product} Originale',
  '{product} - Offerta Speciale',
  'Acquista {product} Online',
  '{product} Naturale',
  '{product} - Garanzia 60 Giorni',
  '{product} Spedizione Gratuita'
]

export const ITALIAN_DESCRIPTIONS_TEMPLATES = [
  '{product} naturale con garanzia di 60 giorni e spedizione gratuita in Italia',
  '{product} premium - formula testata clinicamente con risultati comprovati',
  'Acquista {product} con sicurezza. Pagamento protetto e consegna rapida',
  'Offerta speciale {product} per tempo limitato. Spedizione gratuita per tutta Italia'
]