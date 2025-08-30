const puppeteer = require('puppeteer');

async function analyzeViarexCOD() {
  console.log('🔍 Analyzing Viarex COD page...');
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    await page.goto('https://2xs1b.doctormurin.com/l', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('📄 Page loaded, extracting form details...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract all form fields
    const formFields = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select, textarea');
      const fields = [];
      
      inputs.forEach(input => {
        fields.push({
          type: input.type,
          name: input.name,
          id: input.id,
          placeholder: input.placeholder,
          required: input.required,
          value: input.value,
          className: input.className
        });
      });
      
      return fields;
    });
    
    console.log('📝 Form fields found:', JSON.stringify(formFields, null, 2));
    
    // Extract form action and method
    const formDetails = await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      const formInfo = [];
      
      forms.forEach(form => {
        formInfo.push({
          action: form.action,
          method: form.method,
          id: form.id,
          className: form.className
        });
      });
      
      return formInfo;
    });
    
    console.log('📋 Form details:', JSON.stringify(formDetails, null, 2));
    
    // Extract hidden fields and tracking data
    const hiddenData = await page.evaluate(() => {
      const hiddens = document.querySelectorAll('input[type="hidden"]');
      const data = [];
      
      hiddens.forEach(hidden => {
        data.push({
          name: hidden.name,
          value: hidden.value,
          id: hidden.id
        });
      });
      
      // Look for any tracking scripts or affiliate IDs
      const scripts = document.querySelectorAll('script');
      const trackingData = [];
      
      scripts.forEach(script => {
        if (script.textContent && (script.textContent.includes('bid') || script.textContent.includes('affiliate') || script.textContent.includes('track'))) {
          trackingData.push(script.textContent.substring(0, 200) + '...');
        }
      });
      
      return { hidden: data, tracking: trackingData };
    });
    
    console.log('🔒 Hidden/Tracking data:', JSON.stringify(hiddenData, null, 2));
    
    // Extract product info
    const productInfo = await page.evaluate(() => {
      const prices = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent && (el.textContent.includes('RON') || el.textContent.includes('LEI'))) {
          prices.push(el.textContent.trim());
        }
      });
      
      return {
        prices: prices.slice(0, 10), // Top 10 price mentions
        title: document.title,
        productName: document.querySelector('h1') ? document.querySelector('h1').textContent : 'Not found'
      };
    });
    
    console.log('💰 Product info:', JSON.stringify(productInfo, null, 2));
    
    // Try to find the order button and see what happens
    const orderButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a[href*="order"], *[class*="order"], *[onclick*="order"]');
      const buttonInfo = [];
      
      buttons.forEach(btn => {
        if (btn.textContent.trim().length > 0) {
          buttonInfo.push({
            text: btn.textContent.trim(),
            href: btn.href || '',
            onclick: btn.onclick ? btn.onclick.toString() : '',
            className: btn.className,
            tagName: btn.tagName
          });
        }
      });
      
      return buttonInfo;
    });
    
    console.log('🔘 Order buttons:', JSON.stringify(orderButtons, null, 2));
    
    // Get the page HTML for detailed analysis
    const pageHTML = await page.content();
    require('fs').writeFileSync('./viarex-page-analysis.html', pageHTML);
    console.log('💾 Full page HTML saved to viarex-page-analysis.html');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    setTimeout(async () => {
      await browser.close();
    }, 5000);
  }
}

analyzeViarexCOD();