/**
 * Tracking Manager - Sistema de tracking avançado
 * Integração tracker pessoal + Microsoft Clarity no header
 */

export interface TrackingConfig {
  // Google Analytics
  googleAnalyticsId?: string
  
  // Facebook Pixel
  facebookPixelId?: string
  
  // Microsoft Clarity
  microsoftClarityId?: string
  
  // Tracker pessoal
  personalTrackerId?: string
  personalTrackerEndpoint?: string
  
  // Configurações gerais
  enableDebugMode?: boolean
  trackScrollDepth?: boolean
  trackClickHeatmap?: boolean
  trackFormInteractions?: boolean
  trackVideoEvents?: boolean
}

export interface TrackingEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  customDimensions?: Record<string, string | number>
  timestamp: string
  sessionId: string
  userId?: string
}

export class TrackingManager {
  private config: TrackingConfig
  private sessionId: string
  private userId?: string
  private eventQueue: TrackingEvent[] = []
  private isInitialized: boolean = false
  
  constructor(config: TrackingConfig) {
    this.config = config
    this.sessionId = this.generateSessionId()
    
    if (typeof window !== 'undefined') {
      this.userId = this.getUserId()
    }
  }
  
  /**
   * Inicializa todos os sistemas de tracking
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    console.log('Initializing tracking systems...')
    
    try {
      // Inicializa em paralelo
      await Promise.all([
        this.initializeGoogleAnalytics(),
        this.initializeFacebookPixel(),
        this.initializeMicrosoftClarity(),
        this.initializePersonalTracker()
      ])
      
      this.setupEventListeners()
      this.isInitialized = true
      
      // Track initialization
      this.track('system', 'tracking', 'initialized', 1)
      
      console.log('Tracking systems initialized successfully')
      
    } catch (error) {
      console.error('Failed to initialize tracking systems:', error)
    }
  }
  
  /**
   * Gera código HTML para inserir no header
   */
  generateTrackingCode(): string {
    const codes: string[] = []
    
    // Google Analytics
    if (this.config.googleAnalyticsId) {
      codes.push(this.getGoogleAnalyticsCode())
    }
    
    // Facebook Pixel
    if (this.config.facebookPixelId) {
      codes.push(this.getFacebookPixelCode())
    }
    
    // Microsoft Clarity
    if (this.config.microsoftClarityId) {
      codes.push(this.getMicrosoftClarityCode())
    }
    
    // Tracker Pessoal
    if (this.config.personalTrackerId) {
      codes.push(this.getPersonalTrackerCode())
    }
    
    // Script de inicialização
    codes.push(this.getInitializationScript())
    
    return codes.join('\n')
  }
  
