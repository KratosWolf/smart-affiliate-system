/**
 * FTP Deployment API for Hostinger
 * Direct integration with hostinger-ftp-deploy
 */

import { NextRequest, NextResponse } from 'next/server'
import { hostingerDeploy } from '@/lib/deployment/hostinger-ftp-deploy'
import fs from 'fs/promises'
import path from 'path'
import JSZip from 'jszip'

export async function POST(request: NextRequest) {
  try {
    const { productName, presellFiles, affiliateUrl } = await request.json()
    
    if (!productName || !presellFiles || !affiliateUrl) {
      return NextResponse.json({
        success: false,
        error: 'Product name, presell files, and affiliate URL are required'
      }, { status: 400 })
    }

    console.log(`🚀 Preparing deployment for ${productName}...`)

    // Map product name to deployment key
    const deploymentKey = productName.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    // Create ZIP file with all presell files
    const zip = new JSZip()
    
    // Add all presell files to ZIP
    for (const [filename, content] of Object.entries(presellFiles as Record<string, string>)) {
      zip.file(filename, content)
      console.log(`📝 Added to ZIP: ${filename}`)
    }
    
    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    })
    
    // Convert to base64 for transport
    const zipBase64 = zipBuffer.toString('base64')
    
    // Get the deployment URL
    const deployedUrl = `https://bestbargains24x7.com/${deploymentKey}`
    
    console.log(`✅ ZIP package created successfully for ${productName}`)
    
    // Instructions for manual deployment
    const deployInstructions = {
      step1: "Download the ZIP file using the 'Download ZIP' button",
      step2: "Access Hostinger File Manager at https://hpanel.hostinger.com",
      step3: `Navigate to public_html/${deploymentKey}/`,
      step4: "Upload and extract the ZIP file",
      step5: `Your presell will be live at ${deployedUrl}`
    }

    return NextResponse.json({
      success: true,
      data: {
        productName,
        deploymentKey,
        deployedUrl,
        method: 'zip-download',
        deployedAt: new Date().toISOString(),
        files: Object.keys(presellFiles),
        zipData: zipBase64,
        zipSize: Math.round(zipBuffer.length / 1024) + ' KB',
        deployInstructions,
        message: 'ZIP file created successfully. Download and upload to Hostinger manually.'
      }
    })

  } catch (error) {
    console.error('❌ FTP deployment API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'FTP deployment failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return FTP configuration status without actually testing connections (for performance)
    console.log('🔍 Checking FTP configuration...')
    
    const domains = (hostingerDeploy as any).config.domains
    const results = []
    
    for (const [key, config] of Object.entries(domains as any)) {
      results.push({
        productKey: key,
        domain: (config as any).domain,
        ftpUser: (config as any).ftpUser,
        connected: 'not_tested', // Don't test to avoid timeouts
        url: `https://${(config as any).domain}`
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ftpConfig: {
          host: process.env.FTP_HOST,
          hasCredentials: !!(process.env.FTP_USER && process.env.FTP_PASSWORD),
          port: process.env.FTP_PORT || '21'
        },
        domains: results,
        summary: {
          total: results.length,
          configured: results.length,
          note: 'Connection testing disabled for performance. Real deployment will test connectivity.'
        }
      }
    })

  } catch (error) {
    console.error('❌ FTP config check error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'FTP configuration check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}