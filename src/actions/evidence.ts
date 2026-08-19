// src/actions/evidence.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function saveJobEvidence(quoteId: string, data: any) {
  try {
    await db.$transaction([
      db.jobEvidence.create({
        data: {
          quoteId,
          ambientTemp: Number(data.ambientTemp),
          internalTemp: Number(data.internalTemp),
          surfaceTemp: Number(data.surfaceTemp),
          surfaceType: data.surfaceType,
          reactorStart: Number(data.reactorStart),
          reactorEnd: Number(data.reactorEnd),
          foilRolls: Number(data.foilRolls),
          packingHours: Number(data.packingHours),
          difficultEnv: data.difficultEnv || null,
          workingAtHeights: !!data.workingAtHeights,
          ventilationUsed: !!data.ventilationUsed,
        }
      }),
      db.quote.update({
        where: { id: quoteId },
        data: { status: 'COMPLETED' }
      })
    ])
    
    revalidatePath(`/admin/quotes/${quoteId}`)
    return { success: true }
  } catch (error) {
    console.error("Chyba při ukládání evidence:", error)
    return { success: false, error: "Nepodařilo se uložit technickou evidenci." }
  }
}