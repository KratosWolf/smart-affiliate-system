export const COUNTRIES = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'AU', name: 'Austrália', flag: '🇦🇺' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlândia', flag: '🇫🇮' },
  { code: 'SE', name: 'Suécia', flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'FR', name: 'França', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹' },
  { code: 'AT', name: 'Áustria', flag: '🇦🇹' },
  { code: 'PL', name: 'Polônia', flag: '🇵🇱' },
  { code: 'RO', name: 'Romênia', flag: '🇷🇴' },
  { code: 'HU', name: 'Hungria', flag: '🇭🇺' },
  { code: 'TR', name: 'Turquia', flag: '🇹🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colômbia', flag: '🇨🇴' }
] as const;

export const COUNTRY_OPTIONS = COUNTRIES.map(country => ({
  value: country.code,
  label: `${country.flag} ${country.name}`
}));

// For compatibility with existing code
export const SUPPORTED_COUNTRIES = COUNTRIES.map(c => c.code);
export const COUNTRY_NAMES = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c.name])
);