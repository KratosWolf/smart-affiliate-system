export const AFFILIATE_PLATFORMS = [
  { code: 'CLICKBANK', name: 'ClickBank', icon: '🏦' },
  { code: 'BUYGOODS', name: 'BuyGoods', icon: '🛍️' },
  { code: 'MAXWEB', name: 'Max Web', icon: '🌐' },
  { code: 'GURUMIDIA', name: 'GuruMídia', icon: '📈' },
  { code: 'SMARTADV', name: 'Smart ADV', icon: '🎯' },
  { code: 'DIGISTORE24', name: 'Digistore24', icon: '🏪' },
  { code: 'ADCOMBO', name: 'AdCombo', icon: '🤝' },
  { code: 'DRCASH', name: 'DR Cash', icon: '💰' },
  { code: 'MIDIA_SCALERS', name: 'Midia Scalers', icon: '📊' },
  { code: 'SMASH_LOUD', name: 'Smash Loud', icon: '🔊' }
] as const;

export const PLATFORM_OPTIONS = AFFILIATE_PLATFORMS.map(platform => ({
  value: platform.code,
  label: `${platform.icon} ${platform.name}`
}));

// For compatibility with existing code
export const SUPPORTED_PLATFORMS = AFFILIATE_PLATFORMS.map(p => p.code);
export const PLATFORM_NAMES = Object.fromEntries(
  AFFILIATE_PLATFORMS.map(p => [p.code, p.name])
);

// Platform categories for discovery  
export const PLATFORM_CATEGORIES = {
  international: ['CLICKBANK', 'BUYGOODS', 'MAXWEB', 'GURUMIDIA', 'SMARTADV', 'DIGISTORE24', 'ADCOMBO', 'DRCASH', 'MIDIA_SCALERS', 'SMASH_LOUD']
} as const;

// All platforms are international - no Brazilian-specific platforms