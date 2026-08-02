import { z } from 'zod'

export const materialSchema = z.object({
  name: z.string().min(2, { message: 'Název materiálu musí mít alespoň 2 znaky.' }),
  
  type: z.enum(['OPEN_CELL', 'CLOSED_CELL'], { 
    message: 'Vyberte typ pěny (otevřená/uzavřená struktura).' 
  }),
  
  density: z.coerce.number({ message: 'Musí být číslo.' })
    .positive('Hustota musí být větší než 0.'),
    
  yieldPerSetM3: z.coerce.number({ message: 'Musí být číslo.' })
    .positive('Vydatnost musí být větší než 0.'),
    
  wasteFactor: z.coerce.number({ message: 'Musí být číslo.' })
    .min(1, 'Koeficient ztráty musí být minimálně 1 (např. 1.05 pro 5% zástřik).'),
    
  buyPricePerSet: z.coerce.number({ message: 'Musí být číslo.' })
    .nonnegative('Cena nesmí být záporná.')
    .optional()
    .nullable(),
})

export type MaterialInput = z.infer<typeof materialSchema>