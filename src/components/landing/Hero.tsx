// src/components/landing/Hero.tsx
'use client'

import { Zap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section 
      className="relative text-white overflow-hidden min-h-[calc(100vh-5rem)] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-bg1.jpeg')" }}
    >
      {/* Silnější tmavý gradientní překryv pro maximální kontrast a čitelnost */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/95 z-0"></div>

      {/* Dynamické dýchající světelné efekty na pozadí */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF4F00] rounded-full blur-[140px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#FF4F00] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-12">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/20 text-[#FF4F00] text-sm font-bold mb-8 shadow-xl backdrop-blur-md"
        >
          <Zap size={16} /> Nejuniverzálnější zateplení na trhu
        </motion.div>

        {/* Hlavní nadpis */}
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        >
          Izolace, která šetří <br className="hidden md:block" />
          <span className="text-[#FF4F00]">až 70 % nákladů</span> na vytápění
        </motion.h1>

        {/* Popis */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-200 max-w-2xl mb-10 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          Zateplení střech, podkroví a fasád stříkanou PUR pěnou. Dokonalé utěsnění bez tepelných mostů s garancí životnosti po celou dobu stavby.
        </motion.p>

        {/* CTA Tlačítko */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <a href="#poptavka" className="px-8 py-4 bg-[#FF4F00] hover:bg-[#E64700] text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(255,79,0,0.5)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            Spočítat nezávazně <ArrowRight size={20} />
          </a>
        </motion.div>

      </div>
    </section>
  )
}