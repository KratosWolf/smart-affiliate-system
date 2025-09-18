/**
 * Google Ads Validation Engine
 * Garante compliance rigoroso com limites de caracteres e políticas
 * Especializado em produtos de fundo de funil (saúde, beleza, suplementos)
 */

export interface GoogleAdsLimits {
  headlines: {
    max: number
    minCount: number
    maxCount: number
  }
  descriptions: {
    max: number
    minCount: number
    maxCount: number
  }
  callouts: {
    max: number
    maxCount: number
  }
  sitelinks: {
    text: number
    description: number
    maxCount: number
  }
  structuredSnippets: {
    values: number
    maxCount: number
  }
}

export const GOOGLE_ADS_LIMITS: GoogleAdsLimits = {
  headlines: {
    max: 30, // caracteres
    minCount: 3,
    maxCount: 15
  },
  descriptions: {
    max: 90, // caracteres  
    minCount: 2,
    maxCount: 4
  },
  callouts: {
    max: 25, // caracteres
    maxCount: 10
  },
  sitelinks: {
    text: 25, // caracteres
    description: 35, // caracteres
    maxCount: 6
  },
  structuredSnippets: {
    values: 25, // caracteres por valor
    maxCount: 20 // valores totais
  }
}

/**
 * Palavras proibidas para produtos de saúde/beleza (fundo de funil)
 */
export const PROHIBITED_CLAIMS = [
  // Claims médicos extremos
  'cure', 'cura', 'treat', 'tratar doença',
  'miracle', 'milagre', 'magic', 'mágico',
  
  // Superlativos extremos proibidos
  'best in world', 'melhor do mundo',
  'only solution', 'única solução',
  'guaranteed results', 'resultados garantidos',
  
  // Claims de FDA/ANVISA não aprovados
  'fda approved', 'anvisa aprovado',
  'clinically proven', 'clinicamente comprovado',
  
  // Urgência excessiva
  'act now or never', 'agora ou nunca',
  'last chance', 'última chance',
  
  // Comparações médicas
  'better than medicine', 'melhor que remédio',
  'replace doctor', 'substitui médico'
]

/**
 * Palavras obrigatórias para disclaimer (produtos saúde)
 */
export const REQUIRED_DISCLAIMERS = {
  health: ['results may vary', 'consult your doctor', 'not intended to diagnose'],
  beauty: ['individual results vary', 'not medical advice'],
  supplements: ['dietary supplement', 'consult healthcare provider']
}

/**
 * Alternativas seguras para claims comuns
 */
export const SAFE_ALTERNATIVES = {
  'guaranteed': 'may help',
  'garantido': 'pode ajudar',
  'cure': 'support',
  'cura': 'apoio',
  'miracle': 'advanced',
  'milagre': 'avançado',
  'best': 'top-rated',
  'melhor': 'bem avaliado',
  'only': 'leading',
  'único': 'líder'
}

export class GoogleAdsValidationEngine {
  
  /**
   * Valida e corrige headlines
   */
  validateHeadlines(headlines: string[]): {
    valid: string[]
    corrected: string[]
    rejected: string[]
    warnings: string[]
  } {
    const result = {
      valid: [] as string[],
      corrected: [] as string[],
      rejected: [] as string[],
      warnings: [] as string[]
    }

    headlines.forEach(headline => {
      // 1. Verificar limite de caracteres
      if (headline.length > GOOGLE_ADS_LIMITS.headlines.max) {
        const truncated = headline.substring(0, GOOGLE_ADS_LIMITS.headlines.max)
        result.corrected.push(truncated)
        result.warnings.push(`Headlines truncated: "${headline}" → "${truncated}"`)
        return
      }

      // 2. Verificar palavras proibidas
      const hasProhibited = PROHIBITED_CLAIMS.some(claim => 
        headline.toLowerCase().includes(claim.toLowerCase())
      )
      
      if (hasProhibited) {
        // Tentar corrigir automaticamente
        let corrected = headline
        Object.entries(SAFE_ALTERNATIVES).forEach(([prohibited, safe]) => {
          corrected = corrected.replace(new RegExp(prohibited, 'gi'), safe)
        })
        
        if (corrected !== headline) {
          result.corrected.push(corrected)
          result.warnings.push(`Policy violation corrected: "${headline}" → "${corrected}"`)
        } else {
          result.rejected.push(headline)
          result.warnings.push(`Policy violation rejected: "${headline}"`)
        }
        return
      }

      // 3. Headlines aprovado
      result.valid.push(headline)
    })

    return result
  }

  /**
   * Valida e corrige descriptions
   */
  validateDescriptions(descriptions: string[]): {
    valid: string[]
    corrected: string[]
    rejected: string[]
    warnings: string[]
  } {
    const result = {
      valid: [] as string[],
      corrected: [] as string[],
      rejected: [] as string[],
      warnings: [] as string[]
    }

    descriptions.forEach(description => {
      // 1. Verificar limite de caracteres
      if (description.length > GOOGLE_ADS_LIMITS.descriptions.max) {
        const truncated = description.substring(0, GOOGLE_ADS_LIMITS.descriptions.max)
        result.corrected.push(truncated)
        result.warnings.push(`Description truncated: "${description}" → "${truncated}"`)
        return
      }

      // 2. Verificar se tem disclaimer para produtos de saúde
      const needsDisclaimer = this.needsHealthDisclaimer(description)
      if (needsDisclaimer && !this.hasDisclaimer(description)) {
        const withDisclaimer = this.addDisclaimer(description)
        
        // Se ainda cabe nos 90 caracteres
        if (withDisclaimer.length <= GOOGLE_ADS_LIMITS.descriptions.max) {
          result.corrected.push(withDisclaimer)
          result.warnings.push(`Disclaimer added: "${description}" → "${withDisclaimer}"`)
        } else {
          result.rejected.push(description)
          result.warnings.push(`Cannot fit disclaimer: "${description}"`)
        }
        return
      }

      result.valid.push(description)
    })

    return result
  }

