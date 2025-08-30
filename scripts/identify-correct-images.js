const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function identifyCorrectImages() {
  console.log('🔍 Identifying correct images for each section...');
  
  const exactDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-exact';
  const files = await fs.readdir(exactDir);
  const imageFiles = files.filter(f => f.endsWith('.jpg'));
  
  console.log(`📊 Analyzing ${imageFiles.length} images...`);
  
  const results = [];
  
  for (const file of imageFiles) {
    try {
      const filePath = path.join(exactDir, file);
      const analysis = await analyzeImage(filePath);
      
      results.push({
        filename: file,
        ...analysis
      });
      
      console.log(`📸 ${file}:`);
      console.log(`   Size: ${analysis.width}x${analysis.height}`);
      console.log(`   Aspect: ${analysis.aspectRatio}`);
      console.log(`   Background: ${analysis.backgroundType}`);
      console.log(`   Likely use: ${analysis.likelyUse}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error analyzing ${file}:`, error.message);
    }
  }
  
  // Categorize images based on analysis
  const categorized = {
    hero: results.filter(r => r.likelyUse.includes('hero') || r.likelyUse.includes('hands')),
    product: results.filter(r => r.likelyUse.includes('product') || r.likelyUse.includes('bottle')),
    testimonial: results.filter(r => r.likelyUse.includes('testimonial') || r.likelyUse.includes('person')),
    results: results.filter(r => r.likelyUse.includes('before') || r.likelyUse.includes('nail'))
  };
  
  console.log('🎯 CATEGORIZATION RESULTS:');
  console.log('==========================');
  
  console.log('\\n📸 HERO SECTION (hands applying product):');
  categorized.hero.forEach(img => {
    console.log(`   ✅ ${img.filename} - ${img.width}x${img.height} - ${img.backgroundType}`);
  });
  
  console.log('\\n🍶 PRODUCT BOTTLES:');
  categorized.product.forEach(img => {
    console.log(`   ✅ ${img.filename} - ${img.width}x${img.height} - ${img.backgroundType}`);
  });
  
  console.log('\\n👤 TESTIMONIALS:');
  categorized.testimonial.forEach(img => {
    console.log(`   ✅ ${img.filename} - ${img.width}x${img.height} - ${img.backgroundType}`);
  });
  
  console.log('\\n🔄 BEFORE/AFTER RESULTS:');
  categorized.results.forEach(img => {
    console.log(`   ✅ ${img.filename} - ${img.width}x${img.height} - ${img.backgroundType}`);
  });
  
  // Save categorization
  const categorization = {
    analysis: results,
    categories: categorized,
    recommendations: {
      hero: categorized.hero[0]?.filename || 'Not found',
      product: categorized.product[0]?.filename || 'Not found', 
      testimonials: categorized.testimonial.slice(0, 3).map(t => t.filename),
      results: categorized.results.slice(0, 3).map(r => r.filename)
    }
  };
  
  await fs.writeFile(
    path.join(exactDir, 'categorization.json'),
    JSON.stringify(categorization, null, 2)
  );
  
  console.log('\\n🎯 RECOMMENDATIONS:');
  console.log('===================');
  console.log(`Hero image: ${categorization.recommendations.hero}`);
  console.log(`Product image: ${categorization.recommendations.product}`);
  console.log(`Testimonials: ${categorization.recommendations.testimonials.join(', ')}`);
  console.log(`Results: ${categorization.recommendations.results.join(', ')}`);
  
  return categorization;
}

async function analyzeImage(imagePath) {
  const metadata = await sharp(imagePath).metadata();
  const { width, height } = metadata;
  
  // Calculate aspect ratio
  const aspectRatio = (width / height).toFixed(2);
  
  // Get dominant colors from corners to determine background
  const { data } = await sharp(imagePath)
    .resize(100, 100)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Sample corners for background color
  const corners = [
    [0, 0], [99, 0], [0, 99], [99, 99] // Top-left, top-right, bottom-left, bottom-right
  ];
  
  let lightCorners = 0;
  for (const [x, y] of corners) {
    const index = (y * 100 + x) * 3;
    const r = data[index];
    const g = data[index + 1]; 
    const b = data[index + 2];
    
    const brightness = (r + g + b) / 3;
    if (brightness > 200) lightCorners++;
  }
  
  const backgroundType = lightCorners >= 3 ? 'light' : lightCorners >= 2 ? 'mixed' : 'dark';
  
  // Determine likely use based on dimensions and aspect ratio
  let likelyUse = '';
  
  if (aspectRatio > 1.5) {
    likelyUse = 'hero or banner image';
  } else if (aspectRatio < 0.8) {
    likelyUse = 'product bottle or tall image';
  } else if (width < 200 && height < 200) {
    likelyUse = 'testimonial or small icon';
  } else if (backgroundType === 'light' && aspectRatio > 1.2) {
    likelyUse = 'hero hands or product showcase';
  } else if (width > 300 && backgroundType === 'light') {
    likelyUse = 'product collection or results';
  } else {
    likelyUse = 'before/after or detail image';
  }
  
  return {
    width,
    height,
    aspectRatio,
    backgroundType,
    likelyUse
  };
}

// Execute if running directly
if (require.main === module) {
  identifyCorrectImages().catch(console.error);
}

module.exports = { identifyCorrectImages };