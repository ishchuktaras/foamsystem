// src/components/landing/LandingContactForm.tsx
'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, Phone, Mail, Building2, Globe } from 'lucide-react'
import { createQuote } from '@/actions/quote'
// Přidáme import naší nové funkce pro e-maily
import { sendInquiryNotification } from '@/actions/sendEmail'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    type: '',
    area: '',
    thickness: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gdprConsent) return
    setIsSubmitting(true)
    
    // 1. Uložíme do databáze
    const dbResult = await createQuote({
      customerName: formData.name,
      city: formData.city || 'Nezadáno',
      area: formData.area || '0',
      thickness: formData.thickness || '0',
      materialName: `Poptávka z webu: ${formData.type}`,
      totalCost: '0',
      applicatorNotes: `KONTAKT Z WEBU:\nTelefon: ${formData.phone}\nE-mail: ${formData.email}\nTyp izolace: ${formData.type}`
    })

    // 2. Pokud se uložení povedlo, odešleme e-mail na poptavky@izolacers.cz
    if (dbResult.success) {
      // Vytvoříme zprávu pro e-mailový notifikátor
      const emailMessage = `Město realizace: ${formData.city}\nTyp izolace: ${formData.type}\nPlocha: ${formData.area} m²\nTloušťka: ${formData.thickness} cm`

      // Nečekáme na výsledek e-mailu (await nepoužijeme, nebo ho zachytíme bez blokování UI), 
      // aby zákazník nemusel zbytečně dlouho čekat na zelenou obrazovku, pokud by se SMTP zpozdil.
      sendInquiryNotification({
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: emailMessage,
        quoteId: dbResult.id // Pokud akce `createQuote` vrací ID vytvořené zakázky
      }).catch(err => console.error("Chyba při odesílání e-mailového upozornění:", err))

      setFormSuccess(true)
      setFormData({ name: '', phone: '', email: '', city: '', type: '', area: '', thickness: '' })
      setGdprConsent(false)
    } else {
      alert('Něco se pokazilo. Zkuste to prosím znovu.')
    }
    
    setIsSubmitting(false)
  }

  if (formSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500 text-green-400 p-8 rounded-2xl text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Poptávka odeslána!</h3>
        <p>Děkujeme za váš zájem. Brzy se vám ozveme s naceněním.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white text-[#000000] p-8 md:p-10 rounded-3xl shadow-2xl">
      
      {/* KOMPLETNÍ KONTAKTNÍ A FIREMNÍ ÚDAJE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FF8730]/10 text-[#FF8730] rounded-xl shrink-0"><Phone size={16} /></div>
          <div>
            <span className="block font-bold text-zinc-400 uppercase text-[10px]">Telefon</span>
            <a href="tel:+420734617462" className="font-extrabold text-[#000000] hover:text-[#FF8730] transition-colors">+420 734 617 462</a>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-[#FF8730]/10 text-[#FF8730] rounded-xl shrink-0 mt-0.5"><Mail size={16} /></div>
          <div>
            <span className="block font-bold text-zinc-400 uppercase text-[10px] mb-1">E-mail pro dotazy</span>
            <a href="mailto:info@izolacers.cz" className="font-extrabold text-[#000000] hover:text-[#FF8730] transition-colors block mb-0.5">info@izolacers.cz</a>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-200/60 text-zinc-700 rounded-xl shrink-0"><Building2 size={16} /></div>
          <div>
            <span className="block font-bold text-zinc-400 uppercase text-[10px]">IČ / DIČ</span>
            <span className="font-extrabold text-zinc-800">88707351 / CZ308068889</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-zinc-200/60 text-zinc-700 rounded-xl shrink-0"><Globe size={16} /></div>
          <div>
            <span className="block font-bold text-zinc-400 uppercase text-[10px]">Působnost</span>
            <span className="font-extrabold text-zinc-800">Jihlava & Celá ČR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Jméno a příjmení *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Město realizace *</label>
          <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Telefon *</label>
          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">E-mail *</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none" />
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Co zateplujeme?</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none font-medium">
            <option>Šikmá střecha / Podkroví</option>
            <option>Plochá střecha</option>
            <option>Strop / Podlaha</option>
            <option>Fasáda / Základy</option>
            <option>Hala / Průmysl</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Plocha (m²)</label>
          <input type="number" placeholder="cca" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Tloušťka (cm)</label>
          <input type="number" placeholder="cca" value={formData.thickness} onChange={e => setFormData({...formData, thickness: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none" />
        </div>
      </div>

      {/* GDPR SOUHLAS A ODESLÁNÍ */}
      <div className="space-y-5 pt-4 mt-6 border-t border-zinc-100">
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
            Odesláním souhlasíte se sdílením a <a href="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" className="font-bold text-[#FF8730] hover:underline transition-colors">zpracováním osobních údajů</a> (pouze pro účely přípravy smlouvy, faktury a naší účetní evidence v souladu s legislativou).
          </span>
        </label>

        <button 
          type="submit" 
          disabled={!gdprConsent || isSubmitting}
          className="w-full py-4 bg-[#FF8730] hover:bg-[#E67020] text-white font-black text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] cursor-pointer"
        >
          {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          Odeslat nezávaznou poptávku
        </button>
      </div>
    </form>
  )
}