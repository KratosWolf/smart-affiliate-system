const puppeteer = require('puppeteer');

async function analyzeCODForm() {
  console.log('🔍 Analyzing COD form structure...');
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    await page.goto('https://5y1c6.doctormurin.com/l', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('📄 Page loaded, looking for order buttons...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Find and click order button
    const orderButtons = await page.$$eval('[href*="order"], [onclick*="order"], button, a[href*="zamow"], *[class*="order"], *[class*="btn"]', buttons => {
      return buttons.map(btn => ({
        text: btn.textContent.trim(),
        href: btn.href,
        onclick: btn.onclick?.toString(),
        className: btn.className
      })).filter(btn => btn.text.length > 0);
    });
    
    console.log('🔘 Found buttons:', orderButtons);
    
    // Try to find order button and click
    const orderButton = await page.$('*[class*="btn"], button, a[href*="order"]');
    if (orderButton) {
      console.log('🖱️ Clicking order button...');
      await orderButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if form appeared or new page loaded
      const currentUrl = page.url();
      console.log('🌐 Current URL:', currentUrl);
      
      // Look for form fields
      const formFields = await page.$$eval('input, select, textarea', fields => {
        return fields.map(field => ({
          type: field.type,
          name: field.name,
          placeholder: field.placeholder,
          required: field.required,
          id: field.id
        }));
      });
      
      console.log('📝 Form fields found:', formFields);
      
      // Get page HTML to analyze structure
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      console.log('📄 Form page loaded, analyzing structure...');
      
      // Save form HTML for analysis
      require('fs').writeFileSync('./cod-form-analysis.html', bodyHTML);
      console.log('💾 Form HTML saved to cod-form-analysis.html');
      
    } else {
      console.log('❌ No order button found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

analyzeCODForm();