import Link from 'next/link'
import { Search, Target, TrendingUp, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const features = [
    {
      title: 'Discovery + Mining',
      description: 'High-volume product discovery with 15-30 products daily',
      icon: <Search className="w-8 h-8 text-purple-600" />,
      href: '/discovery-mining',
      current: false
    },
    {
      title: 'Validation + Intelligence',
      description: 'Validate viability & analyze top 10 competitors',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      href: '/validation',
      current: false
    },
    {
      title: 'Presell Generator', 
      description: 'Generate high-converting presells with 5 template types',
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      href: '/presell',
      current: false
    },
    {
      title: 'Campaign Builder',
      description: 'Create Google Ads campaigns with CSV export',
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      href: '/campaigns',
      current: false
    },
    {
      title: 'ROI Tracking',
      description: 'Monitor ROI with 3-day rolling window & auto-scaling',
      icon: <BarChart3 className="w-8 h-8 text-red-600" />,
      href: '/tracking',
      current: false
    },
    {
      title: 'Dashboard',
      description: 'Complete system overview and performance metrics',
      icon: <BarChart3 className="w-8 h-8 text-slate-600" />,
      href: '/dashboard',
      current: false
    },
    {
      title: 'System Guide',
      description: 'How to use each module and when to use them',
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      href: '/dashboard-guide',
      current: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Affiliate System
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {features.map((feature, index) => (
                <Link key={index} href={feature.href}>
                  <Button 
                    variant={feature.current ? "default" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    {feature.icon}
                    {feature.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${
                feature.current ? 'border-blue-500 bg-blue-50' : ''
              }`}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Current Page Content */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Choose a Module to Get Started</h2>
          <p className="text-gray-600">Select any module above to begin using the Smart Affiliate System</p>
        </div>
      </div>
    </div>
  );
}
