// src/components/Logo.tsx
import React from 'react'

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

// Přidali jsme responzivní třídy přímo do výchozí hodnoty (h-10 pro mobil, md:h-12 pro tablet, lg:h-14 pro PC)
export default function Logo({ className = "h-10 md:h-12 lg:h-14 w-auto", collapsed = false }: LogoProps) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center bg-[#FF4F00] text-white font-black italic rounded-xl h-10 w-10 text-xl shadow-md border border-orange-600 relative overflow-hidden">
        <div className="absolute opacity-20 -left-1 -top-1">
          <svg viewBox="0 0 100 100" className="w-12 h-12" fill="white">
            <path d="M 35 95 L 65 45 L 40 45 L 75 0 L 45 45 L 70 45 Z" />
          </svg>
        </div>
        <span className="relative z-10 skew-x-[-10deg]">RS</span>
      </div>
    )
  }

  return (
    // Zvětšený viewBox na 550, aby se širší font Roboto neořezával na pravé straně
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 130" className={className}>
      <defs>
        <style>
          {`
            .text-izolace { font-family: 'Roboto', sans-serif; font-size: 65px; font-weight: 700; font-style: italic; fill: currentColor; }
            .text-rs { font-family: 'Roboto', sans-serif; font-size: 65px; font-weight: 900; font-style: italic; fill: #FF4F00; }
            .bolt { fill: #FF4F00; }
            .subtitle { font-family: 'Roboto', sans-serif; font-size: 16px; font-weight: 700; fill: #A0A0A0; letter-spacing: 2.5px; }
          `}
        </style>
      </defs>
      <g transform="skewX(-15) translate(30, 20)">
        <path className="bolt" d="M 35 95 L 65 45 L 40 45 L 75 0 L 45 45 L 70 45 Z" />
        
        {/* Použití tspan řeší automatickou mezeru (dx="15") nezávisle na šířce textu */}
        <text y="80">
          <tspan x="85" className="text-izolace">IZOLACE</tspan>
          <tspan dx="15" className="text-rs">RS</tspan>
        </text>
        
        {/* Podtitul zarovnaný k začátku nápisu */}
        <text x="90" y="105" className="subtitle">STŘÍKANÉ IZOLACE</text>
      </g>
    </svg>
  )
}