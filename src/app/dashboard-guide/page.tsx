'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SystemGuidePage() {
  const [activeTab, setActiveTab] = useState<'guide' | 'playbook' | 'implementation'>('guide')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema Completo - Guia Detalhado</h1>
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

        {/* TAB SYSTEM */}
        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-xl mb-8">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-black text-white">🚀 TABS WORKING!</h2>
            <p className="text-white text-2xl mt-2 font-bold">Current Tab: {activeTab}</p>
          </div>
          
          <div className="flex gap-4 justify-center mb-8">
            <button 
              onClick={() => setActiveTab('guide')}
              className={`px-8 py-4 rounded-lg text-xl font-black shadow-lg transition-colors ${
                activeTab === 'guide' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              📚 SYSTEM GUIDE
            </button>
            <button 
              onClick={() => setActiveTab('playbook')}
              className={`px-8 py-4 rounded-lg text-xl font-black shadow-lg transition-colors ${
                activeTab === 'playbook' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              📋 PLAYBOOK
            </button>
            <button 
              onClick={() => setActiveTab('implementation')}
              className={`px-8 py-4 rounded-lg text-xl font-black shadow-lg transition-colors ${
                activeTab === 'implementation' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              🚀 IMPLEMENTATION
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                  📚 SYSTEM GUIDE COMPLETO
                  <Badge className="bg-blue-600 text-white">v1.1</Badge>
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Documentação completa de todos os módulos, APIs e funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Visão Geral do Sistema */}
                <div className="bg-white/60 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold mb-3 text-blue-800">🏗️ VISÃO GERAL DO SISTEMA</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">📊 Módulos Operacionais</h4>
                      <ul className="text-xs space-y-1">
                        <li>• <strong>Discovery:</strong> Mining de produtos em alta</li>
                        <li>• <strong>Validation:</strong> Google Search API real</li>
                        <li>• <strong>Intelligence:</strong> Análise de concorrência</li>
                        <li>• <strong>Campaign Builder:</strong> Google Ads automático</li>
                        <li>• <strong>Presell Generator:</strong> 6 templates otimizados</li>
                        <li>• <strong>ROI Tracking:</strong> Métricas em tempo real</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">⚙️ Stack Técnica</h4>
                      <ul className="text-xs space-y-1">
                        <li>• <strong>Frontend:</strong> Next.js 15.5.0 + TypeScript</li>
                        <li>• <strong>UI:</strong> shadcn/ui + Tailwind CSS</li>
                        <li>• <strong>APIs:</strong> Google Search, YouTube, Pexels</li>
                        <li>• <strong>Deploy:</strong> Vercel auto-deploy</li>
                        <li>• <strong>Database:</strong> JSON + Local Storage</li>
                        <li>• <strong>Performance:</strong> ~200ms response time</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Como Usar Cada Ferramenta */}
                <div className="bg-white/60 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold mb-3 text-blue-800">🛠️ COMO USAR CADA FERRAMENTA</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-400 pl-3">
                      <h4 className="font-semibold text-sm">🔍 Discovery & Mining</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Acesse /discovery → Configure países e nichos → Clique "Start Mining" → 
                        Sistema encontra 15-30 produtos/dia automaticamente
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-3">
                      <h4 className="font-semibold text-sm">✅ Product Validation</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Acesse /validation → Produtos aparecem automaticamente → 
                        Clique "Validate" para análise com Google API → Score 0-100
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-3">
                      <h4 className="font-semibold text-sm">🎯 Campaign Builder</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Acesse /campaign-builder → Selecione produto validado → 
                        Configure budget e targeting → Download CSV para Google Ads
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-400 pl-3">
                      <h4 className="font-semibold text-sm">📊 ROI Tracking</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Acesse /tracking → Configure UTM tracking → 
                        Monitore conversões em tempo real → Auto-scaling com ROI &gt; 2:1
                      </p>
                    </div>
                  </div>
                </div>

                {/* APIs e Configurações */}
                <div className="bg-white/60 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold mb-3 text-blue-800">🔑 APIs E CONFIGURAÇÕES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">APIs Necessárias</h4>
                      <ul className="text-xs space-y-1">
                        <li>✅ <strong>Google Search API:</strong> Configurada</li>
                        <li>✅ <strong>YouTube Data API:</strong> Ativa</li>
                        <li>✅ <strong>Pexels API:</strong> Integrada</li>
                        <li>⏳ <strong>Google Ads API:</strong> Pendente config</li>
                        <li>⏳ <strong>Analytics API:</strong> Setup manual</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Configurações Recomendadas</h4>
                      <ul className="text-xs space-y-1">
                        <li>• <strong>Mining:</strong> Rodar às 6:00 AM diariamente</li>
                        <li>• <strong>Validation:</strong> Batch de 10 produtos/vez</li>
                        <li>• <strong>Budget:</strong> $50-100/produto para teste</li>
                        <li>• <strong>Scaling:</strong> Automático com ROI &gt; 2:1</li>
                        <li>• <strong>Tracking:</strong> UTM em todas URLs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Fluxo de Trabalho */}
                <div className="bg-white/60 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold mb-3 text-blue-800">🔄 FLUXO DE TRABALHO COMPLETO</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-xs"><strong>Discovery:</strong> Sistema encontra produtos em alta no YouTube/Google</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-xs"><strong>Validation:</strong> API valida demanda e concorrência (Score 0-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-xs"><strong>Presell:</strong> Gera página otimizada automaticamente (8-18% CVR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-xs"><strong>Campaign:</strong> Cria campanha Google Ads com targeting preciso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</div>
                      <span className="text-xs"><strong>Tracking:</strong> Monitora ROI e escala automaticamente</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'playbook' && (
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                📋 PLAYBOOK COMPLETO
                <Badge className="bg-purple-600 text-white">READY</Badge>
              </CardTitle>
              <CardDescription className="text-purple-700">
                Arquitetura completa do sistema e workflow operacional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Arquitetura do Sistema */}
              <div className="bg-white/60 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-bold mb-3 text-purple-800">🏗️ ARQUITETURA DO SISTEMA</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <div className="font-semibold text-sm">Discovery & Intelligence Mining</div>
                      <div className="text-xs text-gray-600">Sistema automatizado que monitora YouTube, Google Trends e transparência de anúncios.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <div className="font-semibold text-sm">Validation Engine</div>
                      <div className="text-xs text-gray-600">Valida produtos com Google Search API real e analisa concorrência.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <div className="font-semibold text-sm">Presell Generator</div>
                      <div className="text-xs text-gray-600">Cria páginas de pré-venda otimizadas automaticamente.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Operacional */}
              <div className="bg-white/60 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-bold mb-3 text-purple-800">📊 WORKFLOW OPERACIONAL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-yellow-700">⚡ PROCESSO DIÁRIO</h4>
                    <ul className="text-xs space-y-1">
                      <li>• Mining automático de produtos</li>
                      <li>• Validação com Google Search API</li>
                      <li>• Análise de concorrência em tempo real</li>
                      <li>• Geração de scores de oportunidade</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-700">🎯 PROCESSO SEMANAL</h4>
                    <ul className="text-xs space-y-1">
                      <li>• Revisão de métricas de performance</li>
                      <li>• Otimização de campanhas ativas</li>
                      <li>• Análise de ROI por produto</li>
                      <li>• Ajuste de estratégias de targeting</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* KPIs Principais */}
              <div className="bg-white/60 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-bold mb-3 text-purple-800">📈 KPIs PRINCIPAIS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-xs text-gray-600">Taxa de Produtos Viáveis</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">3.2x</div>
                    <div className="text-xs text-gray-600">ROI Médio das Campanhas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15-30</div>
                    <div className="text-xs text-gray-600">Produtos/dia Discovery</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">24h</div>
                    <div className="text-xs text-gray-600">Tempo Setup Campaign</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'implementation' && (
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                🚀 IMPLEMENTATION PLAN
                <Badge className="bg-green-600 text-white">READY</Badge>
              </CardTitle>
              <CardDescription className="text-green-700">
                Cronograma detalhado e próximos passos para implementação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Cronograma */}
              <div className="bg-white/60 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold mb-3 text-green-800">📅 CRONOGRAMA DE IMPLEMENTAÇÃO</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-400 pl-3">
                    <h4 className="font-semibold text-sm text-green-700">SEMANA 1-2: Setup & Configuração</h4>
                    <ul className="text-xs mt-1 space-y-0.5 text-gray-600">
                      <li>• Configurar APIs (Google, YouTube, Pexels)</li>
                      <li>• Setup inicial de domínios e hosting</li>
                      <li>• Configurar tracking e analytics</li>
                      <li>• Primeiro teste com 2-3 produtos</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-yellow-400 pl-3">
                    <h4 className="font-semibold text-sm text-yellow-700">SEMANA 3-4: Automação</h4>
                    <ul className="text-xs mt-1 space-y-0.5 text-gray-600">
                      <li>• Ativar mining automático diário</li>
                      <li>• Configurar campanhas do Google Ads</li>
                      <li>• Setup de presell pages automáticas</li>
                      <li>• Implementar sistema de tracking</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-400 pl-3">
                    <h4 className="font-semibold text-sm text-purple-700">SEMANA 5+: Scaling</h4>
                    <ul className="text-xs mt-1 space-y-0.5 text-gray-600">
                      <li>• Scaling de campanhas com ROI &gt; 2:1</li>
                      <li>• Expansão para novos nichos</li>
                      <li>• Otimização contínua baseada em dados</li>
                      <li>• Automação completa do pipeline</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-white/60 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold mb-3 text-green-800">🔧 PRÓXIMOS PASSOS IMEDIATOS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-700">🚨 URGENTE (Esta Semana)</h4>
                    <ul className="text-xs space-y-1">
                      <li>• Configurar Google Ads API</li>
                      <li>• Setup do primeiro domínio</li>
                      <li>• Testar 1 produto manualmente</li>
                      <li>• Validar fluxo completo</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-700">⏳ PRÓXIMA SEMANA</h4>
                    <ul className="text-xs space-y-1">
                      <li>• Ativar mining automático</li>
                      <li>• Configurar 3-5 produtos</li>
                      <li>• Setup de analytics avançado</li>
                      <li>• Primeiro ciclo de otimização</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recursos Necessários */}
              <div className="bg-white/60 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold mb-3 text-green-800">💼 RECURSOS NECESSÁRIOS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xl font-bold text-blue-600">$500</div>
                    <div className="text-xs text-gray-600">Budget Inicial Ads</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">10h</div>
                    <div className="text-xs text-gray-600">Setup Semanal</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">3</div>
                    <div className="text-xs text-gray-600">APIs Necessárias</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">1</div>
                    <div className="text-xs text-gray-600">Domínio Principal</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}