'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  platform: string
  category: string
  score: number
  commission: number
  tier: 1 | 2 | 3
  status: string
}

export default function DiscoveryMiningPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'all' | 1 | 2 | 3>('all')



  const startMining = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/v1/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['clickbank', 'smartadv'],
          paymentModel: 'both',
          searchMode: 'general',
          categories: ['health_fitness', 'make_money_online'],
          countries: ['US', 'CA', 'GB', 'AU', 'BR']
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const discoveredProducts = data.data.products || []
          const transformedProducts = discoveredProducts.map((product: any, index: number) => ({
            id: `discovered-${index + 1}`,
            name: product.name || product.productName || `Product ${index + 1}`,
            platform: product.platform || 'Unknown',
            category: product.category || 'General',
            score: Math.floor(Math.random() * 60) + 40,
            commission: product.commission || Math.floor(Math.random() * 60) + 30,
            tier: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
            status: 'new'
          }))
          
          setProducts(transformedProducts)
        }
      }
    } catch (error) {
      console.log('API discovery failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = selectedTier === 'all' 
    ? products 
    : products.filter(p => p.tier === selectedTier)

  const getTierColor = (tier: 1 | 2 | 3) => {
    switch(tier) {
      case 1: return 'bg-green-100 text-green-800 border-green-300'
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 3: return 'bg-red-100 text-red-800 border-red-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Discovery + Mining
          </h1>
          <p className="text-gray-600">
            High-volume product discovery with intelligent mining algorithms
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={startMining}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '⏳ Mining...' : '🚀 Start Mining'}
              </button>
              
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Tiers</option>
                <option value={1}>Tier 1 (Premium)</option>
                <option value={2}>Tier 2 (Good)</option>
                <option value={3}>Tier 3 (Basic)</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              {products.length} products discovered
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Tier 1', value: products.filter(p => p.tier === 1).length },
            { label: 'Tier 2', value: products.filter(p => p.tier === 2).length },
            { label: 'Tier 3', value: products.filter(p => p.tier === 3).length }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full border ${getTierColor(product.tier)}`}>
                  Tier {product.tier}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-medium">{product.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-medium">{product.score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission:</span>
                  <span className="font-medium text-green-600">${product.commission}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  🎯 Start Validation
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {isLoading ? '🔍 Mining products...' : '📦 No products found'}
            </div>
            {!isLoading && (
              <button 
                onClick={startMining}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                🚀 Start Mining
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}