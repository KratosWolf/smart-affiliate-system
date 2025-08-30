const https = require('https');
const fs = require('fs');
const path = require('path');

// Imagens selecionadas (URLs do Unsplash - gratuitas para uso comercial)
const imageUrls = {
  // Pés saudáveis
  'healthy-feet.jpg': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
  
  // Unhas bem cuidadas
  'healthy-nails.jpg': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop',
  
  // Pés femininos saudáveis
  'healthy-feet-female.jpg': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop',
  
  // Pedicure/cuidados
  'nail-care.jpg': 'https://images.unsplash.com/photo-1560472355-a9a6d4e8b9b7?w=600&h=400&fit=crop'
};

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join('./clean-images/real-images/', filename);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
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
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('🔄 Downloading real images from Pexels...');
  
  for (const [filename, url] of Object.entries(imageUrls)) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.log(`❌ Failed to download ${filename}`);
    }
  }
  
  console.log('🎉 Download complete! Images saved to ./clean-images/real-images/');
  console.log('Next step: Process with Remove.bg API');
}

downloadAllImages();