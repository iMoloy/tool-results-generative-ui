'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, CheckCircle, ShieldAlert, Globe } from 'lucide-react';
import type { ToolErrorPayload } from '@/types/tools';

interface ToolErrorCardProps {
  toolName: string;
  error: ToolErrorPayload | Error | unknown;
  onRetry?: (fallbackTarget?: string) => void;
}

/**
 * State 4: Output Error
 * Answers: "What went wrong and how does the user recover or retry?"
 * Designed error state: Prevents UI crash, explains exact root cause, provides interactive recovery.
 */
export function ToolErrorCard({ toolName, error, onRetry }: ToolErrorCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Normalize error shape
  const parsedError: ToolErrorPayload =
    error && typeof error === 'object' && 'code' in error
      ? (error as ToolErrorPayload)
      : {
          code: 'ERR_EXECUTION_FAILURE',
          message: error instanceof Error ? error.message : 'Tool execution terminated unexpectedly.',
          details: 'An unhandled exception or network timeout halted tool execution.',
          suggestedFix: 'Check network connectivity, verify input parameters, or retry with a valid host.',
          timestamp: new Date().toISOString(),
        };

  return (
    <div className="w-full my-3 p-4 sm:p-5 rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-md shadow-xl shadow-rose-950/25 animate-morph-in">
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-rose-500/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                State 4 · Output Error
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CODE: {parsedError.code}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
              Tool Failed: <span className="text-rose-300 font-mono">{toolName}</span>
            </h4>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-rose-950/70 border border-rose-500/30 text-[10px] font-semibold text-rose-300 uppercase">
          Failed Safely
        </span>
      </div>

      {/* Primary Error Message */}
      <div className="mt-3.5 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200 leading-relaxed font-sans">
        <p className="font-semibold text-rose-100 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          {parsedError.message}
        </p>
        {parsedError.details && (
          <p className="mt-1.5 text-slate-300 text-[11px] leading-normal">
            {parsedError.details}
          </p>
        )}
      </div>

      {/* Remediation Guidance */}
      {parsedError.suggestedFix && (
        <div className="mt-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Recommended Remediation
          </span>
          <div className="flex items-start gap-2 text-slate-300 text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{parsedError.suggestedFix}</span>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={() => onRetry(parsedError.target || undefined)}
              className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/40 text-xs font-semibold text-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Execution</span>
            </button>
          )}

          {onRetry && (
            <button
              onClick={() => onRetry('https://flyrank.io')}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Test with https://flyrank.io</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1 transition-colors py-1 cursor-pointer"
        >
          <span>{showDetails ? 'Hide Diagnostics' : 'Raw Trace'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Diagnostics Payload */}
      {showDetails && (
        <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto max-h-48">
          <pre>{JSON.stringify(parsedError, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
