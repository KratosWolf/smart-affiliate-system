import Link from 'next/link'

export default function Home() {
  const features = [
    {
      title: 'Discovery + Mining',
      description: 'High-volume product discovery with 15-30 products daily',
      href: '/discovery-mining', // CORRIGIDO - página correta!
    },
    {
      title: 'Validation + Intelligence',
      description: 'Validate viability & analyze top 10 competitors',
      href: '/validation-intelligence', // CORRIGIDO - página correta!
    },
    {
      title: 'Presell Generator', 
      description: 'Generate high-converting presells with 6 template types',
      href: '/presell-generator',
    },
    {
      title: 'Campaign Builder',
      description: 'Create Google Ads campaigns with CSV export',
      href: '/tracking', // Este usa tracking mesmo
    },
    {
      title: 'Intelligence Center',
      description: 'AI-powered market intelligence and competitor analysis',
      href: '/intelligence', // ADICIONADO - tínhamos isso!
    },
    {
      title: 'Dashboard',
      description: 'Complete system overview and performance metrics',
      href: '/dashboard',
    },
    {
      title: 'System Guide',
      description: 'How to use each module and when to use them',
      href: '/dashboard-guide',
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold">VIBE Smart Affiliate System</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            🚀 Sistema Completo para Afiliados
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Descubra produtos, valide oportunidades, crie presells e gerencie campanhas
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              href={feature.href}
              className="block p-6 bg-gray-50 rounded-lg border hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-gray-500">
            ✅ Sistema 100% funcional | ⚡ Deploy em produção ativo
          </p>
        </div>
      </div>
    </div>
  );
}
