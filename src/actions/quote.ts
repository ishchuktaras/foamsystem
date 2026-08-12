// src/actions/quote.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createQuote(data: {
  customerName: string
  ico?: string
  street?: string
  city: string
  zip?: string
  materialName: string
  area: string
  thickness: string
  totalCost: string
}) {
  try {
    const quote = await db.quote.create({
      data: {
        customerName: data.customerName,
        ico: data.ico,
        street: data.street,
        city: data.city,
        zip: data.zip,
        materialName: data.materialName,
        area: data.area,
        thickness: data.thickness,
        totalCost: data.totalCost,
      }
    })
    
    revalidatePath('/admin/quotes')
    return { success: true, id: quote.id }
  } catch (error) {
    console.error("Chyba při ukládání nabídky:", error)
    return { success: false, error: "Nepodařilo se uložit nabídku do databáze." }
  }
}

// Nová funkce pro smazání nabídky
export async function deleteQuote(id: string) {
  try {
    await db.quote.delete({
      where: { id }
    })
    revalidatePath('/admin/quotes')
    return { success: true }
  } catch (error) {
    console.error("Chyba při mazání nabídky:", error)
    return { success: false, error: "Nepodařilo se smazat nabídku." }
  }
}