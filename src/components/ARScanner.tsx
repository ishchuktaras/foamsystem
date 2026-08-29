// src/components/ARScanner.tsx

'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { X } from 'lucide-react'

// 1. Založení storu s parametrem customSessionInit pro povolení hit-testu
const store = createXRStore({
  customSessionInit: { requiredFeatures: ['hit-test'] }
})

export default function ARScanner({ 
  onClose, 
  onComplete 
}: { 
  onClose: () => void
  onComplete: (width: number, height: number) => void 
}) {
  return (
    <div className="relative w-full h-[450px] bg-[#1a1a1a] rounded-2xl overflow-hidden border-2 border-[#FF4F00] shadow-inner">
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      {/* 2. enterAR() se volá zcela čistě bez argumentů, přesně jak TypeScript požaduje */}
      <button 
        onClick={() => store.enterAR()}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#FF4F00] text-[#FEFEFA] font-bold rounded-xl shadow-lg border border-orange-500 cursor-pointer"
      >
        Aktivovat kameru
      </button>

      <Canvas>
        <XR store={store}>
          <ambientLight intensity={1} />
        </XR>
      </Canvas>
    </div>
  )
}