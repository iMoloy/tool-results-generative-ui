import { tool } from 'ai';
import { auditWebsiteInputSchema, executeWebsiteAudit } from './audit-website';
import { scoreLeadInputSchema, executeScoreLead } from './score-lead';
import { confirmFixInputSchema, executeOptimizationFix } from './confirm-fix';

export * from './audit-website';
export * from './score-lead';
export * from './confirm-fix';

/**
 * Server-side tools bundle configured for streamText in /api/chat
 */
export const serverTools = {
  auditWebsite: tool({
    description:
      'Audits a target website URL for Core Web Vitals (LCP, INP, CLS, TTFB), technical SEO health, meta tag extraction, and diagnostics. Set simulateError: true or use "invalid-domain-error" to test error handling.',
    parameters: auditWebsiteInputSchema,
    execute: executeWebsiteAudit,
  }),
  scoreLeadPipeline: tool({
    description:
      'Scores an enterprise prospective lead based on traffic volume, team headcount, and budget capacity, providing pipeline qualification metrics.',
    parameters: scoreLeadInputSchema,
    execute: executeScoreLead,
  }),
  confirmOptimizationFix: tool({
    description:
      'Requests user confirmation before deploying an automated Core Web Vitals or SEO fix to production.',
    parameters: confirmFixInputSchema,
    execute: async (input) => executeOptimizationFix(input, true),
  }),
};
