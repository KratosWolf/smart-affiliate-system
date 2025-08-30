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
    commission: '',
    domain: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPresell, setGeneratedPresell] = useState<any>(null)

  const generatePresell = async () => {
    if (!selectedTemplate || !productData.name || !productData.affiliateUrl) {
      alert('Por favor, preencha todos os campos e selecione um template')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simular geração (substituir com API real)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setGeneratedPresell({
        template: selectedTemplate,
        product: productData.name,
        url: `https://${productData.domain || 'review-site.com'}/${productData.name.toLowerCase().replace(/\s+/g, '-')}/`,
        preview: 'Preview HTML aqui...',
        files: {
          'index.html': 'HTML content',
          'style.css': 'CSS content',
          'script.js': 'JS content'
        }
      })
    } catch (error) {
      console.error('Erro ao gerar presell:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const deployToHostinger = async () => {
    // Deploy via FTP
    console.log('Deploying to Hostinger...')
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Estratégia Pre-Sell</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>Cookie Template:</strong> Melhor para tráfego frio (primeiro contato)</li>
                        <li>• <strong>Expert Review:</strong> Ideal para produtos de saúde (4-6% conv.)</li>
                        <li>• <strong>Quiz Template:</strong> Produtos personalizados (3-5% conv.)</li>
                        <li>• <strong>COD Template:</strong> Para Índia e Oriente Médio</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Produto</Label>
                    <Input
                      placeholder="Ex: Glucosense, NerveCalm, GlicoShield"
                      value={productData.name}
                      onChange={(e) => setProductData({...productData, name: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use produtos exclusivos para maior ROI
                    </p>
                  </div>
                  <div>
                    <Label>Comissão ($)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 50"
                      value={productData.commission}
                      onChange={(e) => setProductData({...productData, commission: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Link de Afiliado</Label>
                  <Input
                    placeholder="https://hop.clickbank.net/?affiliate=you&vendor=product"
                    value={productData.affiliateUrl}
                    onChange={(e) => setProductData({...productData, affiliateUrl: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Domínio (opcional)</Label>
                  <Input
                    placeholder="glicoshield-review.com"
                    value={productData.domain}
                    onChange={(e) => setProductData({...productData, domain: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deixe vazio para usar subdomínio padrão
                  </p>
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
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Deploy para Hostinger
                      </Button>
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
                <CardTitle className="text-lg">⚙️ Configuração Hostinger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-600">Deploy Multi-Domínio:</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li>• Addon Domains no hPanel</li>
                  <li>• Pasta separada por produto</li>
                  <li>• FTP único para todos os domínios</li>
                  <li>• SSL automático via AutoSSL</li>
                </ul>
                
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Ver guia completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}