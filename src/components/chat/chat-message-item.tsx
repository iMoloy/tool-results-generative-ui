'use client';

import React, { useState } from 'react';
import type { Message } from 'ai';
import { Bot, User, Copy, Check, Sparkles } from 'lucide-react';
import { ToolInvocationRenderer } from '../tools/tool-invocation-renderer';

interface ChatMessageItemProps {
  message: Message;
  isStreaming?: boolean;
  onRetry?: (targetUrl?: string) => void;
  onConfirmAction?: (toolCallId: string, approved: boolean) => void;
}

export function ChatMessageItem({
  message,
  isStreaming = false,
  onRetry,
  onConfirmAction,
}: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeString = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Now';

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 my-4 animate-morph-in">
        <div className="max-w-[85%] md:max-w-[70%] flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">You</span>
            <span>•</span>
            <span>{timeString}</span>
          </div>
          <div className="p-3.5 md:p-4 rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-950/40 border border-indigo-500/30 text-sm leading-relaxed break-words">
            {message.content}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-6">
          <User className="w-4 h-4 text-slate-200" />
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex justify-start gap-3 my-4 animate-morph-in">
      <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-1 shadow-md shadow-indigo-950/50">
        <Bot className="w-4 h-4 text-indigo-300" />
      </div>

      <div className="flex-1 max-w-[95%] md:max-w-[88%] flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1.5 text-[11px] text-slate-400">
          <span className="font-semibold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>FlyRank Agent</span>
          </span>
          <span>•</span>
          <span>{timeString}</span>
        </div>

        {/* 1. Render Tool Invocations if present */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="w-full space-y-3 mb-2">
            {message.toolInvocations.map((invocation) => (
              <ToolInvocationRenderer
                key={invocation.toolCallId}
                invocation={invocation}
                onRetry={onRetry}
                onConfirmAction={onConfirmAction}
              />
            ))}
          </div>
        )}

        {/* 2. Render Text Content */}
        {message.content && (
          <div className="w-full p-4 rounded-2xl rounded-tl-sm bg-slate-900/80 text-slate-200 border border-slate-800 text-sm leading-relaxed break-words shadow-md backdrop-blur-md">
            <div className="space-y-2 whitespace-pre-wrap font-sans">
              {message.content}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">Structured Generative Output</span>
              <button
                onClick={handleCopy}
                className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Streaming cursor if still streaming without text */}
        {isStreaming && !message.content && (!message.toolInvocations || message.toolInvocations.length === 0) && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Agent reasoning and preparing tool call...</span>
          </div>
        )}
      </div>
    </div>
  );
}
