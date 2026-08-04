// src/app/admin/page.tsx

import Link from 'next/link'
import { FileText, Boxes, ShieldCheck, TrendingUp, Calculator } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B3E]">Přehled systému</h1>
        <p className="text-gray-600 mt-1">
          Vítejte v administraci FoamSystem. Zde najdete rychlý přístup k vašim zakázkám a materiálům.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* Rychlé odkazy jako "Karty" */}
        <DashboardCard
          title="Nová poptávka"
          value="Vytvořit"
          subtitle="s automatickým ARES"
          href="/admin/inquiries/new"
          icon={<FileText size={24} className="text-[#3B82F6]" />}
        />

        <DashboardCard
          title="Kalkulátor"
          value="Spočítat"
          subtitle="Spotřeba a cena"
          href="/admin/calculator"
          icon={<Calculator size={24} className="text-[#3B82F6]" />}
        />
        
        <DashboardCard
          title="Materiály"
          value="Správa pěn"
          subtitle="Úprava cen a parametrů"
          href="/admin/materials"
          icon={<Boxes size={24} className="text-[#3B82F6]" />}
        />
        
        <DashboardCard
          title="Nabídky"
          value="Seznam"
          subtitle="Historie a stav poptávek"
          href="/admin/quotes"
          icon={<TrendingUp size={24} className="text-[#3B82F6]" />}
        />
        
        <DashboardCard
          title="Systém"
          value="ARES Test"
          subtitle="Ověření spojení s API"
          href="/admin/ares-test"
          icon={<ShieldCheck size={24} className="text-[#3B82F6]" />}
        />
      </div>
    </div>
  )
}

// Pomocná komponenta pro čistší kód karet
function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  href, 
  icon 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  href: string; 
  icon: React.ReactNode;
}) {
  return (
    <Link 
      href={href} 
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-500">{title}</h3>
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-[#0D1B3E]">{value}</div>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
    </Link>
  )
}