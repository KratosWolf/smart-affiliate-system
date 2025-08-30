const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

// Remove.bg API - Professional background removal
// Sign up at https://www.remove.bg/users/sign_up for free API key (50 free images/month)
// Or use paid plan for more images

async function processImagesWithRemoveBg() {
  console.log('🎨 Professional Background Removal with Remove.bg...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // IMPORTANT: Get your API key from https://www.remove.bg/api
  const API_KEY = process.env.REMOVEBG_API_KEY || 'YOUR_API_KEY_HERE';
  
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('⚠️  SETUP REQUIRED:');
    console.log('');
    console.log('1. Sign up at: https://www.remove.bg/users/sign_up');
    console.log('2. Get your API key from: https://www.remove.bg/api');
    console.log('3. Add to .env.local: REMOVEBG_API_KEY=your_key_here');
    console.log('');
    console.log('📊 Pricing:');
    console.log('   • FREE: 50 images/month (1 credit = 0.25 megapixels)');
    console.log('   • PAY AS YOU GO: $1.99 per image');
    console.log('   • SUBSCRIPTION: From $9/month for 40 images');
    console.log('');
    return;
  }
  
  const inputDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-exact';
  const outputDir = '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/clean-images/skinatrin-removebg';
  
  await fs.mkdir(outputDir, { recursive: true });
  
  // Key images to process
  const imagesToProcess = [
    { file: 'exact-image-3-6d7c9317.jpg', name: 'hero-hands' },
    { file: 'exact-image-4-bbad0c46.jpg', name: 'testimonial-maja' },
    { file: 'exact-image-5-9fdb60d6.jpg', name: 'testimonial-arkadiusz' },
    { file: 'exact-image-6-c60b854d.jpg', name: 'testimonial-maria' },
    { file: 'exact-image-7-0d92d302.jpg', name: 'product-bottle' },
    { file: 'exact-image-2-dfc1e522.jpg', name: 'result-comparison' }
  ];
  
  console.log(`📸 Processing ${imagesToProcess.length} images...`);
  console.log('');
  
  for (const img of imagesToProcess) {
    await processWithRemoveBg(img, inputDir, outputDir, API_KEY);
  }
  
  console.log('');
  console.log('✅ Professional background removal complete!');
  console.log(`📁 Check: ${outputDir}`);
}

async function processWithRemoveBg(imageInfo, inputDir, outputDir, apiKey) {
  const { file, name } = imageInfo;
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, `${name}-nobg.png`);
  
  try {
    console.log(`🎨 Processing: ${name}...`);
    
    const imageBuffer = await fs.readFile(inputPath);
    
    // Create form data
    const formData = new FormData();
    formData.append('image_file', imageBuffer, file);
    formData.append('size', 'auto'); // auto, preview, small, medium, hd, 4k
    formData.append('type', 'auto'); // auto, person, product, car
    formData.append('format', 'png'); // png, jpg, zip
    formData.append('bg_color', ''); // empty for transparent
    
    // Call Remove.bg API
    const result = await callRemoveBgAPI(formData, apiKey);
    
    if (result) {
      await fs.writeFile(outputPath, result);
      console.log(`   ✅ Saved: ${name}-nobg.png`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

function callRemoveBgAPI(formData, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.remove.bg',
      port: 443,
      path: '/v1.0/removebg',
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': apiKey
      }
    };
    
    const req = https.request(options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => chunks.push(chunk));
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(Buffer.concat(chunks));
        } else {
          const error = Buffer.concat(chunks).toString();
          reject(new Error(`API Error ${res.statusCode}: ${error}`));
        }
      });
    });
    
    req.on('error', reject);
    formData.pipe(req);
  });
}

// Alternative: Use Canva's Background Remover (requires manual process)
async function setupCanvaIntegration() {
  console.log('🎨 Canva Integration Guide');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Since you have Canva Pro, here\'s the best workflow:');
  console.log('');
  console.log('📸 MANUAL PROCESS (Best Quality):');
  console.log('1. Upload images to Canva');
  console.log('2. Use "Background Remover" (Pro feature)');
  console.log('3. Apply enhancements:');
  console.log('   • Adjust contrast');
  console.log('   • Fix brightness');
  console.log('   • Add shadows');
  console.log('4. Download as PNG with transparent background');
  console.log('');
  console.log('🤖 AUTOMATED PROCESS (Using Canva Connect API):');
  console.log('1. Register app at: https://www.canva.com/developers/');
  console.log('2. Get OAuth credentials');
  console.log('3. Use Design Editing API to:');
  console.log('   • Create designs programmatically');
  console.log('   • Apply templates');
  console.log('   • Export results');
  console.log('');
  console.log('⚡ RECOMMENDED: Use Remove.bg API for automation');
  console.log('   It\'s simpler and specifically designed for background removal');
}

// Execute if running directly
if (require.main === module) {
  // Check if user wants Canva guide or Remove.bg processing
  const args = process.argv.slice(2);
  
  if (args[0] === '--canva') {
    setupCanvaIntegration();
  } else {
    processImagesWithRemoveBg().catch(console.error);
  }
}

module.exports = { processImagesWithRemoveBg, setupCanvaIntegration };