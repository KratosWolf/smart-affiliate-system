// Smart Affiliate System - Core Types
// Sistema Inteligente de Marketing para Afiliados

// ================================
// PRODUCT VALIDATION TYPES
// ================================

export interface ProductValidationRequest {
  productUrl: string;
  targetCountry?: string;
  budget?: number;
  niche?: string;
}

export interface ProductValidationResponse {
  id: string;
  productName: string;
  productUrl: string;
  targetCountry: string;
  validationScore: number; // 0-100
  status: 'pending' | 'validating' | 'completed' | 'failed';
  
  // Product Data
  productData: {
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    brand?: string;
  };
  
  // Market Analysis  
  marketAnalysis: {
    searchVolume: number;
    competition: 'low' | 'medium' | 'high';
    avgCpc: number;
    seasonality: SeasonalityData[];
    trends: TrendData[];
  };
  
  // Competitor Analysis
  competitorAnalysis?: {
    totalAdvertisers: number;
    topAdvertisers: string[];
    commonHeadlines: string[];
    avgAdPosition: number;
    dominantStrategies: string[];
  };
  
  // Viability Metrics
  viabilityMetrics: {
    demandScore: number; // 0-100
    competitionScore: number; // 0-100  
    profitabilityScore: number; // 0-100
    difficultyScore: number; // 0-100
  };
  
  // Recommendations
  recommendations: {
    shouldProceed: boolean;
    estimatedRoi: number;
    suggestedBudget: number;
    riskLevel: 'low' | 'medium' | 'high';
    keyInsights: string[];
    warnings: string[];
  };
  
  validatedAt: Date;
  expiresAt: Date;
}

export interface SeasonalityData {
  month: number;
  multiplier: number;
  confidence: number;
}

export interface TrendData {
  date: string;
  value: number;
  change: number;
}

// ================================
// CHARACTER OPTIMIZATION TYPES  
// ================================

export interface CharacterOptimizationRequest {
  type: 'headline' | 'description' | 'display_url';
  content: string;
  keywords?: string[];
  productInfo?: {
    name: string;
    benefits: string[];
    price?: number;
  };
}

export interface CharacterOptimizationResponse {
  originalContent: string;
  optimizedContent: string;
  characterCount: {
    original: number;
    optimized: number;
    limit: number;
    optimal: number;
  };
  optimizationScore: number; // 0-100
  improvements: OptimizationImprovement[];
  alternatives: string[];
}

export interface OptimizationImprovement {
  type: 'length' | 'keywords' | 'cta' | 'urgency' | 'clarity';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

// Google Ads Character Limits
export const CHARACTER_LIMITS = {
  headline: { min: 1, max: 30, optimal: 25 },
  description: { min: 1, max: 90, optimal: 80 },
  display_url: { min: 1, max: 15, optimal: 12 },
  path: { min: 1, max: 15, optimal: 12 }
} as const;

// ================================
// CAMPAIGN TYPES
// ================================

export interface SmartCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  
  // Product Reference
  validatedProductId: string;
  productUrl: string;
  
  // Campaign Configuration
  config: {
    budget: CampaignBudget;
    targeting: CampaignTargeting;
    bidding: CampaignBidding;
  };
  
  // Optimized Content
  content: {
    headlines: OptimizedHeadline[];
    descriptions: OptimizedDescription[];
    keywords: CampaignKeyword[];
    extensions: CampaignExtension[];
  };
  
  // Performance Tracking
  performance: CampaignPerformance;
  
  // ROI Tracking
  roiTracking: ROITracking;
  
  // Scaling Status
  scalingStatus: ScalingStatus;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type CampaignStatus = 
  | 'draft'
  | 'pending_approval' 
  | 'active'
  | 'paused'
  | 'scaling'
  | 'ended'
  | 'failed';

export interface CampaignBudget {
  daily: number;
  total?: number;
  currency: string;
  autoScaling: boolean;
  scalingThreshold: number; // ROI threshold for scaling
}

export interface CampaignTargeting {
  countries: string[];
  languages: string[];
  devices: ('desktop' | 'mobile' | 'tablet')[];
  ageRanges: string[];
  genders: ('male' | 'female' | 'unknown')[];
  interests: string[];
  demographics: Record<string, any>;
}

export interface CampaignBidding {
  strategy: 'manual_cpc' | 'maximize_conversions' | 'target_roas' | 'target_cpa';
  maxCpc?: number;
  targetRoas?: number;
  targetCpa?: number;
}

// ================================
// OPTIMIZED CONTENT TYPES
// ================================

export interface OptimizedHeadline {
  id: string;
  text: string;
  characterCount: number;
  optimizationScore: number;
  keywords: string[];
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  status: 'active' | 'testing' | 'paused';
}

export interface OptimizedDescription {
  id: string;
  text: string;
  characterCount: number;
  optimizationScore: number;
  keywords: string[];
  callToAction: string;
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  status: 'active' | 'testing' | 'paused';
}

export interface CampaignKeyword {
  id: string;
  text: string;
  matchType: 'exact' | 'phrase' | 'broad';
  maxCpc: number;
  quality_score?: number;
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
  };
  status: 'active' | 'paused' | 'negative';
}

