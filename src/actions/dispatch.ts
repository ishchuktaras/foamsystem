'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateDispatchAssignment(formData: FormData): Promise<void> {
  const quoteId = formData.get('quoteId') as string
  const dateStr = formData.get('scheduledDate') as string
  const responsibleUserId = formData.get('responsibleUserId') as string

  if (!quoteId) return

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
  } catch (error) {
    console.error('Chyba při ukládání dispečinku v DB:', error)
    throw error
  }
}