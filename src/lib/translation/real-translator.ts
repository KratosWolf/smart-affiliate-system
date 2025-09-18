// Real Translation System - Production Ready
import { getCurrencyForCountry } from '@/lib/constants/currencies'

export interface TranslationOptions {
  targetLanguage: string
  countryCode: string
  productName: string
}

// Comprehensive translation dictionaries for major markets
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // POLISH (Poland)
  'PL': {
    'Frete Grátis': 'Darmowa Dostawa',
    'Desconto Exclusivo': 'Ekskluzywna Zniżka',
    'Site Oficial': 'Oficjalna Strona',
    'Melhor Preço': 'Najlepsza Cena',
    'Compre': 'Kup',
    'Original': 'Oryginalny',
    'Oficial': 'Oficjalny',
    'com Desconto': 'ze Zniżką',
    'Oferta': 'Oferta',
    'Entrega Rápida': 'Szybka Dostawa',
    'Promoção': 'Promocja',
    'Direto': 'Bezpośrednio',
    'Loja Oficial': 'Oficjalny Sklep',
    'Genuíno': 'Autentyczny',
    'Super Oferta': 'Super Oferta',
    'Exclusivo': 'Ekskluzywny',
    'Premium': 'Premium',
    'Autêntico': 'Autentyczny',
    'Liquidação': 'Wyprzedaż',
    'Comprar': 'Kup',
    'Online': 'Online',
    'Loja Confiável': 'Zaufany Sklep',
    'Produto Original': 'Oryginalny Produkt',
    'Entrega Segura': 'Bezpieczna Dostawa',

    // Descriptions
    'original com frete grátis': 'oryginalny z darmową dostawą',
    'Oferta por tempo limitado': 'Oferta przez ograniczony czas',
    'Site oficial com entrega rápida': 'Oficjalna strona z szybką dostawą',
    'melhor preço garantido': 'najlepsza gwarantowana cena',
    'Compre agora no site oficial': 'Kup teraz na oficjalnej stronie',
    'Frete grátis para todo Brasil': 'Darmowa dostawa w całej Polsce',
    'Aproveite': 'Skorzystaj',
    'Produto original com garantia': 'Oryginalny produkt z gwarancją',
    'nunca foi tão fácil': 'nigdy nie było tak łatwo',
    'direto da loja oficial': 'bezpośrednio z oficjalnego sklepu',
    'acima de': 'powyżej',
    'imperdível': 'nie do przegapienia',
    'por tempo limitado': 'przez ograniczony czas',
    'genuíno': 'autentyczny',

    // Sitelinks
    'Sobre': 'O',
    'Conheça todos os benefícios': 'Poznaj wszystkie korzyści',
    'Como Funciona': 'Jak to działa',
    'Veja o passo a passo completo': 'Zobacz kompletny przewodnik krok po kroku',
    'Benefícios': 'Korzyści',
    'Descubra todas as vantagens': 'Odkryj wszystkie zalety',
    'Comprar Agora': 'Kup Teraz',
    'Adquira com desconto exclusivo': 'Kup z ekskluzywną zniżką',
    'Ofertas Especiais': 'Oferty Specjalne',
    'Promoções por tempo limitado': 'Promocje na ograniczony czas',
    'Formas de Pagamento': 'Sposoby Płatności',
    'Cartão, PIX ou boleto': 'Karta, BLIK lub przelew',
    'Garantia': 'Gwarancja',
    '30 dias para devolução': '30 dni na zwrot',
    'Suporte 24h': 'Wsparcie 24h',
    'Atendimento sempre disponível': 'Obsługa zawsze dostępna',
    'Política de Troca': 'Polityka Zwrotów',
    'Troca fácil e sem burocracia': 'Łatwy zwrot bez biurokracji',
    'Entrega gratuita em todo país': 'Darmowa dostawa w całym kraju',
    'Entrega Expressa': 'Dostawa Ekspresowa',
    'Receba em até 2 dias úteis': 'Otrzymaj w ciągu 2 dni roboczych',
    'Rastrear Pedido': 'Śledź Zamówienie',
    'Acompanhe sua encomenda': 'Śledź swoją przesyłkę',

    // Callouts & Snippets
    'Garantia 30 dias': 'Gwarancja 30 Dni',
    'Sem Taxa Extra': 'Bez Dodatkowych Opłat',
    'Cashback': 'Cashback',
    'Parcele sem Juros': 'Raty Bez Odsetek',
    'Devolução Grátis': 'Darmowy Zwrot',
    'Empresa Confiável': 'Zaufana Firma',
    'Compra Protegida': 'Chroniony Zakup',
    'Certificado': 'Certyfikowany',
    'Garantia Total': 'Pełna Gwarancja',
    'Sem Taxa': 'Bez Opłat'
  },

  // GERMAN (Germany, Austria)
  'DE': {
    'Frete Grátis': 'Kostenloser Versand',
    'Desconto Exclusivo': 'Exklusiver Rabatt',
    'Site Oficial': 'Offizielle Website',
    'Melhor Preço': 'Bester Preis',
    'Compre': 'Kaufen',
    'Original': 'Original',
    'Oficial': 'Offiziell',
    'com Desconto': 'mit Rabatt',
    'Oferta': 'Angebot',
    'Entrega Rápida': 'Schnelle Lieferung',
    'Promoção': 'Promotion',
    'Direto': 'Direkt',
    'Loja Oficial': 'Offizieller Shop',
    'Genuíno': 'Echt',
    'Super Oferta': 'Super Angebot',
    'Exclusivo': 'Exklusiv',
    'Premium': 'Premium',
    'Autêntico': 'Authentisch',
    'Liquidação': 'Ausverkauf'
  },

  // SPANISH (Spain)
  'ES': {
    'Frete Grátis': 'Envío Gratis',
    'Desconto Exclusivo': 'Descuento Exclusivo',
    'Site Oficial': 'Sitio Oficial',
    'Melhor Preço': 'Mejor Precio',
    'Compre': 'Comprar',
    'Original': 'Original',
    'Oficial': 'Oficial',
    'com Desconto': 'con Descuento',
    'Oferta': 'Oferta',
    'Entrega Rápida': 'Entrega Rápida',
    'Promoção': 'Promoción',
    'Direto': 'Directo',
    'Loja Oficial': 'Tienda Oficial',
    'Genuíno': 'Genuino',
    'Super Oferta': 'Super Oferta',
    'Exclusivo': 'Exclusivo',
    'Premium': 'Premium',
    'Autêntico': 'Auténtico',
    'Liquidação': 'Liquidación'
  },

  // FRENCH (France)
  'FR': {
    'Frete Grátis': 'Livraison Gratuite',
    'Desconto Exclusivo': 'Remise Exclusive',
    'Site Oficial': 'Site Officiel',
    'Melhor Preço': 'Meilleur Prix',
    'Compre': 'Acheter',
    'Original': 'Original',
    'Oficial': 'Officiel',
    'com Desconto': 'avec Remise',
    'Oferta': 'Offre',
    'Entrega Rápida': 'Livraison Rapide',
    'Promoção': 'Promotion',
    'Direto': 'Direct',
    'Loja Oficial': 'Boutique Officielle',
    'Genuíno': 'Authentique',
    'Super Oferta': 'Super Offre',
    'Exclusivo': 'Exclusif',
    'Premium': 'Premium',
    'Autêntico': 'Authentique',
    'Liquidação': 'Liquidation'
  },

  // ITALIAN (Italy)
  'IT': {
    'Frete Grátis': 'Spedizione Gratuita',
    'Desconto Exclusivo': 'Sconto Esclusivo',
    'Site Oficial': 'Sito Ufficiale',
    'Melhor Preço': 'Miglior Prezzo',
    'Compre': 'Acquista',
    'Original': 'Originale',
    'Oficial': 'Ufficiale',
    'com Desconto': 'con Sconto',
    'Oferta': 'Offerta',
    'Entrega Rápida': 'Consegna Veloce',
    'Promoção': 'Promozione',
    'Direto': 'Diretto',
    'Loja Oficial': 'Negozio Ufficiale',
    'Genuíno': 'Genuino',
    'Super Oferta': 'Super Offerta',
    'Exclusivo': 'Esclusivo',
    'Premium': 'Premium',
    'Autêntico': 'Autentico',
    'Liquidação': 'Liquidazione'
  },

  // HUNGARIAN (Hungary)
  'HU': {
    'Frete Grátis': 'Ingyenes Szállítás',
    'Desconto Exclusivo': 'Exkluzív Kedvezmény',
    'Site Oficial': 'Hivatalos Oldal',
    'Melhor Preço': 'Legjobb Ár',
    'Compre': 'Vásároljon',
    'Original': 'Eredeti',
    'Oficial': 'Hivatalos',
    'com Desconto': 'Kedvezménnyel',
    'Oferta': 'Ajánlat',
    'Entrega Rápida': 'Gyors Szállítás',
    'Promoção': 'Akció',
    'Direto': 'Közvetlen',
    'Loja Oficial': 'Hivatalos Üzlet',
    'Genuíno': 'Valódi',
    'Super Oferta': 'Szuper Ajánlat',
    'Exclusivo': 'Exkluzív',
    'Premium': 'Prémium',
    'Autêntico': 'Hiteles',
    'Liquidação': 'Kiárusítás',

    // Descriptions
    'original com frete grátis': 'eredeti ingyenes szállítással',
    'Oferta por tempo limitado': 'Korlátozott idejű ajánlat',
    'Site oficial com entrega rápida': 'Hivatalos oldal gyors szállítással',
    'melhor preço garantido': 'garantált legjobb ár',
    'Compre agora no site oficial': 'Vásároljon most a hivatalos oldalon',
    'Frete grátis para todo Brasil': 'Ingyenes szállítás egész Magyarországon',
    'Aproveite': 'Használja ki',
    'Produto original com garantia': 'Eredeti termék garanciával',
    'nunca foi tão fácil': 'még soha nem volt ilyen könnyű',
    'direto da loja oficial': 'közvetlenül a hivatalos üzletből',
    'acima de': 'felett',
    'imperdível': 'kihagyhatatlan',
    'por tempo limitado': 'korlátozott ideig',
    'genuíno': 'valódi',

    // Sitelinks
    'Sobre': 'Rólunk',
    'Conheça todos os benefícios': 'Ismerje meg az összes előnyt',
    'Como Funciona': 'Hogyan Működik',
    'Veja o passo a passo completo': 'Tekintse meg a teljes útmutatót',
    'Benefícios': 'Előnyök',
    'Descubra todas as vantagens': 'Fedezze fel az összes előnyt',
    'Comprar Agora': 'Vásárlás Most',
    'Adquira com desconto exclusivo': 'Szerezze be exkluzív kedvezménnyel',
    'Garantia': 'Garancia',
    '30 dias para devolução': '30 napos visszatérítés',
    'Suporte 24h': '24 órás Támogatás',
    'Atendimento sempre disponível': 'Mindig elérhető ügyfélszolgálat',

    // Callouts & Snippets
    'Garantia 30 dias': '30 Napos Garancia',
    'Sem Taxa Extra': 'Extra díj nélkül',
    'Cashback': 'Visszatérítés',
    'Parcele sem Juros': 'Kamatmentes Részletfizetés',
    'Devolução Grátis': 'Ingyenes Visszaküldés',
    'Empresa Confiável': 'Megbízható Cég',
    'Compra Protegida': 'Védett Vásárlás',
    'Certificado': 'Tanúsított',
    'Garantia Total': 'Teljes Garancia',
    'Sem Taxa': 'Díjmentes'
  }
}

