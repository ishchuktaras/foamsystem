// src/actions/ares.ts

'use server'

export type AresCompanyData = {
  ico: string
  dic?: string
  name: string
  street: string
  city: string
  zip: string
}

export async function fetchCompanyByIco(ico: string): Promise<{ success: boolean; data?: AresCompanyData; error?: string }> {
  const cleanIco = ico.trim().replace(/\s+/g, '')

  if (!/^\d{8}$/.test(cleanIco)) {
    return { success: false, error: 'IČO musí mít přesně 8 čísel.' }
  }

  try {
    // POST požadavek s koncovým lomítkem zabrání chybovému přesměrování
    const response = await fetch('https://ares.gov.cz/ekonomicke-subjekty-v-zaznamech/v-res/ekonomicke-subjekty/vyhledat/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FoamSystemApp'
      },
      body: JSON.stringify({
        ico: [cleanIco],
        pocetZaznamu: 1
      }),
    })

    if (!response.ok) {
      return { success: false, error: `Chyba serveru ARES (kód: ${response.status})` }
    }

    const text = await response.text()
    
    if (text.trim().startsWith('<')) {
      return { success: false, error: 'ARES vrátil chybovou stránku místo dat.' }
    }

    const data = JSON.parse(text)
    const ekonomickeSubjekty = data.ekonomickeSubjekty || []

    if (ekonomickeSubjekty.length === 0) {
      return { success: false, error: 'Subjekt s tímto IČO nebyl v registru ARES nalezen.' }
    }

    const subject = ekonomickeSubjekty[0]

    const name = subject.obchodniJmeno || ''
    const dic = subject.dic || ''
    
    const sidlo = subject.sidlo || {}
    const streetName = sidlo.nazevUlice || sidlo.nazevCastiObce || ''
    const houseNumber = sidlo.cisloDomovni 
      ? `${sidlo.cisloDomovni}${sidlo.cisloOrientacni ? `/${sidlo.cisloOrientacni}` : ''}` 
      : ''
    
    const street = `${streetName} ${houseNumber}`.trim()
    const city = sidlo.nazevObce || ''
    const zip = sidlo.psc ? String(sidlo.psc) : ''

    return {
      success: true,
      data: {
        ico: cleanIco,
        dic,
        name,
        street,
        city,
        zip,
      }
    }
  } catch (error: unknown) {
    console.error('ARES fetch error detail:', error)
    const message = error instanceof Error ? error.message : 'Neznámá chyba'
    return { success: false, error: `Nelze se připojit k ARES: ${message}` }
  }
}