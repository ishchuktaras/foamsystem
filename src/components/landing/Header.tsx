// src/components/landing/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Menu, X, ArrowRight, Calculator } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="fixed top-0 w-full bg-[#F9FAFB]/90 backdrop-blur-md z-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center text-black hover:opacity-90 transition-opacity">
          <Logo className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigace */}
        <nav className="hidden md:flex gap-8 text-sm font-bold text-[#000000]">
          <a href="#vyhody" className="hover:text-[#FF4F00] transition-colors">Proč pěna?</a>
          <a href="#proces" className="hover:text-[#FF4F00] transition-colors">Jak to funguje</a>
          <a href="#faq" className="hover:text-[#FF4F00] transition-colors">Časté dotazy</a>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#poptavka" className="px-6 py-2.5 bg-[#FF4F00] hover:bg-[#E64700] text-white font-bold rounded-xl transition-all shadow-md hover:scale-105 active:scale-95">
            Nezávazná kalkulace
          </a>
        </div>

        {/* Mobile Burger Tlačítko */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2.5 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors focus:outline-none cursor-pointer"
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Rozbalovací Menu s Framer Motion animací */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-20 left-0 w-full bg-[#FEFEFA] border-b border-zinc-200 shadow-2xl p-6 space-y-6"
          >
            <nav className="flex flex-col space-y-2 text-base font-bold text-zinc-800">
              <a 
                href="#vyhody" 
                onClick={closeMenu}
                className="p-3.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-between"
              >
                <span>Proč pěna?</span>
                <ArrowRight size={16} className="text-zinc-400" />
              </a>
              <a 
                href="#proces" 
                onClick={closeMenu}
                className="p-3.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-between"
              >
                <span>Jak to funguje</span>
                <ArrowRight size={16} className="text-zinc-400" />
              </a>
              <a 
                href="#faq" 
                onClick={closeMenu}
                className="p-3.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-between"
              >
                <span>Časté dotazy</span>
                <ArrowRight size={16} className="text-zinc-400" />
              </a>
            </nav>

            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <a 
                href="#poptavka" 
                onClick={closeMenu}
                className="w-full py-4 bg-[#FF4F00] hover:bg-[#E64700] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <Calculator size={18} /> Nezávazná kalkulace
              </a>
              <Link 
                href="/login" 
                onClick={closeMenu}
                className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                Přihlášení do systému
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}