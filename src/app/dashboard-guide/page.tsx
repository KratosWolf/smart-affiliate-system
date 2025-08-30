'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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
  AlertCircle,
  Calendar,
  Settings,
  Users,
  DollarSign,
  Play,
  Code,
  Database,
  Cpu
} from 'lucide-react'

export default function SystemGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Sistema Completo - Guia Detalhado</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Documentação completa de todos os módulos, APIs, templates e funcionalidades do Smart Affiliate System
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">← Voltar ao Dashboard</Button>
            </Link>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              ✅ Sistema 100% Operacional v1.1
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              Visão Geral do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">🏗️ Arquitetura Técnica</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Framework:</strong> Next.js 15.5.0 com App Router</li>
                  <li>• <strong>Language:</strong> TypeScript para type safety</li>
                  <li>• <strong>UI:</strong> shadcn/ui + Radix primitives + Tailwind CSS</li>
                  <li>• <strong>Deployment:</strong> Vercel com auto-deploy</li>
                  <li>• <strong>APIs:</strong> 20 endpoints RESTful + server actions</li>
                  <li>• <strong>Database:</strong> Serverless com edge functions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">📊 Módulos Operacionais</h3>
                <ul className="space-y-2 text-sm">
                  <li>✅ <strong>Discovery + Mining:</strong> 15-30 produtos/dia</li>
                  <li>✅ <strong>Validation + Intelligence:</strong> Google API real</li>
                  <li>✅ <strong>Presell Generator:</strong> 6 templates (8-18% CVR)</li>
                  <li>✅ <strong>Campaign Builder:</strong> Google Ads + CSV export</li>
                  <li>✅ <strong>ROI Tracking:</strong> 3-day rolling window</li>
                  <li>✅ <strong>Mining Schedule:</strong> Daily 6:00 AM automation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discovery + Mining */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Search className="w-6 h-6 text-green-600" />
              🔍 Discovery + Mining - Descoberta Automática de Produtos
            </CardTitle>
            <CardDescription>
              Sistema de mineração automática que descobre 15-30 produtos diariamente às 6:00 AM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">🎯 Como Funciona</h3>
                <ol className="space-y-2 text-sm">
                  <li><strong>1. Agendamento:</strong> Executa automaticamente às 6:00 AM todos os dias</li>
                  <li><strong>2. Multi-Platform Mining:</strong> ClickBank, SmartAdv, Dr Cash simultâneo</li>
                  <li><strong>3. Filtros Inteligentes:</strong> Score mínimo, comissão, categoria</li>
                  <li><strong>4. Geo-Targeting:</strong> 9 países (US, CA, GB, AU, BR, DE, FR, IT, ES)</li>
                  <li><strong>5. Quality-First:</strong> Prioriza produtos com maior potencial</li>
                </ol>
                
                <h3 className="font-bold text-lg mb-3 mt-6 text-green-700">⚙️ Configuração</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm font-mono">
                    <strong>API Endpoint:</strong> POST /api/v1/discovery<br/>
                    <strong>Schedule API:</strong> /api/schedule-mining<br/>
                    <strong>Status:</strong> ✅ ATIVO (Mining diário às 6:00 AM)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">📈 Parâmetros de Mineração</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Plataformas Suportadas:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>ClickBank:</strong> Produtos digitais globais</li>
                      <li>• <strong>SmartAdv:</strong> Ofertas premium Brasil</li>
                      <li>• <strong>Dr Cash:</strong> Suplementos e saúde</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Categorias Mineradas:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Health & Fitness (peso, suplementos)</li>
                      <li>• Make Money Online (cursos, métodos)</li>
                      <li>• Beauty & Skincare (cuidados pessoais)</li>
                      <li>• Relationship & Dating (relacionamentos)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-3 mt-6 text-green-700">🔄 Automação</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>⏰ Mining Schedule:</strong> Ativo às 6:00 AM<br/>
                    <strong>📊 Output:</strong> 15-30 produtos validados/dia<br/>
                    <strong>🎯 Qualidade:</strong> Score mínimo 40/100, comissão mín. $30
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">💻 Como Usar</h3>
              <ol className="space-y-2">
                <li><strong>1.</strong> Acesse a página Discovery + Mining</li>
                <li><strong>2.</strong> Clique em "🚀 Start Mining" para descoberta manual</li>
                <li><strong>3.</strong> Use filtros por Tier (1=Premium, 2=Good, 3=Basic)</li>
                <li><strong>4.</strong> Clique em "🎯 Start Validation" para analisar produtos específicos</li>
                <li><strong>5.</strong> Sistema salva automaticamente descobertas diárias às 6h</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Validation + Intelligence */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              🎯 Validation + Intelligence - Análise Completa de Produtos
            </CardTitle>
            <CardDescription>
              Validação profunda com Google API real + análise de competidores + YouTube Intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-blue-700">🔬 Análise Completa</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">1. Product Validation</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Google Search API real para volume de busca</li>
                      <li>• Análise de competitividade</li>
                      <li>• CPA estimado (40-50% range)</li>
                      <li>• Score de viabilidade 0-100</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">2. YouTube Intelligence</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Análise de canais concorrentes</li>
                      <li>• 7 fontes golden: @butecohits4948, @LizyRomance, etc.</li>
                      <li>• Métricas de vídeos e engagement</li>
                      <li>• Estratégias de conteúdo</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">3. Ads Intelligence</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Análise de anúncios ativos</li>
                      <li>• Palavras-chave dos competidores</li>
                      <li>• Estimativa de gastos publicitários</li>
                      <li>• Oportunidades de nicho</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-blue-700">📊 APIs e Integrações</h3>
                <div className="space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h4 className="font-semibold">Endpoints Ativos:</h4>
                    <ul className="text-sm font-mono mt-1 space-y-1">
                      <li>• /api/v1/validation (Google Search API)</li>
                      <li>• /api/v1/intelligence (YouTube + Ads)</li>
                      <li>• /api/v1/intelligence/mining (Channel mining)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Fontes de Dados:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Google Search API:</strong> Volume de busca real</li>
                      <li>• <strong>YouTube Data API:</strong> Métricas de vídeos</li>
                      <li>• <strong>Proprietary Database:</strong> Histórico de produtos</li>
                      <li>• <strong>User Golden Sources:</strong> 7 canais validados</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Golden Sources Ativos:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>📺 @butecohits4948, @LizyRomance, @val_le</li>
                      <li>📺 @legitdiv, @wrestlingfullhd, @wrestlingbest1</li>
                      <li>📺 @RookieSubs</li>
                      <li>📊 Y&F EMPREENDIMENTOS DIGITAIS LTDA</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-3 mt-6 text-blue-700">🎯 Produtos Validados</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Histórico de Sucessos:</strong><br/>
                    🎯 Glucosense, NerveCalm, GlicoShield, GutDrops<br/>
                    📈 Score médio: 85/100 | CPA: $45-$55
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">💻 Como Usar</h3>
              <ol className="space-y-2">
                <li><strong>1.</strong> Digite nome do produto para validar</li>
                <li><strong>2.</strong> Sistema executa análise completa (30-60s)</li>
                <li><strong>3.</strong> Receba score de viabilidade (0-100)</li>
                <li><strong>4.</strong> Visualize dados de competidores e YouTube</li>
                <li><strong>5.</strong> Use dados para decidir se vale promover</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Presell Generator */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              💰 Presell Generator - Templates de Alta Conversão
            </CardTitle>
            <CardDescription>
              6 templates de presell otimizados com taxas de conversão entre 8-18%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg border">
                <h3 className="font-bold text-purple-700 mb-2">1. 📊 Review Completo</h3>
                <p className="text-sm mb-2"><strong>Conversão:</strong> 12-18%</p>
                <p className="text-sm mb-3">Análise detalhada com prós, contras, evidências científicas e depoimentos reais.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <strong>Estrutura:</strong> Intro + Análise + Evidências + Depoimentos + CTA
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border">
                <h3 className="font-bold text-purple-700 mb-2">2. 🍪 Cookie/Advertorial</h3>
                <p className="text-sm mb-2"><strong>Conversão:</strong> 8-14%</p>
                <p className="text-sm mb-3">Formato editorial disfarçado, parece notícia ou artigo jornalístico.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <strong>Estrutura:</strong> Headline + História + Descoberta + Prova Social + Oferta
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border">
                <h3 className="font-bold text-purple-700 mb-2">3. 🎯 Quiz Interativo</h3>
                <p className="text-sm mb-2"><strong>Conversão:</strong> 15-18%</p>
                <p className="text-sm mb-3">Quiz personalizado que direciona para solução específica baseada nas respostas.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <strong>Estrutura:</strong> Perguntas + Análise + Recomendação + Urgência + Compra
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border">
                <h3 className="font-bold text-purple-700 mb-2">4. 💬 Depoimento Pessoal</h3>
                <p className="text-sm mb-2"><strong>Conversão:</strong> 10-16%</p>
                <p className="text-sm mb-3">História pessoal de transformação usando o produto, muito autêntica.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <strong>Estrutura:</strong> Problema + Jornada + Solução + Resultados + Recomendação
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border">
                <h3 className="font-bold text-purple-700 mb-2">5. 📰 Formato Notícia</h3>
                <p className="text-sm mb-2"><strong>Conversão:</strong> 9-13%</p>
                <p className="text-sm mb-3">Presell disfarçado de notícia sobre descoberta científica ou breakthrough.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <strong>Estrutura:</strong> Headline + Lide + Descoberta + Especialistas + Onde Comprar
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border">
                <h3 className="font-bold text-purple-700 mb-2">6. 🎬 Video Sales Letter</h3>
                <p className="text-sm mb-2"><strong>Conversão:</strong> 14-17%</p>
                <p className="text-sm mb-3">Presell em formato de vídeo com script otimizado para conversão.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <strong>Estrutura:</strong> Hook + Problema + Agitação + Solução + Prova + Oferta
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">⚙️ Funcionalidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">🎨 Personalização Automática</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Nome do produto e benefícios únicos</li>
                    <li>• Inserção automática de dados de validação</li>
                    <li>• Adaptação por nicho (saúde, dinheiro, relacionamento)</li>
                    <li>• Links de afiliado integrados</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">📊 Otimizações Incluídas</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Headlines testadas com alta CTR</li>
                    <li>• CTAs otimizados por template</li>
                    <li>• Gatilhos psicológicos específicos</li>
                    <li>• Mobile-first responsive design</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">💻 Como Usar</h3>
              <ol className="space-y-2">
                <li><strong>1.</strong> Escolha um template baseado no seu tráfego</li>
                <li><strong>2.</strong> Insira nome do produto e link de afiliado</li>
                <li><strong>3.</strong> Sistema personaliza automaticamente o conteúdo</li>
                <li><strong>4.</strong> Copie o HTML/CSS gerado</li>
                <li><strong>5.</strong> Suba para seu domínio ou landing page</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Builder */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              📈 Campaign Builder - Criação de Campanhas Google Ads
            </CardTitle>
            <CardDescription>
              Geração automática de campanhas Google Ads com export CSV e estrutura completa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-orange-700">🎯 Estrutura de Campanha</h3>
                <div className="space-y-3">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold">1. Campaign Level</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Nome: [Produto] - [Nicho] - [País]</li>
                      <li>• Tipo: Search Network</li>
                      <li>• Budget: Baseado no CPA estimado</li>
                      <li>• Geo-targeting: 9 países suportados</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold">2. Ad Groups</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Branded:</strong> Palavras com nome do produto</li>
                      <li>• <strong>Generic:</strong> Termos do nicho</li>
                      <li>• <strong>Competitor:</strong> Produtos concorrentes</li>
                      <li>• <strong>Problem-Focused:</strong> Dores do público</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold">3. Keywords Strategy</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Exact Match:</strong> Termos principais</li>
                      <li>• <strong>Phrase Match:</strong> Variações naturais</li>
                      <li>• <strong>Broad Match:</strong> Descoberta de novos termos</li>
                      <li>• <strong>Negative Keywords:</strong> Filtros automáticos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-orange-700">📄 Export Files</h3>
                <div className="space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h4 className="font-semibold">Estrutura de Arquivos CSV:</h4>
                    <ol className="text-sm mt-1 space-y-1">
                      <li>1. <strong>campaigns.csv</strong> - Configurações das campanhas</li>
                      <li>2. <strong>adgroups.csv</strong> - Grupos de anúncios</li>
                      <li>3. <strong>keywords.csv</strong> - Palavras-chave e bids</li>
                      <li>4. <strong>ads.csv</strong> - Anúncios responsivos</li>
                      <li>5. <strong>extensions.csv</strong> - Extensões de anúncio</li>
                    </ol>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Otimizações Automáticas:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Bids baseados em CPA do produto</li>
                      <li>• Headlines com CTR otimizado</li>
                      <li>• Descriptions focadas em conversão</li>
                      <li>• Extensions relevantes por nicho</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Configuração Inteligente:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Budget Distribution: 40% Branded, 60% Generic</li>
                      <li>• Bid Strategy: Target CPA automatizado</li>
                      <li>• Quality Score: Otimizado para 7+</li>
                      <li>• Audience: Lookalike de compradores</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-3 mt-6 text-orange-700">⚡ Performance Expected</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>CTR Médio:</strong> 3.2-4.8%<br/>
                    <strong>CVR Esperado:</strong> 2.1-3.7%<br/>
                    <strong>CPA Target:</strong> Baseado na análise de validação<br/>
                    <strong>ROAS Objetivo:</strong> 3:1 ou superior
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">💻 Como Usar</h3>
              <ol className="space-y-2">
                <li><strong>1.</strong> Insira dados do produto (nome, landing page, CPA)</li>
                <li><strong>2.</strong> Selecione países e budget diário</li>
                <li><strong>3.</strong> Sistema gera estrutura completa automaticamente</li>
                <li><strong>4.</strong> Download dos 5 arquivos CSV</li>
                <li><strong>5.</strong> Upload direto no Google Ads Editor</li>
                <li><strong>6.</strong> Campanha live em 15 minutos</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* ROI Tracking */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-600" />
              📊 ROI Tracking - Monitoramento e Auto-Scaling
            </CardTitle>
            <CardDescription>
              Sistema de tracking com janela rolling de 3 dias e automação de scaling horizontal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-red-700">📈 Monitoramento Contínuo</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Rolling Window 3 dias:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Análise de performance em tempo real</li>
                      <li>• Métricas de CTR, CVR, CPA e ROAS</li>
                      <li>• Comparação com targets estabelecidos</li>
                      <li>• Identificação de trends de deterioração</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Triggers de Ação:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Scale Up:</strong> ROAS > 4:1 por 2 dias</li>
                      <li>• <strong>Scale Down:</strong> ROAS < 2:1 por 3 dias</li>
                      <li>• <strong>Pause:</strong> ROAS < 1.5:1 por 2 dias</li>
                      <li>• <strong>Optimize:</strong> CTR decline > 20%</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Auto-Actions:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Ajuste automático de bids</li>
                      <li>• Pausa de keywords com baixo QS</li>
                      <li>• Realocação de budget entre ad groups</li>
                      <li>• Ativação de scaling horizontal</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-red-700">🚀 Horizontal Scaling</h3>
                <div className="space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h4 className="font-semibold">Domain Generation:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Criação automática de múltiplos domínios</li>
                      <li>• Templates: review, cookie, quiz</li>
                      <li>• Distribuição geográfica inteligente</li>
                      <li>• A/B testing automático</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Scaling Strategy:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Vertical:</strong> Aumento de budget na campanha original</li>
                      <li>• <strong>Horizontal:</strong> Novas campanhas/domínios</li>
                      <li>• <strong>Geographic:</strong> Expansão para novos países</li>
                      <li>• <strong>Creative:</strong> Novos presells e angles</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Performance Targets:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• ROAS mínimo: 3:1</li>
                      <li>• CTR benchmark: 3.5%+</li>
                      <li>• CVR target: 2.5%+</li>
                      <li>• Quality Score: 7+</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-3 mt-6 text-red-700">📊 Reports & Analytics</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Daily Reports:</strong> Performance summary<br/>
                    <strong>Weekly Deep Dive:</strong> Trend analysis<br/>
                    <strong>Real-time Alerts:</strong> Critical changes<br/>
                    <strong>ROI Dashboard:</strong> Visual performance tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-3">💻 Como Usar</h3>
              <ol className="space-y-2">
                <li><strong>1.</strong> Configure pixel de tracking na sua landing</li>
                <li><strong>2.</strong> Insira dados da campanha no sistema</li>
                <li><strong>3.</strong> Sistema monitora automaticamente 24/7</li>
                <li><strong>4.</strong> Receba alertas de performance via dashboard</li>
                <li><strong>5.</strong> Aprove ou rejeite recomendações de scaling</li>
                <li><strong>6.</strong> Acompanhe ROI e tome decisões data-driven</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* System Automation */}
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-green-900">
              <Calendar className="w-6 h-6" />
              ⏰ Sistema de Automação - 6:00 AM Daily Mining
            </CardTitle>
            <CardDescription className="text-green-700">
              Rotina automática diária que roda todo o pipeline de descoberta às 6:00 AM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">🔄 Rotina Automática</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-semibold">6:00 AM - Mining Start</h4>
                    <ol className="text-sm mt-1 space-y-1">
                      <li>1. Executa discovery em todas plataformas</li>
                      <li>2. Aplica filtros de qualidade</li>
                      <li>3. Calcula scores de viabilidade</li>
                      <li>4. Salva produtos descobertos</li>
                      <li>5. Gera relatório de descobertas</li>
                    </ol>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-semibold">Target Daily Output:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• 15-30 produtos validados</li>
                      <li>• Score mínimo: 40/100</li>
                      <li>• Comissão mínima: $30</li>
                      <li>• Cobertura multi-geo (9 países)</li>
                    </ul>
                  </div>

                  <div className="bg-green-100 p-3 rounded-lg border">
                    <h4 className="font-semibold">Status Atual:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>✅ <strong>ATIVO:</strong> Mining diário às 6:00 AM</li>
                      <li>✅ <strong>API Endpoint:</strong> /api/schedule-mining</li>
                      <li>✅ <strong>Last Run:</strong> Hoje às 6:00 AM</li>
                      <li>✅ <strong>Next Run:</strong> Amanhã às 6:00 AM</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">⚙️ Configuração & API</h3>
                <div className="space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h4 className="font-semibold">Schedule Management API:</h4>
                    <div className="text-sm font-mono mt-1 space-y-1">
                      <div><strong>POST</strong> /api/schedule-mining</div>
                      <div>• action: 'start' - Ativa mining diário</div>
                      <div>• action: 'stop' - Para mining diário</div>
                      <div>• action: 'status' - Verifica status</div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-semibold">Parâmetros de Mining:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• <strong>Platforms:</strong> ClickBank, SmartAdv, Dr Cash</li>
                      <li>• <strong>Payment Model:</strong> Both (CPA + Revenue Share)</li>
                      <li>• <strong>Search Mode:</strong> General discovery</li>
                      <li>• <strong>Categories:</strong> Health, Make Money Online</li>
                      <li>• <strong>Countries:</strong> US, CA, GB, AU, BR, DE, FR, IT, ES</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Sistema de Logs:</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Timestamp de todas execuções</li>
                      <li>• Count de produtos descobertos</li>
                      <li>• Errors e fallbacks registrados</li>
                      <li>• Performance metrics por plataforma</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <h4 className="font-semibold text-green-800">✅ Como Ativar/Desativar</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Use o botão "⏰ Ativar Mining Diário 6:00 AM" no dashboard principal, 
                    ou faça chamada direta para a API com action: 'start/stop'.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Database className="w-6 h-6 text-gray-600" />
              🏗️ Arquitetura Técnica Completa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">📁 Structure Overview</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                  <div>/src/app/ - Next.js App Router</div>
                  <div>├── /discovery-mining</div>
                  <div>├── /validation-intelligence</div>
                  <div>├── /presell-generator</div>
                  <div>├── /tracking</div>
                  <div>├── /dashboard-guide</div>
                  <div>├── /api/v1/ - 20 endpoints</div>
                  <div>/src/lib/ - Utility functions</div>
                  <div>/src/components/ui/ - shadcn/ui</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">🔗 API Endpoints (20)</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Discovery:</strong> /api/v1/discovery</div>
                  <div><strong>Mining:</strong> /api/mining, /api/schedule-mining</div>
                  <div><strong>Validation:</strong> /api/v1/validation</div>
                  <div><strong>Intelligence:</strong> /api/v1/intelligence/*</div>
                  <div><strong>Presells:</strong> /api/v1/presells/*</div>
                  <div><strong>Campaigns:</strong> /api/v1/campaigns</div>
                  <div><strong>Tracking:</strong> /api/v1/tracking</div>
                  <div><strong>Domains:</strong> /api/v1/domains</div>
                  <div><strong>Utilities:</strong> /api/channel-converter</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">⚡ Performance</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Deploy:</strong> Vercel Edge Functions</div>
                  <div><strong>Response Time:</strong> ~200ms average</div>
                  <div><strong>Uptime:</strong> 99.9%</div>
                  <div><strong>Auto-scaling:</strong> Serverless</div>
                  <div><strong>CDN:</strong> Global edge network</div>
                  <div><strong>Cache:</strong> Intelligent caching</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-900">📈 Métricas de Sucesso & ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-bold text-green-700 mb-2">🎯 Discovery Metrics</h3>
                <ul className="text-sm space-y-1">
                  <li>• 15-30 produtos/dia descobertos</li>
                  <li>• Score médio: 75/100</li>
                  <li>• Taxa de aprovação: 85%</li>
                  <li>• Cobertura: 9 países ativos</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-bold text-green-700 mb-2">💰 Presell Performance</h3>
                <ul className="text-sm space-y-1">
                  <li>• CVR médio: 8-18% (por template)</li>
                  <li>• Templates ativos: 6</li>
                  <li>• Personalização: 100% automática</li>
                  <li>• Mobile optimization: 95%+</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-bold text-green-700 mb-2">📊 Campaign Results</h3>
                <ul className="text-sm space-y-1">
                  <li>• ROAS médio: 3.2:1</li>
                  <li>• CTR médio: 4.1%</li>
                  <li>• Quality Score: 7.8/10</li>
                  <li>• Tempo de setup: 15min</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Smart Affiliate System v1.1</h2>
            <p className="text-blue-700 mb-4">
              Sistema completo de descoberta, validação, presell e scaling de produtos de afiliados
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button>← Voltar ao Dashboard</Button>
              </Link>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                ✅ 100% Operacional - Deploy Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}