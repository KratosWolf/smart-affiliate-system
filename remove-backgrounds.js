const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

async function removeBackgrounds() {
  console.log('🎨 Starting background removal for Skinatrin images...');
  
  const inputDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-exact';
  const outputDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-no-bg';
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get all image files
  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  console.log(`📊 Processing ${imageFiles.length} images for background removal...`);
  
  const processedImages = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i];
    const result = await removeBackground(filename, inputDir, outputDir, i);
    if (result) {
      processedImages.push(result);
    }
  }
  
  // Create manifest for processed images
  const manifest = {
    source: inputDir,
    processDate: new Date().toISOString(),
    totalProcessed: processedImages.length,
    images: processedImages,
    note: 'Dark backgrounds removed, converted to PNG with transparency'
  };
  
  await fs.writeFile(
    path.join(outputDir, 'no-bg-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`✅ Background removal completed!`);
  console.log(`📁 Clean images saved to: ${outputDir}`);
  console.log(`🎯 ${processedImages.length} images processed successfully`);
  
  return processedImages;
}

async function removeBackground(filename, inputDir, outputDir, index) {
  try {
    const inputPath = path.join(inputDir, filename);
    const hash = crypto.randomBytes(4).toString('hex');
    const outputFilename = `skinatrin-clean-${index}-${hash}.png`; // PNG for transparency
    const outputPath = path.join(outputDir, outputFilename);
    
    console.log(`🎨 Processing: ${filename} → ${outputFilename}`);
    
    // Read the input image
    const image = sharp(inputPath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { width, height, channels } = info;
    
    // Create output buffer for RGBA (with alpha channel)
    const outputData = Buffer.alloc(width * height * 4);
    
    // Process each pixel
    for (let i = 0; i < width * height; i++) {
      const inputIdx = i * channels;
      const outputIdx = i * 4;
      
      const r = data[inputIdx];
      const g = data[inputIdx + 1];  
      const b = data[inputIdx + 2];
      
      // Calculate if pixel is part of dark background
      const brightness = (r + g + b) / 3;
      const isDark = brightness < 50; // Very dark pixels
      const isBlackish = r < 80 && g < 80 && b < 80; // Dark colors
      
      // Calculate color similarity to common background colors
      const isBackground = isDark || isBlackish || 
                          (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && brightness < 100);
      
      if (isBackground) {
        // Make background transparent
        outputData[outputIdx] = 0;     // R
        outputData[outputIdx + 1] = 0; // G
        outputData[outputIdx + 2] = 0; // B
        outputData[outputIdx + 3] = 0; // A (transparent)
      } else {
        // Keep foreground pixels
        outputData[outputIdx] = r;     // R
        outputData[outputIdx + 1] = g; // G
        outputData[outputIdx + 2] = b; // B
        outputData[outputIdx + 3] = 255; // A (opaque)
      }
    }
    
    // Create image with transparent background
    await sharp(outputData, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
    .png({ quality: 90 })
    .toFile(outputPath);
    
    console.log(`✅ Background removed: ${outputFilename}`);
    
    return {
      originalFile: filename,
      cleanedFile: outputFilename,
      backgroundRemoved: true,
      transparent: true,
      format: 'PNG'
    };
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return null;
  }
}

// Alternative method using color-based removal for better results
async function advancedBackgroundRemoval(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    
    // First, try to detect edges and enhance contrast
    const processed = await image
      .modulate({
        brightness: 1.2, // Slightly brighten
        saturation: 1.3   // Enhance colors
      })
      .gamma(0.9) // Adjust gamma
      .png({ quality: 90 })
      .toBuffer();
    
    // Then apply basic thresholding
    const final = await sharp(processed)
      .threshold(30) // Remove very dark pixels
      .png()
      .toBuffer();
    
    await fs.writeFile(outputPath, final);
    return true;
    
  } catch (error) {
    console.error('Advanced removal failed:', error.message);
    return false;
  }
}

// Execute if running directly
if (require.main === module) {
  removeBackgrounds().catch(console.error);
}

module.exports = { removeBackgrounds };