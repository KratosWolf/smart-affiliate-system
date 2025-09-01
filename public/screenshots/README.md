# 📸 Screenshots para Cookie Template

## 📁 Como Usar

Para adicionar screenshots personalizados para o Cookie Template:

1. **Tire screenshots manuais** da página que você quer usar
2. **Renomeie os arquivos** seguindo o padrão:
   - Desktop: `{dominio}_desktop.png`  
   - Mobile: `{dominio}_mobile.png`
3. **Coloque nesta pasta** (`public/screenshots/`)

## 🎯 Exemplo para nervecalm.com

Para a página `https://nervecalm.com/`:

- **Desktop**: `nervecalm_com_desktop.png`
- **Mobile**: `nervecalm_com_mobile.png`

## 📱 Como Tirar Screenshot Mobile

1. Abra a página no Chrome
2. F12 → Toggle Device Toolbar (📱)
3. Escolha iPhone/dispositivo mobile  
4. Tire screenshot da página completa
5. Salve como `nervecalm_com_mobile.png`

## 🖥️ Como Tirar Screenshot Desktop

1. Abra a página no Chrome
2. Tire screenshot da primeira dobra (área visível)
3. Salve como `nervecalm_com_desktop.png`

## 🔄 Funcionamento

O sistema vai:
1. ✅ **Primeiro**: Tentar usar sua imagem local
2. 🔄 **Fallback**: Usar serviços online se não encontrar
3. 📊 **Logs**: Mostrar no console o que está sendo usado

## 📋 Exemplos de Nomes

| URL | Desktop | Mobile |
|-----|---------|--------|
| nervecalm.com | `nervecalm_com_desktop.png` | `nervecalm_com_mobile.png` |
| exemplo.com.br | `exemplo_com_br_desktop.png` | `exemplo_com_br_mobile.png` |
| site-teste.net | `site_teste_net_desktop.png` | `site_teste_net_mobile.png` |

## 🎨 Recomendações

- **Desktop**: 1200x800px ou similar
- **Mobile**: 375x812px (iPhone) ou similar
- **Formato**: PNG (melhor qualidade)
- **Qualidade**: Alta resolução para melhor visual