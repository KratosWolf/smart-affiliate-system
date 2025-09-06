/**
 * FTP Deployment Server
 * Servidor dedicado para deployments FTP
 * Rode este servidor em um VPS ou servidor dedicado
 */

const express = require('express');
const cors = require('cors');
const ftp = require('basic-ftp');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://smart-affiliate-system.vercel.app',
    'http://localhost:3000'
  ]
}));
app.use(express.json({ limit: '50mb' }));

// FTP Configuration
const FTP_CONFIG = {
  host: process.env.FTP_HOST || 'mediumblue-monkey-640112.hostingersite.com',
  user: process.env.FTP_USER || 'u973230760.bestbargains24x7.com',
  password: process.env.FTP_PASSWORD || 'FTPBestBargains2025#Main!',
  port: 21,
  secure: false
};

/**
 * Deploy endpoint - receives files and uploads to FTP
 */
app.post('/deploy', async (req, res) => {
  const { productName, presellFiles, deploymentKey } = req.body;
  
  if (!productName || !presellFiles) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }

  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    // Connect to FTP
    console.log('🔗 Connecting to Hostinger FTP...');
    await client.access(FTP_CONFIG);
    
    // Create/ensure remote directory
    const remotePath = `/public_html/${deploymentKey || productName.toLowerCase()}`;
    await client.ensureDir(remotePath);
    
    // Upload each file
    for (const [filename, content] of Object.entries(presellFiles)) {
      const remoteFile = path.join(remotePath, filename);
      
      // Create temporary file
      const tempFile = path.join('/tmp', filename);
      await fs.writeFile(tempFile, content);
      
      // Upload to FTP
      console.log(`📤 Uploading ${filename}...`);
      await client.uploadFrom(tempFile, remoteFile);
      
      // Clean up temp file
      await fs.unlink(tempFile);
    }
    
    console.log('✅ FTP deployment successful!');
    
    res.json({
      success: true,
      data: {
        productName,
        deploymentKey,
        deployedUrl: `https://bestbargains24x7.com/${deploymentKey}`,
        filesUploaded: Object.keys(presellFiles).length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ FTP deployment failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
    
  } finally {
    client.close();
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'FTP Deployment Server',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test FTP connection
 */
app.get('/test-ftp', async (req, res) => {
  const client = new ftp.Client();
  
  try {
    await client.access(FTP_CONFIG);
    const list = await client.list('/public_html');
    
    res.json({
      success: true,
      message: 'FTP connection successful',
      directories: list.filter(item => item.type === 2).map(d => d.name)
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
    
  } finally {
    client.close();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FTP Deployment Server running on port ${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   POST /deploy - Deploy presell files`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET /test-ftp - Test FTP connection`);
});