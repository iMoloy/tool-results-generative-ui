'use client';

import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Clock, Globe, ArrowRight } from 'lucide-react';

interface ToolExecutingCardProps {
  toolName: string;
  args: Record<string, unknown> | unknown;
}

/**
 * State 2: Input Available / Running
 * Answers: "What is the tool doing right now? With what validated input?"
 * Visual treatment: Live execution radar, animated pipeline checklist, validated payload chips.
 */
export function ToolExecutingCard({ toolName, args }: ToolExecutingCardProps) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Format arguments into inspectable pills
  const parsedArgs = (args && typeof args === 'object' ? args : {}) as Record<string, unknown>;
  const targetUrl = typeof parsedArgs.url === 'string' ? parsedArgs.url : null;
  const companyDomain = typeof parsedArgs.companyDomain === 'string' ? parsedArgs.companyDomain : null;
  const targetLabel = targetUrl || companyDomain || 'server payload';

  return (
    <div className="w-full my-3 p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-slate-950/80 backdrop-blur-md shadow-lg shadow-cyan-950/20 animate-morph-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Activity className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                State 2 · Input Available / Running
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIFECYCLE: EXECUTING
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Executing {toolName}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-mono text-xs truncate max-w-[200px] sm:max-w-xs">
                {targetLabel}
              </span>
            </h4>
          </div>
        </div>

        {/* Live Elapsed Counter */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>{(elapsedMs / 1000).toFixed(1)}s</span>
        </div>
      </div>

      {/* Validated Input Parameters Grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Target Destination
          </span>
          <div className="flex items-center gap-1.5 font-mono text-cyan-200">
            <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{targetLabel}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Validated Parameter Set
          </span>
          <div className="flex flex-wrap gap-1">
            {Object.entries(parsedArgs).map(([key, val]) => (
              <span
                key={key}
                className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300"
              >
                {key}={String(val)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-step pipeline tracker */}
      <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-cyan-900/30 space-y-1.5 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>✓ Zod schema parsed and strictly validated</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-300">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
          <span>⟳ Server worker executing asynchronous operation...</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
          <span>○ Synthesizing diagnostics and generating component payload</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>The server is running the execute() function. Morphing to component view when output is ready.</span>
        <span className="font-mono text-slate-500 text-[10px]">ai-sdk: call</span>
      </div>
    </div>
  );
}
