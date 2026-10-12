'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ScoreGauge({
  score,
  size = 120,
  strokeWidth = 10,
  label = 'Performance',
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Determine color based on standard Lighthouse/Core Web Vitals thresholds
  const getColor = (s: number) => {
    if (s >= 90) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.25)', text: 'text-emerald-400' };
    if (s >= 70) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)', text: 'text-amber-400' };
    return { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.25)', text: 'text-rose-400' };
  };

  const { stroke, glow, text } = getColor(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Animated Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${text}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold text-slate-300 tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}
