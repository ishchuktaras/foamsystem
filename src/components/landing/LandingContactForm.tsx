// src/components/landing/LandingContactForm.tsx
'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, Phone, Mail, Building2, Globe } from 'lucide-react'
import { createQuote } from '@/actions/quote'
import { sendInquiryNotification } from '@/actions/sendEmail'

export default function LandingContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    type: 'Šikmá střecha / Podkroví',
    area: '',
    thickness: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gdprConsent) return
    setIsSubmitting(true)
    
    // 1. Uložení do databáze
    const dbResult = await createQuote({
      customerName: formData.name,
      city: formData.city || 'Nezadáno',
      area: formData.area || '0',
      thickness: formData.thickness || '0',
      materialName: `Poptávka z webu: ${formData.type}`,
      totalCost: '0',
      applicatorNotes: `KONTAKT Z WEBU:\nTelefon: ${formData.phone}\nE-mail: ${formData.email}\nTyp izolace: ${formData.type}`
    })

    // 2. Odeslání e-mailového upozornění (neblokujeme UI)
    if (dbResult.success) {
      const emailMessage = `Město realizace: ${formData.city}\nTyp izolace: ${formData.type}\nPlocha: ${formData.area} m²\nTloušťka: ${formData.thickness} cm`

      sendInquiryNotification({
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: emailMessage,
        quoteId: dbResult.id 
      }).catch(err => console.error("Chyba při odesílání e-mailového upozornění:", err))

      setFormSuccess(true)
      setFormData({ name: '', phone: '', email: '', city: '', type: 'Šikmá střecha / Podkroví', area: '', thickness: '' })
      setGdprConsent(false)
    } else {
      alert('Něco se pokazilo. Zkuste to prosím znovu.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
      
      {/* LEVÝ SLOUPEC: Kontakty a "živá komunikace" */}
      <div className="lg:col-span-5 space-y-8 text-zinc-300">
        <div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Preferujete živou komunikaci?</h3>
          <p className="text-lg leading-relaxed text-zinc-400">
            Nebaví vás vyplňování formulářů? Rozumíme vám. Zavolejte nám nebo napište e-mail a vše rádi probereme osobně a obratem.
          </p>
        </div>

        <div className="space-y-6">
          {/* Telefon */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FF8730]/10 flex items-center justify-center shrink-0 border border-[#FF8730]/20">
              <Phone className="text-[#FF8730]" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Zavolejte nám</p>
              <a href="tel:+420734617462" className="text-xl font-black text-white hover:text-[#FF8730] transition-colors">+420 734 617 462</a>
            </div>
          </div>

          {/* E-mail */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FF8730]/10 flex items-center justify-center shrink-0 border border-[#FF8730]/20">
              <Mail className="text-[#FF8730]" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Napište nám pro konzultaci</p>
              <a href="mailto:info@izolacers.cz" className="text-xl font-black text-white hover:text-[#FF8730] transition-colors">info@izolacers.cz</a>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
            {/* Firemní údaje */}
            <div>
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Building2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">IČO / DIČ</span>
              </div>
              <p className="font-bold text-white text-sm">88707351<br/>CZ308068889</p>
            </div>

            {/* Působnost */}
            <div>
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Globe size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Působnost</span>
              </div>
              <p className="font-bold text-white text-sm">Jihlava<br/>& Celá ČR</p>
            </div>
          </div>
        </div>
      </div>

      {/* PRAVÝ SLOUPEC: Formulář */}
      <div className="lg:col-span-7">
        {formSuccess ? (
          <div className="bg-[#1a1a1a] border border-[#FF8730]/30 text-white p-10 rounded-3xl text-center shadow-2xl h-full flex flex-col justify-center items-center">
            <CheckCircle2 size={64} className="text-[#FF8730] mb-6" />
            <h3 className="text-3xl font-black mb-3">Poptávka odeslána!</h3>
            <p className="text-zinc-400 text-lg">Děkujeme za váš zájem. Vaši žádost jsme přijali a brzy se vám ozveme s naceněním.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white text-[#000000] p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-zinc-100 w-full">
            
            <h4 className="text-2xl font-black mb-6 border-b border-zinc-100 pb-4">Nezávazná kalkulace on-line</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-6">
              <div className="space-y-2">
                <label className="font-bold text-sm text-zinc-600">Jméno a příjmení *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm text-zinc-600">Město realizace *</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm text-zinc-600">Telefon *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm text-zinc-600">E-mail *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none transition-all" />
              </div>
            </div>

            {/* OPRAVENÁ RESPONZIVITA - Rozdělení na 4 sloupce (2 pro select, 1+1 pro čísla) */}
            <div className="border-t border-zinc-100 pt-6 grid grid-cols-1 sm:grid-cols-4 gap-5 md:gap-6 mb-8">
              <div className="space-y-2 sm:col-span-2">
                <label className="font-bold text-sm text-zinc-600">Co zateplujeme?</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none font-medium transition-all">
                  <option>Šikmá střecha / Podkroví</option>
                  <option>Plochá střecha</option>
                  <option>Strop / Podlaha</option>
                  <option>Fasáda / Základy</option>
                  <option>Hala / Průmysl</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-1">
                <label className="font-bold text-sm text-zinc-600">Plocha (m²)</label>
                <input type="number" placeholder="cca" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none transition-all" />
              </div>
              <div className="space-y-2 sm:col-span-1">
                <label className="font-bold text-sm text-zinc-600">Tloušťka (cm)</label>
                <input type="number" placeholder="cca" value={formData.thickness} onChange={e => setFormData({...formData, thickness: e.target.value})} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none transition-all" />
              </div>
            </div>

            {/* GDPR SOUHLAS A ODESLÁNÍ */}
            <div className="space-y-5 pt-6 border-t border-zinc-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-0.5 shrink-0">
                  <input 
                    type="checkbox" 
                    required
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-300 text-[#FF8730] focus:ring-[#FF8730] transition-colors cursor-pointer accent-[#FF8730]"
                  />
                </div>
                <span className="text-sm text-zinc-500 leading-snug">
                  Odesláním souhlasíte se sdílením a <a href="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" className="font-bold text-[#FF8730] hover:underline transition-colors">zpracováním osobních údajů</a> (pouze pro účely přípravy smlouvy a fakturace v souladu s legislativou).
                </span>
              </label>

              <button 
                type="submit" 
                disabled={!gdprConsent || isSubmitting}
                className="w-full py-4 bg-[#FF8730] hover:bg-[#E67020] text-white font-black text-lg rounded-xl transition-all shadow-[0_4px_20px_rgba(255,135,48,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                Odeslat nezávaznou poptávku
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  )
}