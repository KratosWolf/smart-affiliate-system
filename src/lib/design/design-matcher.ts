/**
 * Design Matcher - Extrai cores, fontes e estilo da página original
 * Para criar presells com fluidez visual total
 */

import { JSDOM } from 'jsdom';

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    button: string;
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
    headingFont: string;
    fontSize: {
      base: string;
      heading: string;
      small: string;
    };
  };
  layout: {
    borderRadius: string;
    spacing: string;
    buttonStyle: 'rounded' | 'square' | 'pill';
    shadowStyle: 'none' | 'subtle' | 'strong';
  };
  theme: {
    style: 'modern' | 'classic' | 'medical' | 'organic' | 'tech';
    mood: 'professional' | 'friendly' | 'urgent' | 'calm';
  };
}

export class DesignMatcher {
  
  /**
   * Extrai design tokens da página original
   */
  async extractDesignTokens(pageUrl: string): Promise<DesignTokens> {
    try {
      // 1. Fetch da página original
      const response = await fetch(pageUrl);
      const html = await response.text();
      
      // 2. Parse do DOM
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      // 3. Extrair CSS inline e computed styles
      const styles = this.extractStyles(document);
      
      // 4. Analisar cores dominantes
      const colors = this.analyzeColors(styles, document);
      
      // 5. Extrair tipografia
      const typography = this.analyzeTypography(styles, document);
      
      // 6. Detectar layout patterns
      const layout = this.analyzeLayout(styles, document);
      
      // 7. Determinar tema/mood
      const theme = this.analyzeTheme(colors, typography, layout);
      
      return {
        colors,
        typography,
        layout,
        theme
      };
      
    } catch (error) {
      console.error('Design extraction failed:', error);
      return this.getDefaultDesignTokens();
    }
  }

  /**
   * Extrai todos os estilos CSS da página
   */
  private extractStyles(document: Document): Map<string, any> {
    const styles = new Map();
    
    // CSS inline styles
    const elementsWithStyle = document.querySelectorAll('[style]');
    elementsWithStyle.forEach(el => {
      const inlineStyle = el.getAttribute('style');
      if (inlineStyle) {
        styles.set(`inline_${Math.random()}`, this.parseInlineStyle(inlineStyle));
      }
    });
    
    // CSS from stylesheets
    const styleSheets = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleSheets.forEach((sheet, index) => {
      if (sheet.tagName === 'STYLE') {
        styles.set(`embedded_${index}`, sheet.textContent);
      }
    });
    
    return styles;
  }

  /**
   * Analisa cores dominantes da página
   */
  private analyzeColors(styles: Map<string, any>, document: Document): DesignTokens['colors'] {
    const colorExtractor = new ColorExtractor();
    
    // Extrair cores de elementos principais
    const primaryColors = this.extractColorsFromElements(document, [
      'button', '[type="submit"]', '.btn', '.cta', 
      'h1', 'h2', '.headline', '.title'
    ]);
    
    const backgroundColors = this.extractColorsFromElements(document, [
      'body', 'main', '.container', '.wrapper', 'header'
    ]);
    
    const textColors = this.extractColorsFromElements(document, [
      'p', 'span', 'div', 'body'
    ]);
    
    // Analisar frequência e dominância
    const dominantColors = colorExtractor.findDominantColors([
      ...primaryColors,
      ...backgroundColors,
      ...textColors
    ]);
    
    return {
      primary: dominantColors.primary || '#007bff',
      secondary: dominantColors.secondary || '#6c757d',
      accent: dominantColors.accent || '#28a745',
      background: dominantColors.background || '#ffffff',
      text: dominantColors.text || '#333333',
      button: dominantColors.button || dominantColors.primary || '#007bff'
    };
  }

  /**
   * Analisa tipografia da página
   */
  private analyzeTypography(styles: Map<string, any>, document: Document): DesignTokens['typography'] {
    const fontExtractor = new FontExtractor();
    
    // Fontes de headings
    const headingFonts = this.extractFontsFromElements(document, ['h1', 'h2', 'h3', '.title', '.headline']);
    
    // Fontes de corpo
    const bodyFonts = this.extractFontsFromElements(document, ['body', 'p', 'div', 'span']);
    
    // Tamanhos de fonte
    const fontSizes = this.extractFontSizes(document);
    
    return {
      primaryFont: bodyFonts[0] || 'Arial, sans-serif',
      secondaryFont: headingFonts[0] || bodyFonts[0] || 'Arial, sans-serif', 
      headingFont: headingFonts[0] || 'Georgia, serif',
      fontSize: {
        base: fontSizes.base || '16px',
        heading: fontSizes.heading || '24px',
        small: fontSizes.small || '14px'
      }
    };
  }

