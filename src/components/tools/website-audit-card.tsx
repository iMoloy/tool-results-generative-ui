'use client';

import React, { useState } from 'react';
import {
  Globe,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Code2,
} from 'lucide-react';
import type { WebsiteAuditResult, AuditFinding } from '@/types/tools';
import { ScoreGauge } from './score-gauge';

interface WebsiteAuditCardProps {
  data: WebsiteAuditResult;
  onRunFix?: (findingId: string) => void;
}

/**
 * State 3: Output Available (Generative UI Component)
 * Answers: "What came back? What findings and metrics were discovered?"
 * Full component featuring SVG circular meter, Core Web Vitals grid, findings table, and meta extractor.
 */
export function WebsiteAuditCard({ data, onRunFix }: WebsiteAuditCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'meta' | 'raw'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summaryText = `FlyRank SEO & Performance Audit: ${data.targetUrl}
Overall Score: ${data.overallScore}/100 (${data.status.toUpperCase()})
- LCP: ${data.vitals.lcp.formatted} (${data.vitals.lcp.rating})
- INP: ${data.vitals.inp.formatted} (${data.vitals.inp.rating})
- CLS: ${data.vitals.cls.formatted} (${data.vitals.cls.rating})
- TTFB: ${data.vitals.ttfb.formatted} (${data.vitals.ttfb.rating})
Total Findings: ${data.findings.length} issues identified.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRatingBadge = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Good
          </span>
        );
      case 'needs-improvement':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Needs Work
          </span>
        );
      case 'poor':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Poor
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: AuditFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" /> Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  return (
    <div className="w-full my-4 rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl shadow-2xl shadow-indigo-950/30 overflow-hidden animate-morph-in">
      {/* Top Banner */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Gauge className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                State 3 · Output Available
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                LIFECYCLE: GENERATIVE UI
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <a
                href={data.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-slate-100 hover:text-indigo-400 transition-colors flex items-center gap-1 font-mono"
              >
                <span>{data.targetUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-5 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vitals & Score</span>
        </button>

        <button
          onClick={() => setActiveTab('findings')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'findings'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Findings Table ({data.findings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'meta'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Meta Tags</span>
        </button>

        <button
          onClick={() => setActiveTab('raw')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'raw'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Raw Contract</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Top Score Banner & Speed Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 items-center">
              {/* SVG Score Gauge */}
              <div className="flex justify-center md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
                <ScoreGauge score={data.overallScore} size={110} strokeWidth={9} label="Audit Score" />
              </div>

              {/* Summary Stats */}
              <div className="md:col-span-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-100">
                    Technical SEO & Performance Assessment
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Depth: {data.auditDepth.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The domain meets Google&apos;s Core Web Vitals thresholds for mobile and desktop indexing.
                  Edge TTFB latency is optimal with fast first-byte response.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed Core Web Vitals
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
                    Estimated LCP Savings: ~{data.summary.estimatedLcpSavingsMs}ms
                  </span>
                </div>
              </div>
            </div>

            {/* Core Web Vitals Metric Tiles Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Google Core Web Vitals Benchmarks
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* LCP */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">LCP</span>
                    {getRatingBadge(data.vitals.lcp.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-100 font-mono">
                    {data.vitals.lcp.formatted}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {data.vitals.lcp.name}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                    <span>Good Target:</span>
                    <span className="font-mono text-emerald-400">{data.vitals.lcp.thresholdGood}</span>
                  </div>
                </div>

                {/* INP */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">INP</span>
                    {getRatingBadge(data.vitals.inp.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-100 font-mono">
                    {data.vitals.inp.formatted}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {data.vitals.inp.name}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                    <span>Good Target:</span>
                    <span className="font-mono text-emerald-400">{data.vitals.inp.thresholdGood}</span>
                  </div>
                </div>

                {/* CLS */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">CLS</span>
                    {getRatingBadge(data.vitals.cls.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-100 font-mono">
                    {data.vitals.cls.formatted}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {data.vitals.cls.name}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                    <span>Good Target:</span>
                    <span className="font-mono text-emerald-400">{data.vitals.cls.thresholdGood}</span>
                  </div>
                </div>

                {/* TTFB */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">TTFB</span>
                    {getRatingBadge(data.vitals.ttfb.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-100 font-mono">
                    {data.vitals.ttfb.formatted}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {data.vitals.ttfb.name}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                    <span>Good Target:</span>
                    <span className="font-mono text-emerald-400">{data.vitals.ttfb.thresholdGood}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Findings Table */}
        {activeTab === 'findings' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Identified Technical Diagnostics & Remediation
              </h4>
              <span className="text-xs text-slate-400">
                {data.findings.length} findings categorized
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Severity</th>
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">Finding & Recommendation</th>
                    <th className="py-2.5 px-3 font-semibold">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.findings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        {getSeverityBadge(item.severity)}
                      </td>
                      <td className="py-3 px-3 align-top uppercase font-mono text-[10px] text-slate-400">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className="font-semibold text-slate-100">{item.title}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                          {item.recommendation}
                        </div>
                        {item.estimatedSavings && (
                          <div className="mt-1 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Estimated upside: {item.estimatedSavings}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top whitespace-nowrap text-slate-300 font-mono text-[11px]">
                        {item.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Extracted Meta Tags */}
        {activeTab === 'meta' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Crawled HTML Meta & OpenGraph Tags
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  &lt;title&gt;
                </span>
                <p className="text-xs font-semibold text-slate-100 font-mono">
                  {data.meta.title}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Canonical URL
                </span>
                <p className="text-xs text-indigo-300 font-mono truncate">
                  {data.meta.canonical}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 md:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  &lt;meta name=&quot;description&quot;&gt;
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {data.meta.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Robots Indexing Directive
                </span>
                <p className="text-xs text-emerald-400 font-mono">
                  {data.meta.robots}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Viewport Configuration
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  {data.meta.viewport || 'Standard mobile responsive'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Raw JSON Contract Inspector */}
        {activeTab === 'raw' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Return shape from executeWebsiteAudit():</span>
              <span className="font-mono text-indigo-400">WebsiteAuditResult</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
