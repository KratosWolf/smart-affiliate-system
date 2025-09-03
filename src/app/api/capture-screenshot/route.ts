import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { url, productName } = await request.json();
    
    if (!url || !productName) {
      return NextResponse.json(
        { error: 'URL and product name are required' },
        { status: 400 }
      );
    }

    console.log('📸 Capturing screenshots for:', productName, 'from:', url);
    
    // Clean product name for folder
    const cleanProductName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Create directory for product screenshots
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots', cleanProductName);
    
    try {
      await fs.mkdir(screenshotsDir, { recursive: true });
    } catch (error) {
      console.log('Directory already exists or created');
    }

    // Generate screenshot URLs using external API
    const desktopScreenshotUrl = `https://mini.s-shot.ru/1200x800/JPEG/1200/Z100/?${url}`;
    const mobileScreenshotUrl = `https://mini.s-shot.ru/375x812/JPEG/375/Z100/?${url}`;
    
    // Fetch screenshots
    const screenshots = await Promise.all([
      fetch(desktopScreenshotUrl).then(res => res.arrayBuffer()),
      fetch(mobileScreenshotUrl).then(res => res.arrayBuffer())
    ]);

    // Save screenshots locally
    const desktopPath = path.join(screenshotsDir, 'desktop-hero.jpg');
    const mobilePath = path.join(screenshotsDir, 'mobile-hero.jpg');
    
    await Promise.all([
      fs.writeFile(desktopPath, Buffer.from(screenshots[0])),
      fs.writeFile(mobilePath, Buffer.from(screenshots[1]))
    ]);

    console.log('✅ Screenshots saved successfully');
    
    return NextResponse.json({
      success: true,
      paths: {
        desktop: `/screenshots/${cleanProductName}/desktop-hero.jpg`,
        mobile: `/screenshots/${cleanProductName}/mobile-hero.jpg`
      }
    });
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    return NextResponse.json(
      { error: 'Failed to capture screenshots', details: error.message },
      { status: 500 }
    );
  }
}