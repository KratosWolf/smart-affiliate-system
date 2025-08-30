const puppeteer = require('puppeteer');

async function captureDirectScreenshots() {
  console.log('🚀 Capturing from: https://5y1c6.doctormurin.com/l');
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto('https://5y1c6.doctormurin.com/l', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('📄 Page loaded, waiting for content...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Desktop screenshot
    console.log('📸 Taking desktop screenshot...');
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: './generated-presells/cookie-skinatrin/screenshot-desktop.jpg',
      type: 'jpeg',
      quality: 90,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    
    // Mobile screenshot  
    console.log('📱 Taking mobile screenshot...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: './generated-presells/cookie-skinatrin/screenshot-mobile.jpg',
      type: 'jpeg', 
      quality: 90,
      clip: { x: 0, y: 0, width: 375, height: 812 }
    });
    
    console.log('✅ Screenshots captured successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Keep browser open for 10 seconds to see result
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

captureDirectScreenshots();