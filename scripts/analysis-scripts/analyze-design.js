const puppeteer = require('puppeteer');

async function analyzeDesign() {
  console.log('🎨 Analyzing original Skinatrin page design...');
  
  const browser = await puppeteer.launch({
    headless: false, // Visual para você ver
    slowMo: 1000
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('📱 Loading original page...');
    await page.goto('https://5y1c6.doctormurin.com/l', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('🔍 Extracting design system...');
    
    const designSystem = await page.evaluate(() => {
      // Extrair cores dos elementos principais
      const body = document.body;
      const bodyStyles = window.getComputedStyle(body);
      
      // Buscar botões CTA
      const buttons = Array.from(document.querySelectorAll('button, .btn, [class*="button"], a[href*="order"], a[href*="buy"]'));
      const mainButton = buttons.find(btn => 
        btn.textContent.toLowerCase().includes('zamawiam') || 
        btn.textContent.toLowerCase().includes('order') ||
        btn.offsetWidth > 200
      );
      
      let buttonStyles = {};
      if (mainButton) {
        const btnStyles = window.getComputedStyle(mainButton);
        buttonStyles = {
          backgroundColor: btnStyles.backgroundColor,
          color: btnStyles.color,
          borderRadius: btnStyles.borderRadius,
          fontSize: btnStyles.fontSize,
          fontWeight: btnStyles.fontWeight,
          padding: btnStyles.padding,
          textTransform: btnStyles.textTransform
        };
      }
      
      // Extrair cores de texto
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
      const headingStyles = headings.map(h => ({
        tag: h.tagName,
        color: window.getComputedStyle(h).color,
        fontSize: window.getComputedStyle(h).fontSize,
        fontWeight: window.getComputedStyle(h).fontWeight,
        text: h.textContent.substring(0, 50)
      }));
      
      // Preços
      const priceElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.includes('PLN') || 
        el.textContent.includes('zł') ||
        /\d+[,.]?\d*\s*PLN/i.test(el.textContent)
      );
      
      const prices = priceElements.map(p => ({
        text: p.textContent.trim(),
        color: window.getComputedStyle(p).color,
        fontSize: window.getComputedStyle(p).fontSize,
        fontWeight: window.getComputedStyle(p).fontWeight,
        textDecoration: window.getComputedStyle(p).textDecoration
      }));
      
      return {
        body: {
          backgroundColor: bodyStyles.backgroundColor,
          color: bodyStyles.color,
          fontFamily: bodyStyles.fontFamily,
          fontSize: bodyStyles.fontSize,
          lineHeight: bodyStyles.lineHeight
        },
        button: buttonStyles,
        headings: headingStyles,
        prices: prices,
        url: window.location.href,
        title: document.title,
        language: document.documentElement.lang || 'pl'
      };
    });
    
    console.log('\n🎨 DESIGN SYSTEM EXTRACTED:');
    console.log('=====================================');
    console.log('📄 Page:', designSystem.title);
    console.log('🌐 URL:', designSystem.url);
    console.log('🗣️ Language:', designSystem.language);
    
    console.log('\n📱 Body Styles:');
    console.log('Background:', designSystem.body.backgroundColor);
    console.log('Text Color:', designSystem.body.color);
    console.log('Font Family:', designSystem.body.fontFamily);
    console.log('Font Size:', designSystem.body.fontSize);
    
    console.log('\n🔘 Button Styles:');
    console.log(designSystem.button);
    
    console.log('\n📝 Headings:');
    designSystem.headings.forEach((h, i) => {
      console.log(`${h.tag}: ${h.color} | ${h.fontSize} | ${h.fontWeight}`);
      console.log(`Text: "${h.text}..."`);
    });
    
    console.log('\n💰 Prices:');
    designSystem.prices.forEach(p => {
      console.log(`"${p.text}" - Color: ${p.color}, Size: ${p.fontSize}`);
    });
    
    // Screenshot para referência visual
    await page.screenshot({ 
      path: '/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/original-design.png',
      fullPage: true 
    });
    
    console.log('\n📸 Screenshot saved: original-design.png');
    console.log('\n✅ Analysis complete! Press any key to close browser...');
    
    // Aguardar input para fechar
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => {
      browser.close();
      process.exit();
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    browser.close();
  }
}

analyzeDesign();