/**
 * VALIDADOR DE CARACTERES GOOGLE ADS
 * Limites rigorosos para aprovação automática
 */

export interface CharacterLimits {
  headlines: number;
  descriptions: number;
  sitelinks: number;
  callouts: number;
  paths: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedContent?: {
    headlines: string[];
    descriptions: string[];
    sitelinks: string[];
    callouts: string[];
    paths: string[];
  };
}

export class GoogleAdsCharacterValidator {
  
  private limits: CharacterLimits = {
    headlines: 30,     // Máximo 30 caracteres
    descriptions: 90,  // Máximo 90 caracteres  
    sitelinks: 25,     // Máximo 25 caracteres
    callouts: 25,      // Máximo 25 caracteres
    paths: 15          // Máximo 15 caracteres
  };

  /**
   * VALIDA E CORRIGE CONTEÚDO AUTOMATICAMENTE
   */
  validateAndCorrect(content: {
    headlines: string[];
    descriptions: string[];
    sitelinks: string[];
    callouts: string[];
    paths?: string[];
  }): ValidationResult {
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Valida e corrige headlines
    const correctedHeadlines = this.validateHeadlines(content.headlines, errors, warnings);
    
    // Valida e corrige descriptions
    const correctedDescriptions = this.validateDescriptions(content.descriptions, errors, warnings);
    
    // Valida e corrige sitelinks
    const correctedSitelinks = this.validateSitelinks(content.sitelinks, errors, warnings);
    
    // Valida e corrige callouts
    const correctedCallouts = this.validateCallouts(content.callouts, errors, warnings);
    
    // Valida e corrige paths
    const correctedPaths = content.paths 
      ? this.validatePaths(content.paths, errors, warnings)
      : [];

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedContent: {
        headlines: correctedHeadlines,
        descriptions: correctedDescriptions,
        sitelinks: correctedSitelinks,
        callouts: correctedCallouts,
        paths: correctedPaths
      }
    };
  }

  /**
   * VALIDA HEADLINES (30 caracteres máx)
   */
  private validateHeadlines(headlines: string[], errors: string[], warnings: string[]): string[] {
    return headlines.map((headline, index) => {
      if (headline.length > this.limits.headlines) {
        warnings.push(`Headline ${index + 1} reduzida de ${headline.length} para ${this.limits.headlines} caracteres`);
        
        // Estratégia inteligente de corte
        return this.smartTruncate(headline, this.limits.headlines);
      }
      
      // Valida caracteres especiais problemáticos
      if (this.hasProblematicChars(headline)) {
        warnings.push(`Headline ${index + 1} contém caracteres que podem ser rejeitados`);
      }
      
      return headline;
    });
  }

  /**
   * VALIDA DESCRIPTIONS (90 caracteres máx)
   */
  private validateDescriptions(descriptions: string[], errors: string[], warnings: string[]): string[] {
    return descriptions.map((description, index) => {
      if (description.length > this.limits.descriptions) {
        warnings.push(`Description ${index + 1} reduzida de ${description.length} para ${this.limits.descriptions} caracteres`);
        
        return this.smartTruncate(description, this.limits.descriptions, true);
      }
      
      return description;
    });
  }

  /**
   * VALIDA SITELINKS (25 caracteres máx)
   */
  private validateSitelinks(sitelinks: string[], errors: string[], warnings: string[]): string[] {
    return sitelinks.map((sitelink, index) => {
      if (sitelink.length > this.limits.sitelinks) {
        warnings.push(`Sitelink ${index + 1} reduzido de ${sitelink.length} para ${this.limits.sitelinks} caracteres`);
        
        return this.smartTruncate(sitelink, this.limits.sitelinks);
      }
      
      return sitelink;
    });
  }

  /**
   * VALIDA CALLOUTS (25 caracteres máx)
   */
  private validateCallouts(callouts: string[], errors: string[], warnings: string[]): string[] {
    return callouts.map((callout, index) => {
      if (callout.length > this.limits.callouts) {
        warnings.push(`Callout ${index + 1} reduzido de ${callout.length} para ${this.limits.callouts} caracteres`);
        
        return this.smartTruncate(callout, this.limits.callouts);
      }
      
      return callout;
    });
  }

  /**
   * VALIDA PATHS (15 caracteres máx)
   */
  private validatePaths(paths: string[], errors: string[], warnings: string[]): string[] {
    return paths.map((path, index) => {
      if (path.length > this.limits.paths) {
        warnings.push(`Path ${index + 1} reduzido de ${path.length} para ${this.limits.paths} caracteres`);
        
        return this.smartTruncate(path, this.limits.paths);
      }
      
      return path;
    });
  }

  /**
   * CORTE INTELIGENTE DE TEXTO
   * Preserva palavras completas quando possível
   */
  private smartTruncate(text: string, maxLength: number, preserveSentence: boolean = false): string {
    if (text.length <= maxLength) return text;
    
    // Para descriptions, tenta preservar frases
    if (preserveSentence) {
      const sentences = text.split('. ');
      let result = '';
      
      for (const sentence of sentences) {
        const withSentence = result + (result ? '. ' : '') + sentence;
        if (withSentence.length <= maxLength) {
          result = withSentence;
        } else {
          break;
        }
      }
      
      if (result && result.length <= maxLength) {
        return result;
      }
    }
    
    // Corte por palavra
    const words = text.split(' ');
    let result = '';
    
    for (const word of words) {
      const withWord = result + (result ? ' ' : '') + word;
      if (withWord.length <= maxLength) {
        result = withWord;
      } else {
        break;
      }
    }
    
    // Se não conseguiu formar nenhuma palavra, corta caractere
    if (!result) {
      result = text.substring(0, maxLength - 3) + '...';
    }
    
    return result;
  }

  /**
   * DETECTA CARACTERES PROBLEMÁTICOS
   */
  private hasProblematicChars(text: string): boolean {
    // Caracteres que podem causar rejeição
    const problematicChars = /[™®©°§¶•‚„…‰′″‹›€™¢£¥₹]/;
    const repeatedChars = /(.)\1{2,}/; // 3+ caracteres repetidos
    const excessivePunctuation = /[!?]{2,}/; // !! ou ??
    
    return problematicChars.test(text) || 
           repeatedChars.test(text) || 
           excessivePunctuation.test(text);
  }

  /**
   * GERA RELATÓRIO DE VALIDAÇÃO
   */
  generateValidationReport(result: ValidationResult): string {
    let report = '# 📋 RELATÓRIO DE VALIDAÇÃO - GOOGLE ADS\n\n';
    
    if (result.isValid) {
      report += '✅ **STATUS**: Todos os textos estão dentro dos limites!\n\n';
    } else {
      report += '⚠️ **STATUS**: Ajustes necessários\n\n';
    }
    
    if (result.errors.length > 0) {
      report += '## 🚨 ERROS CRÍTICOS:\n';
      result.errors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += '\n';
    }
    
    if (result.warnings.length > 0) {
      report += '## ⚠️ AVISOS E CORREÇÕES:\n';
      result.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
      report += '\n';
    }
    
    if (result.correctedContent) {
      report += '## 📝 CONTEÚDO CORRIGIDO:\n\n';
      
      report += '### Headlines (máx 30 chars):\n';
      result.correctedContent.headlines.forEach((headline, i) => {
        const charCount = headline.length;
        const status = charCount <= 30 ? '✅' : '❌';
        report += `${i + 1}. ${headline} (${charCount}/30) ${status}\n`;
      });
      
      report += '\n### Descriptions (máx 90 chars):\n';
      result.correctedContent.descriptions.forEach((desc, i) => {
        const charCount = desc.length;
        const status = charCount <= 90 ? '✅' : '❌';
        report += `${i + 1}. ${desc} (${charCount}/90) ${status}\n`;
      });
      
      report += '\n### Sitelinks (máx 25 chars):\n';
      result.correctedContent.sitelinks.forEach((sitelink, i) => {
        const charCount = sitelink.length;
        const status = charCount <= 25 ? '✅' : '❌';
        report += `${i + 1}. ${sitelink} (${charCount}/25) ${status}\n`;
      });
      
      report += '\n### Callouts (máx 25 chars):\n';
      result.correctedContent.callouts.forEach((callout, i) => {
        const charCount = callout.length;
        const status = charCount <= 25 ? '✅' : '❌';
        report += `${i + 1}. ${callout} (${charCount}/25) ${status}\n`;
      });
    }
    
    report += '\n---\n**🎯 DICA**: Textos mais curtos têm maior taxa de aprovação no Google Ads!\n';
    
    return report;
  }
}

export const characterValidator = new GoogleAdsCharacterValidator();