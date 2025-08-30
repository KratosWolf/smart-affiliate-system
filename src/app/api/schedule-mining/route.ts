import { NextRequest, NextResponse } from 'next/server'

// Sistema de Agendamento Diário - 6:00 AM
let scheduledInterval: NodeJS.Timeout | null = null
let isScheduleActive = false

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'start') {
      if (isScheduleActive) {
        return NextResponse.json({
          success: false,
          message: 'Schedule already active'
        })
      }
      
      console.log('🔄 Starting daily mining schedule at 6:00 AM...')
      
      // Calcular próximo 6:00 AM
      const now = new Date()
      const next6AM = new Date()
      next6AM.setHours(6, 0, 0, 0)
      
      if (now.getHours() >= 6) {
        // Se já passou das 6h hoje, agendar para amanhã
        next6AM.setDate(next6AM.getDate() + 1)
      }
      
      const timeUntil6AM = next6AM.getTime() - now.getTime()
      
      console.log(`⏰ Next mining scheduled for: ${next6AM.toLocaleString()}`)
      console.log(`⏳ Time until next run: ${Math.floor(timeUntil6AM / (1000 * 60 * 60))}h ${Math.floor((timeUntil6AM % (1000 * 60 * 60)) / (1000 * 60))}m`)
      
      // Timeout para primeira execução
      setTimeout(() => {
        runDailyMining()
        
        // Depois executa a cada 24 horas
        scheduledInterval = setInterval(() => {
          runDailyMining()
        }, 24 * 60 * 60 * 1000)
        
      }, timeUntil6AM)
      
      isScheduleActive = true
      
      return NextResponse.json({
        success: true,
        message: 'Daily mining schedule activated',
        nextRun: next6AM.toISOString(),
        timeUntilNext: timeUntil6AM
      })
      
    } else if (action === 'stop') {
      if (scheduledInterval) {
        clearInterval(scheduledInterval)
        scheduledInterval = null
      }
      
      isScheduleActive = false
      
      return NextResponse.json({
        success: true,
        message: 'Daily mining schedule stopped'
      })
      
    } else if (action === 'status') {
      const now = new Date()
      const next6AM = new Date()
      next6AM.setHours(6, 0, 0, 0)
      
      if (now.getHours() >= 6) {
        next6AM.setDate(next6AM.getDate() + 1)
      }
      
      return NextResponse.json({
        success: true,
        data: {
          isActive: isScheduleActive,
          nextRun: next6AM.toISOString(),
          currentTime: now.toISOString(),
          timeUntilNext: next6AM.getTime() - now.getTime()
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action. Use: start, stop, or status'
    })
    
  } catch (error) {
    console.error('Schedule mining error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to manage mining schedule'
    }, { status: 500 })
  }
}

async function runDailyMining() {
  console.log('🌅 DAILY MINING STARTED - 6:00 AM')
  console.log('🔍 Running high-volume discovery (15-30 products target)')
  
  try {
    // Chama o mining endpoint REAL
    const response = await fetch('http://localhost:3000/api/mining', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Daily mining completed: ${data.data.totalProducts} products discovered`)
      console.log(`📊 Summary: ${data.data.summary.immediate} immediate, ${data.data.summary.exclusive} exclusive, ${data.data.summary.hot} hot`)
    } else {
      console.error('❌ Daily mining failed:', response.status)
    }
    
  } catch (error) {
    console.error('❌ Daily mining error:', error)
  }
  
  console.log('⏰ Next mining scheduled for tomorrow at 6:00 AM')
}