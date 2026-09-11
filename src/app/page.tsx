// src/app/page.tsx
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import ContactForm from '@/components/landing/LandingContactForm'
import Hero from '@/components/landing/Hero'
import Benefits from '@/components/landing/Benefits'
import Process from '@/components/landing/Process'
import FaqReviews from '@/components/landing/FaqReviews'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-[#FF4F00] selection:text-white">
      <Header />

      <main className="pt-20">
        
        <Hero />
        <Benefits />
        <Process />
        <FaqReviews />

        {/* POPTÁVKA (Importovaná klientská komponenta) */}
        <section id="poptavka" className="py-24 bg-[#000000] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Získejte kalkulaci zdarma</h2>
              <p className="text-zinc-400">Vyplňte základní údaje o vašem projektu. Ozveme se vám s orientační cenou.</p>
            </div>
            
            <ContactForm />
            
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}