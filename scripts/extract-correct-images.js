const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

// Target specific image URLs based on your screenshots
const CORRECT_IMAGES = [
  // Hero section - hands with light background (from screenshot 1)
  {
    searchPattern: 'hero.*hands|hand.*apply|apply.*hand',
    name: 'hero-hands-light',
    priority: 1,
    description: 'Hands applying product with light background'
  },
  
  // Product bottles with light background (from screenshot 3)
  {
    searchPattern: 'bottle.*light|product.*white|spray.*clean',
    name: 'product-bottles-light',
    priority: 1,
    description: 'Product bottles with clean light background'
  },
  
  // Real before/after nail images (from screenshot 4 - actual nails, not text)
  {
    searchPattern: 'nail.*before|nail.*after|toe.*nail|finger.*nail',
    name: 'real-nail-comparison',
    priority: 1,
    description: 'Real nail before/after images, not PRZED/PO text'
  }
];

async function extractCorrectImages() {
  console.log('🔍 Extracting CORRECT images with light backgrounds...');
  
  const cleanDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-correct';
  await fs.mkdir(cleanDir, { recursive: true });
  
  try {
    // Get page HTML to analyze image context
    const html = await fetchPageHTML();
    
    // Find images in specific sections
    const heroImages = extractImagesFromSection(html, 'hero|header|top');
    const productImages = extractImagesFromSection(html, 'product|bottle|spray');
    const resultImages = extractImagesFromSection(html, 'result|effect|before|after');
    
    console.log(`📊 Found ${heroImages.length} hero images, ${productImages.length} product images, ${resultImages.length} result images`);
    
    // Download and analyze each image to find the light background ones
    const allImages = [...heroImages, ...productImages, ...resultImages];
    const correctImages = [];
    
    for (let i = 0; i < allImages.length; i++) {
      const imageAnalysis = await analyzeAndDownloadImage(allImages[i], i, cleanDir);
      if (imageAnalysis && imageAnalysis.hasLightBackground) {
        correctImages.push(imageAnalysis);
      }
    }
    
    // Create manifest
    const manifest = {
      source: 'https://5y1c6.doctormurin.com/l',
      downloadDate: new Date().toISOString(),
      totalImages: correctImages.length,
      images: correctImages,
      criteria: 'Only images with light backgrounds matching original design'
    };
    
    await fs.writeFile(
      path.join(cleanDir, 'manifest-correct.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`✅ Extracted ${correctImages.length} CORRECT images with light backgrounds!`);
    console.log(`📁 Saved to: ${cleanDir}`);
    
    return correctImages;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

async function fetchPageHTML() {
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
      res.on('end', () => resolve(html));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

function extractImagesFromSection(html, sectionPattern) {
  const images = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1] && !match[1].includes('data:')) {
      const url = match[1].startsWith('http') ? match[1] : `https://5y1c6.doctormurin.com${match[1]}`;
      
      // Get context around the image
      const startIndex = Math.max(0, match.index - 200);
      const endIndex = Math.min(html.length, match.index + 200);
      const context = html.substring(startIndex, endIndex).toLowerCase();
      
      if (new RegExp(sectionPattern, 'i').test(context)) {
        images.push({
          url,
          context: sectionPattern,
          fullMatch: match[0]
        });
      }
    }
  }
  
  return images;
}

async function analyzeAndDownloadImage(imageData, index, outputDir) {
  const { url, context } = imageData;
  
  try {
    console.log(`⬇️  Analyzing image ${index + 1}: ${context}`);
    
    // Download image
    const imageBuffer = await downloadImage(url);
    if (!imageBuffer) return null;
    
    // Analyze image for light background
    const analysis = await analyzeImageBackground(imageBuffer);
    
    if (analysis.hasLightBackground) {
      // Generate clean filename
      const hash = crypto.randomBytes(4).toString('hex');
      const cleanFilename = `correct-${context.replace(/[^a-z]/g, '')}-${index}-${hash}.jpg`;
      const outputPath = path.join(outputDir, cleanFilename);
      
      console.log(`🧹 Cleaning: ${cleanFilename} (light background detected)`);
      
      // Clean metadata
      await sharp(imageBuffer)
        .withMetadata(false)
        .jpeg({ quality: 90, progressive: true })
        .toFile(outputPath);
      
      console.log(`✅ Saved: ${cleanFilename}`);
      
      return {
        originalUrl: url,
        cleanedFile: cleanFilename,
        context,
        hasLightBackground: true,
        backgroundAnalysis: analysis
      };
    } else {
      console.log(`❌ Skipped: Dark background detected`);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error analyzing image ${index}:`, error.message);
    return null;
  }
}

async function analyzeImageBackground(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Sample pixels from edges to determine background color
    const { width, height, channels } = info;
    const sampleSize = Math.min(width, height, 100); // Sample 100 pixels from edges
    
    let lightPixels = 0;
    let totalPixels = 0;
    
    // Sample from top edge
    for (let x = 0; x < sampleSize; x++) {
      const pixelIndex = x * channels;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      
      // Calculate brightness (0-255)
      const brightness = (r + g + b) / 3;
      
      if (brightness > 180) { // Threshold for "light"
        lightPixels++;
      }
      totalPixels++;
    }
    
    const lightPercentage = (lightPixels / totalPixels) * 100;
    const hasLightBackground = lightPercentage > 60; // 60% of edge pixels are light
    
    return {
      hasLightBackground,
      lightPercentage,
      analysis: `${lightPercentage.toFixed(1)}% light pixels`
    };
    
  } catch (error) {
    return { hasLightBackground: false, lightPercentage: 0, analysis: 'Analysis failed' };
  }
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 15000 }, (response) => {
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
    
    request.on('error', reject);
  });
}

// Execute if running directly
if (require.main === module) {
  extractCorrectImages().catch(console.error);
}

module.exports = { extractCorrectImages };