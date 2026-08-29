'use client'

import { Canvas } from '@react-three/fiber'
import { ARButton, XR } from '@react-three/xr'
import { X } from 'lucide-react'

export default function ARScanner({ 
  onClose, 
  onComplete 
}: { 
  onClose: () => void
  onComplete: (width: number, height: number) => void 
}) {
  return (
    <div className="relative w-full h-[450px] bg-[#1a1a1a] rounded-2xl overflow-hidden border-2 border-[#FF4F00] shadow-inner">
      
      {/* Tlačítko pro zavření AR režimu */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
      >
        <X size={20} />
      </button>

      {/* Systémové tlačítko pro vyvolání ARCore session */}
      <ARButton 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#FF4F00] text-[#FEFEFA] font-bold rounded-xl shadow-lg border border-orange-500"
        sessionInit={{ requiredFeatures: ['hit-test'] }}
      >
        Aktivovat kameru
      </ARButton>

      {/* 3D Prostor, do kterého v dalším kroku přidáme logiku měření */}
      <Canvas>
        <XR>
          <ambientLight intensity={1} />
        </XR>
      </Canvas>
    </div>
  )
}