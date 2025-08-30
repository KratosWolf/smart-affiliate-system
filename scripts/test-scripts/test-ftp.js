const ftp = require('basic-ftp');
require('dotenv').config({ path: '.env.local' });

async function testFTP() {
  const client = new ftp.Client();
  
  try {
    console.log('🔍 Testando conexão FTP...');
    console.log('Host:', process.env.FTP_HOST);
    console.log('User:', process.env.FTP_USER);
    console.log('Password:', process.env.FTP_PASSWORD ? '***configurada***' : '❌NÃO CONFIGURADA');
    
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: 21
    });
    
    console.log('✅ Conexão FTP funcionando!');
    
    // Listar arquivos em /public_html
    console.log('\n📂 Listando /public_html:');
    const list = await client.list('/public_html');
    list.forEach(item => {
      const type = item.isDirectory ? '📁' : '📄';
      console.log(`${type} ${item.name}`);
    });
    
    // Testar criação de pasta Skinatrin
    console.log('\n🔧 Criando pasta /public_html/skinatrin...');
    await client.ensureDir('/public_html/skinatrin');
    console.log('✅ Pasta skinatrin criada!');
    
    // Criar arquivo de teste
    console.log('\n📝 Criando arquivo de teste...');
    const testContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Skinatrin - Teste</title>
</head>
<body>
    <h1>🧪 Teste FTP Funcionando!</h1>
    <p>Sistema Smart Affiliate conectado com sucesso!</p>
    <p>Data: ${new Date().toLocaleString()}</p>
</body>
</html>`;
    
    await client.uploadFrom(Buffer.from(testContent), '/public_html/skinatrin/test.html');
    console.log('✅ Arquivo test.html criado!');
    
    console.log('\n🌐 Teste no browser:');
    console.log('https://bestbargains24x7.com/skinatrin/test.html');
    
  } catch (error) {
    console.error('❌ Erro FTP:', error.message);
  } finally {
    client.close();
  }
}

testFTP();