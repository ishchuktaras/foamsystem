// src/actions/dispatch.ts

'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateDispatchAssignment(formData: FormData) {
  const quoteId = formData.get('quoteId') as string
  const dateStr = formData.get('scheduledDate') as string
  const responsibleUserId = formData.get('responsibleUserId') as string

  if (!quoteId) return { error: 'Chybí ID zakázky' }

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
    
    revalidatePath('/admin/dispatch')
    revalidatePath('/admin/quotes')
    return { success: true }
    
  } catch (error: unknown) {
    console.error('Chyba při ukládání dispečinku v DB:', error)
    return { error: 'Nepodařilo se uložit do databáze. Pravděpodobně v Supabase stále chybí sloupce pro dispečink. Zkontrolujte připojení přes port 5432 a spusťte npx prisma db push.' }
  }
}