const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

// Based on your screenshots, these are the exact image patterns we need
const TARGET_IMAGES = [
  // Screenshot 1: Hero section with hands and light background
  {
    patterns: ['header_img', 'hero_hands', 'apply.*product', 'light.*background'],
    targetName: 'hero-hands-light',
    description: 'Hands applying product with light background'
  },
  
  // Screenshot 3: Product bottles arrangement with light background  
  {
    patterns: ['product.*arrangement', 'bottles.*white', 'spray.*collection'],
    targetName: 'product-collection',
    description: 'Product bottles arranged with clean background'
  },
  
  // Screenshot 4: Real nail before/after (NOT the PRZED/PO text images)
  {
    patterns: ['nail.*real', 'toe.*comparison', 'finger.*before', 'fungus.*after'],
    targetName: 'nail-comparison',
    description: 'Real nail before/after photos'
  }
];

async function downloadExactImages() {
  console.log('🎯 Downloading EXACT images matching your screenshots...');
  
  const outputDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-exact';
  await fs.mkdir(outputDir, { recursive: true });
  
  try {
    // Get all images from the page
    const allImages = await getAllPageImages();
    console.log(`📊 Found ${allImages.length} total images on page`);
    
    // Filter out the text-based images (PRZED/PO)
    const realImages = allImages.filter(img => {
      const url = img.url.toLowerCase();
      const isTextImage = url.includes('przed') || 
                         url.includes('po.png') || 
                         url.includes('text') ||
                         url.includes('word') ||
                         url.includes('label');
      return !isTextImage;
    });
    
    console.log(`🔍 ${realImages.length} non-text images to analyze`);
    
    // Download and analyze each image
    const correctImages = [];
    
    for (let i = 0; i < realImages.length; i++) {
      const result = await downloadAndAnalyzeImage(realImages[i], i, outputDir);
      if (result) {
        correctImages.push(result);
      }
    }
    
    // Create manifest
    const manifest = {
      source: 'https://5y1c6.doctormurin.com/l',
      downloadDate: new Date().toISOString(),
      totalImages: correctImages.length,
      images: correctImages,
      note: 'Filtered out PRZED/PO text images, kept only real photos'
    };
    
    await fs.writeFile(
      path.join(outputDir, 'manifest-exact.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`✅ Downloaded ${correctImages.length} exact images!`);
    console.log(`📁 Check folder: ${outputDir}`);
    
    return correctImages;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

async function getAllPageImages() {
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
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        try {
          const images = [];
          
          // Extract img src
          const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
          let match;
          
          while ((match = imgRegex.exec(html)) !== null) {
            if (match[1] && !match[1].includes('data:')) {
              const url = match[1].startsWith('http') ? match[1] : `https://5y1c6.doctormurin.com${match[1]}`;
              
              // Get alt text and surrounding context for better identification
              const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
              const alt = altMatch ? altMatch[1] : '';
              
              images.push({
                url,
                alt,
                fullTag: match[0],
                type: 'img'
              });
            }
          }
          
          // Also extract background images
          const bgRegex = /background-image:\s*url\\(['""]?([^'"")]+)['""]?\\)/gi;
          while ((match = bgRegex.exec(html)) !== null) {
            if (match[1] && !match[1].includes('data:')) {
              const url = match[1].startsWith('http') ? match[1] : `https://5y1c6.doctormurin.com${match[1]}`;
              images.push({
                url,
                alt: 'background-image',
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

async function downloadAndAnalyzeImage(imageData, index, outputDir) {
  const { url, alt } = imageData;
  
  try {
    console.log(`📥 Downloading ${index + 1}: ${alt || 'unnamed'}`);
    console.log(`   URL: ${url.substring(0, 80)}...`);
    
    // Download image
    const imageBuffer = await downloadImage(url);
    if (!imageBuffer || imageBuffer.length < 1000) { // Skip very small images
      console.log(`   ⚠️  Skipped: Too small or failed download`);
      return null;
    }
    
    // Generate clean filename
    const hash = crypto.randomBytes(4).toString('hex');
    const cleanName = (alt || `image-${index}`).replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
    const cleanFilename = `exact-${cleanName}-${hash}.jpg`;
    const outputPath = path.join(outputDir, cleanFilename);
    
    // Clean metadata and save
    await sharp(imageBuffer)
      .withMetadata(false) // Remove ALL metadata
      .jpeg({ quality: 90, progressive: true })
      .toFile(outputPath);
    
    console.log(`   ✅ Saved: ${cleanFilename}`);
    
    return {
      originalUrl: url,
      cleanedFile: cleanFilename,
      alt: alt || 'unnamed',
      metadataRemoved: true,
      size: imageBuffer.length
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 15000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        resolve(null); // Don't reject, just return null for failed downloads
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      response.on('error', () => resolve(null));
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve(null);
    });
    
    request.on('error', () => resolve(null));
  });
}

// Execute if running directly
if (require.main === module) {
  downloadExactImages().catch(console.error);
}

module.exports = { downloadExactImages };