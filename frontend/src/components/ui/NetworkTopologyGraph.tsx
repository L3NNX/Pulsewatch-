'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NetworkTopologyGraphProps {
  className?: string;
  size?: number;
}

export function NetworkTopologyGraph({ className, size = 420 }: NetworkTopologyGraphProps) {
  // Center is (210, 210)
  const center = size / 2;
  const radius = 140;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center border border-[rgba(58,58,56,0.20)] bg-[#F7F7F5] rounded-full p-4 overflow-hidden select-none',
        className
      )}
      style={{ width: size, height: size, maxWidth: '100%' }}
    >
      {/* Background crosshair coordinates */}
      <div className="absolute inset-x-4 top-1/2 h-[1px] bg-[rgba(58,58,56,0.15)] pointer-events-none" />
      <div className="absolute inset-y-4 left-1/2 w-[1px] bg-[rgba(58,58,56,0.15)] pointer-events-none" />

      {/* SVG Network Graphic */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer subtle concentric guide rings */}
        <circle
          cx={center}
          cy={center}
          r={radius + 35}
          fill="none"
          stroke="rgba(58, 58, 56, 0.12)"
          strokeWidth="1"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(58, 58, 56, 0.25)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx={center}
          cy={center}
          r={radius - 50}
          fill="none"
          stroke="rgba(58, 58, 56, 0.12)"
          strokeWidth="1"
        />

        {/* Orbiting Group with 20s linear infinite rotation */}
        <g
          className="animate-orbit"
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          {/* Node 1 (0 deg: right) */}
          <line
            x1={center}
            y1={center}
            x2={center + radius}
            y2={center}
            stroke="#1A3C2B"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <circle
            cx={center + radius}
            cy={center}
            r="8"
            fill="#F7F7F5"
            stroke="#1A3C2B"
            strokeWidth="1.5"
          />
          <circle
            cx={center + radius}
            cy={center}
            r="3"
            fill="#9EFFBF"
          />

          {/* Node 2 (120 deg) */}
          <line
            x1={center}
            y1={center}
            x2={center + radius * Math.cos((120 * Math.PI) / 180)}
            y2={center + radius * Math.sin((120 * Math.PI) / 180)}
            stroke="#1A3C2B"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <circle
            cx={center + radius * Math.cos((120 * Math.PI) / 180)}
            cy={center + radius * Math.sin((120 * Math.PI) / 180)}
            r="8"
            fill="#F7F7F5"
            stroke="#1A3C2B"
            strokeWidth="1.5"
          />
          <circle
            cx={center + radius * Math.cos((120 * Math.PI) / 180)}
            cy={center + radius * Math.sin((120 * Math.PI) / 180)}
            r="3"
            fill="#FF8C69"
          />

          {/* Node 3 (240 deg) */}
          <line
            x1={center}
            y1={center}
            x2={center + radius * Math.cos((240 * Math.PI) / 180)}
            y2={center + radius * Math.sin((240 * Math.PI) / 180)}
            stroke="#1A3C2B"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <circle
            cx={center + radius * Math.cos((240 * Math.PI) / 180)}
            cy={center + radius * Math.sin((240 * Math.PI) / 180)}
            r="8"
            fill="#F7F7F5"
            stroke="#1A3C2B"
            strokeWidth="1.5"
          />
          <circle
            cx={center + radius * Math.cos((240 * Math.PI) / 180)}
            cy={center + radius * Math.sin((240 * Math.PI) / 180)}
            r="3"
            fill="#F4D35E"
          />
        </g>

        {/* Central 16px Solid Forest Green Node */}
        <circle
          cx={center}
          cy={center}
          r="12"
          fill="#F7F7F5"
          stroke="#1A3C2B"
          strokeWidth="1.5"
        />
        <circle
          cx={center}
          cy={center}
          r="8"
          fill="#1A3C2B"
        />
      </svg>

      {/* Technical coordinate annotations */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-[#3A3A38]/50">
        SYS.TOPOLOGY.ORBIT // 20s_CYCLE
      </div>
    </div>
  );
}

export default NetworkTopologyGraph;

