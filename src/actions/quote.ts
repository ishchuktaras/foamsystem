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
  applicatorNotes?: string | null
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
        applicatorNotes: data.applicatorNotes,
      }
    })
    
    revalidatePath('/admin/quotes')
    return { success: true, id: quote.id }
  } catch (error: unknown) {
    console.error("Chyba při ukládání nabídky:", error)
    return { success: false, error: "Nepodařilo se uložit nabídku do databáze." }
  }
}

export async function deleteQuote(id: string) {
  try {
    // 1. KROK: Nejprve se pokusíme smazat případnou existující evidenci
    // (ochrana proti databázové chybě P2003 - Foreign Key Constraint)
    try {
      // TypeScript-safe volání dynamických modelů přes unknown
      type DynamicModel = { deleteMany?: (args: { where: { quoteId: string } }) => Promise<unknown> }
      const dynamicDb = db as unknown as Record<string, DynamicModel>
      
      if (dynamicDb.jobEvidence?.deleteMany) {
        await dynamicDb.jobEvidence.deleteMany({ where: { quoteId: id } })
      }
      if (dynamicDb.evidence?.deleteMany) {
        await dynamicDb.evidence.deleteMany({ where: { quoteId: id } })
      }
    } catch(e: unknown) {
      // Ignorujeme, pokud modely neexistují
    }

    // 2. KROK: Smazání samotné nabídky
    await db.quote.delete({
      where: { id }
    })
    
    // 3. KROK: Obnovíme všechny routy
    revalidatePath('/admin/quotes')
    revalidatePath('/admin/dispatch')
    revalidatePath('/admin')
    
    return { success: true }
  } catch (error: unknown) {
    console.error("Chyba při mazání nabídky:", error)
    
    let errMsg = "Nepodařilo se smazat nabídku ze serveru."
    
    // Typově bezpečné zpracování chyby
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>
      if (err.code === 'P2003') {
         errMsg = "Databáze zamítla smazání (Chyba P2003): K této nabídce stále existují připojená data, která blokují smazání."
      } else if (err.code === 'P2025') {
         errMsg = "Tato nabídka již byla smazána nebo v databázi neexistuje."
      }
    } 
    
    if (error instanceof Error && !errMsg.includes('P2003') && !errMsg.includes('P2025')) {
       errMsg = `Chyba databáze: ${error.message.split('\n').slice(-1)[0]}`
    }
    
    return { success: false, error: errMsg }
  }
}

// FUNKCE Slouží pro úpravu (editaci) existující nabídky
export async function updateQuote(id: string, data: {
  customerName: string
  ico?: string
  street?: string
  city: string
  zip?: string
  materialName: string
  area: string
  thickness: string
  totalCost: string
  applicatorNotes?: string | null
}) {
  try {
    await db.quote.update({
      where: { id },
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
        applicatorNotes: data.applicatorNotes,
      }
    })
    
    revalidatePath('/admin/quotes')
    return { success: true }
  } catch (error: unknown) {
    console.error("Chyba při aktualizaci nabídky:", error)
    return { success: false, error: "Nepodařilo se aktualizovat nabídku v databázi." }
  }
}