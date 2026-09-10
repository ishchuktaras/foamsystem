// src/components/landing/LandingContactForm.tsx
'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { createQuote } from '@/actions/quote'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
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
    setIsSubmitting(true)
    
    const result = await createQuote({
      customerName: formData.name,
      city: formData.city || 'Nezadáno',
      area: formData.area || '0',
      thickness: formData.thickness || '0',
      materialName: `Poptávka z webu: ${formData.type}`,
      totalCost: '0',
      applicatorNotes: `KONTAKT Z WEBU:\nTelefon: ${formData.phone}\nE-mail: ${formData.email}\nTyp izolace: ${formData.type}`
    })

    setIsSubmitting(false)
    if (result.success) {
      setFormSuccess(true)
      setFormData({ name: '', phone: '', email: '', city: '', type: 'Šikmá střecha / Podkroví', area: '', thickness: '' })
    } else {
      alert('Něco se pokazilo. Zkuste to prosím znovu.')
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Jméno a příjmení *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Město realizace *</label>
          <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Telefon *</label>
          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">E-mail *</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none" />
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Co zateplujeme?</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none font-medium">
            <option>Šikmá střecha / Podkroví</option>
            <option>Plochá střecha</option>
            <option>Strop / Podlaha</option>
            <option>Fasáda / Základy</option>
            <option>Hala / Průmysl</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Plocha (m²)</label>
          <input type="number" placeholder="cca" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="font-bold text-sm text-zinc-600">Tloušťka (cm)</label>
          <input type="number" placeholder="cca" value={formData.thickness} onChange={e => setFormData({...formData, thickness: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF4F00] outline-none" />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#FF4F00] hover:bg-[#E64700] text-white font-black text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
        {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
        Odeslat nezávaznou poptávku
      </button>
      <p className="text-center text-xs text-zinc-400 mt-4">
        Odesláním souhlasíte se zpracováním osobních údajů.
      </p>
    </form>
  )
}