export class RealTranslator {
  private options: TranslationOptions

  constructor(options: TranslationOptions) {
    this.options = options
  }

  async translateText(text: string): Promise<string> {
    // If target is Portuguese/Brazil, return as-is
    if (this.options.countryCode === 'BR' || this.options.targetLanguage === 'pt-BR') {
      return text.replace(/\{ProductName\}/g, this.options.productName)
    }

    // Get translation dictionary for target country
    const translations = TRANSLATIONS[this.options.countryCode]

    if (!translations) {
      console.warn(`No translations available for country: ${this.options.countryCode}`)
      return text.replace(/\{ProductName\}/g, this.options.productName)
    }

    let translatedText = text

    // Replace product name placeholder first
    translatedText = translatedText.replace(/\{ProductName\}/g, this.options.productName)

    // Apply translations in order of length (longest first to avoid partial matches)
    const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length)

    for (const portugueseText of sortedKeys) {
      const translatedVersion = translations[portugueseText]
      // Use global regex with word boundaries where appropriate
      const regex = new RegExp(this.escapeRegex(portugueseText), 'gi')
      translatedText = translatedText.replace(regex, translatedVersion)
    }

    return translatedText
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Get language-specific currency symbol
  getCurrencyDisplay(): string {
    const currency = getCurrencyForCountry(this.options.countryCode)

    const currencyNames: Record<string, Record<string, string>> = {
      'PL': { 'PLN': 'zł' },
      'DE': { 'EUR': '€' },
      'ES': { 'EUR': '€' },
      'FR': { 'EUR': '€' },
      'IT': { 'EUR': '€' }
    }

    return currencyNames[this.options.countryCode]?.[currency] || currency
  }

  // Get localized number format
  formatPrice(amount: number): string {
    const currency = getCurrencyForCountry(this.options.countryCode)
    const symbol = this.getCurrencyDisplay()

    // Polish format: 99,99 zł
    if (this.options.countryCode === 'PL') {
      return `${amount.toFixed(2).replace('.', ',')} ${symbol}`
    }

    // European format: €99,99
    if (['DE', 'ES', 'FR', 'IT'].includes(this.options.countryCode)) {
      return `${symbol}${amount.toFixed(2).replace('.', ',')}`
    }

    // Default format
    return `${symbol}${amount.toFixed(2)}`
  }
}

// Utility function to create translator instance
export function createTranslator(countryCode: string, productName: string): RealTranslator {
  const languageMap: Record<string, string> = {
    'PL': 'pl-PL',
    'DE': 'de-DE',
    'ES': 'es-ES',
    'FR': 'fr-FR',
    'IT': 'it-IT',
    'BR': 'pt-BR',
    'US': 'en-US'
  }

  return new RealTranslator({
    targetLanguage: languageMap[countryCode] || 'en-US',
    countryCode,
    productName
  })
}