  /**
   * Rastreia um evento em todos os sistemas
   */
  track(
    category: string,
    action: string,
    label?: string,
    value?: number,
    customDimensions?: Record<string, string | number>
  ): void {
    const event: TrackingEvent = {
      event: `${category}_${action}`,
      category,
      action,
      label,
      value,
      customDimensions,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    // Adiciona à fila
    this.eventQueue.push(event)
    
    if (typeof window === 'undefined') return
    
    // Google Analytics
    this.trackGoogleAnalytics(event)
    
    // Facebook Pixel
    this.trackFacebookPixel(event)
    
    // Microsoft Clarity (eventos customizados)
    this.trackMicrosoftClarity(event)
    
    // Tracker Pessoal
    this.trackPersonal(event)
    
    if (this.config.enableDebugMode) {
      console.log('Tracked event:', event)
    }
  }
  
  /**
   * Rastreia conversão
   */
  trackConversion(
    conversionType: 'lead' | 'purchase' | 'signup' | 'download' | 'view_item',
    value?: number,
    currency: string = 'BRL',
    productName?: string
  ): void {
    const event: TrackingEvent = {
      event: 'conversion',
      category: 'conversion',
      action: conversionType,
      label: productName,
      value,
      customDimensions: {
        currency,
        conversion_type: conversionType
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.eventQueue.push(event)
    
    if (typeof window === 'undefined') return
    
    // Google Analytics - Enhanced Ecommerce
    if ((window as any).gtag && this.config.googleAnalyticsId) {
      (window as any).gtag('event', 'conversion', {
        send_to: this.config.googleAnalyticsId,
        value: value || 0,
        currency: currency,
        transaction_id: this.generateTransactionId()
      })
    }
    
    // Facebook Pixel - Conversion
    if ((window as any).fbq && this.config.facebookPixelId) {
      const fbEventMap = {
        lead: 'Lead',
        purchase: 'Purchase',
        signup: 'CompleteRegistration',
        download: 'Lead',
        view_item: 'ViewContent'
      }
      
      ;(window as any).fbq('track', fbEventMap[conversionType], {
        value: value || 0,
        currency: currency,
        content_name: productName
      })
    }
    
    // Tracker Pessoal
    this.trackPersonal(event)
  }
  
  /**
   * Rastreia página visualizada
   */
  trackPageView(
    page: string,
    title?: string,
    customDimensions?: Record<string, string | number>
  ): void {
    this.track('page', 'view', page, undefined, {
      page_title: title || 'Unknown Page',
      ...customDimensions
    })
  }
  
  /**
   * Rastreia tempo na página
   */
  trackTimeOnPage(): void {
    if (typeof window === 'undefined') return
    
    const startTime = Date.now()
    
    const trackTime = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      this.track('engagement', 'time_on_page', 'seconds', timeSpent)
    }
    
    // Track a cada 30 segundos
    const interval = setInterval(trackTime, 30000)
    
    // Track quando sair da página
    window.addEventListener('beforeunload', () => {
      clearInterval(interval)
      trackTime()
    })
  }
  
  /**
   * Rastreia scroll depth
   */
  trackScrollDepth(): void {
    if (typeof window === 'undefined' || !this.config.trackScrollDepth) return
    
    const milestones = [25, 50, 75, 100]
    const reached: number[] = []
    
    const checkScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !reached.includes(milestone)) {
          reached.push(milestone)
          this.track('engagement', 'scroll_depth', `${milestone}%`, milestone)
        }
      })
    }
    
    window.addEventListener('scroll', checkScroll, { passive: true })
  }
  
  /**
   * Configuração de eventos automáticos
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return
    
    // Scroll depth tracking
    if (this.config.trackScrollDepth) {
      this.trackScrollDepth()
    }
    
    // Click tracking
    if (this.config.trackClickHeatmap) {
      this.setupClickTracking()
    }
    
    // Form tracking
    if (this.config.trackFormInteractions) {
      this.setupFormTracking()
    }
    
    // Time on page
    this.trackTimeOnPage()
  }
  
  private setupClickTracking(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const className = target.className
      const id = target.id
      
      this.track('interaction', 'click', `${tagName}`, undefined, {
        element_class: className,
        element_id: id,
        click_x: event.clientX,
        click_y: event.clientY
      })
    })
  }
  
  private setupFormTracking(): void {
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.track('form', 'submit', form.id || 'unnamed_form')
    })
    
    // Track form field interactions
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea') {
        this.track('form', 'focus', (target as HTMLInputElement).name || 'unnamed_field')
      }
    })
  }
  
  // Códigos de inicialização para cada plataforma
  
  private getGoogleAnalyticsCode(): string {
    return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.config.googleAnalyticsId}', {
        send_page_view: false, // Controle manual
        anonymize_ip: true,
        cookie_expires: 63072000, // 2 years
      });
    </script>`
  }
  
  private getFacebookPixelCode(): string {
    return `
    <!-- Facebook Pixel -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.config.facebookPixelId}');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${this.config.facebookPixelId}&ev=PageView&noscript=1"/></noscript>`
  }
  
  private getMicrosoftClarityCode(): string {
    return `
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${this.config.microsoftClarityId}");
    </script>`
  }
  
  private getPersonalTrackerCode(): string {
    return `
    <!-- Personal Tracker -->
    <script>
      window.personalTracker = {
        id: '${this.config.personalTrackerId}',
        endpoint: '${this.config.personalTrackerEndpoint}',
        sessionId: '${this.sessionId}',
        queue: []
      };
    </script>`
  }
  
  private getInitializationScript(): string {
    return `
    <script>
      // Tracking Manager Initialization
      window.trackingManager = {
        sessionId: '${this.sessionId}',
        initialized: false,
        queue: []
      };
      
      // Helper function for manual tracking
      window.track = function(category, action, label, value, customDimensions) {
        if (window.trackingManager.initialized) {
          // Call actual tracking function
        } else {
          // Queue event
          window.trackingManager.queue.push({
            category, action, label, value, customDimensions,
            timestamp: new Date().toISOString()
          });
        }
      };
      
      // Auto-initialize on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          if (window.initializeTracking) {
            window.initializeTracking();
          }
        });
      } else {
        if (window.initializeTracking) {
          window.initializeTracking();
        }
      }
    </script>`
  }
  
  // Métodos de tracking específicos
  
  private async initializeGoogleAnalytics(): Promise<void> {
    if (!this.config.googleAnalyticsId) return
    // Já inicializado via código HTML
  }
  
  private async initializeFacebookPixel(): Promise<void> {
    if (!this.config.facebookPixelId) return
    // Já inicializado via código HTML
  }
  
  private async initializeMicrosoftClarity(): Promise<void> {
    if (!this.config.microsoftClarityId) return
    // Já inicializado via código HTML
  }
  
  private async initializePersonalTracker(): Promise<void> {
    if (!this.config.personalTrackerId || !this.config.personalTrackerEndpoint) return
    
    // Configuração do tracker pessoal
    console.log('Personal tracker initialized')
  }
  
  private trackGoogleAnalytics(event: TrackingEvent): void {
    if (typeof window === 'undefined' || !(window as any).gtag) return
    
    ;(window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_map: event.customDimensions
    })
  }
  
  private trackFacebookPixel(event: TrackingEvent): void {
    if (typeof window === 'undefined' || !(window as any).fbq) return
    
    // Map events to Facebook standard events
    const fbEventMap: Record<string, string> = {
      'page_view': 'PageView',
      'conversion_lead': 'Lead',
      'conversion_purchase': 'Purchase',
      'form_submit': 'Lead',
      'click_cta': 'Lead'
    }
    
    const fbEvent = fbEventMap[event.event] || 'CustomEvent'
    
    ;(window as any).fbq('trackCustom', fbEvent, {
      category: event.category,
      action: event.action,
      label: event.label,
      value: event.value
    })
  }
  
  private trackMicrosoftClarity(event: TrackingEvent): void {
    if (typeof window === 'undefined' || !(window as any).clarity) return
    
    ;(window as any).clarity('set', 'custom_event', {
      event: event.event,
      category: event.category,
      action: event.action,
      timestamp: event.timestamp
    })
  }
  
  private trackPersonal(event: TrackingEvent): void {
    if (!this.config.personalTrackerEndpoint) return
    
    // Send to personal tracking endpoint
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      fetch(this.config.personalTrackerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trackerId: this.config.personalTrackerId,
          event,
          sessionId: this.sessionId,
          userId: this.userId,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }).catch(error => {
        if (this.config.enableDebugMode) {
          console.error('Personal tracking failed:', error)
        }
      })
    }
  }
  
  // Utility methods
  
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  private getUserId(): string {
    // Try to get from localStorage, otherwise generate
    if (typeof window === 'undefined') return ''
    
    let userId = localStorage.getItem('tracking_user_id')
    if (!userId) {
      userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
      localStorage.setItem('tracking_user_id', userId)
    }
    
    return userId
  }
  
  private generateTransactionId(): string {
    return 'txn_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  /**
   * Exporta dados de tracking para análise
   */
  exportTrackingData(): {
    sessionId: string
    userId: string | undefined
    events: TrackingEvent[]
    config: TrackingConfig
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      events: [...this.eventQueue],
      config: { ...this.config }
    }
  }
  
  /**
   * Limpa dados de tracking
   */
  clearTrackingData(): void {
    this.eventQueue = []
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tracking_user_id')
    }
  }
}

