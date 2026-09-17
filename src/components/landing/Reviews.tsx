// src/components/landing/Reviews.tsx
'use client'

import { Star, Quote as QuoteIcon } from 'lucide-react'
import { motion, Variants } from 'framer-motion' // <-- Přidán import Variants

const reviews = [
  { 
    text: 'Blesková realizace. Ráno přijeli, odpoledne bylo hotovo. Už první zimu jsme poznali rozdíl na účtech za vytápění.', 
    author: 'Martin D.', 
    location: 'Jihlava' 
  },
  { 
    text: 'Všude se dostali, perfektně zakryli okna a po sobě uklidili. Profesionální přístup od A do Z, můžu jen doporučit.', 
    author: 'Jana K.', 
    location: 'Havlíčkův Brod' 
  },
  { 
    text: 'Férové jednání a profi stroje. Zateplovali jsme střechu u staršího domu a vše proběhlo přesně podle domluvy. Pěna drží perfektně.', 
    author: 'Petr S.', 
    location: 'Pelhřimov' 
  }
]

export default function Reviews() {
  // Explicitní typování pro Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  // Explicitní typování pro Framer Motion
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <section id="recenze" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF8730]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-2xl text-[#FF8730] mb-4 shadow-lg shadow-[#FF8730]/20"
          >
            <Star size={28} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#000000]"
          >
            Řekli o nás
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review, i) => (
            <motion.div 
              key={i}
              variants={cardVariants}
              className="bg-zinc-900 text-white p-8 rounded-3xl relative group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF8730]/20 transition-all duration-300 border border-zinc-800"
            >
              <QuoteIcon className="absolute top-6 right-6 text-zinc-800 group-hover:text-[#FF8730]/20 transition-colors duration-300" size={48} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="#FF8730" className="text-[#FF8730]" />
                ))}
              </div>

              <p className="text-zinc-300 italic mb-8 relative z-10 leading-relaxed min-h-[100px]">
               &bdquo;{review.text}&ldquo;
              </p>
              
              <div className="border-t border-zinc-800 pt-6">
                <div className="font-black text-white text-lg">{review.author}</div>
                <div className="font-bold text-[#FF8730] text-sm">{review.location}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}