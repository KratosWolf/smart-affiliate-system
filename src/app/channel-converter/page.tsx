"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Search, CheckCircle } from 'lucide-react'

export default function ChannelConverterPage() {
  const [handles, setHandles] = useState(`@butecohits4948
@LizyRomance
@val_le
@legitdiv
@wrestlingfullhd
@wrestlingbest1
@RookieSubs`)
  
  const [results, setResults] = useState<any[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')

  const convertHandles = async () => {
    setIsConverting(true)
    setError('')
    setResults([])
    
    const handleList = handles.split('\n').map(h => h.trim()).filter(h => h)
    
    try {
      const response = await fetch('/api/convert-channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handles: handleList })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data.channels)
      } else {
        setError(data.error || 'Failed to convert channels')
      }
      
    } catch (error) {
      setError('Failed to convert channels')
      console.error('Conversion error:', error)
    } finally {
      setIsConverting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAllChannelIds = () => {
    const channelIds = results.map(r => r.channelId).join('\n')
    navigator.clipboard.writeText(channelIds)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Channel ID Converter</h1>
          </div>
          <p className="text-xl text-gray-600">
            Convert YouTube handles (@username) to Channel IDs for API use
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                YouTube Handles
              </CardTitle>
              <CardDescription>
                Enter your YouTube channel handles (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full h-48 p-3 border-2 rounded-lg resize-none font-mono text-sm"
                placeholder="@butecohits4948
@LizyRomance
@val_le"
                value={handles}
                onChange={(e) => setHandles(e.target.value)}
              />
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <span>{error}</span>
                </div>
              )}
              
              <Button 
                onClick={convertHandles}
                disabled={isConverting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Convert to Channel IDs
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Channel IDs
                  </CardTitle>
                  <CardDescription>
                    Ready to use in your mining system
                  </CardDescription>
                </div>
                {results.length > 0 && (
                  <Button 
                    onClick={copyAllChannelIds}
                    variant="outline" 
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All IDs
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {results.length === 0 && !isConverting && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No results yet. Enter handles and click convert.</p>
                </div>
              )}
              
              {results.length > 0 && (
                <div className="space-y-4">
                  {results.map((channel, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">{channel.title}</div>
                          <div className="text-sm text-gray-600">{channel.handle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {channel.subscriberCount?.toLocaleString()} subscribers
                          </div>
                          <div className="text-sm text-gray-500">
                            {channel.videoCount?.toLocaleString()} videos
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-600 mb-1">Channel ID:</div>
                        <div className="font-mono text-sm flex items-center justify-between">
                          <span className="truncate pr-2">{channel.channelId}</span>
                          <Button 
                            onClick={() => copyToClipboard(channel.channelId)}
                            variant="ghost" 
                            size="sm"
                            className="ml-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Ready for Mining System</h3>
                    <p className="text-sm text-green-700">
                      These Channel IDs are now ready to replace the @handles in your mining configuration.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}