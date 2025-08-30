# 🖼️ Manual Image Download & Clean Guide

## Como baixar e limpar imagens da página Skinatrin

### PASSO 1: Identificar imagens na página original

Acesse: https://5y1c6.doctormurin.com/l

**Imagens importantes para baixar:**
1. **Imagem das mãos** aplicando o produto (hero section)
2. **Fotos dos testemunhos** (Maja, Arkadiusz, Maria)
3. **Imagens do produto** Skinatrin spray
4. **Before/After** das unhas
5. **Ícones** e elementos gráficos

### PASSO 2: Baixar imagens manualmente

#### **Método A: Clique direito**
1. **Clique direito** na imagem
2. **"Salvar imagem como..."**
3. **Salve** em: `/Users/tiagofernandes/Desktop/VIBE/smart-affiliate-system/raw-images/`

#### **Método B: Inspecionar elemento**
1. **Clique direito** → **"Inspecionar elemento"**
2. **Procure** pela tag `<img src="...">`
3. **Clique direito** no link da imagem
4. **"Abrir em nova aba"** → **Salvar**

### PASSO 3: Limpar metadados

Depois de baixar, vou criar um script para limpar:

```bash
# Na pasta do projeto, execute:
npm run clean-images
```

### PASSO 4: Usar imagens limpas na pre-sell

Substituo as imagens placeholder pelas reais e limpas.

---

## 🚨 IMPORTANTE: Segurança

### **Por que limpar metadados:**
- **EXIF data** pode conter localização GPS
- **Camera info** pode identificar dispositivo
- **Timestamps** podem revelar quando foi feita
- **Software info** pode identificar ferramentas

### **O que o sistema vai remover:**
✅ Dados EXIF completos
✅ Metadados de câmera  
✅ Informações de localização
✅ Timestamps originais
✅ Informações de software
✅ Perfis de cor desnecessários

---

## 📋 Lista de Imagens para Baixar

### **Prioritárias:**
- [ ] Imagem das mãos (hero section, lado direito)
- [ ] Foto da Maja (testemunho 1)
- [ ] Foto do Arkadiusz (testemunho 2) 
- [ ] Foto da Maria (testemunho 3)
- [ ] Produto Skinatrin spray (várias versões)

### **Secundárias:**
- [ ] Before/after das unhas
- [ ] Ícones de features
- [ ] Background patterns
- [ ] Logo Skinatrin

---

## 🎯 Próximos passos:

1. **Você baixa** as imagens principais
2. **Eu crio** script para limpar metadados
3. **Substituo** na pre-sell V5
4. **Testamos** resultado final

**Consegue começar baixando as imagens das mãos e dos testemunhos?**