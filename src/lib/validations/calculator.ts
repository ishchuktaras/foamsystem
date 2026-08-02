// src/lib/validations/calculator.ts

import { z } from 'zod'

export const calculatorSchema = z.object({
  materialId: z.string().min(1, { message: 'Prosím, vyberte typ materiálu.' }),
  
  areaM2: z.coerce.number({
    message: 'Plocha je povinný údaj a musí to být platné číslo.',
  })
    .positive({ message: 'Plocha musí být větší než 0.' })
    .max(10000, { message: 'Plocha je příliš velká. Zkontrolujte zadání.' }),
    
  thicknessCm: z.coerce.number({
    message: 'Tloušťka je povinný údaj a musí to být platné číslo.',
  })
    .positive({ message: 'Tloušťka musí být větší než 0.' })
    .max(100, { message: 'Tloušťka je příliš velká. Zkontrolujte zadání.' }),
})

// Vygenerujeme si z toho TypeScript typ pro naše použití ve frontendu
export type CalculatorInput = z.infer<typeof calculatorSchema>