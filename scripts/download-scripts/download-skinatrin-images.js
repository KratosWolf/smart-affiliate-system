const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

// Direct image URLs extracted from the Skinatrin page
const SKINATRIN_IMAGES = [
  {
    url: 'https://5y1c6.doctormurin.com/wp-content/uploads/2024/09/skinatrin-hands-hero.jpg',
    name: 'hero-hands',
    priority: 1
  },
  {
    url: 'https://5y1c6.doctormurin.com/wp-content/uploads/2024/09/skinatrin-product.png',
    name: 'product-bottle',
    priority: 1
  },
  {
    url: 'https://5y1c6.doctormurin.com/wp-content/uploads/2024/09/maja-testimonial.jpg',
    name: 'testimonial-maja',
    priority: 1
  },
  {
    url: 'https://5y1c6.doctormurin.com/wp-content/uploads/2024/09/arkadiusz-testimonial.jpg',
    name: 'testimonial-arkadiusz',
    priority: 1
  },
  {
    url: 'https://5y1c6.doctormurin.com/wp-content/uploads/2024/09/maria-testimonial.jpg',
    name: 'testimonial-maria',
    priority: 1
  },
  {
    url: 'https://5y1c6.doctormurin.com/wp-content/uploads/2024/09/before-after-nails.jpg',
    name: 'before-after',
    priority: 2
  }
];

// Fallback generic URLs to try if specific ones don't work
const FALLBACK_PATTERNS = [
  'https://5y1c6.doctormurin.com/wp-content/uploads/2024/',
  'https://5y1c6.doctormurin.com/images/',
  'https://5y1c6.doctormurin.com/assets/'
];

async function downloadSkinAtrinImages() {
  console.log('🖼️  Starting automated Skinatrin image download...');
  
  // Create directories
  const rawDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/raw-images';
  const cleanDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin';
  
  await fs.mkdir(rawDir, { recursive: true });
  await fs.mkdir(cleanDir, { recursive: true });
  
  const downloadedImages = [];
  
  // First, try to extract actual image URLs from the page
  try {
    console.log('🔍 Extracting image URLs from Skinatrin page...');
    const pageImages = await extractImagesFromPage();
    
    if (pageImages.length > 0) {
      console.log(`📊 Found ${pageImages.length} images on the page`);
      
      // Download and clean each image
      for (let i = 0; i < pageImages.length; i++) {
        const result = await downloadAndCleanImage(pageImages[i], i, cleanDir);
        if (result) {
          downloadedImages.push(result);
        }
      }
    }
  } catch (error) {
    console.error('⚠️  Could not extract from page:', error.message);
    console.log('🔄 Trying predefined image URLs...');
    
    // Fallback to predefined URLs
    for (let i = 0; i < SKINATRIN_IMAGES.length; i++) {
      const img = SKINATRIN_IMAGES[i];
      const result = await downloadAndCleanImage(img, i, cleanDir);
      if (result) {
        downloadedImages.push(result);
      }
    }
  }
  
  // Create manifest
  const manifest = {
    source: 'https://5y1c6.doctormurin.com/l',
    downloadDate: new Date().toISOString(),
    totalImages: downloadedImages.length,
    images: downloadedImages
  };
  
  await fs.writeFile(
    path.join(cleanDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`✅ Downloaded and cleaned ${downloadedImages.length} images!`);
  console.log(`📁 Clean images saved to: ${cleanDir}`);
  console.log('🔒 All metadata removed for security');
  
  return downloadedImages;
}

async function extractImagesFromPage() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '5y1c6.doctormurin.com',
      path: '/l',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };
    
    const req = https.request(options, (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        try {
          // Extract image URLs using regex
          const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
          const bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
          
          const images = [];
          let match;
          
          // Extract img src
          while ((match = imgRegex.exec(html)) !== null) {
            if (match[1] && !match[1].includes('data:')) {
              const url = match[1].startsWith('http') ? match[1] : `https://5y1c6.doctormurin.com${match[1]}`;
              images.push({
                url,
                name: `extracted-${images.length}`,
                type: 'img'
              });
            }
          }
          
          // Extract background images
          while ((match = bgRegex.exec(html)) !== null) {
            if (match[1] && !match[1].includes('data:')) {
              const url = match[1].startsWith('http') ? match[1] : `https://5y1c6.doctormurin.com${match[1]}`;
              images.push({
                url,
                name: `bg-${images.length}`,
                type: 'background'
              });
            }
          }
          
          resolve(images);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function downloadAndCleanImage(imageData, index, outputDir) {
  const { url, name } = imageData;
  
  try {
    console.log(`⬇️  Downloading: ${name} (${index + 1})`);
    
    // Download image
    const imageBuffer = await downloadImage(url);
    
    if (!imageBuffer) {
      console.log(`⚠️  Skipped: ${name} (download failed)`);
      return null;
    }
    
    // Generate secure filename
    const hash = crypto.randomBytes(6).toString('hex');
    const cleanFilename = `skinatrin-${index}-${hash}.jpg`;
    const outputPath = path.join(outputDir, cleanFilename);
    
    console.log(`🧹 Cleaning metadata: ${name}`);
    
    // Clean metadata using Sharp
    await sharp(imageBuffer)
      .withMetadata(false) // Remove ALL metadata including EXIF, GPS, timestamps
      .jpeg({ 
        quality: 85,
        progressive: true
      })
      .toFile(outputPath);
    
    console.log(`✅ Cleaned: ${cleanFilename}`);
    
    return {
      originalUrl: url,
      cleanedFile: cleanFilename,
      name,
      metadataRemoved: true
    };
    
  } catch (error) {
    console.error(`❌ Error processing ${name}:`, error.message);
    return null;
  }
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const timeout = 15000; // 15 second timeout
    
    const request = https.get(url, { timeout }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }
      
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
  downloadSkinAtrinImages().catch(console.error);
}

module.exports = { downloadSkinAtrinImages };