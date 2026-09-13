// src/components/admin/BentoGrid.tsx
'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type BentoCardProps = {
  title: string;
  value: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
  className?: string;
}

export function BentoCard({ title, value, subtitle, href, icon, className = '' }: BentoCardProps) {
  return (
    <Link 
      href={href}
      className={`group relative overflow-hidden rounded-3xl bg-[#FEFEFA] p-6 border border-zinc-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#FF4F00]/50 hover:-translate-y-1 flex flex-col justify-between ${className}`}
    >
      {/* Background glow effect on hover */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FF4F00]/10 blur-2xl transition-all duration-500 group-hover:bg-[#FF4F00]/20 group-hover:scale-150 pointer-events-none" />

      <div className="flex justify-between items-start relative z-10 mb-8">
        <div className="p-4 rounded-2xl bg-zinc-100/80 border border-zinc-200/50 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#FF4F00] group-hover:text-white transition-all duration-300">
          <ArrowUpRight size={20} />
        </div>
      </div>

      <div className="relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">{title}</span>
        <h3 className="text-2xl font-black text-[#000000] tracking-tight mb-1 group-hover:text-[#FF4F00] transition-colors">
          {value}
        </h3>
        <p className="text-sm font-medium text-zinc-500">{subtitle}</p>
      </div>
    </Link>
  )
}