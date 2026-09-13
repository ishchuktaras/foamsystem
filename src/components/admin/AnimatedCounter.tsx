// src/components/admin/AnimatedCounter.tsx
'use client'

import { useEffect, useState } from 'react'

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, suffix = ' Kč' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    const duration = 1000 // 1 sekunda animace

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing out efekt
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      setDisplayValue(Math.floor(easeProgress * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span>
      {displayValue.toLocaleString('cs-CZ')}{suffix}
    </span>
  )
}