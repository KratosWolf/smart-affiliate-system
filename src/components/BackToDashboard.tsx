'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

interface BackToDashboardProps {
  className?: string
}

export default function BackToDashboard({ className = "" }: BackToDashboardProps) {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <Link href="/">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
      </Link>
      <div className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4 mr-1" />
        <span>Dashboard Principal sempre disponível</span>
      </div>
    </div>
  )
}