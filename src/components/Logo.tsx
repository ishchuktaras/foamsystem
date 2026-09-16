// src/components/Logo.tsx
import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

// Výrazně zvětšené responzivní třídy pro výšku (h-12 mobil, h-16 tablet, h-20 až h-24 PC)
export default function Logo({ className = "h-12 md:h-16 lg:h-20 xl:h-24 w-auto", collapsed = false }: LogoProps) {
  if (collapsed) {
    // Původní design pro sbalený Sidebar
    return (
      <div className="flex items-center justify-center bg-[#FF4F00] text-white font-black italic rounded-xl h-10 w-10 text-xl shadow-md border border-orange-600 relative overflow-hidden shrink-0">
        <div className="absolute opacity-20 -left-1 -top-1">
          <svg viewBox="0 0 100 100" className="w-12 h-12" fill="white">
            <path d="M 35 95 L 65 45 L 40 45 L 75 0 L 45 45 L 70 45 Z" />
          </svg>
        </div>
        <span className="relative z-10 skew-x-[-10deg]">RS</span>
      </div>
    )
  }

  // Rozbalený stav - použití optimalizované Next.js Image komponenty
  return (
    <Image 
      src="/logo-orange.svg" 
      alt="IZOLACE RS" 
      width={385} 
      height={306} 
      className={className}
      priority
    />
  )
}