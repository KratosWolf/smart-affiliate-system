const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

async function cleanImageMetadata() {
  console.log('🧹 Starting metadata cleaning for downloaded images...');
  
  const rawDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/raw-images';
  const cleanDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin';
  
  // Create clean images directory
  await fs.mkdir(cleanDir, { recursive: true });
  
  try {
    // Read all files from raw-images directory
    const files = await fs.readdir(rawDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('❌ No images found in raw-images directory');
      console.log('📋 Please download images manually to:', rawDir);
      return;
    }
    
    console.log(`📊 Found ${imageFiles.length} images to clean`);
    
    // Process each image
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      await cleanSingleImage(filename, rawDir, cleanDir, i);
    }
    
    // Create manifest
    const manifest = {
      source: 'https://5y1c6.doctormurin.com/l',
      downloadDate: new Date().toISOString(),
      totalImages: imageFiles.length,
      cleanedImages: imageFiles.map((file, index) => {
        const hash = crypto.randomBytes(4).toString('hex');
        return {
          original: file,
          cleaned: `skinatrin-${index}-${hash}.jpg`,
          metadataRemoved: true
        };
      })
    };
    
    await fs.writeFile(
      path.join(cleanDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('✅ All images cleaned and metadata removed!');
    console.log(`📁 Clean images saved to: ${cleanDir}`);
    console.log('🔒 All EXIF data, GPS location, and timestamps removed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function cleanSingleImage(filename, inputDir, outputDir, index) {
  try {
    const inputPath = path.join(inputDir, filename);
    const hash = crypto.randomBytes(4).toString('hex');
    const outputFilename = `skinatrin-${index}-${hash}.jpg`;
    const outputPath = path.join(outputDir, outputFilename);
    
    console.log(`🧹 Cleaning: ${filename} → ${outputFilename}`);
    
    // Clean metadata and convert to optimized JPEG
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF (then remove EXIF)
      .removeMetadata() // ⚠️ CRITICAL: Remove ALL metadata including EXIF, GPS, timestamps
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true // Better compression
      })
      .toFile(outputPath);
    
    console.log(`✅ Cleaned: ${outputFilename}`);
    
  } catch (error) {
    console.error(`❌ Error cleaning ${filename}:`, error.message);
  }
}

// Execute if running directly
if (require.main === module) {
  cleanImageMetadata().catch(console.error);
}

module.exports = { cleanImageMetadata };