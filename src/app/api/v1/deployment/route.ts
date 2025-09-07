import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs/promises'

export async function POST(request: NextRequest) {
  try {
    const { productName, deploymentConfig } = await request.json()
    
    if (!productName || !deploymentConfig?.affiliateUrl) {
      return NextResponse.json({
        success: false,
        error: 'Product name and affiliate URL are required'
      }, { status: 400 })
    }

    console.log(`🚀 Starting deployment for ${productName}...`)

    // Call the deployment script
    const scriptPath = path.join(process.cwd(), 'scripts', 'deploy-presell.js')
    const method = deploymentConfig.method || 'static'
    const affiliate = deploymentConfig.affiliateUrl
    const price = deploymentConfig.price || 97
    const country = deploymentConfig.country || 'BR'
    const template = deploymentConfig.templateType || 'default'

    const cmd = `node "${scriptPath}" "${productName}" --method=${method} --affiliate="${affiliate}" --price=${price} --country=${country} --template=${template}`
    
    console.log(`📝 Executing: ${cmd}`)
    
    try {
      const output = execSync(cmd, { 
        encoding: 'utf-8',
        timeout: 60000, // 1 minute timeout
        cwd: process.cwd()
      })

      // Extract URL from output
      const urlMatch = output.match(/🎉 Success! Your presell is live at: (.+)/)
      const deployedUrl = urlMatch ? urlMatch[1] : null

      console.log(`✅ Deployment completed successfully`)

      return NextResponse.json({
        success: true,
        data: {
          productName,
          method,
          deployedUrl,
          output: output.split('\n').filter(line => line.trim()),
          deployedAt: new Date().toISOString()
        }
      })

    } catch (execError: any) {
      console.error(`❌ Deployment script failed:`, execError.message)
      
      return NextResponse.json({
        success: false,
        error: 'Deployment script execution failed',
        details: execError.message,
        output: execError.stdout || execError.stderr
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Deployment API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal deployment error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get list of deployed presells
    const staticDeploymentsPath = path.join(process.cwd(), 'static-deployments')
    const generatedPresellsPath = path.join(process.cwd(), 'generated-presells')
    
    const deployments: any[] = []

    try {
      const staticDirs = await fs.readdir(staticDeploymentsPath)
      
      for (const dir of staticDirs) {
        const deploymentPath = path.join(staticDeploymentsPath, dir)
        const stat = await fs.stat(deploymentPath)
        
        if (stat.isDirectory()) {
          deployments.push({
            productName: dir,
            method: 'static',
            deployedAt: stat.mtime.toISOString(),
            localPath: deploymentPath,
            url: `file://${deploymentPath}/index.html`,
            status: 'deployed'
          })
        }
      }
    } catch (error) {
      // Directory might not exist yet
      console.log('No static deployments found')
    }

    return NextResponse.json({
      success: true,
      data: {
        deployments,
        summary: {
          total: deployments.length,
          static: deployments.filter(d => d.method === 'static').length,
          vercel: deployments.filter(d => d.method === 'vercel').length,
          netlify: deployments.filter(d => d.method === 'netlify').length
        }
      }
    })

  } catch (error) {
    console.error('❌ Get deployments error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get deployments'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productName = searchParams.get('productName')
    
    if (!productName) {
      return NextResponse.json({
        success: false,
        error: 'Product name is required'
      }, { status: 400 })
    }

    // Remove deployment directories
    const staticPath = path.join(process.cwd(), 'static-deployments', productName)
    const generatedPath = path.join(process.cwd(), 'generated-presells', productName)
    
    const removedPaths: string[] = []

    try {
      await fs.rm(staticPath, { recursive: true, force: true })
      removedPaths.push(staticPath)
      console.log(`✅ Removed static deployment: ${staticPath}`)
    } catch (error) {
      console.log(`Static deployment not found: ${staticPath}`)
    }

    try {
      await fs.rm(generatedPath, { recursive: true, force: true })
      removedPaths.push(generatedPath)
      console.log(`✅ Removed generated files: ${generatedPath}`)
    } catch (error) {
      console.log(`Generated files not found: ${generatedPath}`)
    }

    return NextResponse.json({
      success: true,
      data: {
        productName,
        removedPaths,
        removedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Delete deployment error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete deployment'
    }, { status: 500 })
  }
}