// src/components/admin/DashboardCard.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
  hoverClass: string;
}

export default function DashboardCard({ title, value, subtitle, href, icon, colorClass, hoverClass }: DashboardCardProps) {
  return (
    <Link href={href} className={`group relative bg-[#FEFEFA] p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${hoverClass}`}>
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">{title}</h3>
          <p className="text-2xl font-bold text-[#000000] mb-1 group-hover:text-[#FF4F00] transition-colors">{value}</p>
          <p className="text-zinc-500 text-sm leading-relaxed">{subtitle}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#FF4F00] group-hover:text-[#FEFEFA] transition-colors shrink-0"><ArrowRight size={20} /></div>
      </div>
    </Link>
  )
}