import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, AlertCircle, Zap } from 'lucide-react'
import { COUNTRY_OPTIONS } from '@/lib/constants/countries'
import { PLATFORM_OPTIONS } from '@/lib/constants/platforms'
import { CampaignParams } from '@/lib/types'

interface CampaignFormProps {
  campaignData: Omit<CampaignParams, 'targetCpa'> & {
    dailyBudget: number
    targetCpa: number
    platform?: string
    commissionValue?: number
    currency?: 'BRL' | 'USD'
    useEdisTracking?: boolean
    edisBaseUrl?: string
    // Campos contextuais da Fase 1
    discountPercentage?: number
    discountAmount?: number
    productPrice?: number
    guaranteePeriod?: string
    deliveryType?: string
  }
  onInputChange: (field: string, value: string | number | boolean) => void
  onSubmit: () => void
  isLoading: boolean
}

export function CampaignForm({ 
  campaignData, 
  onInputChange, 
  onSubmit, 
  isLoading 
}: CampaignFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          Configuração da Campanha
        </CardTitle>
        <CardDescription>
          Configure os dados básicos para gerar uma campanha Google Ads otimizada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <Input
              placeholder="Ex: GlicoShield, NerveCalm, Leptitox"
              value={campaignData.productName}
              onChange={(e) => onInputChange('productName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataforma de Afiliado *
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.platform}
              onChange={(e) => onInputChange('platform', e.target.value)}
            >
              {PLATFORM_OPTIONS.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Comissão *
            </label>
            <Input
              type="number"
              placeholder="100"
              value={campaignData.commissionValue}
              onChange={(e) => onInputChange('commissionValue', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda da Conta Google Ads
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.currency}
              onChange={(e) => onInputChange('currency', e.target.value)}
            >
              <option value="BRL">🇧🇷 Real (BRL)</option>
              <option value="USD">🇺🇸 Dólar (USD)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País de Targeting
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.targetCountry}
              onChange={(e) => onInputChange('targetCountry', e.target.value)}
            >
              {COUNTRY_OPTIONS.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Produto
              <span className="text-gray-500 text-xs ml-2">(Opcional - ajuda na geração de keywords)</span>
            </label>
            <Input
              placeholder="Breve descrição do produto e seus benefícios"
              value={campaignData.description || ''}
              onChange={(e) => onInputChange('description', e.target.value)}
              className="text-lg"
            />
          </div>

          {/* DADOS INTELIGENTES DO PRODUTO - FASE 1 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:col-span-2">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              📊 Dados Inteligentes do Produto (Fase 1)
            </h4>
            <p className="text-blue-600 text-sm mb-4">
              Forneça dados específicos para gerar headlines contextuais mais precisas
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Desconto (%)
                  <span className="text-blue-500 text-xs ml-2">(Opcional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={campaignData.discountPercentage || ''}
                  onChange={(e) => onInputChange('discountPercentage', e.target.value ? Number(e.target.value) : 0)}
                  className="text-lg"
                />
                <p className="text-xs text-blue-600 mt-1">Se fornecido, será usado em headlines específicas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Valor do Produto
                  <span className="text-blue-500 text-xs ml-2">(Recomendado)</span>
                </label>
                <Input
                  type="number"
                  placeholder={`Ex: ${campaignData.currency === 'BRL' ? '149' : '49'}`}
                  value={campaignData.productPrice || ''}
                  onChange={(e) => onInputChange('productPrice', e.target.value ? Number(e.target.value) : 0)}
                  className="text-lg"
                />
                <p className="text-xs text-blue-600 mt-1">Preço do produto para headlines "For Only $X"</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Valor do Desconto
                  <span className="text-blue-500 text-xs ml-2">(Opcional)</span>
                </label>
                <Input
                  type="number"
                  placeholder={`Ex: ${campaignData.currency === 'BRL' ? '100' : '20'}`}
                  value={campaignData.discountAmount || ''}
                  onChange={(e) => onInputChange('discountAmount', e.target.value ? Number(e.target.value) : 0)}
                  className="text-lg"
                />
                <p className="text-xs text-blue-600 mt-1">Valor fixo do desconto em {campaignData.currency}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Período de Garantia
                  <span className="text-blue-500 text-xs ml-2">(Opcional)</span>
                </label>
                <Input
                  placeholder="Ex: 60 dias, 90 dias"
                  value={campaignData.guaranteePeriod || ''}
                  onChange={(e) => onInputChange('guaranteePeriod', e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-blue-600 mt-1">Será usado em headlines de garantia</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Tipo de Entrega
                  <span className="text-blue-500 text-xs ml-2">(Opcional)</span>
                </label>
                <select
                  value={campaignData.deliveryType || ''}
                  onChange={(e) => onInputChange('deliveryType', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md text-lg bg-white"
                >
                  <option value="">Selecionar tipo de entrega...</option>
                  <option value="Frete Grátis">Frete Grátis</option>
                  <option value="Entrega Express">Entrega Express</option>
                  <option value="Entrega Rápida">Entrega Rápida</option>
                  <option value="Entrega Imediata">Entrega Imediata</option>
                  <option value="Free Shipping">Free Shipping (EN)</option>
                  <option value="Express Delivery">Express Delivery (EN)</option>
                </select>
                <p className="text-xs text-blue-600 mt-1">Influencia sitelinks e headlines de entrega</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 md:col-span-2">
            <h4 className="font-semibold text-yellow-800 mb-3">💰 Cálculos Automáticos (Regras do Sistema)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">
                  Orçamento Diário Calculado
                </label>
                <Input
                  type="number"
                  value={campaignData.dailyBudget}
                  disabled
                  className="bg-yellow-100 text-yellow-800 font-semibold"
                />
                <p className="text-xs text-yellow-600 mt-1">
                  📊 Fórmula: Máximo entre {campaignData.currency === 'BRL' ? 'R$350' : '$70'} (mínimo) ou 3.5x da comissão
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">
                  CPA Alvo Calculado (45% da comissão)
                </label>
                <Input
                  type="number"
                  value={campaignData.targetCpa}
                  disabled
                  className="bg-yellow-100 text-yellow-800 font-semibold"
                />
                <p className="text-xs text-yellow-600 mt-1">
                  🎯 45% de {campaignData.currency === 'BRL' ? 'R$' : '$'}{campaignData.commissionValue || 100} = {campaignData.currency === 'BRL' ? 'R$' : '$'}{campaignData.targetCpa}
                </p>
              </div>
            </div>
          </div>

          {/* EDIS Tracking Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="font-semibold text-green-800">📊 Tracking Edis</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={campaignData.useEdisTracking}
                  onChange={(e) => onInputChange('useEdisTracking', e.target.checked)}
                  className="rounded border-green-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-green-700">Ativar tracking</span>
              </label>
            </div>
            
            {campaignData.useEdisTracking && (
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  URL Base do Edis
                </label>
                <Input
                  placeholder="www.test.com"
                  value={campaignData.edisBaseUrl}
                  onChange={(e) => onInputChange('edisBaseUrl', e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-xs text-green-600 mt-1">
                  URLs finais terão: {campaignData.edisBaseUrl}?campaignid={'{campaignid}'}&keyword={'{keyword}'}&network={'{network}'}&extensionid={'{extensionid}'}&matchtype={'{matchtype}'}&adgroupid={'{adgroupid}'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:col-span-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Metodologia Luiz</h4>
                <p className="text-sm text-blue-700">
                  Sistema automatizado baseado nas melhores práticas de campaigns de afiliados de sucesso.
                  Usa estrutura 1 campanha = 1 ad, orçamento fixo R$ 350, e otimização baseada em 3 dias de dados.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onSubmit}
            disabled={isLoading || !campaignData.productName}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Gerando Campanha...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                🚀 Gerar Campanha Google Ads
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}