import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const ftpConfig = {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT || '21'
    };

    console.log('🔍 FTP Config Test:', {
      host: ftpConfig.host ? '✅ Set' : '❌ Missing',
      user: ftpConfig.user ? '✅ Set' : '❌ Missing',
      password: ftpConfig.password ? '✅ Set' : '❌ Missing',
      port: ftpConfig.port
    });

    return NextResponse.json({
      success: true,
      config: {
        host: ftpConfig.host ? 'Set' : 'Missing',
        user: ftpConfig.user ? 'Set' : 'Missing', 
        password: ftpConfig.password ? 'Set' : 'Missing',
        port: ftpConfig.port
      },
      message: 'FTP credentials check completed'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}