'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Sparkles,
  Bot,
  Activity,
  Layers,
  ShieldAlert,
  ArrowRight,
  Code2,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { ChatMessageItem } from './chat-message-item';
import { ChatInput } from './chat-input';
import { StateMachineInspector } from './state-machine-inspector';
import type { ToolLifecycleState } from '@/types/tools';

export function ChatInterface() {
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    append,
  } = useChat({
    api: '/api/chat',
    maxSteps: 5,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Derive current active tool state for the StateMachineInspector
  let activeToolState: ToolLifecycleState | null = null;
  let activeToolName = 'auditWebsite';

  if (messages.length > 0) {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
    if (lastAssistantMsg?.toolInvocations && lastAssistantMsg.toolInvocations.length > 0) {
      const lastInv = lastAssistantMsg.toolInvocations[lastAssistantMsg.toolInvocations.length - 1];
      activeToolName = lastInv.toolName;
      if (lastInv.state === 'partial-call') {
        activeToolState = 'input-streaming';
      } else if (lastInv.state === 'call') {
        activeToolState = 'input-available';
      } else if (lastInv.state === 'result') {
        const res = lastInv.result;
        const isError =
          Boolean(res && typeof res === 'object' && ('isError' in res || 'error' in res)) ||
          res?.status === 'error';
        activeToolState = isError ? 'output-error' : 'output-available';
      }
    }
  }

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
    // Automatically submit for seamless testing experience
    append({
      role: 'user',
      content: prompt,
    });
  };

  const handleRetry = (targetUrl?: string) => {
    const retryTarget = targetUrl || 'https://flyrank.io';
    append({
      role: 'user',
      content: `Audit ${retryTarget} for technical SEO and Core Web Vitals`,
    });
  };

  const handleConfirmAction = (toolCallId: string, approved: boolean) => {
    append({
      role: 'user',
      content: approved
        ? 'Authorization granted: proceed with deploying image compression fix.'
        : 'Deployment cancelled by operator.',
    });
  };

  const handleClear = () => {
    setMessages([]);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#080b11] text-slate-400">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 animate-spin text-indigo-500" />
          <span>Initializing Generative UI runtime...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#080b11] text-slate-100 bg-grid-pattern overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">
                FlyRank Generative UI Studio
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                FE-07
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              Server-side tools · Typed Zod schemas · Lifecycle state machine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">Lifecycle: 4-State Machine Active</span>
          </div>

          <button
            onClick={handleClear}
            title="Reset conversation"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col items-center scrollbar-thin">
        <div className="w-full max-w-4xl flex-1 flex flex-col">
          {/* Real-time State Machine Telemetry Monitor */}
          <div className="mb-4">
            <StateMachineInspector
              currentState={activeToolState}
              toolName={activeToolName}
            />
          </div>

          {/* Welcome Screen if no messages */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center py-6 animate-morph-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-xl shadow-indigo-950/40">
                <Sparkles className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                Generative UI & Server Tool Results
              </h2>
              <p className="max-w-xl text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Experience real AI products with server-side tools defined via typed Zod schemas.
                Watch tool lifecycles transition from parameter streaming to rich interactive components and resilient error cards.
              </p>

              {/* State Machine Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-6 text-left">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-indigo-500/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    State 1
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">Input Streaming</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Model streams JSON parameters token by token in a distinct blueprint view.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    State 2
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">Input Available / Running</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Server executes with live radar spinner, progress checklist, and duration ticker.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    State 3
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">Output Available</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Renders rich SVG Score Gauges, Core Web Vitals tiles, and findings tables.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                    State 4
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">Output Error</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Designed error card with actionable remediation and instant retry buttons.
                  </p>
                </div>
              </div>

              {/* Starter Buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() =>
                    handleSelectPrompt(
                      'Perform an autonomous technical SEO and Core Web Vitals audit for https://flyrank.io'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🚀 Run Live Audit for flyrank.io</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() =>
                    handleSelectPrompt(
                      'Audit https://invalid-domain-error.test to verify designed error handling'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>⚠️ Test Designed Error State</span>
                </button>
              </div>
            </div>
          ) : (
            /* Message Stream */
            <div className="space-y-4 py-2">
              {messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  isStreaming={isLoading}
                  onRetry={handleRetry}
                  onConfirmAction={handleConfirmAction}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Input Bar */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl pt-2 z-10 flex-shrink-0">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          onSelectPrompt={handleSelectPrompt}
          onClearChat={handleClear}
        />
      </footer>
    </div>
  );
}
