'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  Copy,
  Check,
  Target,
  Sparkles,
  Award,
} from 'lucide-react';
import type { LeadScoreResult } from '@/types/tools';
import { ScoreGauge } from './score-gauge';

interface LeadScoreCardProps {
  data: LeadScoreResult;
}

/**
 * Generative UI Component for scoreLeadPipeline Tool
 * Stretch Goal: Multi-tool selection + Small chart representation of fit factors & conversion probability
 */
export function LeadScoreCard({ data }: LeadScoreCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Lead Qualification for ${data.companyDomain}: ${data.qualificationScore}/100 (${data.tier}). Estimated Annual Value: ${data.estimatedAnnualValue}. Playbook: ${data.recommendedPlaybook}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/95 via-indigo-950/20 to-slate-950/95 backdrop-blur-xl shadow-2xl shadow-indigo-950/25 overflow-hidden animate-morph-in">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
            <Target className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                Tool Result · Lead Qualification Pipeline
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                scoreLeadPipeline
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{data.companyDomain}</span>
            </h3>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="p-5 space-y-4">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 items-center">
          <div className="flex justify-center md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
            <ScoreGauge score={data.qualificationScore} size={110} strokeWidth={9} label="Fit Index" />
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-4 h-4 text-violet-400" />
                {data.tier}
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                Est. Value: {data.estimatedAnnualValue}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {data.recommendedPlaybook}
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> {data.teamSize} team headcount
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> {data.trafficTier.toUpperCase()} traffic
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {data.budgetRange.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Stretch Goal Chart: Hand-rolled SVG Horizontal Fit Factor Bar Chart */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Fit Factor Decomposition (Chart)
            </h4>
            <span className="text-xs font-mono text-indigo-300">
              Conversion Probability: <strong className="text-emerald-400">{data.conversionProbability}%</strong>
            </span>
          </div>

          <div className="space-y-3">
            {/* Traffic Fit */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Search Traffic Potential</span>
                <span className="font-mono text-cyan-400">{data.fitFactors.trafficFit} / 40 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(data.fitFactors.trafficFit / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* Budget Fit */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Budget Alignment</span>
                <span className="font-mono text-emerald-400">{data.fitFactors.budgetFit} / 40 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(data.fitFactors.budgetFit / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* Team Fit */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Engineering & Product Capacity</span>
                <span className="font-mono text-violet-400">{data.fitFactors.teamFit} / 20 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(data.fitFactors.teamFit / 20) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Drivers */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Identified Opportunity Drivers
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {data.keyDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
