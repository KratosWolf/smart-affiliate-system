// Currency mapping for different countries
export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // European Union - Euro
  'DE': 'EUR', // Germany
  'FR': 'EUR', // France  
  'ES': 'EUR', // Spain
  'IT': 'EUR', // Italy
  'AT': 'EUR', // Austria
  'NL': 'EUR', // Netherlands
  'BE': 'EUR', // Belgium
  'PT': 'EUR', // Portugal
  'FI': 'EUR', // Finland
  
  // Individual European Countries
  'PL': 'PLN', // Poland - Zloty
  'UK': 'GBP', // United Kingdom - Pound
  'GB': 'GBP', // United Kingdom - Pound (alternative code)
  'CH': 'CHF', // Switzerland - Franc
  'DK': 'DKK', // Denmark - Krone
  'SE': 'SEK', // Sweden - Krona
  'NO': 'NOK', // Norway - Krone
  'CZ': 'CZK', // Czech Republic - Koruna
  'HU': 'HUF', // Hungary - Forint
  'RO': 'RON', // Romania - Leu
  'BG': 'BGN', // Bulgaria - Lev
  'TR': 'TRY', // Turkey - Lira
  
  // Americas
  'US': 'USD', // United States - Dollar
  'CA': 'CAD', // Canada - Dollar
  'BR': 'BRL', // Brazil - Real
  'MX': 'MXN', // Mexico - Peso
  'AR': 'ARS', // Argentina - Peso
  'CL': 'CLP', // Chile - Peso
  'CO': 'COP', // Colombia - Peso
  'PE': 'PEN', // Peru - Sol
  
  // Asia Pacific
  'JP': 'JPY', // Japan - Yen
  'AU': 'AUD', // Australia - Dollar
  'NZ': 'NZD', // New Zealand - Dollar
  'SG': 'SGD', // Singapore - Dollar
  'HK': 'HKD', // Hong Kong - Dollar
  'KR': 'KRW', // South Korea - Won
  'TH': 'THB', // Thailand - Baht
  'MY': 'MYR', // Malaysia - Ringgit
  'ID': 'IDR', // Indonesia - Rupiah
  'PH': 'PHP', // Philippines - Peso
  'VN': 'VND', // Vietnam - Dong
  'IN': 'INR', // India - Rupee
  'CN': 'CNY', // China - Yuan
  
  // Middle East & Africa
  'IL': 'ILS', // Israel - Shekel
  'SA': 'SAR', // Saudi Arabia - Riyal
  'AE': 'AED', // UAE - Dirham
  'ZA': 'ZAR', // South Africa - Rand
  'EG': 'EGP', // Egypt - Pound
  'NG': 'NGN', // Nigeria - Naira
}

// Country name to code mapping
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  // Portuguese names  
  'Brasil': 'BR',
  'Estados Unidos': 'US', 
  'Canadá': 'CA',
  'Reino Unido': 'GB',
  'Austrália': 'AU',
  'Dinamarca': 'DK',
  'Finlândia': 'FI',
  'Suécia': 'SE',
  'Noruega': 'NO',
  'França': 'FR',
  'Alemanha': 'DE',
  'Espanha': 'ES',
  'Portugal': 'PT',
  'Itália': 'IT',
  'Áustria': 'AT',
  'Polônia': 'PL',
  'Romênia': 'RO',
  'Hungria': 'HU',
  'Turquia': 'TR',
  'México': 'MX',
  'Argentina': 'AR',
  'Colômbia': 'CO',
  'Chile': 'CL',
  'Peru': 'PE',
  
  // English names
  'Brazil': 'BR',
  'United States': 'US',
  'Canada': 'CA', 
  'United Kingdom': 'GB',
  'Australia': 'AU',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Sweden': 'SE',
  'Norway': 'NO',
  'France': 'FR',
  'Germany': 'DE',
  'Spain': 'ES',
  'Italy': 'IT',
  'Austria': 'AT',
  'Poland': 'PL',
  'Romania': 'RO',
  'Hungary': 'HU',
  'Turkey': 'TR',
  'Mexico': 'MX',
  'Colombia': 'CO'
}

// Get currency for a country code or name
export function getCurrencyForCountry(countryInput: string): string {
  const input = countryInput.trim()
  
  // First try as country code (2-letter)
  let countryCode = input.toUpperCase()
  if (COUNTRY_CURRENCY_MAP[countryCode]) {
    return COUNTRY_CURRENCY_MAP[countryCode]
  }
  
  // If not found, try as country name
  countryCode = COUNTRY_NAME_TO_CODE[input]
  if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
    return COUNTRY_CURRENCY_MAP[countryCode]
  }
  
  // Default to USD if not found
  return 'USD'
}

// Currency symbols for display
export const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€', 
  'GBP': '£',
  'PLN': 'zł',
  'BRL': 'R$',
  'CAD': 'C$',
  'AUD': 'A$',
  'JPY': '¥',
  'CHF': 'CHF',
  'DKK': 'kr',
  'SEK': 'kr',
  'NOK': 'kr',
  'CZK': 'Kč',
  'HUF': 'Ft',
  'RON': 'lei',
  'TRY': '₺',
  'BGN': 'лв',
  'MXN': '$',
  'ARS': '$',
  'CLP': '$',
  'COP': '$',
  'PEN': 'S/',
  'KRW': '₩',
  'CNY': '¥',
  'INR': '₹',
  'ILS': '₪',
  'ZAR': 'R',
  'THB': '฿',
  'MYR': 'RM',
  'SGD': 'S$',
  'HKD': 'HK$',
  'NZD': 'NZ$',
  'IDR': 'Rp',
  'PHP': '₱',
  'VND': '₫',
  'SAR': '﷼',
  'AED': 'د.إ',
  'EGP': 'E£',
  'NGN': '₦'
}

// Get currency symbol
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency
}

// Get formatted currency display
export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount}`
}