'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { X } from 'lucide-react' // Odstraněn nepoužitý AlertTriangle

const store = createXRStore({
  customSessionInit: { optionalFeatures: ['hit-test', 'dom-overlay'] }
})

export default function ARScanner({ 
  onClose, 
  onComplete 
}: { 
  onClose: () => void
  onComplete: (width: number, height: number) => void 
}) {

  const handleStartAR = async () => {
    try {
      if (!navigator.xr) {
        alert('Chyba: Prohlížeč nepodporuje WebXR. Zkuste Google Chrome.')
        return
      }

      const isSupported = await navigator.xr.isSessionSupported('immersive-ar')
      if (!isSupported) {
        alert('Chyba: Vaše zařízení aktuálně nepodporuje AR. Důvody: \n1. Nejste na HTTPS.\n2. Chybí vám ARCore.')
        return
      }

      await store.enterAR()
      
    } catch (error: unknown) { // Změněno z 'any' na 'unknown' pro čistý TypeScript
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert('Při spouštění kamery došlo k chybě: ' + errorMessage)
    }
  }

  return (
    <div className="relative w-full h-[450px] bg-[#1a1a1a] rounded-2xl overflow-hidden border-2 border-[#FF4F00] shadow-inner">
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      <button 
        onClick={handleStartAR}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#FF4F00] text-[#FEFEFA] font-bold rounded-xl shadow-lg border border-orange-500 cursor-pointer"
      >
        Aktivovat kameru
      </button>
      
      {/* Testovací tlačítko pro vývojáře, které využije onComplete */}
      <button 
        onClick={() => onComplete(5.2, 3.1)}
        className="absolute bottom-6 right-6 z-50 px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
      >
        Test dat
      </button>

      <Canvas>
        <XR store={store}>
          <ambientLight intensity={1} />
        </XR>
      </Canvas>
    </div>
  )
}