  /**
   * Analisa padrões de layout
   */
  private analyzeLayout(styles: Map<string, any>, document: Document): DesignTokens['layout'] {
    // Analisar border-radius
    const borderRadius = this.analyzeBorderRadius(document);
    
    // Analisar espaçamento
    const spacing = this.analyzeSpacing(document);
    
    // Analisar estilo de botões
    const buttonStyle = this.analyzeButtonStyle(document);
    
    // Analisar shadows
    const shadowStyle = this.analyzeShadowStyle(document);
    
    return {
      borderRadius,
      spacing,
      buttonStyle,
      shadowStyle
    };
  }

  /**
   * Determina tema e mood geral
   */
  private analyzeTheme(
    colors: DesignTokens['colors'],
    typography: DesignTokens['typography'], 
    layout: DesignTokens['layout']
  ): DesignTokens['theme'] {
    
    // Determinar estilo baseado em cores e layout
    let style: DesignTokens['theme']['style'] = 'modern';
    
    if (colors.primary.includes('#fff') && layout.shadowStyle === 'subtle') {
      style = 'medical';
    } else if (colors.primary.includes('green') || colors.accent.includes('green')) {
      style = 'organic';
    } else if (layout.borderRadius === '0px' && colors.background === '#ffffff') {
      style = 'classic';
    } else if (colors.primary.includes('#00') || colors.primary.includes('#ff')) {
      style = 'tech';
    }
    
    // Determinar mood baseado em cores
    let mood: DesignTokens['theme']['mood'] = 'professional';
    
    if (colors.primary.includes('#ff') || colors.accent.includes('#ff')) {
      mood = 'urgent';
    } else if (colors.primary.includes('blue') || colors.primary.includes('navy')) {
      mood = 'professional';
    } else if (colors.primary.includes('green')) {
      mood = 'calm';
    } else {
      mood = 'friendly';
    }
    
    return { style, mood };
  }

  /**
   * Aplica design tokens a um template
   */
  applyDesignTokens(htmlTemplate: string, tokens: DesignTokens): string {
    const css = this.generateCSSFromTokens(tokens);
    
    // Injetar CSS no template
    const styledTemplate = htmlTemplate.replace(
      '</head>',
      `<style>${css}</style></head>`
    );
    
    return styledTemplate;
  }

  /**
   * Gera CSS a partir dos design tokens
   */
  private generateCSSFromTokens(tokens: DesignTokens): string {
    return `
      :root {
        /* Cores */
        --primary-color: ${tokens.colors.primary};
        --secondary-color: ${tokens.colors.secondary};
        --accent-color: ${tokens.colors.accent};
        --background-color: ${tokens.colors.background};
        --text-color: ${tokens.colors.text};
        --button-color: ${tokens.colors.button};
        
        /* Tipografia */
        --primary-font: ${tokens.typography.primaryFont};
        --heading-font: ${tokens.typography.headingFont};
        --base-font-size: ${tokens.typography.fontSize.base};
        --heading-font-size: ${tokens.typography.fontSize.heading};
        
        /* Layout */
        --border-radius: ${tokens.layout.borderRadius};
        --spacing: ${tokens.layout.spacing};
        --shadow: ${this.getShadowCSS(tokens.layout.shadowStyle)};
      }
      
      body {
        font-family: var(--primary-font);
        font-size: var(--base-font-size);
        color: var(--text-color);
        background-color: var(--background-color);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--heading-font);
        color: var(--primary-color);
      }
      
      .btn, button {
        background-color: var(--button-color);
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        padding: var(--spacing);
        border: none;
        font-family: var(--primary-font);
      }
      
      .btn:hover, button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .card {
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        background-color: var(--background-color);
      }
      
      .accent {
        color: var(--accent-color);
      }
      
      .secondary {
        color: var(--secondary-color);
      }
    `;
  }

  // Helper methods
  
