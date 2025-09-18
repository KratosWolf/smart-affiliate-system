'use client'

import { useState } from 'react'

export default function AITestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    productName: 'Skinatrin',
    targetCountry: 'BR',
    language: 'pt-BR',
    task: 'headlines'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🧪 Testing AI with:', formData)
      
      const response = await fetch('/api/v1/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Erro desconhecido')
      }
    } catch (err) {
      console.error('Test error:', err)
      setError('Erro na requisição: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Teste do Sistema de IA
          </h1>
          <p className="text-gray-600 mb-8">
            Claude + Gemini para Headlines e Descriptions Otimizadas
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Skinatrin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País de Destino
                  </label>
                  <select
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BR">🇧🇷 Brasil</option>
                    <option value="IT">🇮🇹 Itália</option>
                    <option value="US">🇺🇸 Estados Unidos</option>
                    <option value="PL">🇵🇱 Polônia</option>
                    <option value="DE">🇩🇪 Alemanha</option>
                    <option value="FR">🇫🇷 França</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idioma
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="it-IT">Italiano</option>
                    <option value="en-US">English (US)</option>
                    <option value="pl-PL">Polski</option>
                    <option value="de-DE">Deutsch</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Conteúdo
                  </label>
                  <select
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="headlines">Headlines</option>
                    <option value="descriptions">Descriptions</option>
                    <option value="callouts">Callouts</option>
                    <option value="sitelinks">Sitelinks</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Gerando com IA...
                    </span>
                  ) : (
                    '🚀 Testar Sistema de IA'
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultado:</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-red-800 mb-2">❌ Erro:</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-green-800 mb-2">✅ Produto:</h3>
                    <p className="text-green-700">{result.productName} ({result.targetCountry})</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-green-800 mb-2">🎯 Conteúdo Gerado:</h3>
                    <div className="bg-white rounded border p-3 space-y-2">
                      {result.result?.content?.map((item: string, index: number) => (
                        <div key={index} className="text-sm text-gray-800 border-l-2 border-blue-400 pl-3">
                          {index + 1}. {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.result?.reasoning && (
                    <div>
                      <h3 className="font-medium text-green-800 mb-2">🧠 Análise da IA:</h3>
                      <div className="bg-white rounded border p-3 text-sm text-gray-700">
                        {result.result.reasoning.map((reason: string, index: number) => (
                          <p key={index} className="mb-1">• {reason}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-green-800 mb-2">📊 Confiança:</h3>
                    <div className="bg-white rounded border p-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(result.result?.confidence || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round((result.result?.confidence || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    API Keys: Claude ✅ | Gemini ✅ | Gerado em {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}

              {!result && !error && !loading && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">🤖</div>
                  <p>Preencha o formulário e clique em "Testar Sistema de IA"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}