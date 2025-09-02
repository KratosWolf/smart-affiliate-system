import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs/promises'

export async function POST(request: NextRequest) {
  try {
    const { productUrl, productName } = await request.json()
    
    if (!productUrl) {
      return NextResponse.json({ error: 'Product URL is required' }, { status: 400 })
    }

    console.log(`🚀 Starting screenshot capture for: ${productName || 'Unknown Product'}`)
    
    // Create directory for screenshots
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots', 
      productName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown-product')
    
    try {
      await fs.mkdir(screenshotsDir, { recursive: true })
    } catch (err) {
      console.log('Directory already exists or created')
    }

    // Configure Puppeteer for Vercel/serverless environment
    const isProduction = process.env.NODE_ENV === 'production'
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      ...(isProduction && {
        executablePath: '/usr/bin/chromium-browser' // Common path in Vercel
      })
    })

    try {
      const page = await browser.newPage()
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      
      console.log(`📍 Navigating to: ${productUrl}`)
      
      await page.goto(productUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Capture desktop screenshot (hero section)
      console.log('📸 Capturing desktop screenshot...')
      await page.setViewport({ width: 1920, height: 1080 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const desktopPath = path.join(screenshotsDir, 'desktop-hero.jpg')
      await page.screenshot({
        path: desktopPath as `${string}.jpeg`,
        type: 'jpeg',
        quality: 85,
        clip: {
          x: 0,
          y: 0,
          width: 1920,
          height: 1080
        }
      })
      console.log('✅ Desktop screenshot saved')
      
      // Capture mobile screenshot
      console.log('📱 Capturing mobile screenshot...')
      await page.setViewport({ width: 375, height: 812 })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mobilePath = path.join(screenshotsDir, 'mobile-hero.jpg')
      await page.screenshot({
        path: mobilePath as `${string}.jpeg`,
        type: 'jpeg',
        quality: 85,
        clip: {
          x: 0,
          y: 0,
          width: 375,
          height: 812
        }
      })
      console.log('✅ Mobile screenshot saved')
      
      // Capture full page screenshot (for analysis)
      console.log('📄 Capturing full page screenshot...')
      await page.setViewport({ width: 1920, height: 1080 })
      
      const fullPagePath = path.join(screenshotsDir, 'full-page.jpg')
      await page.screenshot({
        path: fullPagePath as `${string}.jpeg`,
        type: 'jpeg',
        quality: 70,
        fullPage: true
      })
      console.log('✅ Full page screenshot saved')

      // Extract basic page info
      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title || '',
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          h1: document.querySelector('h1')?.textContent || '',
          price: document.querySelector('[class*="price"], [data-price], .price-value')?.textContent || '',
          currency: document.documentElement.lang || 'en'
        }
      })

      await browser.close()

      const publicPaths = {
        desktop: `/screenshots/${productName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown-product'}/desktop-hero.jpg`,
        mobile: `/screenshots/${productName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown-product'}/mobile-hero.jpg`,
        fullPage: `/screenshots/${productName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown-product'}/full-page.jpg`
      }

      return NextResponse.json({
        success: true,
        message: 'Screenshots captured successfully',
        screenshots: publicPaths,
        pageInfo,
        productName,
        capturedAt: new Date().toISOString()
      })

    } catch (pageError) {
      console.error('Screenshot capture error:', pageError)
      await browser.close()
      
      return NextResponse.json({
        error: 'Failed to capture screenshots',
        details: pageError instanceof Error ? pageError.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Screenshot API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}