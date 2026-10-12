/**
 * Tool Results & Generative UI Type Definitions
 * FE-07: Frontend AI Engineering
 */

export type ToolLifecycleState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error';

export type VitalRating = 'good' | 'needs-improvement' | 'poor';

export interface VitalMetric {
  name: string;
  shortName: 'LCP' | 'INP' | 'CLS' | 'TTFB';
  value: number;
  formatted: string;
  rating: VitalRating;
  thresholdGood: string;
  description: string;
}

export interface ExtractedMetaTags {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType?: string;
  ogImage?: string;
  viewport?: string;
}

export interface AuditFinding {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'performance' | 'seo' | 'accessibility' | 'security';
  title: string;
  impact: string;
  recommendation: string;
  estimatedSavings?: string;
}

export interface WebsiteAuditResult {
  targetUrl: string;
  auditDepth: 'quick' | 'comprehensive';
  targetMetric: string;
  timestamp: string;
  overallScore: number;
  status: 'passed' | 'warning' | 'critical';
  vitals: {
    lcp: VitalMetric;
    inp: VitalMetric;
    cls: VitalMetric;
    ttfb: VitalMetric;
  };
  meta: ExtractedMetaTags;
  findings: AuditFinding[];
  summary: {
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    estimatedLcpSavingsMs: number;
  };
}

export interface LeadScoreResult {
  companyDomain: string;
  trafficTier: 'starter' | 'growth' | 'enterprise';
  teamSize: number;
  budgetRange: 'tier_starter' | 'tier_growth' | 'tier_enterprise';
  qualificationScore: number; // 0 - 100
  tier: 'Tier 1 — High Priority Enterprise' | 'Tier 2 — Growth Account' | 'Tier 3 — Self-Service / Nurture';
  conversionProbability: number; // percentage e.g. 78%
  estimatedAnnualValue: string;
  fitFactors: {
    trafficFit: number;
    teamFit: number;
    budgetFit: number;
  };
  recommendedPlaybook: string;
  keyDrivers: string[];
}

export interface ToolErrorPayload {
  code: string;
  message: string;
  details?: string;
  suggestedFix?: string;
  target?: string;
  timestamp: string;
}
