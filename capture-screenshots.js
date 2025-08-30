const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the Skinatrin original site
    const url = 'https://trynourix.com/skinatrin-spray-pl/';
    console.log(`📍 Navigating to: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Capture desktop screenshot (first fold only)
    console.log('📸 Capturing desktop screenshot...');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.screenshot({
      path: './generated-presells/cookie-skinatrin/screenshot-desktop.jpg',
      type: 'jpeg',
      quality: 90,
      clip: {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
      }
    });
    console.log('✅ Desktop screenshot saved');
    
    // Capture mobile screenshot (first fold only)
    console.log('📱 Capturing mobile screenshot...');
    await page.setViewport({ width: 375, height: 812 }); // iPhone X size
    await page.waitForTimeout(1000); // Wait for responsive adjustment
    await page.screenshot({
      path: './generated-presells/cookie-skinatrin/screenshot-mobile.jpg',
      type: 'jpeg',
      quality: 90,
      clip: {
        x: 0,
        y: 0,
        width: 375,
        height: 812
      }
    });
    console.log('✅ Mobile screenshot saved');
    
    console.log('🎉 Screenshots captured successfully!');
    
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error.message);
  } finally {
    await browser.close();
  }
}

captureScreenshots();