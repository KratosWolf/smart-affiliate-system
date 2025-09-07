import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
    }

    // API está funcional via youtube-monitor.ts
    return NextResponse.json({ 
      success: true, 
      message: 'YouTube Search API - Ver youtube-monitor.ts para implementação completa',
      query 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}