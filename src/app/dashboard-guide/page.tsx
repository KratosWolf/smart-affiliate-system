'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Search, 
  Eye, 
  TrendingUp, 
  BarChart3,
  Activity,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function DashboardGuidePage() {
  const tools = [
    {
      title: '🎯 Product Validation',
      description: 'Valida SE um produto específico vale a pena promover',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      href: '/',
      status: 'production',
      
      whenToUse: 'Quando você JÁ tem um produto em mente e quer saber se vale a pena',
      howItWorks: {
        input: 'Nome de 1 produto específico (ex: "Leptitox")',
        method: 'Google Search API para medir demanda/interesse',
        output: 'Score 0-100 + VIÁVEL/NÃO VIÁVEL + reasoning',
        timeToResult: '5 segundos'
      },
      
      example: {
        input: 'Leptitox',
        result: '✅ VIÁVEL (Score: 90/100) - Alto volume de busca com resultados específicos'
      },
      
      nextStep: 'Se VIÁVEL → Intelligence Mining ou Product Intelligence para estratégia'
    },
    
    {
      title: '🔍 Product Discovery',  
      description: 'Encontra produtos em massa nas plataformas de afiliados',
      icon: <Search className="w-8 h-8 text-green-600" />,
      href: '/discovery',
      status: 'production',
      
      whenToUse: 'Quando você quer DESCOBRIR novos produtos para promover',
      howItWorks: {
        input: 'Tipo de pagamento (CPA/Commission) + Plataformas + Busca geral/específica',
        method: 'APIs das plataformas: ClickBank, SmartADV, DrCash, WarriorPlus, JVZoo',
        output: 'Lista de 30+ produtos rankeados por opportunity score',
        timeToResult: '3-5 segundos'
      },
      
      example: {
        input: 'CPA + SmartADV + Busca Geral',
        result: '15 produtos CPA encontrados, Keto Diet Plan (Score: 87), Crypto Course (Score: 79)...'
      },
      
      nextStep: 'Escolher TOP 3-5 produtos → Product Validation → Intelligence'
    },
    
    {
      title: '🧠 Product Intelligence',
      description: 'Análise PROFUNDA de um produto específico para criar estratégia',
      icon: <Eye className="w-8 h-8 text-indigo-600" />,
      href: '/intelligence',
      status: 'production',
      
      whenToUse: 'Quando você decidiu promover UM produto e quer saber COMO fazer',
      howItWorks: {
        input: 'Nome de 1 produto específico',
        method: 'YouTube Data API + Google Ads Transparency + Competition Analysis',
        output: 'Estratégia completa: concorrentes, copy vencedor, budget recomendado',
        timeToResult: '10-15 segundos'
      },
      
      example: {
        input: 'Leptitox',
        result: '4 canais promovendo, 3 ads ativos vs 15K buscas = OURO! Copy: "cientificamente provado". Recomendação: $500 budget (ROI: 320%)'
      },
      
      nextStep: 'Implementar → Presell Generator → Campaign Builder → ROI Tracking'
    },
    
    {
      title: '🎯 Intelligence Mining',
      description: 'Sistema ATIVO de garimpagem para descobrir produtos quentes automaticamente',
      icon: <Zap className="w-8 h-8 text-emerald-600" />,
      href: '/intelligence-mining',  
      status: 'production',
      
      whenToUse: 'Quando você quer descobrir produtos que estão "bombando" AGORA',
      howItWorks: {
        input: 'Clique "Iniciar Garimpagem" (sistema automático)',
        method: 'Monitor YouTube channels + Random Ads testing + Exclusivity detection',
        output: 'Lista de produtos descobertos com exclusivity level e action recommendations',
        timeToResult: '15-30 segundos (análise completa)'
      },
      
      example: {
        input: 'Sistema automático',
        result: 'MetaboFix (EXCLUSIVE, Score: 92) - 2 canais, $15K spend. Crypto Wealth (SEMI, Score: 87) - 6 menções...'
      },
      
      nextStep: 'Produtos descobertos → Product Validation → Product Intelligence → Campaign'
    },
    
    {
      title: '📄 Presell Generator',
      description: 'Gera landing pages de alta conversão (5 templates: 8-18%)',
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      href: '/presell',
      status: 'production',
      
      whenToUse: 'Depois de escolher o produto e analisar a estratégia',
      howItWorks: {
        input: 'Produto + Template escolhido + País alvo',
        method: 'Templates otimizados + Design matching + Localização',
        output: 'HTML completo + CSS + JS + assets prontos para hospedar',
        timeToResult: '5-8 segundos'
      },
      
      example: {
        input: 'Leptitox + COD Template + Brasil',
        result: 'Landing page COD em português (12-18% conversão) com design matching'
      },
      
      nextStep: 'Hospedar presell → Campaign Builder para criar anúncios'
    },
    
    {
      title: '🎯 Campaign Builder',
      description: 'Constrói campanhas Google Ads otimizadas com export CSV',
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      href: '/campaigns',
      status: 'production',
      
      whenToUse: 'Depois de ter presell pronta e querer criar anúncios',
      howItWorks: {
        input: 'Produto + URL presell + Budget + País',
        method: 'Google Ads compliance + Character optimization + CSV generation',
        output: 'CSV + 5 arquivos (campaigns, adgroups, ads, keywords, extensions)',
        timeToResult: '3-5 segundos'
      },
      
      example: {
        input: 'Leptitox + presell URL + $500 budget + Brasil', 
        result: 'CSV com 1 campaign, 3 adgroups, 15 ads, 45 keywords - pronto para importar'
      },
      
      nextStep: 'Importar no Google Ads → ROI Tracking para monitorar'
    },
    
    {
      title: '📊 ROI Tracking',
      description: 'Monitora performance com janela móvel 3 dias + auto-scaling',
      icon: <Activity className="w-8 h-8 text-red-600" />,
      href: '/tracking',
      status: 'production',
      
      whenToUse: 'Depois de lançar campanhas e querer monitorar ROI',
      howItWorks: {
        input: 'Sistema automático (conecta com campanhas ativas)',
        method: 'Janela móvel 3 dias + Auto-scaling quando ROI > 60%',
        output: 'Dashboard tempo real + Recomendações de scaling + Alertas',
        timeToResult: 'Tempo real (auto-refresh 60s)'
      },
      
      example: {
        input: 'Campanhas ativas',
        result: '5 campanhas, ROI médio +69%, 2 precisam scaling, 1 pausar'
      },
      
      nextStep: 'Scaling automático → Domain Generator para múltiplos URLs'
    },
    
    {
      title: '🌐 Domain Generator',
      description: 'Gera múltiplos domínios para scaling horizontal (evita competição interna)',
      icon: <Globe className="w-8 h-8 text-cyan-600" />,
      href: '#',
      status: 'api-only',
      
      whenToUse: 'Quando campanhas estão com ROI > 60% e precisam escalar',
      howItWorks: {
        input: 'Produto + Niche + Países + Templates',
        method: 'Geração automática + SEO optimization + Disponibilidade check',
        output: '31 domínios únicos + estimativas de custo + reach potential',
        timeToResult: '2-3 segundos'
      },
      
      example: {
        input: 'Leptitox + Weight Loss + 3 países',
        result: '31 domínios gerados, reach estimado 31K pessoas, custo $4,960'
      },
      
      nextStep: 'Registrar domínios → Replicar presells → Escalar campanhas'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      'production': 'bg-green-100 text-green-800',
      'api-only': 'bg-blue-100 text-blue-800',
      'beta': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status as keyof typeof colors]
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'production': <CheckCircle className="w-4 h-4" />,
      'api-only': <AlertCircle className="w-4 h-4" />,
      'beta': <Clock className="w-4 h-4" />
    }
    return icons[status as keyof typeof icons]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Affiliate System - Guia Completo
          </h1>
          <p className="text-xl text-gray-600">
            Como usar cada ferramenta do sistema para maximizar seus resultados
          </p>
        </div>

        {/* Workflow Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔄 Fluxo de Trabalho Recomendado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium">Mining/Discovery</div>
                <div className="text-sm text-gray-600">Encontrar produtos</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium">Validation</div>
                <div className="text-sm text-gray-600">Verificar viabilidade</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-medium">Intelligence</div>
                <div className="text-sm text-gray-600">Criar estratégia</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="text-2xl mb-2">📄</div>
                <div className="font-medium">Presell</div>
                <div className="text-sm text-gray-600">Gerar landing</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium">Campaign</div>
                <div className="text-sm text-gray-600">Criar anúncios</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Tracking</div>
                <div className="text-sm text-gray-600">Monitorar ROI</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools Detail */}
        <div className="space-y-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {tool.icon}
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(tool.status)}>
                    {getStatusIcon(tool.status)}
                    <span className="ml-1">{tool.status.toUpperCase()}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">📋 Quando Usar:</h4>
                  <p className="text-gray-700">{tool.whenToUse}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-3">⚙️ Como Funciona:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Input:</strong> {tool.howItWorks.input}</div>
                      <div><strong>Método:</strong> {tool.howItWorks.method}</div>
                      <div><strong>Output:</strong> {tool.howItWorks.output}</div>
                      <div><strong>Tempo:</strong> {tool.howItWorks.timeToResult}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-700 mb-3">💡 Exemplo Prático:</h4>
                    <div className="bg-purple-50 p-3 rounded-lg space-y-2 text-sm">
                      <div><strong>Input:</strong> {tool.example.input}</div>
                      <div><strong>Resultado:</strong> {tool.example.result}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">➡️ Próximo Passo:</h4>
                  <p className="text-gray-700">{tool.nextStep}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}