/**
 * Factory function para criar TrackingManager
 */
export function createTrackingManager(config: TrackingConfig): TrackingManager {
  return new TrackingManager(config)
}

/**
 * Configurações padrão por país/mercado
 */
export const defaultTrackingConfigs = {
  brazil: {
    googleAnalyticsId: 'GA_TRACKING_ID_BR',
    facebookPixelId: 'FB_PIXEL_ID_BR',
    microsoftClarityId: 'CLARITY_ID_BR',
    personalTrackerId: 'PERSONAL_TRACKER_BR',
    personalTrackerEndpoint: 'https://tracking.example.com/api/events',
    trackScrollDepth: true,
    trackClickHeatmap: true,
    trackFormInteractions: true
  },
  
  usa: {
    googleAnalyticsId: 'GA_TRACKING_ID_US',
    facebookPixelId: 'FB_PIXEL_ID_US',
    microsoftClarityId: 'CLARITY_ID_US',
    personalTrackerId: 'PERSONAL_TRACKER_US',
    personalTrackerEndpoint: 'https://tracking.example.com/api/events',
    trackScrollDepth: true,
    trackClickHeatmap: true,
    trackFormInteractions: true
  }
}

// Export singleton para uso direto
export const trackingManager = createTrackingManager(defaultTrackingConfigs.brazil)