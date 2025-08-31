"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BackToDashboard from '@/components/BackToDashboard'
import { Cookie, Star, UserCheck, HelpCircle, CreditCard, FileText, ArrowRight, Eye, Download, Upload } from 'lucide-react'

const templates = [
  {
    id: 'cookie',
    name: 'Cookie Template',
    icon: Cookie,
    description: 'Política de cookies como isca inicial',
    conversion: '3-5%',
    bestFor: 'Tráfego frio, primeiro contato'
  },
  {
    id: 'review',
    name: 'Review Template',
    icon: Star,
    description: 'Review padrão com prós e contras',
    conversion: '2-4%',
    bestFor: 'Produtos conhecidos'
  },
  {
    id: 'expert',
    name: 'Expert Review',
    icon: UserCheck,
    description: 'Review de especialista/médico',
    conversion: '4-6%',
    bestFor: 'Produtos de saúde'
  },
  {
    id: 'quiz',
    name: 'Quiz Template',
    icon: HelpCircle,
    description: 'Quiz interativo personalizado',
    conversion: '3-5%',
    bestFor: 'Produtos personalizados'
  },
  {
    id: 'cod',
    name: 'COD Template',
    icon: CreditCard,
    description: 'Cash on Delivery para países específicos',
    conversion: '2-3%',
    bestFor: 'Índia, Oriente Médio'
  }
]

