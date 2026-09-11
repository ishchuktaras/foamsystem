import { Zap, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-[#000000] text-white overflow-hidden py-24 lg:py-32">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF4F00] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#FF4F00] rounded-full blur-[100px]"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FF4F00] text-sm font-bold mb-8">
          <Zap size={16} /> Nejuniverzálnější zateplení na trhu
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
          Izolace, která šetří <br className="hidden md:block" />
          <span className="text-[#FF4F00]">až 50 % nákladů</span> na vytápění
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-medium">
          Zateplení střech, podkroví a fasád stříkanou PUR pěnou. Dokonalé utěsnění bez tepelných mostů s garancí životnosti po celou dobu stavby.
        </p>
        <a href="#poptavka" className="px-8 py-4 bg-[#FF4F00] hover:bg-[#E64700] text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,79,0,0.4)] flex items-center justify-center gap-2">
          Spočítat nezávazně <ArrowRight size={20} />
        </a>
      </div>
    </section>
  )
}