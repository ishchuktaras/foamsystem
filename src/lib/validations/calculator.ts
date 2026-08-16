// src/lib/validations/calculator.ts

import { z } from 'zod'

// Tady je ten chybějící "export const calculatorSchema"
export const calculatorSchema = z.object({
  materialId: z.string().min(1, { message: 'Prosím, vyberte typ materiálu.' }),
  
  areaM2: z.coerce.number({
    message: 'Plocha je povinný údaj a musí to být platné číslo.',
  })
    .positive({ message: 'Plocha musí být větší než 0.' })
    .max(50000, { message: 'Plocha je příliš velká. Zkontrolujte zadání.' }),
    
  thicknessCm: z.coerce.number({
    message: 'Tloušťka je povinný údaj a musí to být platné číslo.',
  })
    .positive({ message: 'Tloušťka musí být větší než 0.' })
    .max(50, { message: 'Maximální tloušťka izolační vrstvy je 50 cm.' }),
})

// Exportujeme i TypeScript typ
export type CalculatorInput = z.infer<typeof calculatorSchema>