export default function PresellGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [productData, setProductData] = useState({
    name: '',
    affiliateUrl: '',
    producerPageUrl: '', // Campo essencial para extração de dados
    ratoEiraAdsCode: '', // Script ID da Ratoeira Ads
    clarityProjectId: '', // Project ID do MS Clarity
    commission: '', // Opcional - pode não ser necessário
    domain: '', // Será sugerido automaticamente
    domainPurchased: false // Flag para indicar se o domínio já foi comprado
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPresell, setGeneratedPresell] = useState<any>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<any>(null)
  const [isExtractingData, setIsExtractingData] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  // Função para extrair dados da página do produtor
  const extractProducerData = async () => {
    if (!productData.producerPageUrl) {
      alert('Por favor, informe a URL da página do produtor')
      return
    }

    setIsExtractingData(true)
    
    try {
      console.log('🔍 Extraindo dados da página do produtor...')
      
      // Usar o design matcher para extrair informações da página
      const response = await fetch('/api/v1/design-extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: productData.producerPageUrl,
          extractData: true // Flag para extrair dados do produto também
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setExtractedData(result.data)
        
        // Auto-sugerir domínio baseado no nome do produto
        if (productData.name) {
          const suggestedDomain = generateSuggestedDomain(productData.name)
          setProductData(prev => ({
            ...prev,
            domain: suggestedDomain
          }))
        }
        
        alert('✅ Dados extraídos com sucesso da página do produtor!')
      } else {
        throw new Error(result.error || 'Failed to extract data')
      }
    } catch (error) {
      console.error('❌ Erro ao extrair dados:', error)
      alert('Erro ao extrair dados da página: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setIsExtractingData(false)
    }
  }

  // Função para sugerir domínio automaticamente
  const generateSuggestedDomain = (productName: string): string => {
    const cleanName = productName.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15) // Limitar tamanho
    
    const domainSuggestions = [
      `${cleanName}-review.com`,
      `${cleanName}-oficial.com`, 
      `${cleanName}-original.com`,
      `review-${cleanName}.com`
    ]
    
    return domainSuggestions[0] // Por enquanto retorna o primeiro
  }

  const generatePresell = async () => {
    if (!selectedTemplate || !productData.name || !productData.affiliateUrl || !productData.producerPageUrl) {
      alert('Por favor, preencha todos os campos obrigatórios:\n- Selecione um template\n- Nome do produto\n- Link de afiliado\n- Página do produtor')
      return
    }

    setIsGenerating(true)
    
    try {
      // Create validation data using extracted producer data or fallback to form inputs
      const useExtractedData = extractedData && extractedData.productData
      
      const mockValidation = {
        productName: productData.name,
        validationScore: 85,
        viable: true,
        targetCountry: 'Brasil',
        productData: {
          title: productData.name,
          price: useExtractedData ? extractedData.productData.price : (parseInt(productData.commission) || 97),
          currency: useExtractedData ? extractedData.productData.currency : 'BRL',
          description: useExtractedData ? extractedData.productData.description : `Produto inovador ${productData.name} com excelentes resultados comprovados`,
          benefits: useExtractedData ? extractedData.productData.benefits : [`Benefício premium do ${productData.name}`, `Resultado garantido em 30 dias`, `Aprovado por especialistas`],
          images: useExtractedData ? extractedData.productData.images : []
        },
        marketAnalysis: {
          avgCpc: 2.5,
          competition: 'Medium'
        },
        recommendations: {
          suggestedBudget: 350
        }
      }

      // Generate presell using real API
      const response = await fetch('/api/v1/presell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validation: mockValidation,
          affiliateUrl: productData.affiliateUrl,
          templateType: selectedTemplate,
          originalPageUrl: productData.producerPageUrl, // Para design matching
          customization: {
            colors: { primary: '#007bff' },
            tracking: {
              ratoEiraAdsCode: productData.ratoEiraAdsCode,
              clarityProjectId: productData.clarityProjectId
            },
            domain: productData.domain,
            domainPurchased: productData.domainPurchased
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setGeneratedPresell({
          template: selectedTemplate,
          product: productData.name,
          url: `https://${productData.domain || 'bestbargains24x7.com'}/${productData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/`,
          preview: result.data.generated.html,
          files: {
            'index.html': result.data.generated.html,
            'style.css': result.data.generated.css,
            'script.js': result.data.generated.js
          },
          rawData: result.data
        })
      } else {
        throw new Error(result.error || 'Failed to generate presell')
      }
    } catch (error) {
      console.error('Erro ao gerar presell:', error)
      alert('Erro ao gerar presell: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setIsGenerating(false)
    }
  }

  const deployToHostinger = async () => {
    if (!generatedPresell || !generatedPresell.files) {
      alert('Por favor, gere a presell primeiro antes de fazer o deploy')
      return
    }

    setIsDeploying(true)
    setDeploymentResult(null)
    
    try {
      console.log('🚀 Starting FTP deployment to Hostinger...')
      
      const response = await fetch('/api/v1/ftp-deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productData.name,
          presellFiles: generatedPresell.files,
          affiliateUrl: productData.affiliateUrl
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setDeploymentResult(result.data)
        alert(`✅ Deploy realizado com sucesso!\n\nAcesse: ${result.data.deployedUrl}`)
      } else {
        throw new Error(result.error || 'Deploy failed')
      }
    } catch (error) {
      console.error('❌ Erro no deploy:', error)
      alert('Erro no deploy: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <BackToDashboard />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📄 Pre-Sell Page Generator
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Gere páginas de vendas otimizadas baseadas em critérios validados
          </p>
          
          {/* Strategy Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">CPA Targets</h4>
                <p className="text-sm text-gray-600">40-45% comissão target<br/>ROI mínimo 150%</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Multi-Geo</h4>
                <p className="text-sm text-gray-600">9 países: US, FR, DE, GB<br/>CA, DK, SE, PL, RO</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Templates</h4>
                <p className="text-sm text-gray-600">5 modelos otimizados<br/>Conv. 2-6%</p>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYBOOK Criteria Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Critérios PLAYBOOK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">💰 Validação CPA</h4>
              <ul className="text-sm space-y-1">
                <li>🎯 <strong>Target:</strong> 40-45% da comissão</li>
                <li>⚠️ <strong>Máximo:</strong> 80% da comissão</li>
                <li>🛑 <strong>Stop Loss:</strong> 100% da comissão</li>
                <li>💵 <strong>Budget Teste:</strong> R$350 ou 5x comissão</li>
                <li>📈 <strong>ROI Mínimo:</strong> 150% para prosseguir</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">🏆 Produtos Exclusivos</h4>
              <ul className="text-sm space-y-1">
                <li>💊 <strong>Glucosense:</strong> 45% commission (95% pop.)</li>
                <li>🧠 <strong>NerveCalm:</strong> 40% commission (88% pop.)</li>
                <li>🩺 <strong>GlicoShield:</strong> 50% commission (92% pop.)</li>
                <li>💧 <strong>GutDrops:</strong> 35% commission (85% pop.)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>1. Escolha o Template</CardTitle>
                <CardDescription>
                  Templates otimizados baseados em análises competitivas reais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => {
                    const Icon = template.icon
                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedTemplate === template.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <span className="text-green-600 font-medium">
                                Conv: {template.conversion}
                              </span>
                              <span className="text-gray-500">
                                {template.bestFor}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Product Data */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>2. Dados do Produto</CardTitle>
                <CardDescription>
                  Informações básicas para gerar a pre-sell
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Dados Essenciais para Presell</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Página do Produtor:</strong> Essencial para extrair dados reais (imagens, preços, benefícios)</li>
                        <li>• <strong>Link de Afiliado:</strong> HopLink para conversões</li>
                        <li>• <strong>Tracking Links:</strong> Ratoeira Ads + Microsoft Clarity para analytics</li>
                        <li>• <strong>Domínio:</strong> Será sugerido automaticamente baseado no produto</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Campo principal: Página do Produtor */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">🏠 Página do Produtor *</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://exemplo.com/produto-oficial (essencial para extrair dados reais)"
                        value={productData.producerPageUrl}
                        onChange={(e) => setProductData({...productData, producerPageUrl: e.target.value})}
                        className="flex-1"
                      />
                      <Button 
                        onClick={extractProducerData}
                        disabled={isExtractingData || !productData.producerPageUrl}
                        variant="outline"
                        className="px-6"
                      >
                        {isExtractingData ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                            Extraindo...
                          </>
                        ) : (
                          <>📥 Extrair Dados</>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cole aqui a URL da página oficial do produto. Vamos extrair automaticamente: preço, benefícios, imagens e descrições.
                    </p>
                    {extractedData && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        <span className="text-green-800 font-medium">✅ Dados extraídos com sucesso!</span>
                        <div className="text-green-700 mt-1">
                          Preço: {extractedData.productData?.price || 'N/A'} | 
                          Benefícios: {extractedData.productData?.benefits?.length || 0} encontrados
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome do Produto *</Label>
                      <Input
                        placeholder="Ex: Glucosense, NerveCalm, GlicoShield"
                        value={productData.name}
                        onChange={(e) => {
                          const newName = e.target.value
                          setProductData(prev => ({
                            ...prev, 
                            name: newName,
                            domain: newName ? generateSuggestedDomain(newName) : ''
                          }))
                        }}
                      />
                    </div>
                    <div>
                      <Label>Comissão ($) <span className="text-gray-400">(opcional)</span></Label>
                      <Input
                        type="number"
                        placeholder="Ex: 50"
                        value={productData.commission}
                        onChange={(e) => setProductData({...productData, commission: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>🔗 Link de Afiliado (HopLink) *</Label>
                  <Input
                    placeholder="https://hop.clickbank.net/?affiliate=you&vendor=product"
                    value={productData.affiliateUrl}
                    onChange={(e) => setProductData({...productData, affiliateUrl: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    HopLink do ClickBank, Hotmart ou outra plataforma de afiliados
                  </p>
                </div>
                
                {/* Campos de tracking corrigidos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>📊 Ratoeira Ads (Script ID)</Label>
                    <Input
                      placeholder="5783-08cdb400-b11a-40e1-8240-4f4afd24120b"
                      value={productData.ratoEiraAdsCode}
                      onChange={(e) => setProductData({...productData, ratoEiraAdsCode: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Apenas o ID do script para &lt;head&gt;
                    </p>
                  </div>
                  <div>
                    <Label>📈 Microsoft Clarity (Project ID)</Label>
                    <Input
                      placeholder="xxxxxxxxxx"
                      value={productData.clarityProjectId}
                      onChange={(e) => setProductData({...productData, clarityProjectId: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Apenas o Project ID do MS Clarity
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>🌐 Domínio para Presell</Label>
                  
                  {/* Sugestões de domínio melhores */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">💡 Sugestões de domínio para presell (extensões baratas):</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <button 
                        onClick={() => setProductData({...productData, domain: `${productData.name.toLowerCase().replace(/\s+/g, '')}-funciona.site`})}
                        className="text-left p-2 bg-white rounded border hover:bg-blue-50"
                      >
                        <code>{productData.name.toLowerCase().replace(/\s+/g, '')}-funciona.site</code>
                        <span className="text-green-600 ml-1">💰 Barato</span>
                      </button>
                      <button 
                        onClick={() => setProductData({...productData, domain: `${productData.name.toLowerCase().replace(/\s+/g, '')}-oficial.online`})}
                        className="text-left p-2 bg-white rounded border hover:bg-blue-50"
                      >
                        <code>{productData.name.toLowerCase().replace(/\s+/g, '')}-oficial.online</code>
                        <span className="text-green-600 ml-1">💰 Barato</span>
                      </button>
                      <button 
                        onClick={() => setProductData({...productData, domain: `comprar-${productData.name.toLowerCase().replace(/\s+/g, '')}.site`})}
                        className="text-left p-2 bg-white rounded border hover:bg-blue-50"
                      >
                        <code>comprar-{productData.name.toLowerCase().replace(/\s+/g, '')}.site</code>
                        <span className="text-green-600 ml-1">💰 Barato</span>
                      </button>
                      <button 
                        onClick={() => setProductData({...productData, domain: `${productData.name.toLowerCase().replace(/\s+/g, '')}-brasil.online`})}
                        className="text-left p-2 bg-white rounded border hover:bg-blue-50"
                      >
                        <code>{productData.name.toLowerCase().replace(/\s+/g, '')}-brasil.online</code>
                        <span className="text-green-600 ml-1">💰 Barato</span>
                      </button>
                      <button 
                        onClick={() => setProductData({...productData, domain: `${productData.name.toLowerCase().replace(/\s+/g, '')}.top`})}
                        className="text-left p-2 bg-white rounded border hover:bg-blue-50"
                      >
                        <code>{productData.name.toLowerCase().replace(/\s+/g, '')}.top</code>
                        <span className="text-green-600 ml-1">💰 Muito barato</span>
                      </button>
                      <button 
                        onClick={() => setProductData({...productData, domain: `${productData.name.toLowerCase().replace(/\s+/g, '')}-review.website`})}
                        className="text-left p-2 bg-white rounded border hover:bg-blue-50"
                      >
                        <code>{productData.name.toLowerCase().replace(/\s+/g, '')}-review.website</code>
                        <span className="text-green-600 ml-1">💰 Barato</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      💡 <strong>Extensões mais baratas:</strong> .site, .online, .top, .website, .store, .space
                    </p>
                  </div>

                  <Input
                    placeholder="Ou digite seu próprio domínio"
                    value={productData.domain}
                    onChange={(e) => setProductData({...productData, domain: e.target.value})}
                  />
                  
                  {/* Checkbox para "já comprei" */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="domainPurchased"
                      checked={productData.domainPurchased || false}
                      onChange={(e) => setProductData({...productData, domainPurchased: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="domainPurchased" className="text-sm text-green-700">
                      ✅ Já comprei este domínio e está configurado
                    </Label>
                  </div>

                  {productData.domain && !productData.domainPurchased && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded text-sm">
                      <p className="text-orange-800 mb-2">⚠️ <strong>Próximos passos:</strong></p>
                      <ol className="text-orange-700 space-y-1 text-xs">
                        <li>1. Compre o domínio <code className="bg-white px-1 rounded">{productData.domain}</code> na Hostinger</li>
                        <li>2. Configure o FTP (será feito automaticamente)</li>
                        <li>3. Marque a checkbox acima quando estiver pronto</li>
                      </ol>
                    </div>
                  )}

                  {productData.domain && productData.domainPurchased && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <span className="text-green-800">🎯 URL final da presell: </span>
                      <code className="text-green-600">https://{productData.domain}</code>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={generatePresell}
                  disabled={isGenerating || !selectedTemplate || !productData.name}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Gerando Pre-Sell...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Gerar Pre-Sell
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>3. Preview & Deploy</CardTitle>
                <CardDescription>
                  Visualize e faça deploy da sua pre-sell
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPresell ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700">URL Final:</p>
                      <p className="text-xs text-blue-600 mt-1 break-all">
                        {generatedPresell.url}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview no Browser
                      </Button>
                      
                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download ZIP
                      </Button>
                      
                      <Button 
                        onClick={deployToHostinger}
                        disabled={isDeploying}
                        className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
                      >
                        {isDeploying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Fazendo Deploy...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Deploy para Hostinger
                          </>
                        )}
                      </Button>

                      {deploymentResult && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">✅ Deploy Realizado!</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">URL Final:</span>
                              <a 
                                href={deploymentResult.deployedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 ml-2 font-mono text-xs block break-all"
                              >
                                {deploymentResult.deployedUrl}
                              </a>
                            </div>
                            <div>
                              <span className="text-gray-600">Método:</span>
                              <span className="ml-2 text-green-700 font-medium">{deploymentResult.method}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Deploy Key:</span>
                              <span className="ml-2 font-mono text-xs">{deploymentResult.deploymentKey}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Arquivos:</span>
                              <span className="ml-2">{deploymentResult.files?.length || 0} arquivo(s)</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Data:</span>
                              <span className="ml-2 text-xs">
                                {new Date(deploymentResult.deployedAt).toLocaleString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <a
                              href={deploymentResult.deployedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-green-700 hover:text-green-800 font-medium"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Visualizar Presell Online
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Arquivos Gerados:</p>
                      <div className="space-y-1">
                        {Object.keys(generatedPresell.files).map((file) => (
                          <div key={file} className="flex items-center gap-2 text-xs">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Selecione um template e preencha os dados</p>
                    <p className="text-xs mt-2">
                      A pre-sell será gerada automaticamente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Multi-Geo Strategy */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">🌍 Estratégia Multi-Geo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">9 Países Target:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <span className="bg-blue-50 px-2 py-1 rounded">🇺🇸 US</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇫🇷 FR</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇩🇪 DE</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇬🇧 GB</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇨🇦 CA</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇩🇰 DK</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇸🇪 SE</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇵🇱 PL</span>
                    <span className="bg-blue-50 px-2 py-1 rounded">🇷🇴 RO</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-gray-600 mb-2">Gap Patterns:</p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• Produtos que sumiram 60+ dias</li>
                    <li>• Detecta retornos de produtos</li>
                    <li>• Oportunidades exclusivas por país</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* Hostinger Config */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">⚙️ Setup Hostinger Simplificado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Processo Simplificado</h4>
                  <ol className="text-xs text-green-700 space-y-1 list-decimal list-inside">
                    <li>Compre o domínio sugerido na Hostinger</li>
                    <li>O FTP já está configurado - funcionará automaticamente</li>
                    <li>Click "Deploy" - vai direto para o ar!</li>
                    <li>SSL é instalado automaticamente</li>
                  </ol>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-2">Estrutura FTP Atual:</p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• <span className="font-mono">bestbargains24x7.com/produto</span></li>
                    <li>• FTP: <span className="font-mono">{process.env.FTP_HOST}</span></li>
                    <li>• Credenciais já configuradas ✅</li>
                    <li>• Deploy automático via botão</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Dica Pro</h4>
                  <p className="text-xs text-yellow-700">
                    Não precisa criar subdomínios manualmente. Compre o domínio sugerido e o sistema fará tudo automaticamente!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Setup Guide */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">📊 Setup de Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Links Essenciais:</h4>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li>• <strong>Ratoeira Ads:</strong> Seu sistema de tracking principal</li>
                    <li>• <strong>Microsoft Clarity:</strong> Heatmaps e gravações de sessão</li>
                    <li>• <strong>Google Analytics:</strong> Será instalado automaticamente</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <p className="text-xs text-blue-700">
                    <strong>✨ Automático:</strong> Os códigos de tracking serão inseridos automaticamente na presell gerada!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}