export interface CampaignExtension {
  type: 'sitelink' | 'callout' | 'structured_snippet' | 'call' | 'location';
  data: Record<string, any>;
  status: 'active' | 'paused';
}

// ================================
// ROI & PERFORMANCE TYPES
// ================================

export interface ROITracking {
  current: ROIMetrics;
  historical: ROISnapshot[];
  scalingCriteria: ScalingCriteria;
  lastCalculated: Date;
}

export interface ROIMetrics {
  roi: number; // Return on Investment percentage
  roas: number; // Return on Ad Spend
  profit: number;
  revenue: number;
  cost: number;
  conversions: number;
  conversionRate: number;
  costPerConversion: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface ROISnapshot {
  date: Date;
  roi: number;
  revenue: number;
  cost: number;
  conversions: number;
}

export interface ScalingCriteria {
  minimumRoi: number; // Default: 60%
  minimumConversions: number; // Default: 10
  evaluationPeriod: number; // Days, default: 3
  scalingIncrement: number; // Default: 20%
  maxScalingMultiplier: number; // Default: 5x
}

export interface ScalingStatus {
  eligible: boolean;
  currentMultiplier: number;
  lastScalingAction: Date | null;
  nextEvaluation: Date;
  scalingHistory: ScalingAction[];
  reasons: string[];
}

export interface ScalingAction {
  date: Date;
  action: 'scale_up' | 'scale_down' | 'pause' | 'resume';
  fromBudget: number;
  toBudget: number;
  reason: string;
  roiAtTime: number;
}

export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  cost: number;
  conversions: number;
  conversionRate: number;
  costPerClick: number;
  costPerConversion: number;
  
  // Time-based metrics
  today: PerformanceMetrics;
  yesterday: PerformanceMetrics;
  last7Days: PerformanceMetrics;
  last30Days: PerformanceMetrics;
  
  // Quality metrics
  qualityScore: number;
  adRelevance: number;
  landingPageExperience: number;
  expectedCtr: number;
}

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue: number;
}

// ================================
// GOOGLE SEARCH API TYPES
// ================================

export interface GoogleSearchRequest {
  query: string;
  country?: string;
  language?: string;
  resultsCount?: number;
}

export interface GoogleSearchResponse {
  query: string;
  totalResults: number;
  searchTime: number;
  results: SearchResult[];
  relatedQueries: string[];
  suggestions: string[];
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  domain: string;
  position: number;
  featured?: boolean;
}

// ================================
// USER & AUTH TYPES
// ================================

export interface SmartAffiliateUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  
  // Subscription
  subscription: {
    plan: 'free' | 'pro' | 'agency' | 'enterprise';
    status: 'active' | 'canceled' | 'expired' | 'trialing';
    validationsLeft: number;
    maxValidations: number;
    renewsAt?: Date;
  };
  
  // Usage Metrics
  usage: {
    validationsThisMonth: number;
    campaignsActive: number;
    totalSpend: number;
    totalRevenue: number;
    avgRoi: number;
  };
  
  // Preferences
  preferences: {
    defaultCountry: string;
    defaultCurrency: string;
    notifications: {
      email: boolean;
      roiAlerts: boolean;
      scalingNotifications: boolean;
      weeklyReports: boolean;
    };
  };
  
  createdAt: Date;
  lastLoginAt: Date;
}

export type UserRole = 'admin' | 'user' | 'agency';

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ================================
// DASHBOARD & ANALYTICS TYPES
// ================================

export interface DashboardOverview {
  period: DateRange;
  metrics: {
    totalValidations: number;
    activeCampaigns: number;
    totalSpend: number;
    totalRevenue: number;
    avgRoi: number;
    scalingCampaigns: number;
  };
  
  charts: {
    roiTrend: ChartDataPoint[];
    spendVsRevenue: ChartDataPoint[];
    validationSuccess: ChartDataPoint[];
  };
  
