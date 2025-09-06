import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { CampaignData } from '@/lib/types'
import { createSafeCampaignAccess } from '@/lib/validators/campaign.validator'

interface CampaignDisplayProps {
  campaign: CampaignData
  safeAccess: ReturnType<typeof createSafeCampaignAccess>
}

export function CampaignDisplay({ campaign, safeAccess }: CampaignDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Campanha Gerada com Sucesso!
          </CardTitle>
          <CardDescription>
            Revise os detalhes da sua campanha antes de exportar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">📊 Informações da Campanha</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {safeAccess.getCampaignName()}
              </div>
              <div>
                <span className="font-medium">Orçamento:</span> ${safeAccess.getCampaignBudget()}/dia
              </div>
              <div>
                <span className="font-medium">Localizações:</span> {safeAccess.getCampaignLocations()}
              </div>
              <div>
                <span className="font-medium">Keywords:</span> {safeAccess.getKeywordCount()} palavras-chave
              </div>
            </div>
          </div>

          {campaign.keywords && campaign.keywords.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">🔑 Palavras-chave ({campaign.keywords.length})</h3>
              <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                {campaign.keywords.map((kw, i) => (
                  <div key={i} className="text-sm py-1 border-b last:border-0">
                    {kw.text} [{kw.matchType || 'BROAD'}] {kw.cpc && `- CPC: $${kw.cpc}`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaign.ads && campaign.ads.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">📝 Anúncios ({campaign.ads.length})</h3>
              {campaign.ads.map((ad, i) => (
                <Card key={i} className="mb-3">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-sm">Headline:</span>
                        <div className="text-sm text-gray-600">{ad.headline}</div>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Description:</span>
                        <div className="text-sm text-gray-600">{ad.description}</div>
                      </div>
                      {ad.url && (
                        <div>
                          <span className="font-medium text-sm">URL:</span>
                          <div className="text-sm text-blue-600 break-all">{ad.url}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}