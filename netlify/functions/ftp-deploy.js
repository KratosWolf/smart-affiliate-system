const ftp = require('basic-ftp');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { productName, presellFiles, deploymentKey } = JSON.parse(event.body);
  
  const client = new ftp.Client();
  client.ftp.timeout = 60000; // 60 seconds timeout
  
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false
    });
    
    const remotePath = `/public_html/${deploymentKey}`;
    await client.ensureDir(remotePath);
    
    // Upload files
    for (const [filename, content] of Object.entries(presellFiles)) {
      const buffer = Buffer.from(content);
      await client.uploadFrom(buffer, `${remotePath}/${filename}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        deployedUrl: `https://bestbargains24x7.com/${deploymentKey}`
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
    
  } finally {
    client.close();
  }
};