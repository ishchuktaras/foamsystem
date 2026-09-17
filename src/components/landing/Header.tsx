// src/components/landing/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Menu, X, ArrowRight, Calculator, Lock } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut', staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  }
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <header className="fixed top-0 w-full bg-[#F9FAFB]/90 backdrop-blur-md z-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center text-black hover:opacity-90 transition-opacity">
          <Logo className="h-18 w-auto" />
        </Link>

        {/* Desktop Navigace */}
        <nav className="hidden md:flex gap-8 text-sm font-bold text-[#000000]">
          <a href="#proces" className="hover:text-[#FF8730] transition-colors">Jak to funguje</a>
          <a href="#faq" className="hover:text-[#FF8730] transition-colors">Časté dotazy</a>
          <a href="#recenze" className="hover:text-[#FF8730] transition-colors">Recenze</a>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#poptavka" className="px-6 py-2.5 bg-[#FF8730] hover:bg-[#E67020] text-white font-bold rounded-xl transition-all shadow-md hover:scale-105 active:scale-95">
            Nezávazná kalkulace
          </a>
        </div>

        {/* Mobile Burger Tlačítko */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2.5 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
          aria-label="Menu"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Rozbalovací Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute top-20 left-0 w-full bg-[#FEFEFA] border-b border-zinc-200 shadow-2xl p-6 space-y-6"
          >
            <nav className="flex flex-col space-y-2 text-base font-bold text-zinc-800">
              <motion.a 
                variants={itemVariants}
                href="#proces" 
                onClick={closeMenu}
                className="p-3.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-between group"
              >
                <span>Jak to funguje</span>
                <ArrowRight size={16} className="text-zinc-400 group-hover:text-[#FF8730] transition-colors" />
              </motion.a>
              <motion.a 
                variants={itemVariants}
                href="#faq" 
                onClick={closeMenu}
                className="p-3.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-between group"
              >
                <span>Časté dotazy</span>
                <ArrowRight size={16} className="text-zinc-400 group-hover:text-[#FF8730] transition-colors" />
              </motion.a>
              <motion.a 
                variants={itemVariants}
                href="#recenze" 
                onClick={closeMenu}
                className="p-3.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-between group"
              >
                <span>Recenze</span>
                <ArrowRight size={16} className="text-zinc-400 group-hover:text-[#FF8730] transition-colors" />
              </motion.a>
            </nav>

            <motion.div variants={itemVariants} className="pt-4 border-t border-zinc-100 space-y-4">
              <a 
                href="#poptavka" 
                onClick={closeMenu}
                className="w-full py-4 bg-[#FF8730] hover:bg-[#E67020] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center hover:scale-[1.02]"
              >
                <Calculator size={18} /> Nezávazná kalkulace
              </a>
              
              {/* Odkaz na přihlášení (diskrétní, jako ve footeru) */}
              <div className="pt-2 border-t border-zinc-100 flex justify-center">
                <Link 
                  href="/login" 
                  onClick={closeMenu}
                  className="text-zinc-500 hover:text-[#FF8730] transition-colors flex items-center gap-2 text-sm font-medium py-2"
                >
                  <Lock size={14} /> Přihlášení do systému
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}