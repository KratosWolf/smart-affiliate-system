'use client'

import { useState } from 'react'

export default function TestTabs() {
  const [activeTab, setActiveTab] = useState('guide')

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">🧪 TAB TEST - Funcionamento Simples</h1>
      </div>

      {/* Botões das Abas */}
      <div className="flex gap-4 justify-center mb-8">
        <button 
          onClick={() => setActiveTab('guide')}
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            activeTab === 'guide' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          📚 SYSTEM GUIDE
        </button>
        <button 
          onClick={() => setActiveTab('playbook')}
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            activeTab === 'playbook' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          📋 PLAYBOOK
        </button>
        <button 
          onClick={() => setActiveTab('implementation')}
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            activeTab === 'implementation' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          🚀 IMPLEMENTATION
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'guide' && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">📚 SYSTEM GUIDE CONTENT</h2>
            <p className="text-blue-800">✅ Este é o conteúdo do System Guide. Se você está vendo isso, o sistema de abas FUNCIONA!</p>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p>Documentação completa de todos os módulos do sistema...</p>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">📋 PLAYBOOK COMPLETO</h2>
            <p className="text-purple-800">✅ Este é o conteúdo do PLAYBOOK. Se você está vendo isso, a aba FUNCIONA PERFEITAMENTE!</p>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h3 className="font-bold mb-2">🏗️ Arquitetura Técnica</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Framework: Next.js 15.5.0 com App Router</li>
                <li>Language: TypeScript para type safety</li>
                <li>UI: shadcn/ui + Tailwind CSS</li>
                <li>Deployment: Vercel auto-deploy</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-green-900 mb-4">🚀 IMPLEMENTATION PLAN</h2>
            <p className="text-green-800">✅ Este é o conteúdo do IMPLEMENTATION PLAN. Se você está vendo isso, a aba FUNCIONA PERFEITAMENTE!</p>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h3 className="font-bold mb-2">🔄 Automações Avançadas</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>✅ Mining Scheduler: Sistema ativo às 6:00 AM</li>
                <li>⏳ Auto-Validation: Validação automática dos discoveries</li>
                <li>⏳ Smart Notifications: Alertas de produtos premium</li>
                <li>⏳ Performance Reports: Relatórios automáticos semanais</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600">Tab ativa atual: <strong>{activeTab}</strong></p>
      </div>
    </div>
  )
}