  private extractColorsFromElements(document: Document, selectors: string[]): string[] {
    const colors: string[] = [];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const computedStyle = el.getAttribute('style') || '';
        const bgColor = this.extractColorFromStyle(computedStyle, 'background-color');
        const color = this.extractColorFromStyle(computedStyle, 'color');
        
        if (bgColor) colors.push(bgColor);
        if (color) colors.push(color);
      });
    });
    
    return colors.filter(color => color !== 'transparent' && color !== 'inherit');
  }

  private extractFontsFromElements(document: Document, selectors: string[]): string[] {
    const fonts: string[] = [];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const style = el.getAttribute('style') || '';
        const fontFamily = this.extractFontFromStyle(style);
        if (fontFamily) fonts.push(fontFamily);
      });
    });
    
    return [...new Set(fonts)]; // Remove duplicates
  }

  private extractColorFromStyle(style: string, property: string): string | null {
    const regex = new RegExp(`${property}:\\s*([^;]+)`, 'i');
    const match = style.match(regex);
    return match ? match[1].trim() : null;
  }

  private extractFontFromStyle(style: string): string | null {
    const regex = /font-family:\s*([^;]+)/i;
    const match = style.match(regex);
    return match ? match[1].trim().replace(/['"]/g, '') : null;
  }

  private parseInlineStyle(inlineStyle: string): Record<string, string> {
    const styles: Record<string, string> = {};
    const declarations = inlineStyle.split(';');
    
    declarations.forEach(declaration => {
      const [property, value] = declaration.split(':');
      if (property && value) {
        styles[property.trim()] = value.trim();
      }
    });
    
    return styles;
  }

  private analyzeBorderRadius(document: Document): string {
    const buttons = document.querySelectorAll('button, .btn, [type="submit"]');
    const radiusValues: string[] = [];
    
    buttons.forEach(btn => {
      const style = btn.getAttribute('style') || '';
      const radius = this.extractColorFromStyle(style, 'border-radius');
      if (radius) radiusValues.push(radius);
    });
    
    // Retorna o mais comum ou padrão
    return radiusValues[0] || '6px';
  }

  private analyzeSpacing(document: Document): string {
    // Análise básica de padding/margin
    return '16px';
  }

  private analyzeButtonStyle(document: Document): DesignTokens['layout']['buttonStyle'] {
    const buttons = document.querySelectorAll('button, .btn');
    
    for (const btn of buttons) {
      const style = btn.getAttribute('style') || '';
      const radius = this.extractColorFromStyle(style, 'border-radius');
      
      if (radius && parseInt(radius) > 20) return 'pill';
      if (radius && parseInt(radius) === 0) return 'square';
    }
    
    return 'rounded';
  }

  private analyzeShadowStyle(document: Document): DesignTokens['layout']['shadowStyle'] {
    // Análise básica de box-shadow
    return 'subtle';
  }

  private extractFontSizes(document: Document): { base: string; heading: string; small: string } {
    return {
      base: '16px',
      heading: '24px',
      small: '14px'
    };
  }

  private getShadowCSS(shadowStyle: DesignTokens['layout']['shadowStyle']): string {
    switch (shadowStyle) {
      case 'none': return 'none';
      case 'subtle': return '0 2px 4px rgba(0,0,0,0.1)';
      case 'strong': return '0 4px 12px rgba(0,0,0,0.15)';
      default: return '0 2px 4px rgba(0,0,0,0.1)';
    }
  }

  private getDefaultDesignTokens(): DesignTokens {
    return {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d', 
        accent: '#28a745',
        background: '#ffffff',
        text: '#333333',
        button: '#007bff'
      },
      typography: {
        primaryFont: 'Arial, sans-serif',
        secondaryFont: 'Arial, sans-serif',
        headingFont: 'Georgia, serif',
        fontSize: {
          base: '16px',
          heading: '24px',
          small: '14px'
        }
      },
      layout: {
        borderRadius: '6px',
        spacing: '16px',
        buttonStyle: 'rounded',
        shadowStyle: 'subtle'
      },
      theme: {
        style: 'modern',
        mood: 'professional'
      }
    };
  }
}

/**
 * Helper class para extração de cores
 */
class ColorExtractor {
  findDominantColors(colors: string[]): { primary: string; secondary: string; accent: string; background: string; text: string; button: string } {
    // Análise de frequência de cores
    const colorFreq = new Map<string, number>();
    
    colors.forEach(color => {
      const normalized = this.normalizeColor(color);
      colorFreq.set(normalized, (colorFreq.get(normalized) || 0) + 1);
    });
    
    // Ordena por frequência
    const sortedColors = Array.from(colorFreq.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([color]) => color);
    
    return {
      primary: sortedColors[0] || '#007bff',
      secondary: sortedColors[1] || '#6c757d',
      accent: sortedColors[2] || '#28a745', 
      background: this.findBackgroundColor(colors) || '#ffffff',
      text: this.findTextColor(colors) || '#333333',
      button: sortedColors[0] || '#007bff'
    };
  }

  private normalizeColor(color: string): string {
    // Normaliza formatos de cor (hex, rgb, hsl, etc.)
    return color.toLowerCase().trim();
  }

  private findBackgroundColor(colors: string[]): string {
    // Procura cores claras que provavelmente são background
    const lightColors = colors.filter(color => 
      color.includes('#fff') || 
      color.includes('rgb(255') ||
      color.includes('background')
    );
    
    return lightColors[0] || '#ffffff';
  }

  private findTextColor(colors: string[]): string {
    // Procura cores escuras que provavelmente são texto
    const darkColors = colors.filter(color =>
      color.includes('#000') ||
      color.includes('#333') ||
      color.includes('rgb(0') ||
      color.includes('color:')
    );
    
    return darkColors[0] || '#333333';
  }
}

/**
 * Helper class para extração de fontes
 */
class FontExtractor {
  // Implementação futura se necessário
}

// Export singleton
export const designMatcher = new DesignMatcher();