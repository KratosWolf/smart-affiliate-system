const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

async function downloadAndCleanImages() {
  console.log('🖼️  Starting image download and metadata cleaning...');
  
  // Create clean images directory
  const cleanDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin';
  await fs.mkdir(cleanDir, { recursive: true });
  
  const browser = await puppeteer.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();
    
    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font'){
        req.abort();
      } else {
        req.continue();
      }
    });
    
    console.log('📱 Loading Skinatrin page...');
    await page.goto('https://5y1c6.doctormurin.com/l', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('🔍 Extracting image URLs...');
    
    // Extract all image URLs from the page
    const imageData = await page.evaluate(() => {
      const images = [];
      
      // Get all img elements
      const imgElements = Array.from(document.querySelectorAll('img'));
      
      imgElements.forEach((img, index) => {
        if (img.src && !img.src.includes('data:')) {
          const rect = img.getBoundingClientRect();
          images.push({
            url: img.src,
            alt: img.alt || `image-${index}`,
            width: rect.width,
            height: rect.height,
            className: img.className,
            id: img.id,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
        }
      });
      
      // Also get background images from CSS
      const elementsWithBg = Array.from(document.querySelectorAll('*'));
      elementsWithBg.forEach((el, index) => {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        
        if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
          const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1] && !urlMatch[1].includes('data:')) {
            images.push({
              url: urlMatch[1],
              alt: `background-${index}`,
              type: 'background',
              element: el.tagName,
              className: el.className
            });
          }
        }
      });
      
      return images;
    });
    
    console.log(`📊 Found ${imageData.length} images to download and clean`);
    
    // Download and clean each image
    for (let i = 0; i < imageData.length; i++) {
      const img = imageData[i];
      await downloadAndCleanImage(img, i, cleanDir);
    }
    
    // Create manifest file
    const manifest = {
      source: 'https://5y1c6.doctormurin.com/l',
      downloadDate: new Date().toISOString(),
      totalImages: imageData.length,
      images: imageData.map((img, index) => ({
        originalUrl: img.url,
        cleanedFile: `image-${index}-clean.jpg`,
        alt: img.alt,
        dimensions: `${img.naturalWidth || img.width}x${img.naturalHeight || img.height}`,
        type: img.type || 'img'
      }))
    };
    
    await fs.writeFile(
      path.join(cleanDir, 'manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('✅ All images downloaded and cleaned!');
    console.log(`📁 Check folder: ${cleanDir}`);
    console.log('📋 Manifest created: manifest.json');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

async function downloadAndCleanImage(imageData, index, outputDir) {
  const { url, alt } = imageData;
  
  try {
    console.log(`⬇️  Downloading: ${alt} (${index + 1})`);
    
    // Download image
    const imageBuffer = await downloadImage(url);
    
    if (!imageBuffer) {
      console.log(`⚠️  Skipped: ${alt} (download failed)`);
      return;
    }
    
    // Generate random hash for filename
    const hash = crypto.randomBytes(6).toString('hex');
    const cleanFilename = `image-${index}-${hash}-clean.jpg`;
    const outputPath = path.join(outputDir, cleanFilename);
    
    console.log(`🧹 Cleaning metadata: ${alt}`);
    
    // Clean metadata using Sharp
    await sharp(imageBuffer)
      .rotate() // Auto-rotate based on EXIF (then remove EXIF)
      .removeMetadata() // ⚠️ CRITICAL: Remove ALL metadata
      .jpeg({ 
        quality: 90,
        progressive: true,
        mozjpeg: true // Better compression
      })
      .toFile(outputPath);
    
    console.log(`✅ Cleaned: ${cleanFilename}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${alt}:`, error.message);
  }
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const timeout = 10000; // 10 second timeout
    
    const request = https.get(url, { timeout }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
    
    request.on('error', (error) => {
      reject(error);
    });
  });
}

// Execute if running directly
if (require.main === module) {
  downloadAndCleanImages().catch(console.error);
}

module.exports = { downloadAndCleanImages };