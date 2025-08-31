/**
 * Automatic Folder Creation via FTP
 * Cria pastas automaticamente no deploy
 */

import * as ftp from 'basic-ftp'

export class FolderManager {
  
  /**
   * Criar estrutura completa de pastas automaticamente
   */
  async createProductFolder(
    ftpConfig: any,
    productName: string
  ): Promise<boolean> {
    
    const client = new ftp.Client()
    
    try {
      console.log(`📁 Criando estrutura para: ${productName}`)
      
      // Conectar ao FTP
      await client.access({
        host: ftpConfig.host,
        user: ftpConfig.user,
        password: ftpConfig.password,
        port: 21
      })
      
      // Criar pasta principal do produto
      const productPath = `/public_html/${productName}`
      await client.ensureDir(productPath)
      console.log(`✅ Pasta criada: ${productPath}`)
      
      // Criar subpastas automaticamente
      const subfolders = [
        'assets',
        'assets/images',
        'assets/css',
        'assets/js',
        'backup'
      ]
      
      for (const folder of subfolders) {
        const fullPath = `${productPath}/${folder}`
        await client.ensureDir(fullPath)
        console.log(`✅ Subpasta criada: ${fullPath}`)
      }
      
      // Criar arquivo .htaccess para SEO
      const htaccessContent = `
# SEO e Performance
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Remove trailing slash
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} /$
    RewriteRule ^(.*)$ %{REQUEST_URI}? [R=301,L]
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Compress files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript text/xml application/xml application/xml+rss text/plain
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
      `
      
      // Upload do .htaccess
      await client.uploadFrom(
        Buffer.from(htaccessContent).toString(),
        `${productPath}/.htaccess`
      )
      console.log(`✅ .htaccess criado`)
      
      // Criar robots.txt
      const robotsContent = `
User-agent: *
Allow: /

Sitemap: https://bestbargains24x7.com/${productName}/sitemap.xml
      `
      
      await client.uploadFrom(
        Buffer.from(robotsContent).toString(),
        `${productPath}/robots.txt`
      )
      console.log(`✅ robots.txt criado`)
      
      console.log(`🎉 Estrutura completa criada para: ${productName}`)
      
      return true
      
    } catch (error) {
      console.error('❌ Erro ao criar pastas:', error)
      return false
      
    } finally {
      client.close()
    }
  }
  
  /**
   * Listar estrutura de pastas existente
   */
  async listFolders(ftpConfig: any): Promise<void> {
    const client = new ftp.Client()
    
    try {
      await client.access(ftpConfig)
      
      console.log('\n📂 ESTRUTURA ATUAL:')
      console.log('══════════════════')
      
      const publicHtml = await client.list('/public_html')
      
      for (const item of publicHtml) {
        if (item.isDirectory && !item.name.startsWith('.')) {
          console.log(`📁 ${item.name}/`)
          
          try {
            const subItems = await client.list(`/public_html/${item.name}`)
            for (const subItem of subItems.slice(0, 5)) {
              if (subItem.name !== '.' && subItem.name !== '..') {
                const type = subItem.isDirectory ? '📁' : '📄'
                console.log(`   ${type} ${subItem.name}`)
              }
            }
            if (subItems.length > 5) {
              console.log(`   ... (+${subItems.length - 5} mais)`)
            }
          } catch (e) {
            console.log('   (sem acesso)')
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Erro ao listar:', error)
    } finally {
      client.close()
    }
  }
}

export const folderManager = new FolderManager()