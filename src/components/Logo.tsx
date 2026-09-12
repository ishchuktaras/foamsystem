// src/components/Logo.tsx
import React from 'react'

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export default function Logo({ className = "h-10 w-auto", collapsed = false }: LogoProps) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center bg-[#FF4F00] text-white font-black italic rounded-xl h-10 w-10 text-xl shadow-md border border-orange-600 relative overflow-hidden">
        <div className="absolute opacity-20 -left-1 -top-1">
          <svg viewBox="0 0 100 100" className="w-12 h-12" fill="white"><path d="M 35 95 L 65 45 L 40 45 L 75 0 L 45 45 L 70 45 Z" /></svg>
        </div>
        <span className="relative z-10 skew-x-[-10deg]">RS</span>
      </div>
    )
  }

  return (
    // fill: currentColor umožní měnit barvu slova "IZOLACE" pomocí Tailwind tříd (text-white nebo text-black)
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 120" className={className}>
      <defs>
        <style>
          {`
            .text-izolace { font-family: 'Impact', 'Arial Black', sans-serif; font-size: 65px; font-weight: 900; font-style: italic; fill: currentColor; }
            .text-rs { font-family: 'Impact', 'Arial Black', sans-serif; font-size: 65px; font-weight: 900; font-style: italic; fill: #FF4F00; }
            .bolt { fill: #FF4F00; }
            .subtitle { font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; fill: #A0A0A0; letter-spacing: 2px; }
          `}
        </style>
      </defs>
      <g transform="skewX(-15) translate(30, 20)">
        <path className="bolt" d="M 35 95 L 65 45 L 40 45 L 75 0 L 45 45 L 70 45 Z" />
        <text x="85" y="80" className="text-izolace">IZOLACE</text>
        <text x="350" y="80" className="text-rs">RS</text>
        <text x="90" y="105" className="subtitle">STŘÍKANÉ IZOLACE</text>
      </g>
    </svg>
  )
}