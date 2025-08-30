const https = require('https');
const fs = require('fs');

// URLs diretos do Unsplash (100% gratuitos, uso comercial OK)
// Usando keywords específicos: feet, toenails, healthy, nail care
const freeImages = {
  'healthy-feet-real.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
  'healthy-nails-real.jpg': 'https://images.unsplash.com/photo-1588773357316-c6c83b17f529?w=400&h=300&fit=crop&crop=center', 
  'foot-care-real.jpg': 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e8?w=400&h=300&fit=crop&crop=center'
};

async function downloadFreeImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputDir = './clean-images/free-stock/';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = outputDir + filename;
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.log(`❌ HTTP ${response.statusCode}: ${filename}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error: ${filename} - ${err.message}`);
      reject(err);
    });
  });
}

async function downloadAllFreeImages() {
  console.log('🆓 Downloading FREE images from Unsplash...');
  console.log('💰 Cost: $0.00 (100% free for commercial use)');
  
  for (const [filename, url] of Object.entries(freeImages)) {
    try {
      await downloadFreeImage(url, filename);
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`⚠️  Skip ${filename}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Free download complete!');
  console.log('📂 Images saved to: ./clean-images/free-stock/');
  console.log('💡 Next: Copy best images to V13 template');
}

downloadAllFreeImages();