'use client';

import React, { useRef, useEffect } from 'react';
import { Send, Square, Sparkles, RefreshCcw, ShieldAlert, Target, Globe } from 'lucide-react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  onSelectPrompt: (prompt: string) => void;
  onClearChat?: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  onSelectPrompt,
  onClearChat,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const presets = [
    {
      label: 'Audit flyrank.io',
      icon: Globe,
      prompt: 'Perform an autonomous technical SEO and Core Web Vitals audit for https://flyrank.io',
      color: 'hover:border-indigo-500/50 hover:text-indigo-300',
    },
    {
      label: 'Trigger Error State',
      icon: ShieldAlert,
      prompt: 'Audit https://invalid-domain-error.test to verify designed error handling',
      color: 'hover:border-rose-500/50 hover:text-rose-300',
    },
    {
      label: 'Score Enterprise Lead',
      icon: Target,
      prompt: 'Score the sales pipeline lead for stripe.com with 250 headcount and enterprise tier traffic',
      color: 'hover:border-violet-500/50 hover:text-violet-300',
    },
    {
      label: 'Confirm Fix Deployment',
      icon: Sparkles,
      prompt: 'Prepare an image optimization fix for https://flyrank.io and request authorization',
      color: 'hover:border-amber-500/50 hover:text-amber-300',
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Quick Prompt Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex-shrink-0">
          Test Benches:
        </span>
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onSelectPrompt(preset.prompt)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer ${preset.color}`}
            >
              <Icon className="w-3 h-3" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Container */}
      <form onSubmit={handleSubmit} className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask to audit a website, qualify a lead, or test failure mode..."
          rows={2}
          className="w-full bg-transparent px-4 pt-3.5 pb-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
        />

        {/* Bottom Toolbar inside input */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline text-[11px] font-mono text-slate-400">
              Shift + Enter for new line • Enter to send
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onClearChat && (
              <button
                type="button"
                onClick={onClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-all cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950/40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
