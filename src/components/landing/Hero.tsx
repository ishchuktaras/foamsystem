// src/components/landing/Hero.tsx
'use client'

import { Zap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section 
      // Zde je klíčová změna: obrázky se mění podle velikosti displeje (mobil vs. md:)
      className="relative overflow-hidden min-h-[calc(100vh)] flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/images/hero-bg1.jpeg')] md:bg-[url('/images/hero-bg.jpeg')]"
    >
      {/* Světlý gradientní překryv pro maximální kontrast tmavého textu a viditelnost fotky na pozadí */}
      <div className="absolute inset-0 bg-linear-to-b from-white/15 via-white/35 to-white/95 z-0 backdrop-blur-[2px]"></div>

      {/* Dynamické dýchající světelné efekty na pozadí v barvě #FF8730 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF8730] rounded-full blur-[140px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#FF8730] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-12">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#FF8730]/30 text-[#645e59] text-sm font-bold mb-8 shadow-sm backdrop-blur-md"
        >
          <Zap size={16} /> Nejuniverzálnější zateplení na trhu
        </motion.div>

        {/* Hlavní nadpis - Tmavý pro světlý motiv */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight text-zinc-900"
        >
          Izolace, která šetří <br className="hidden md:block" />
          <span className="text-[#FF8730]">až 70 % nákladů</span> na vytápění
        </motion.h1>

        {/* Popis - Tmavý pro světlý motiv */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-700 max-w-2xl mb-10 font-medium"
        >
          Zateplení střech, podkroví a fasád stříkanou PUR pěnou. Dokonalé utěsnění bez tepelných mostů s garancí životnosti po celou dobu stavby.
        </motion.p>

        {/* CTA Tlačítko */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <a href="#poptavka" className="px-8 py-4 bg-[#FF8730] hover:bg-[#E67020] text-white text-lg font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(255,135,48,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            Spočítat nezávazně <ArrowRight size={20} />
          </a>
        </motion.div>

      </div>
    </section>
  )
}