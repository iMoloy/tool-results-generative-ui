'use client';

import React from 'react';
import { Terminal, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { ToolLifecycleState } from '@/types/tools';

interface StateMachineInspectorProps {
  currentState?: ToolLifecycleState | null;
  toolName?: string;
}

export function StateMachineInspector({
  currentState,
  toolName = 'auditWebsite',
}: StateMachineInspectorProps) {
  const states: Array<{
    id: ToolLifecycleState;
    name: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }> = [
    {
      id: 'input-streaming',
      name: '1. Input Streaming',
      sublabel: 'Token-by-token args',
      icon: Terminal,
      accent: 'indigo',
    },
    {
      id: 'input-available',
      name: '2. Input Available',
      sublabel: 'Server executing',
      icon: Activity,
      accent: 'cyan',
    },
    {
      id: 'output-available',
      name: '3. Output Available',
      sublabel: 'Generative UI rendered',
      icon: CheckCircle2,
      accent: 'emerald',
    },
    {
      id: 'output-error',
      name: '4. Output Error',
      sublabel: 'Designed error card',
      icon: AlertTriangle,
      accent: 'rose',
    },
  ];

  return (
    <div className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Tool Parts State Machine Monitor
          </h4>
        </div>
        {toolName && (
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
            Target Tool: {toolName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {states.map((st) => {
          const isActive = currentState === st.id;
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              className={`p-2.5 rounded-lg border transition-all duration-200 ${
                isActive
                  ? st.id === 'output-error'
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/30'
                    : st.id === 'output-available'
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                    : st.id === 'input-available'
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                    : 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-900/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? st.id === 'output-error'
                        ? 'text-rose-400'
                        : st.id === 'output-available'
                        ? 'text-emerald-400'
                        : st.id === 'input-available'
                        ? 'text-cyan-400'
                        : 'text-indigo-400'
                      : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-xs font-bold truncate ${
                    isActive ? 'text-slate-100' : 'text-slate-400'
                  }`}
                >
                  {st.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">{st.sublabel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
