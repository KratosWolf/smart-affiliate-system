const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function deploySkinatrin(version) {
  const client = new ftp.Client();
  
  try {
    console.log(`🚀 Deploying Skinatrin ${version}...`);
    
    // Connect to FTP with timeout settings
    client.ftp.timeout = 60000; // 60 second timeout
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: 21,
      secure: false
    });
    
    console.log('✅ FTP Connected');
    
    // Ensure directories exist
    await client.ensureDir('/public_html/skinatrin');
    await client.ensureDir('/public_html/skinatrin/images');
    
    const templateDir = `./generated-presells/${version}`;
    
    // Upload HTML file
    console.log('📤 Uploading index.html...');
    await client.uploadFrom(`${templateDir}/index.html`, '/public_html/skinatrin/index.html');
    
    // Upload images
    console.log('📤 Uploading images...');
    const imagesDir = `${templateDir}/images`;
    if (fs.existsSync(imagesDir)) {
      const images = fs.readdirSync(imagesDir);
      for (const image of images) {
        if (image.endsWith('.png') || image.endsWith('.jpg') || image.endsWith('.jpeg')) {
          console.log(`  📷 Uploading ${image}...`);
          await client.uploadFrom(`${imagesDir}/${image}`, `/public_html/skinatrin/images/${image}`);
        }
      }
    }
    
    console.log('✅ Deployment complete!');
    console.log('🌐 Live at: https://bestbargains24x7.com/skinatrin/');
    
  } catch (error) {
    console.error('❌ Deployment error:', error.message);
  } finally {
    client.close();
  }
}

// Get version from command line argument
const version = process.argv[2];
if (!version) {
  console.error('❌ Please provide version: node deploy-skinatrin.js skinatrin-v13');
  process.exit(1);
}

deploySkinatrin(version);