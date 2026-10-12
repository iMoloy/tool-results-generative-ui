'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, Zap, Loader2 } from 'lucide-react';
import type { ConfirmFixInput, ConfirmFixResult } from '@/lib/tools/confirm-fix';

interface ConfirmationCardProps {
  toolCallId: string;
  args: ConfirmFixInput;
  result?: ConfirmFixResult;
  onConfirm?: (confirmed: boolean) => void;
}

export function ConfirmationCard({
  args,
  result,
  onConfirm,
}: ConfirmationCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedState, setConfirmedState] = useState<'pending' | 'approved' | 'rejected'>(
    result ? (result.status === 'applied' ? 'approved' : 'rejected') : 'pending'
  );

  const handleAction = (approved: boolean) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setConfirmedState(approved ? 'approved' : 'rejected');
      setIsSubmitting(false);
      onConfirm?.(approved);
    }, 500);
  };

  return (
    <div className="w-full my-3 p-4.5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-950/90 backdrop-blur-md shadow-xl shadow-amber-950/20 animate-morph-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Human-in-the-Loop Confirmation
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Action Tool
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
              Production Optimization Gate
            </h4>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Target: {args.targetUrl || 'flyrank.io'}
        </span>
      </div>

      {/* Fix Summary */}
      <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-200">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Proposed Fix: {args.fixType}</span>
          </span>
          <span className="text-emerald-400 font-mono text-[11px]">
            {args.estimatedLcpImpact}
          </span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          {args.summary}
        </p>
      </div>

      {/* Confirmation State Controls */}
      <div className="mt-3.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        {confirmedState === 'pending' ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-400">
              Confirm before modifying production asset pipeline?
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={isSubmitting}
                onClick={() => handleAction(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-3 h-3 text-rose-400" />
                <span>Dismiss</span>
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-md shadow-amber-900/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                <span>Authorize Deployment</span>
              </button>
            </div>
          </div>
        ) : confirmedState === 'approved' ? (
          <div className="flex items-center justify-between w-full text-xs text-emerald-400">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Optimization approved and scheduled to production pipeline!</span>
            </div>
            {result?.deploymentId && (
              <span className="font-mono text-[10px] text-slate-400">
                Deploy ID: {result.deploymentId}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <XCircle className="w-4 h-4" />
            <span>Action cancelled by user. No production changes were applied.</span>
          </div>
        )}
      </div>
    </div>
  );
}
