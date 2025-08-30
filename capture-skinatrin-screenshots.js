const puppeteer = require('puppeteer');
const path = require('path');

async function captureRealScreenshots() {
  console.log('🚀 Capturing REAL Skinatrin screenshots...');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    defaultViewport: null
  });
  
  try {
    const page = await browser.newPage();
    
    // Go to REAL Skinatrin site
    const skinatrinUrl = 'https://trynourix.com/skinatrin-spray-pl/';
    console.log(`📍 Loading: ${skinatrinUrl}`);
    
    await page.goto(skinatrinUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Hide any popups or overlays that might interfere
    await page.evaluate(() => {
      // Remove any popups, modals, cookies banners
      const popups = document.querySelectorAll('[class*="popup"], [class*="modal"], [class*="cookie"], [class*="overlay"]');
      popups.forEach(popup => popup.remove());
      
      // Hide any floating elements
      const floatingElements = document.querySelectorAll('[style*="fixed"], [style*="sticky"]');
      floatingElements.forEach(el => el.style.display = 'none');
    });
    
    // DESKTOP SCREENSHOT (first fold only)
    console.log('📸 Capturing desktop screenshot (1920x1080)...');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: './generated-presells/cookie-skinatrin/screenshot-desktop.jpg',
      type: 'jpeg',
      quality: 95,
      clip: {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080 // First fold only
      }
    });
    console.log('✅ Desktop screenshot saved');
    
    // MOBILE SCREENSHOT (first fold only)
    console.log('📱 Capturing mobile screenshot (375x812)...');
    await page.setViewport({ width: 375, height: 812 }); // iPhone X
    await page.waitForTimeout(2000); // Wait for responsive layout
    
    await page.screenshot({
      path: './generated-presells/cookie-skinatrin/screenshot-mobile.jpg',
      type: 'jpeg',
      quality: 95,
      clip: {
        x: 0,
        y: 0,
        width: 375,
        height: 812 // First fold only
      }
    });
    console.log('✅ Mobile screenshot saved');
    
    console.log('🎉 REAL Skinatrin screenshots captured successfully!');
    console.log('📂 Files saved in: ./generated-presells/cookie-skinatrin/');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Fallback: Try a different Skinatrin URL
    console.log('🔄 Trying alternative URL...');
    try {
      await page.goto('https://5y1c6.doctormurin.com/skinatrin/', {
        waitUntil: 'networkidle0',
        timeout: 20000
      });
      
      await page.waitForTimeout(2000);
      
      // Desktop
      await page.setViewport({ width: 1920, height: 1080 });
      await page.screenshot({
        path: './generated-presells/cookie-skinatrin/screenshot-desktop.jpg',
        type: 'jpeg',
        quality: 95,
        fullPage: false
      });
      
      // Mobile  
      await page.setViewport({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: './generated-presells/cookie-skinatrin/screenshot-mobile.jpg',
        type: 'jpeg',
        quality: 95,
        fullPage: false
      });
      
      console.log('✅ Fallback screenshots captured');
      
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
    }
  } finally {
    await browser.close();
  }
}

captureRealScreenshots();