  /**
   * Valida callouts (25 caracteres máximo)
   */
  validateCallouts(callouts: string[]): {
    valid: string[]
    corrected: string[]
    rejected: string[]
    warnings: string[]
  } {
    const result = {
      valid: [] as string[],
      corrected: [] as string[],
      rejected: [] as string[],
      warnings: [] as string[]
    }

    callouts.forEach(callout => {
      if (callout.length > GOOGLE_ADS_LIMITS.callouts.max) {
        const truncated = callout.substring(0, GOOGLE_ADS_LIMITS.callouts.max)
        result.corrected.push(truncated)
        result.warnings.push(`Callout truncated: "${callout}" → "${truncated}"`)
      } else {
        result.valid.push(callout)
      }
    })

    return result
  }

  /**
   * Valida sitelinks
   */
  validateSitelinks(sitelinks: Array<{text: string, description?: string}>): {
    valid: Array<{text: string, description?: string}>
    corrected: Array<{text: string, description?: string}>
    rejected: Array<{text: string, description?: string}>
    warnings: string[]
  } {
    const result = {
      valid: [] as Array<{text: string, description?: string}>,
      corrected: [] as Array<{text: string, description?: string}>,
      rejected: [] as Array<{text: string, description?: string}>,
      warnings: [] as string[]
    }

    sitelinks.forEach(sitelink => {
      const corrected = { ...sitelink }
      let needsCorrection = false

      // Validar texto (25 chars)
      if (corrected.text.length > GOOGLE_ADS_LIMITS.sitelinks.text) {
        corrected.text = corrected.text.substring(0, GOOGLE_ADS_LIMITS.sitelinks.text)
        needsCorrection = true
        result.warnings.push(`Sitelink text truncated: "${sitelink.text}" → "${corrected.text}"`)
      }

      // Validar description (35 chars)
      if (corrected.description && corrected.description.length > GOOGLE_ADS_LIMITS.sitelinks.description) {
        corrected.description = corrected.description.substring(0, GOOGLE_ADS_LIMITS.sitelinks.description)
        needsCorrection = true
        result.warnings.push(`Sitelink description truncated`)
      }

      if (needsCorrection) {
        result.corrected.push(corrected)
      } else {
        result.valid.push(corrected)
      }
    })

    return result
  }

  /**
   * Verifica se precisa de disclaimer de saúde
   */
  private needsHealthDisclaimer(text: string): boolean {
    const healthKeywords = ['health', 'saúde', 'weight', 'peso', 'sugar', 'açúcar', 'pressure', 'pressão']
    return healthKeywords.some(keyword => text.toLowerCase().includes(keyword))
  }

  /**
   * Verifica se já tem disclaimer
   */
  private hasDisclaimer(text: string): boolean {
    const disclaimerKeywords = ['may vary', 'pode variar', 'consult', 'consulte']
    return disclaimerKeywords.some(keyword => text.toLowerCase().includes(keyword))
  }

  /**
   * Adiciona disclaimer apropriado
   */
  private addDisclaimer(text: string): string {
    return `${text} *Results may vary`
  }

  /**
   * Validação completa de campanha
   */
  validateCampaign(campaign: {
    headlines: string[]
    descriptions: string[]
    callouts: string[]
    sitelinks: Array<{text: string, description?: string}>
  }) {
    console.log('🔍 Starting Google Ads validation...')

    const headlinesValidation = this.validateHeadlines(campaign.headlines)
    const descriptionsValidation = this.validateDescriptions(campaign.descriptions)
    const calloutsValidation = this.validateCallouts(campaign.callouts)
    const sitelinksValidation = this.validateSitelinks(campaign.sitelinks)

    const allWarnings = [
      ...headlinesValidation.warnings,
      ...descriptionsValidation.warnings,
      ...calloutsValidation.warnings,
      ...sitelinksValidation.warnings
    ]

    console.log(`✅ Validation complete: ${allWarnings.length} issues found and corrected`)

    return {
      validatedCampaign: {
        headlines: [...headlinesValidation.valid, ...headlinesValidation.corrected].slice(0, GOOGLE_ADS_LIMITS.headlines.maxCount),
        descriptions: [...descriptionsValidation.valid, ...descriptionsValidation.corrected].slice(0, GOOGLE_ADS_LIMITS.descriptions.maxCount),
        callouts: [...calloutsValidation.valid, ...calloutsValidation.corrected].slice(0, GOOGLE_ADS_LIMITS.callouts.maxCount),
        sitelinks: [...sitelinksValidation.valid, ...sitelinksValidation.corrected].slice(0, GOOGLE_ADS_LIMITS.sitelinks.maxCount)
      },
      validation: {
        headlines: headlinesValidation,
        descriptions: descriptionsValidation,
        callouts: calloutsValidation,
        sitelinks: sitelinksValidation
      },
      warnings: allWarnings,
      isCompliant: allWarnings.length === 0
    }
  }
}