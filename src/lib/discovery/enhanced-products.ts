/**
 * Enhanced Product Data with CPA and Physical Products
 */

export const enhancedProductDatabase = {
  smartadv: [
    {
      id: 'keto-diet-2024',
      title: 'Ultimate Keto Diet Plan 2024',
      category: 'health_fitness',
      paymentType: 'cpa' as const,
      cpaValue: 65,
      averagePrice: 49,
      trending: true,
      gravity: 0
    },
    {
      id: 'crypto-mastery',
      title: 'Crypto Trading Mastery',
      category: 'make_money_online',
      paymentType: 'cpa' as const,
      cpaValue: 120,
      averagePrice: 297,
      trending: false,
      gravity: 0
    },
    {
      id: 'mindfulness-app',
      title: 'Mindfulness Meditation App',
      category: 'personal_development',
      paymentType: 'cpa' as const,
      cpaValue: 45,
      averagePrice: 97,
      trending: true,
      gravity: 0
    }
  ],

  drcash: [
    {
      id: 'fitness-tracker-pro',
      title: 'Fitness Tracker Pro 2024',
      category: 'econ',
      paymentType: 'cpa' as const,
      cpaValue: 45,
      averagePrice: 89,
      trending: true,
      gravity: 0
    },
    {
      id: 'smart-scale',
      title: 'Smart Body Scale WiFi',
      category: 'econ',
      paymentType: 'hybrid' as const,
      cpaValue: 25,
      commission: 15,
      averagePrice: 59,
      trending: false,
      gravity: 0
    },
    {
      id: 'protein-powder',
      title: 'Premium Whey Protein',
      category: 'econ',
      paymentType: 'cpa' as const,
      cpaValue: 35,
      averagePrice: 79,
      trending: true,
      gravity: 0
    },
    {
      id: 'yoga-mat-premium',
      title: 'Premium Eco Yoga Mat',
      category: 'econ',
      paymentType: 'cpa' as const,
      cpaValue: 28,
      averagePrice: 49,
      trending: false,
      gravity: 0
    },
    {
      id: 'air-purifier',
      title: 'Smart Air Purifier HEPA',
      category: 'econ',
      paymentType: 'hybrid' as const,
      cpaValue: 55,
      commission: 12,
      averagePrice: 159,
      trending: true,
      gravity: 0
    }
  ],

  warriorplus: [
    {
      id: 'affiliate-blueprint',
      title: 'Affiliate Marketing Blueprint 2024',
      category: 'make_money_online',
      paymentType: 'commission' as const,
      commission: 75,
      averagePrice: 47,
      trending: true,
      gravity: 0
    },
    {
      id: 'funnel-master',
      title: 'Sales Funnel Mastery Course',
      category: 'business_marketing',
      paymentType: 'commission' as const,
      commission: 68,
      averagePrice: 127,
      trending: false,
      gravity: 0
    }
  ],

  jvzoo: [
    {
      id: 'seo-software-2024',
      title: 'SEO Analytics Software Suite',
      category: 'technology_software',
      paymentType: 'commission' as const,
      commission: 50,
      averagePrice: 197,
      trending: true,
      gravity: 0
    },
    {
      id: 'social-scheduler',
      title: 'Social Media Scheduler Pro',
      category: 'technology_software',
      paymentType: 'hybrid' as const,
      cpaValue: 35,
      commission: 25,
      averagePrice: 97,
      trending: false,
      gravity: 0
    }
  ]
}

export const categoryNames = {
  'health_fitness': '💪 Health & Fitness',
  'make_money_online': '💰 Make Money Online',
  'personal_development': '🧠 Personal Development',
  'business_marketing': '📈 Business & Marketing',
  'technology_software': '💻 Technology & Software',
  'relationships_dating': '❤️ Relationships & Dating',
  'econ': '🛍️ Physical Products'
}