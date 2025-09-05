'use client'

import dynamic from 'next/dynamic'

// Carrega o componente apenas no cliente (desabilita SSR completamente)
const CampaignBuilderClient = dynamic(
  () => import('./page-client'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Campaign Builder...</p>
        </div>
      </div>
    )
  }
)

export default function CampaignBuilderPage() {
  return <CampaignBuilderClient />
}