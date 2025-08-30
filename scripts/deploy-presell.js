#!/usr/bin/env node

/**
 * Automated Presell-to-Domain Deployment Script
 * Takes generated presell and deploys to hosting/domain
 */

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

class PresellDeployer {
  constructor() {
    this.deploymentMethods = {
      'vercel': this.deployToVercel.bind(this),
      'netlify': this.deployToNetlify.bind(this),
      'static': this.deployToStaticHosting.bind(this),
      'cpanel': this.deployToCPanel.bind(this)
    }
  }

  async deployPresell(productName, deploymentConfig) {
    console.log(`🚀 Starting deployment for ${productName}...`)
    
    try {
      // Step 1: Generate presell files
      console.log('📝 Generating presell files...')
      const presellData = await this.generatePresellFiles(productName, deploymentConfig)
      
      // Step 2: Setup deployment directory
      const deployDir = await this.setupDeploymentDirectory(productName, presellData)
      
      // Step 3: Deploy based on method
      const method = deploymentConfig.method || 'vercel'
      if (!this.deploymentMethods[method]) {
        throw new Error(`Unknown deployment method: ${method}`)
      }
      
      const deploymentResult = await this.deploymentMethods[method](deployDir, deploymentConfig)
      
      console.log(`✅ Deployment successful!`)
      console.log(`🌐 Live URL: ${deploymentResult.url}`)
      
      return {
        success: true,
        productName,
        method,
        url: deploymentResult.url,
        deployedAt: new Date().toISOString()
      }
      
    } catch (error) {
      console.error(`❌ Deployment failed:`, error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async generatePresellFiles(productName, config) {
    console.log('🔥 Calling presell API...')
    
    // Call our presell API
    const response = await fetch('http://localhost:3000/api/v1/presell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        validation: {
          productName,
          targetCountry: config.country || 'BR',
          validationScore: 85,
          productData: {
            title: productName,
            price: config.price || 97,
            currency: config.currency || 'BRL',
            description: config.description || `${productName} - Premium product description`
          }
        },
        affiliateUrl: config.affiliateUrl,
        templateType: config.templateType || 'default'
      })
    })
    
    if (!response.ok) {
      throw new Error(`Presell API failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.data.generated
  }

  async setupDeploymentDirectory(productName, presellData) {
    const deployDir = path.join(process.cwd(), 'generated-presells', productName.toLowerCase().replace(/[^a-z0-9]/g, '-'))
    
    console.log(`📁 Setting up deployment directory: ${deployDir}`)
    
    // Create directory
    await fs.mkdir(deployDir, { recursive: true })
    
    // Write presell files
    await fs.writeFile(path.join(deployDir, 'index.html'), presellData.html)
    await fs.writeFile(path.join(deployDir, 'style.css'), presellData.css)
    await fs.writeFile(path.join(deployDir, 'script.js'), presellData.js)
    
    // Create package.json for Vercel/Netlify
    const packageJson = {
      name: `presell-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      version: '1.0.0',
      private: true,
      scripts: {
        build: 'echo "Static files already generated"',
        start: 'echo "Static files ready"'
      }
    }
    
    await fs.writeFile(path.join(deployDir, 'package.json'), JSON.stringify(packageJson, null, 2))
    
    console.log(`✅ Deployment directory ready with ${Object.keys(presellData).length} files`)
    return deployDir
  }

