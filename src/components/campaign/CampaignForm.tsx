import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, AlertCircle, Zap } from 'lucide-react'
import { COUNTRY_OPTIONS } from '@/lib/constants/countries'
import { PLATFORM_OPTIONS } from '@/lib/constants/platforms'
import { CAMPAIGN_TYPES } from '@/lib/constants/campaign-templates'
import { getCurrencyForCountry, getCurrencySymbol } from '@/lib/constants/currencies'
import { CampaignParams } from '@/lib/types'

interface CampaignFormProps {
  campaignData: Omit<CampaignParams, 'targetCpa'> & {
    dailyBudget: number
    targetCpa: number
    platform?: string
    commissionValue?: number
    currency?: string
    accountCurrency?: string // NEW: Google Ads account currency
    // NEW REDESIGN FIELDS
    urlBase?: string
    campaignType?: 'Standard' | 'COD' | 'Review' | 'E-commerce' | 'Produto Restrito'
    useEdisTracking?: boolean
    edisBaseUrl?: string
    // Metodologia Luiz - Preços e descontos
    productPrice?: number
    packQuantity?: number
    packTotalPrice?: number
    // Informações contextuais
    guaranteePeriod?: string
    returnPolicy?: string
    deliveryType?: string
    targetCity?: string
    excludedRegions?: string
    bonuses?: string
    scarcityType?: string
    // Campos calculados (legado)
    discountPercentage?: number
    discountAmount?: number
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

          {/* COMISSÃO E MOEDA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Comissão *
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 45.50"
              value={campaignData.commissionValue || ''}
              onChange={(e) => onInputChange('commissionValue', parseFloat(e.target.value) || 0)}
              className="text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Valor em moeda local da comissão por venda</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda da Comissão *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.currency || 'USD'}
              onChange={(e) => onInputChange('currency', e.target.value)}
            >
              <option value="USD">USD - Dólar Americano ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="BRL">BRL - Real Brasileiro (R$)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Moeda utilizada para cálculos de CPA e comissão</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Base *
            </label>
            <Input
              type="url"
              placeholder="https://exemplo.com"
              value={campaignData.urlBase || ''}
              onChange={(e) => onInputChange('urlBase', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">URL base para tracking da campanha</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda da Conta Google Ads *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.accountCurrency || 'USD'}
              onChange={(e) => onInputChange('accountCurrency', e.target.value)}
            >
              <option value="USD">USD - Dólar Americano ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="BRL">BRL - Real Brasileiro (R$)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Moeda configurada na sua conta do Google Ads</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País de Targeting *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.targetCountry}
              onChange={(e) => {
                onInputChange('targetCountry', e.target.value)
                // Auto-detect currency
                const currency = getCurrencyForCountry(e.target.value)
                onInputChange('currency', currency)
              }}
            >
              {COUNTRY_OPTIONS.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Campanha *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={campaignData.campaignType || 'Standard'}
              onChange={(e) => onInputChange('campaignType', e.target.value)}
            >
              {CAMPAIGN_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Tipo de campanha influencia os templates utilizados</p>
          </div>


          {/* METODOLOGIA LUIZ - DADOS COMPLETOS DO PRODUTO */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 md:col-span-2">
            <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5" />
              🎯 Metodologia Luiz - Dados Completos do Produto
            </h4>
            <p className="text-purple-700 text-sm mb-6 bg-purple-100 p-3 rounded-md">
              <strong>📋 Extrair do site do produtor:</strong> preços, garantia, bônus, entrega. Sistema calcula descontos automaticamente.
            </p>
            
            {/* PREÇOS E DESCONTOS */}
            <div className="bg-white rounded-lg p-4 mb-6 border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                💰 Estrutura de Preços (do Site do Produtor)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Valor de 1 Pote *
                    <span className="text-purple-500 text-xs ml-2">(Obrigatório)</span>
                  </label>
                  <Input
                    type="number"
                    placeholder={`Ex: ${campaignData.currency === 'BRL' ? '149' : '49'}`}
                    value={campaignData.productPrice || ''}
                    onChange={(e) => onInputChange('productPrice', e.target.value ? Number(e.target.value) : 0)}
                    className="text-lg border-purple-300 focus:border-purple-500"
                  />
                  <p className="text-xs text-purple-600 mt-1">Preço unitário (base para cálculos)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Quantidade de Potes (Maior Oferta)
                    <span className="text-purple-500 text-xs ml-2">(Ex: 3, 5, 6 potes)</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 6"
                    value={campaignData.packQuantity || ''}
                    onChange={(e) => onInputChange('packQuantity', e.target.value ? Number(e.target.value) : 0)}
                    className="text-lg border-purple-300 focus:border-purple-500"
                  />
                  <p className="text-xs text-purple-600 mt-1">Quantos potes na maior oferta</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Valor Total da Maior Oferta
                    <span className="text-purple-500 text-xs ml-2">(Valor do pack completo)</span>
                  </label>
                  <Input
                    type="number"
                    placeholder={`Ex: ${campaignData.currency === 'BRL' ? '397' : '147'}`}
                    value={campaignData.packTotalPrice || ''}
                    onChange={(e) => onInputChange('packTotalPrice', e.target.value ? Number(e.target.value) : 0)}
                    className="text-lg border-purple-300 focus:border-purple-500"
                  />
                  <p className="text-xs text-purple-600 mt-1">Valor total do pack (para cálculo preciso)</p>
                </div>
              </div>

              {/* CÁLCULOS AUTOMÁTICOS DE DESCONTO */}
              {(campaignData.productPrice && campaignData.packQuantity && campaignData.packTotalPrice) && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h6 className="font-semibold text-green-800 mb-2">🧮 Cálculo Preciso de Desconto</h6>
                  <div className="text-sm space-y-2">
                    <div className="text-green-700">
                      <strong>Cálculo:</strong> {campaignData.packQuantity} potes × {campaignData.currency} {campaignData.productPrice} = {campaignData.currency} {(campaignData.productPrice * campaignData.packQuantity).toFixed(0)}
                    </div>
                    <div className="text-green-700">
                      <strong>Pack {campaignData.packQuantity}:</strong> {campaignData.currency} {campaignData.packTotalPrice} vs {campaignData.currency} {(campaignData.productPrice * campaignData.packQuantity).toFixed(0)} = 
                      <span className="font-bold text-green-800"> {Math.round(((campaignData.productPrice * campaignData.packQuantity - campaignData.packTotalPrice) / (campaignData.productPrice * campaignData.packQuantity)) * 100)}% desconto</span>
                    </div>
                    <div className="text-green-700">
                      <strong>Valor por pote no pack:</strong> {campaignData.currency} {(campaignData.packTotalPrice / campaignData.packQuantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INFORMAÇÕES CONTEXTUAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-4">🛡️ Garantia & Políticas</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Período de Garantia
                    </label>
                    <Input
                      placeholder="Ex: 60 dias, 90 dias, 1 ano"
                      value={campaignData.guaranteePeriod || ''}
                      onChange={(e) => onInputChange('guaranteePeriod', e.target.value)}
                      className="border-purple-300 focus:border-purple-500"
                    />
                    <p className="text-xs text-purple-600 mt-1">Para headlines: "60-Day Money-Back Guarantee"</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Política de Devolução
                      <span className="text-purple-500 text-xs ml-2">(Campo livre)</span>
                    </label>
                    <Input
                      placeholder="Ex: Money-Back Guarantee, Ironclad Guarantee, 100% Garantia"
                      value={campaignData.returnPolicy || ''}
                      onChange={(e) => onInputChange('returnPolicy', e.target.value)}
                      className="border-purple-300 focus:border-purple-500"
                    />
                    <p className="text-xs text-purple-600 mt-1">Digite sua política personalizada (será traduzida automaticamente)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-4">🚚 Entrega & Localização</h5>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Tipo de Entrega
                      <span className="text-purple-500 text-xs ml-2">(Campo livre)</span>
                    </label>
                    <Input
                      placeholder="Ex: Frete Grátis, Free Shipping, Express Delivery"
                      value={campaignData.deliveryType || ''}
                      onChange={(e) => onInputChange('deliveryType', e.target.value)}
                      className="border-purple-300 focus:border-purple-500"
                    />
                    <p className="text-xs text-purple-600 mt-1">Digite em PT/EN - será traduzido para o idioma do país</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Geolocalização
                      <span className="text-purple-500 text-xs ml-2">(Automática baseada no país)</span>
                    </label>
                    <Input
                      value="Detecção automática ativada"
                      disabled
                      className="bg-purple-50 text-purple-600 border-purple-200"
                    />
                    <p className="text-xs text-purple-600 mt-1">Sistema detecta automaticamente cidades principais do país selecionado</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Regiões/Cidades SEM Entrega
                      <span className="text-purple-500 text-xs ml-2">(Opcional - separar por vírgula)</span>
                    </label>
                    <Input
                      placeholder="Ex: Acre, Norte, Interior, Remote areas"
                      value={campaignData.excludedRegions || ''}
                      onChange={(e) => onInputChange('excludedRegions', e.target.value)}
                      className="border-purple-300 focus:border-purple-500"
                    />
                    <p className="text-xs text-purple-600 mt-1">Regiões onde o produtor NÃO faz entrega (deixe vazio se entrega para todo país)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BÔNUS E EXTRAS */}
            <div className="bg-white rounded-lg p-4 mt-6 border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-4">🎁 Bônus & Extras</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Bônus Inclusos
                    <span className="text-purple-500 text-xs ml-2">(Separar por vírgula)</span>
                  </label>
                  <Input
                    placeholder="Ex: E-book gratuito, Consultoria online, Suporte 24h"
                    value={campaignData.bonuses || ''}
                    onChange={(e) => onInputChange('bonuses', e.target.value)}
                    className="border-purple-300 focus:border-purple-500"
                  />
                  <p className="text-xs text-purple-600 mt-1">Para descriptions e sitelinks</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Urgência/Escassez
                    <span className="text-purple-500 text-xs ml-2">(Automático via IA)</span>
                  </label>
                  <Input
                    value="Geração automática baseada nos dados do produto"
                    disabled
                    className="bg-purple-50 text-purple-600 border-purple-200"
                  />
                  <p className="text-xs text-purple-600 mt-1">IA analisa dados de preço/desconto para gerar urgência contextual automaticamente</p>
                </div>
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
          {/* Campaign Type Validation Alert */}
          {campaignData.campaignType && !['Standard', 'COD'].includes(campaignData.campaignType) && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">
                    Tipo de Campanha "{campaignData.campaignType}" em Desenvolvimento
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Por enquanto, apenas campanhas <strong>Standard</strong> e <strong>COD</strong> estão disponíveis.
                    Os demais tipos serão liberados em breve.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={onSubmit}
            disabled={
              isLoading ||
              !campaignData.productName ||
              !campaignData.urlBase ||
              (campaignData.campaignType && !['Standard', 'COD'].includes(campaignData.campaignType))
            }
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