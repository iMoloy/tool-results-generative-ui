import { z } from 'zod';
import type { LeadScoreResult, ToolErrorPayload } from '@/types/tools';

/**
 * Zod Schema for scoreLeadPipeline Tool
 * Qualifies enterprise inbound leads based on traffic, team capacity, and budget tier.
 */
export const scoreLeadInputSchema = z.object({
  companyDomain: z
    .string()
    .describe('Domain or brand name of the target prospective client, e.g. "acme-corp.com"'),
  teamSize: z
    .number()
    .int()
    .min(1)
    .describe('Headcount of the engineering, marketing, or product team (e.g. 25)'),
  trafficTier: z
    .enum(['starter', 'growth', 'enterprise'])
    .describe('Monthly traffic bracket: starter (<50k), growth (50k-500k), enterprise (500k+)'),
  budgetRange: z
    .enum(['tier_starter', 'tier_growth', 'tier_enterprise'])
    .describe('Monthly budget tier: tier_starter ($1k-$5k), tier_growth ($5k-$20k), tier_enterprise ($20k+)'),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadInputSchema>;

/**
 * Executes lead qualification and pipeline scoring.
 */
export async function executeScoreLead(
  input: ScoreLeadInput
): Promise<LeadScoreResult | { isError: true; error: ToolErrorPayload }> {
  // Artificial server processing latency
  await new Promise((resolve) => setTimeout(resolve, 950));

  if (input.companyDomain.includes('invalid') || input.teamSize <= 0) {
    return {
      isError: true,
      error: {
        code: 'ERR_INVALID_LEAD_DATA',
        message: `Validation failed for prospect "${input.companyDomain}"`,
        details: 'The specified company profile could not be verified in firmographic data registries.',
        suggestedFix: 'Provide an active company domain with at least 1 verified team member.',
        target: input.companyDomain,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Calculate weighted fit scores
  const trafficWeight = input.trafficTier === 'enterprise' ? 40 : input.trafficTier === 'growth' ? 28 : 12;
  const budgetWeight = input.budgetRange === 'tier_enterprise' ? 40 : input.budgetRange === 'tier_growth' ? 25 : 10;
  const teamWeight = Math.min(20, Math.floor(input.teamSize * 0.8));

  const totalScore = Math.min(99, trafficWeight + budgetWeight + teamWeight);

  let tier: LeadScoreResult['tier'] = 'Tier 3 — Self-Service / Nurture';
  let probability = 35;
  let estimatedArr = '$12,000 / yr';
  let playbook = 'Automated onboarding drip and product-led self-service trial.';

  if (totalScore >= 80) {
    tier = 'Tier 1 — High Priority Enterprise';
    probability = 88;
    estimatedArr = '$72,000 / yr';
    playbook = 'Direct Account Executive outbound, white-glove technical POC, and custom SLA proposal.';
  } else if (totalScore >= 55) {
    tier = 'Tier 2 — Growth Account';
    probability = 64;
    estimatedArr = '$36,000 / yr';
    playbook = 'High-touch demo call, ROI calculator assessment, and team seat expansion package.';
  }

  const result: LeadScoreResult = {
    companyDomain: input.companyDomain,
    trafficTier: input.trafficTier,
    teamSize: input.teamSize,
    budgetRange: input.budgetRange,
    qualificationScore: totalScore,
    tier,
    conversionProbability: probability,
    estimatedAnnualValue: estimatedArr,
    fitFactors: {
      trafficFit: trafficWeight,
      teamFit: teamWeight,
      budgetFit: budgetWeight,
    },
    recommendedPlaybook: playbook,
    keyDrivers: [
      `Traffic bracket (${input.trafficTier}) signals high search volume upside.`,
      `Budget commitment (${input.budgetRange.replace('_', ' ')}) aligns with enterprise tier.`,
      `Headcount (${input.teamSize}) indicates active technical & marketing resources.`,
    ],
  };

  return result;
}