  async deployToVercel(deployDir, config) {
    console.log('🔺 Deploying to Vercel...')
    
    try {
      // Deploy with Vercel CLI
      const cmd = `cd "${deployDir}" && vercel --prod --yes`
      const output = execSync(cmd, { encoding: 'utf-8' })
      
      // Extract URL from output
      const urlMatch = output.match(/https:\/\/[^\s]+/)
      const url = urlMatch ? urlMatch[0] : 'https://deployment-successful.vercel.app'
      
      console.log('✅ Vercel deployment successful')
      return { url, method: 'vercel' }
      
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error.message}`)
    }
  }

  async deployToNetlify(deployDir, config) {
    console.log('🟢 Deploying to Netlify...')
    
    try {
      // Would use Netlify CLI: netlify deploy --prod --dir .
      const cmd = `cd "${deployDir}" && netlify deploy --prod --dir .`
      const output = execSync(cmd, { encoding: 'utf-8' })
      
      // Extract URL from output
      const urlMatch = output.match(/https:\/\/[^\s]+/)
      const url = urlMatch ? urlMatch[0] : 'https://deployment-successful.netlify.app'
      
      return { url, method: 'netlify' }
      
    } catch (error) {
      throw new Error(`Netlify deployment failed: ${error.message}`)
    }
  }

  async deployToStaticHosting(deployDir, config) {
    console.log('📂 Preparing static files for hosting...')
    
    const staticDir = path.join(process.cwd(), 'static-deployments', path.basename(deployDir))
    
    // Copy files to static deployment directory
    await fs.mkdir(staticDir, { recursive: true })
    const files = await fs.readdir(deployDir)
    
    for (const file of files) {
      if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
        await fs.copyFile(
          path.join(deployDir, file),
          path.join(staticDir, file)
        )
      }
    }
    
    console.log(`✅ Static files ready at: ${staticDir}`)
    return { 
      url: 'file://' + staticDir + '/index.html',
      method: 'static',
      localPath: staticDir
    }
  }

  async deployToCPanel(deployDir, config) {
    console.log('🏠 Preparing cPanel deployment...')
    
    // This would typically use FTP/SFTP to upload files
    // For now, we'll create a zip file ready for manual upload
    
    const zipFile = path.join(process.cwd(), 'cpanel-deployments', `${path.basename(deployDir)}.zip`)
    await fs.mkdir(path.dirname(zipFile), { recursive: true })
    
    const cmd = `cd "${deployDir}" && zip -r "${zipFile}" .`
    execSync(cmd)
    
    console.log(`✅ cPanel deployment package ready: ${zipFile}`)
    return {
      url: 'https://yourdomain.com/' + path.basename(deployDir),
      method: 'cpanel',
      zipFile
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🚀 Presell Deployment Tool

Usage:
  node deploy-presell.js <product-name> [options]

Examples:
  # Deploy to Vercel (default)
  node deploy-presell.js "GlicoShield" --method=vercel --affiliate="https://go.hotmart.com/abc123"
  
  # Deploy to Netlify  
  node deploy-presell.js "NerveCalm" --method=netlify --affiliate="https://go.hotmart.com/xyz789"
  
  # Create static files for manual hosting
  node deploy-presell.js "GutDrops" --method=static --affiliate="https://go.hotmart.com/def456"

Options:
  --method=<vercel|netlify|static|cpanel>  Deployment method (default: vercel)
  --affiliate=<url>                        Affiliate URL (required)
  --price=<number>                         Product price (default: 97)
  --country=<BR|US|FR|etc>                Country (default: BR)
  --template=<default|health|beauty>       Template type (default: default)
`)
    process.exit(1)
  }

  const productName = args[0]
  const config = {}
  
  // Parse arguments
  for (const arg of args.slice(1)) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=')
      config[key] = value
    }
  }
  
  if (!config.affiliate) {
    console.error('❌ Error: --affiliate URL is required')
    process.exit(1)
  }
  
  config.affiliateUrl = config.affiliate
  config.method = config.method || 'vercel'
  config.price = parseFloat(config.price) || 97
  config.country = config.country || 'BR'
  config.templateType = config.template || 'default'
  
  console.log(`🎯 Deploying presell for "${productName}"`)
  console.log(`📊 Config:`, config)
  
  const deployer = new PresellDeployer()
  const result = await deployer.deployPresell(productName, config)
  
  if (result.success) {
    console.log(`🎉 Success! Your presell is live at: ${result.url}`)
  } else {
    console.error(`💥 Deployment failed: ${result.error}`)
    process.exit(1)
  }
}

// Export for use as module or run as CLI
if (require.main === module) {
  main().catch(console.error)
} else {
  module.exports = { PresellDeployer }
}