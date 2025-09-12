import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Campaign builder endpoint - Under development'
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'Campaign builder endpoint - Under development',
      data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}