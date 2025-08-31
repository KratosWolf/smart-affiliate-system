// Country Settings for Presell Pages
// Temporarily disabled for deployment

export const countrySettings = {
  BR: {
    currency: 'BRL',
    symbol: 'R$',
    language: 'pt-BR'
  },
  US: {
    currency: 'USD',
    symbol: '$',
    language: 'en-US'
  }
}

// Named exports for template compatibility
export const getCountrySettings = (country: string) => countrySettings[country as keyof typeof countrySettings] || countrySettings.US

export default countrySettings