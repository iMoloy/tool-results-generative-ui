'use client';

import React from 'react';
import type { ToolInvocation } from 'ai';
import { ToolStreamingCard } from './tool-streaming-card';
import { ToolExecutingCard } from './tool-executing-card';
import { ToolErrorCard } from './tool-error-card';
import { WebsiteAuditCard } from './website-audit-card';
import { LeadScoreCard } from './lead-score-card';
import { ConfirmationCard } from './confirmation-card';
import type { WebsiteAuditResult, LeadScoreResult, ToolLifecycleState } from '@/types/tools';
import type { ConfirmFixInput, ConfirmFixResult } from '@/lib/tools/confirm-fix';

interface ToolInvocationRendererProps {
  invocation: ToolInvocation;
  onRetry?: (targetUrl?: string) => void;
  onConfirmAction?: (toolCallId: string, approved: boolean) => void;
}

/**
 * State Machine Router for Tool Parts Lifecycle
 * Evaluates the 4 distinct lifecycle states and renders the appropriate visual treatment:
 * 1. input-streaming: ToolStreamingCard
 * 2. input-available: ToolExecutingCard
 * 3. output-available: Generative UI Component (WebsiteAuditCard / LeadScoreCard / ConfirmationCard)
 * 4. output-error: ToolErrorCard
 */
export function ToolInvocationRenderer({
  invocation,
  onRetry,
  onConfirmAction,
}: ToolInvocationRendererProps) {
  // State 1: Input Streaming
  if (invocation.state === 'partial-call') {
    return (
      <div className="w-full tool-lifecycle-container transition-all duration-200 ease-out">
        <ToolStreamingCard toolName={invocation.toolName} args={invocation.args} />
      </div>
    );
  }

  // State 2: Input Available / Running
  if (invocation.state === 'call') {
    return (
      <div className="w-full tool-lifecycle-container transition-all duration-200 ease-out">
        <ToolExecutingCard toolName={invocation.toolName} args={invocation.args} />
      </div>
    );
  }

  // State 3 or 4: invocation.state === 'result' (discriminated union narrowed by TypeScript)
  const result = invocation.result;
  const isError =
    Boolean(result && typeof result === 'object' && ('isError' in result || 'error' in result)) ||
    result?.status === 'error';

  // State 4: Output Error
  if (isError) {
    return (
      <div className="w-full tool-lifecycle-container transition-all duration-200 ease-out">
        <ToolErrorCard
          toolName={invocation.toolName}
          error={
            result && typeof result === 'object' && 'error' in result
              ? (result as Record<string, unknown>).error
              : result
          }
          onRetry={onRetry}
        />
      </div>
    );
  }

  // State 3: Output Available (Generative UI Components)
  return (
    <div className="w-full tool-lifecycle-container transition-all duration-200 ease-out">
      {invocation.toolName === 'auditWebsite' && (
        <WebsiteAuditCard data={result as WebsiteAuditResult} />
      )}

      {invocation.toolName === 'scoreLeadPipeline' && (
        <LeadScoreCard data={result as LeadScoreResult} />
      )}

      {invocation.toolName === 'confirmOptimizationFix' && (
        <ConfirmationCard
          toolCallId={invocation.toolCallId}
          args={invocation.args as ConfirmFixInput}
          result={result as ConfirmFixResult}
          onConfirm={(approved) => onConfirmAction?.(invocation.toolCallId, approved)}
        />
      )}

      {invocation.toolName !== 'auditWebsite' &&
        invocation.toolName !== 'scoreLeadPipeline' &&
        invocation.toolName !== 'confirmOptimizationFix' && (
          <div className="my-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
            <span className="font-bold text-indigo-400 block mb-1">
              Tool Result: {invocation.toolName}
            </span>
            <pre className="font-mono overflow-x-auto text-[11px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
    </div>
  );
}
