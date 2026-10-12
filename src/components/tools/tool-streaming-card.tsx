'use client';

import React from 'react';
import { Terminal, Cpu, Loader2 } from 'lucide-react';

interface ToolStreamingCardProps {
  toolName: string;
  args?: unknown;
}

/**
 * State 1: Input Streaming
 * Answers: "What tool is being summoned and what arguments are being streamed?"
 * Visual treatment: Blueprint drafting layout, pulsing indigo beam, monospace parameter stream.
 */
export function ToolStreamingCard({ toolName, args }: ToolStreamingCardProps) {
  const argsText =
    args && typeof args === 'object'
      ? JSON.stringify(args, null, 2)
      : typeof args === 'string'
      ? args
      : 'Streaming parameters...';

  return (
    <div className="w-full my-3 p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-indigo-950/30 backdrop-blur-md shadow-lg shadow-indigo-950/20 animate-morph-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                State 1 · Input Streaming
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LIFECYCLE: DRAFTING
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              Summoning Tool: <span className="text-indigo-300 font-mono">{toolName}</span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-[11px] text-indigo-300">
          <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
          <span>Generating Args</span>
        </div>
      </div>

      {/* Monospace Parameter Streamer */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-indigo-400" />
            <span>schema_payload_delta.json</span>
          </span>
          <span className="text-indigo-400/80 animate-pulse">● writing tokens</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-indigo-200/90 overflow-x-auto max-h-36">
          <pre className="whitespace-pre-wrap break-all leading-relaxed">
            {argsText}
            <span className="inline-block w-2 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
          </pre>
        </div>
      </div>

      {/* Explanatory footer */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>The model is structuring validated parameters against the Zod schema.</span>
        <span className="font-mono text-slate-500 text-[10px]">ai-sdk: partial-call</span>
      </div>
    </div>
  );
}
