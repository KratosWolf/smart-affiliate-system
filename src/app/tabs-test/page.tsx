'use client'

export default function TabsTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 TESTE DE ABAS - TEMPORÁRIO</h1>
          <p className="text-xl">Verificando se as abas aparecem aqui</p>
        </div>

        {/* BOTÕES DAS ABAS */}
        <div className="flex gap-4 justify-center mb-8">
          <button 
            id="btn-guide-test"
            onClick={() => {
              document.getElementById('content-guide-test')!.style.display = 'block'
              document.getElementById('content-playbook-test')!.style.display = 'none'
              document.getElementById('content-implementation-test')!.style.display = 'none'
              document.querySelectorAll('[id^="btn-"][id$="-test"]').forEach(b => {
                b.classList.remove('bg-yellow-400')
                b.classList.add('bg-gray-600')
              })
              document.getElementById('btn-guide-test')!.classList.remove('bg-gray-600')
              document.getElementById('btn-guide-test')!.classList.add('bg-yellow-400')
            }}
            className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-xl font-black hover:bg-yellow-500 shadow-lg transition-colors"
          >
            📚 SYSTEM GUIDE
          </button>
          
          <button 
            id="btn-playbook-test"
            onClick={() => {
              document.getElementById('content-guide-test')!.style.display = 'none'
              document.getElementById('content-playbook-test')!.style.display = 'block'
              document.getElementById('content-implementation-test')!.style.display = 'none'
              document.querySelectorAll('[id^="btn-"][id$="-test"]').forEach(b => {
                b.classList.remove('bg-yellow-400')
                b.classList.add('bg-gray-600')
              })
              document.getElementById('btn-playbook-test')!.classList.remove('bg-gray-600')
              document.getElementById('btn-playbook-test')!.classList.add('bg-yellow-400')
            }}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg text-xl font-black hover:bg-purple-700 shadow-lg transition-colors"
          >
            📋 PLAYBOOK
          </button>
          
          <button 
            id="btn-implementation-test"
            onClick={() => {
              document.getElementById('content-guide-test')!.style.display = 'none'
              document.getElementById('content-playbook-test')!.style.display = 'none'
              document.getElementById('content-implementation-test')!.style.display = 'block'
              document.querySelectorAll('[id^="btn-"][id$="-test"]').forEach(b => {
                b.classList.remove('bg-yellow-400')
                b.classList.add('bg-gray-600')
              })
              document.getElementById('btn-implementation-test')!.classList.remove('bg-gray-600')
              document.getElementById('btn-implementation-test')!.classList.add('bg-yellow-400')
            }}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-black hover:bg-green-700 shadow-lg transition-colors"
          >
            🚀 IMPLEMENTATION
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="max-w-6xl mx-auto">
          
          {/* ABA GUIDE */}
          <div id="content-guide-test" className="block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">📚 SYSTEM GUIDE</h2>
              <p className="text-xl mb-4">Esta é a aba do System Guide (visível por padrão)</p>
              <p>Se você está vendo isso, significa que as abas estão funcionando!</p>
            </div>
          </div>

          {/* ABA PLAYBOOK */}
          <div id="content-playbook-test" className="hidden">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-purple-300 mb-6">📋 PLAYBOOK COMPLETO</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-900/50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">🏗️ ARQUITETURA DO SISTEMA</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-lg">Discovery & Intelligence Mining</h4>
                        <p className="text-gray-300">Sistema automatizado que monitora YouTube, Google Trends e transparência de anúncios para descobrir produtos em alta.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-lg">Validation Engine</h4>
                        <p className="text-gray-300">Valida produtos com Google Search API real, analisa concorrência e calcula scores de viabilidade.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-lg">Presell Generator</h4>
                        <p className="text-gray-300">Cria páginas de pré-venda otimizadas automaticamente com base nos dados coletados.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">📊 WORKFLOW OPERACIONAL</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-yellow-300">⚡ PROCESSO DIÁRIO</h4>
                      <ul className="space-y-2">
                        <li>• Mining automático de produtos (YouTube + Trends)</li>
                        <li>• Validação com Google Search API</li>
                        <li>• Análise de concorrência em tempo real</li>
                        <li>• Geração de scores de oportunidade</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-green-300">🎯 PROCESSO SEMANAL</h4>
                      <ul className="space-y-2">
                        <li>• Revisão de métricas de performance</li>
                        <li>• Otimização de campanhas ativas</li>
                        <li>• Análise de ROI por produto</li>
                        <li>• Ajuste de estratégias de targeting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABA IMPLEMENTATION */}
          <div id="content-implementation-test" className="hidden">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-green-300 mb-6">🚀 IMPLEMENTATION PLAN</h2>
              
              <div className="space-y-6">
                <div className="bg-green-900/50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">📅 CRONOGRAMA DE IMPLEMENTAÇÃO</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-bold text-lg text-green-300">SEMANA 1-2: Setup & Configuração</h4>
                      <ul className="mt-2 space-y-1 text-gray-300">
                        <li>• Configurar APIs (Google, YouTube, Pexels)</li>
                        <li>• Setup inicial de domínios e hosting</li>
                        <li>• Configurar tracking e analytics</li>
                        <li>• Primeiro teste com 2-3 produtos</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-yellow-400 pl-4">
                      <h4 className="font-bold text-lg text-yellow-300">SEMANA 3-4: Automação</h4>
                      <ul className="mt-2 space-y-1 text-gray-300">
                        <li>• Ativar mining automático diário</li>
                        <li>• Configurar campanhas do Google Ads</li>
                        <li>• Setup de presell pages automáticas</li>
                        <li>• Implementar sistema de tracking</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-bold text-lg text-purple-300">SEMANA 5+: Scaling</h4>
                      <ul className="mt-2 space-y-1 text-gray-300">
                        <li>• Scaling de campanhas com ROI &gt; 2:1</li>
                        <li>• Expansão para novos nichos</li>
                        <li>• Otimização contínua baseada em dados</li>
                        <li>• Automação completa do pipeline</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">🔧 PRÓXIMOS PASSOS IMEDIATOS</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-red-300">🚨 URGENTE (Esta Semana)</h4>
                      <ul className="space-y-2">
                        <li>• Configurar Google Ads API</li>
                        <li>• Setup do primeiro domínio</li>
                        <li>• Testar 1 produto manualmente</li>
                        <li>• Validar fluxo completo</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-orange-300">⏳ PRÓXIMA SEMANA</h4>
                      <ul className="space-y-2">
                        <li>• Ativar mining automático</li>
                        <li>• Configurar 3-5 produtos</li>
                        <li>• Setup de analytics avançado</li>
                        <li>• Primeiro ciclo de otimização</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-300">⚠️ Esta é uma página de teste temporária</p>
          <p className="text-sm text-gray-400">Acesse: smart-affiliate-system.vercel.app/tabs-test</p>
        </div>
      </div>
    </div>
  )
}