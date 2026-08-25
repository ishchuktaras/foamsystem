'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateDispatchAssignment(formData: FormData): Promise<void> {
  const quoteId = formData.get('quoteId') as string
  const dateStr = formData.get('scheduledDate') as string
  const responsibleUserId = formData.get('responsibleUserId') as string

  // 1. KONTROLNÍ LOG - Vypíše se do terminálu, jakmile klikneš na Uložit
  console.log('--- START DISPEČINK ---')
  console.log('ID zakázky:', quoteId)
  console.log('Přijaté datum:', dateStr)
  console.log('ID uživatele:', responsibleUserId)

  if (!quoteId) {
    console.log('CHYBA: Chybí quoteId, ukončuji akci.')
    return
  }

  const finalUserId = responsibleUserId && responsibleUserId !== "" ? responsibleUserId : null
  const finalDate = dateStr && dateStr !== "" ? new Date(dateStr) : null

  try {
    await db.quote.update({
      where: { id: quoteId },
      data: {
        scheduledDate: finalDate,
        responsibleUserId: finalUserId,
      }
    })
    
    // 2. KONTROLNÍ LOG - Pokud to projde databází, vypíše se toto
    console.log('--- ÚSPĚŠNĚ ULOŽENO V DB, OBNOVUJI STRÁNKU ---')
    
    revalidatePath('/admin/dispatch')
    revalidatePath('/admin/quotes')
  } catch (error) {
    // 3. KONTROLNÍ LOG - Pokud chybí sloupce v DB, vypíše se přesná chyba Prisma
    console.error('--- KRITICKÁ CHYBA V DATABÁZI ---')
    console.error(error)
    throw error
  }
}