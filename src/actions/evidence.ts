// src/actions/evidence.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// 1. FUNKCE PRO APLIKÁTORA (TECHNICKÁ EVIDENCE)
export interface JobEvidenceInput {
  ambientTemp: string;
  internalTemp: string;
  surfaceTemp: string;
  surfaceType: string;
  reactorStart: string;
  reactorEnd: string;
  foilRolls: string;
  packingHours: string;
  difficultEnv?: string;
  workingAtHeights?: string;
  ventilationUsed?: string;
}

export async function saveJobEvidence(quoteId: string, data: JobEvidenceInput) {
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
          workingAtHeights: data.workingAtHeights === 'on',
          ventilationUsed: data.ventilationUsed === 'on',
        }
      }),
      db.quote.update({
        where: { id: quoteId },
        data: { status: 'COMPLETED' }
      })
    ])
    
    revalidatePath(`/admin/quotes/${quoteId}`)
    revalidatePath('/admin/quotes')
    return { success: true }
  } catch (error) {
    console.error("Chyba při ukládání evidence:", error)
    return { success: false, error: "Nepodařilo se uložit technickou evidenci." }
  }
}

// 2. FUNKCE PRO SUPERVIZORA (FINANČNÍ VYÚČTOVÁNÍ)
export async function saveBillingData(
  evidenceId: string, 
  data: {
    pricePerKg: number
    machineCoefficient: number
    packingPriceRate: number
    heightsSurcharge: number
    difficultEnvSurcharge: number
    finalInvoiceTotal: number
  }
) {
  try {
    await db.jobEvidence.update({
      where: { id: evidenceId },
      data: {
        pricePerKg: data.pricePerKg,
        machineCoefficient: data.machineCoefficient,
        packingPriceRate: data.packingPriceRate,
        heightsSurcharge: data.heightsSurcharge,
        difficultEnvSurcharge: data.difficultEnvSurcharge,
        finalInvoiceTotal: data.finalInvoiceTotal,
      }
    })
    
    revalidatePath('/admin/evidence')
    return { success: true }
  } catch (error) {
    console.error('Chyba při ukládání vyúčtování:', error)
    return { success: false, error: 'Nepodařilo se uložit data vyúčtování.' }
  }
}