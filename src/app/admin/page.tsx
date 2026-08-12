// src/app/admin/page.tsx

import Link from 'next/link'
import { FileText, Boxes, ShieldCheck, TrendingUp, Calculator, ArrowRight, CheckCircle2, Clock } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Uvítací Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1B3E] to-[#1a2c5b] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Přehled systému
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Vítejte v administraci FoamSystem. Zde máš rychlý přístup ke kalkulacím, zakázkám a kompletní správě izolačních materiálů.
          </p>
        </div>
        {/* Dekorativní ikony v pozadí */}
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/4 opacity-10 pointer-events-none">
          <Boxes size={300} />
        </div>
        <div className="absolute right-40 bottom-0 translate-y-1/3 opacity-10 pointer-events-none">
          <Calculator size={150} />
        </div>
      </div>

      {/* 2. Rychlé KPI statistiky (Zástupná data připravená na napojení z DB) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-[#3B82F6] rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Měsíční nabídky</p>
            <h3 className="text-2xl font-bold text-[#0D1B3E]">12</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Aktivní materiály</p>
            <h3 className="text-2xl font-bold text-[#0D1B3E]">3</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Čekající poptávky</p>
            <h3 className="text-2xl font-bold text-[#0D1B3E]">5</h3>
          </div>
        </div>
      </div>

      {/* 3. Hlavní rozcestník - Rychlé akce */}
      <div>
        <h2 className="text-xl font-bold text-[#0D1B3E] mb-6">Rychlé akce</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <DashboardCard
            title="Nová poptávka"
            value="Vytvořit"
            subtitle="s automatickým ARES"
            href="/admin/inquiries/new"
            icon={<FileText size={28} className="text-blue-600" />}
            colorClass="bg-blue-50"
            hoverClass="group-hover:border-blue-500"
          />

          <DashboardCard
            title="Kalkulátor"
            value="Spočítat"
            subtitle="Spotřeba a cena"
            href="/admin/calculator"
            icon={<Calculator size={28} className="text-indigo-600" />}
            colorClass="bg-indigo-50"
            hoverClass="group-hover:border-indigo-500"
          />
          
          <DashboardCard
            title="Materiály"
            value="Správa pěn"
            subtitle="Úprava cen a parametrů"
            href="/admin/materials"
            icon={<Boxes size={28} className="text-amber-600" />}
            colorClass="bg-amber-50"
            hoverClass="group-hover:border-amber-500"
          />
          
          <DashboardCard
            title="Nabídky"
            value="Seznam"
            subtitle="Historie a stav poptávek"
            href="/admin/quotes"
            icon={<TrendingUp size={28} className="text-emerald-600" />}
            colorClass="bg-emerald-50"
            hoverClass="group-hover:border-emerald-500"
          />
          
          <DashboardCard
            title="Systém"
            value="ARES Test"
            subtitle="Ověření spojení s API"
            href="/admin/ares-test"
            icon={<ShieldCheck size={28} className="text-purple-600" />}
            colorClass="bg-purple-50"
            hoverClass="group-hover:border-purple-500"
          />

        </div>
      </div>
    </div>
  )
}

// Vylepšená komponenta pro čistší kód interaktivních karet
function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  href, 
  icon,
  colorClass,
  hoverClass
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  href: string; 
  icon: React.ReactNode;
  colorClass: string;
  hoverClass: string;
}) {
  return (
    <Link 
      href={href} 
      className={`group relative bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${hoverClass}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            {title}
          </h3>
          <p className="text-2xl font-bold text-[#0D1B3E] mb-1 group-hover:text-[#3B82F6] transition-colors">
            {value}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors shrink-0">
          <ArrowRight size={20} />
        </div>
      </div>
      {/* Jemný hover efekt v rohu karty */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  )
}