  topPerformers: {
    campaigns: TopCampaign[];
    products: TopProduct[];
    keywords: TopKeyword[];
  };
}

export interface DateRange {
  start: Date;
  end: Date;
  period: '7d' | '30d' | '90d' | 'custom';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface TopCampaign {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  roi: number;
  conversions: number;
}

export interface TopProduct {
  id: string;
  name: string;
  url: string;
  validationScore: number;
  revenue: number;
  campaigns: number;
}

export interface TopKeyword {
  text: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
}

// ================================
// NOTIFICATION TYPES
// ================================

export interface SmartNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'roi_threshold_met'
  | 'campaign_scaled'
  | 'validation_completed'
  | 'validation_failed'
  | 'budget_exhausted'
  | 'performance_alert'
  | 'system_update'
  | 'billing_issue'
  | 'subscription_expiring';

// ================================
// WEBHOOK TYPES
// ================================

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, any>;
  signature: string;
}

export type WebhookEvent = 
  | 'validation.completed'
  | 'campaign.created'
  | 'campaign.scaled'
  | 'roi.threshold_met'
  | 'performance.alert';

// ================================
// ERROR TYPES
// ================================

export interface SmartAffiliateError {
  code: string;
  message: string;
  statusCode: number;
  context?: Record<string, any>;
  timestamp: Date;
}

// ================================
// PRESELL GENERATOR TYPES
// ================================

export interface PresellGenerationRequest {
  validation: ProductValidationResponse;
  affiliateUrl: string;
  customization?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    texts?: {
      headline?: string;
      subheadline?: string;
      ctaButton?: string;
      urgencyText?: string;
    };
    features?: {
      countdown?: boolean;
      socialProof?: boolean;
      testimonials?: boolean;
      bonusSection?: boolean;
      faqSection?: boolean;
    };
  };
}

export interface PresellGenerationResponse {
  success: boolean;
  data?: {
    productName: string;
    targetCountry: string;
    validationScore: number;
    generated: {
      html: string;
      css: string;
      js: string;
      assets: Record<string, string>;
    };
    config: PresellConfig;
    optimization: {
      mobileOptimized: boolean;
      seoOptimized: boolean;
      conversionOptimized: boolean;
      loadTimeOptimized: boolean;
    };
    metadata: {
      language: string;
      currency: string;
      countdownEnabled: boolean;
      socialProofEnabled: boolean;
      testimonials: boolean;
      generatedAt: string;
    };
  };
  error?: string;
}

export interface PresellConfig {
  // Basic Info
  productName: string;
  targetCountry: string;
  language: string;
  currency: string;
  affiliateUrl: string;
  
  // Styling
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  // Content
  content: {
    headline: string;
    subheadline: string;
    description: string;
    benefits: string[];
    features: string[];
    ctaButton: string;
    urgencyText: string;
    trustSignals: string[];
    testimonials: PresellTestimonial[];
    faqs: PresellFAQ[];
  };
  
  // Features
  features: {
    countdown: boolean;
    socialProof: boolean;
    testimonials: boolean;
    bonusSection: boolean;
    faqSection: boolean;
    exitIntent: boolean;
  };
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  
  // Tracking
  tracking: {
    googleAnalytics?: string;
    facebookPixel?: string;
    customEvents: boolean;
  };
}

export interface PresellTestimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  image?: string;
  verified: boolean;
}

export interface PresellFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PresellAssets {
  html: string;
  css: string;
  js: string;
  seoTags: string;
  mobileOptimization: string;
  conversionTracking: string;
  socialProofScripts: string;
}

// ================================
// CONFIGURATION TYPES
// ================================

export interface SystemConfiguration {
  validation: {
    defaultTimeout: number; // seconds
    maxRetries: number;
    cacheExpiry: number; // hours
  };
  
  scaling: {
    defaultRoiThreshold: number; // percentage
    defaultEvaluationPeriod: number; // days
    maxDailyScaling: number; // max scaling actions per day
    minConversionsRequired: number;
  };
  
  optimization: {
    characterLimits: typeof CHARACTER_LIMITS;
    defaultTestDuration: number; // days
    minPerformanceSampleSize: number;
  };
  
  security: {
    rateLimitEnabled: boolean;
    maxValidationsPerHour: number;
    auditLogging: boolean;
    encryptionEnabled: boolean;
  };
}

// ================================
// DESIGN TOKENS
// ================================

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    sizes: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
  shadows: {
    light: string;
    medium: string;
    heavy: string;
  };
}