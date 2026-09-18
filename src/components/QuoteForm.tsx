// src/components/QuoteForm.tsx
'use client'

import { useState } from 'react'
import { Building2, MapPin, Search, Save, Loader2, AlertCircle, FileDown, Percent, Receipt, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createQuote, updateQuote } from '@/actions/quote'
import jsPDF from 'jspdf'

interface Material {
  id: string;
  name: string;
  type: string;
  density: number;
  yieldPerSetM3: number;
  wasteFactor: number;
  buyPricePerSet: number | null;
  lambda?: string | null;
}

interface CompanyProfile {
  companyName?: string | null;
  ico?: string | null;
  email?: string | null;
  phone?: string | null;
  bankAccount?: string | null;
}

interface QuoteFormProps {
  materials: Material[];
  companyProfile: CompanyProfile | null;
  initialData: {
    id?: string;
    materialId: string;
    area: string;
    thickness: string;
    customerName?: string;
    ico?: string;
    street?: string;
    city?: string;
    zip?: string;
    totalCost?: string;
    applicatorNotes?: string | null;
  };
}

// Funkce pro načtení SVG loga a převod do formátu podporovaného v PDF
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width || 385
      canvas.height = img.height || 306
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = error => reject(error)
    img.src = url
  })
}

export default function QuoteForm({ materials, companyProfile, initialData }: QuoteFormProps) {
  const router = useRouter()
  
  const [ico, setIco] = useState(initialData.ico || '')
  const [customerName, setCustomerName] = useState(initialData.customerName || '')
  const [street, setStreet] = useState(initialData.street || '')
  const [city, setCity] = useState(initialData.city || '')
  const [zip, setZip] = useState(initialData.zip || '')
  const [applicatorNotes, setApplicatorNotes] = useState(initialData.applicatorNotes || '')

  const [selectedMaterialId, setSelectedMaterialId] = useState(initialData.materialId || (materials[0]?.id || ''))
  const [area, setArea] = useState<number | ''>(initialData.area ? Number(initialData.area) : '')
  const [thickness, setThickness] = useState<number | ''>(initialData.thickness ? Number(initialData.thickness) : '')
  
  const [lossPercent, setLossPercent] = useState<number>(10)
  const [marginPercent, setMarginPercent] = useState<number>(100)

  const [isFetchingAres, setIsFetchingAres] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingCombined, setIsGeneratingCombined] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [aresError, setAresError] = useState('')

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId)
  
  let basePrice = 0
  let vat = 0
  let totalPrice = 0
  let techData = null

  if (selectedMaterial && area && thickness) {
    const thicknessM = Number(thickness) / 100
    const pureVolumeM3 = Number(area) * thicknessM
    const lossMultiplier = 1 + (lossPercent / 100)
    const totalVolumeM3 = pureVolumeM3 * lossMultiplier
    
    const exactSets = totalVolumeM3 / selectedMaterial.yieldPerSetM3
    const totalSets = Math.ceil(exactSets)
    const estimatedLifts = Math.round(exactSets * 4011)

    const buyPricePerSet = selectedMaterial.buyPricePerSet || 0
    const exactMaterialCost = exactSets * buyPricePerSet
    
    if (initialData.id && initialData.totalCost && basePrice === 0) {
       const storedCost = Number(initialData.totalCost)
       const calculatedMargin = Math.round(((storedCost / exactMaterialCost) - 1) * 100)
       if(marginPercent === 100 && calculatedMargin !== 100) {
           setMarginPercent(calculatedMargin > 0 ? calculatedMargin : 0)
       }
    }
    
    basePrice = Math.round(exactMaterialCost * (1 + (marginPercent / 100)))
    vat = Math.round(basePrice * 0.21)
    totalPrice = basePrice + vat

    techData = {
      pureVolumeM3: pureVolumeM3.toFixed(2),
      totalVolumeM3: totalVolumeM3.toFixed(2),
      wastedVolumeM3: (totalVolumeM3 - pureVolumeM3).toFixed(2),
      exactSets: exactSets.toFixed(2),
      totalSets,
      estimatedLifts,
      exactMaterialCost: Math.round(exactMaterialCost)
    }
  }

  const fetchAresData = async () => {
    if (!ico || ico.length < 6) return setAresError('Zadejte platné IČO.')
    setIsFetchingAres(true)
    setAresError('')
    try {
      const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`)
      if (!response.ok) throw new Error('Subjekt nenalezen.')
      const data = await response.json()
      setCustomerName(data.obchodniJmeno || '')
      if (data.sidlo) {
        const adresa = []
        if (data.sidlo.nazevUlice) adresa.push(data.sidlo.nazevUlice)
        if (data.sidlo.cisloDomovni) adresa.push(data.sidlo.cisloOrientacni ? `${data.sidlo.cisloDomovni}/${data.sidlo.cisloOrientacni}` : data.sidlo.cisloDomovni)
        setStreet(adresa.join(' ') || data.sidlo.nazevObce || '')
        setCity(data.sidlo.nazevObce || '')
        setZip(data.sidlo.psc ? data.sidlo.psc.toString() : '')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAresError(error.message)
      } else {
        setAresError('Nepodařilo se spojit s ARES.')
      }
    } finally {
      setIsFetchingAres(false)
    }
  }

  const handleAddPreset = (presetText: string) => {
    setApplicatorNotes(prev => prev ? `${prev}\n• ${presetText}` : `• ${presetText}`)
  }

  // --- INICIALIZACE PDF S FONTEM A OPRAVDOVÝM LOGEM ---
  const initPdf = async () => {
    const doc = new jsPDF()
    const loadFont = async (url: string, name: string, style: string) => {
      try {
        const res = await fetch(url)
        if (!res.ok) return 
        const blob = await res.blob()
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve((reader.result as string).split(',')[1])
          reader.readAsDataURL(blob)
        })
        doc.addFileToVFS(`${name}-${style}.ttf`, base64)
        doc.addFont(`${name}-${style}.ttf`, name, style)
      } catch (e) {
        console.warn(`Font ${url} nelze načíst.`)
      }
    }
    await loadFont('/fonts/Roboto-Regular.ttf', 'Roboto', 'normal')
    await loadFont('/fonts/Roboto-Bold.ttf', 'Roboto', 'bold')
    doc.setFont('Roboto', 'normal') 

    let logoData = ''
    try {
      logoData = await getBase64ImageFromURL('/logo-orange.svg')
    } catch (e) {
      console.warn('SVG logo se nepodařilo načíst pro PDF.')
    }

    const drawLogo = (x: number, y: number, w: number, h: number) => {
      if (logoData) {
        doc.addImage(logoData, 'PNG', x, y, w, h)
      } else {
        doc.setFont("Roboto", "bold")
        doc.setFontSize(22)
        doc.setTextColor(0, 0, 0)
        doc.text("IZOLACE", x, y + 10)
        const tw = doc.getTextWidth("IZOLACE")
        doc.setFillColor(255, 135, 48) 
        doc.roundedRect(x + tw + 3, y + 3, 13, 9, 1.5, 1.5, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.text("RS", x + tw + 4.5, y + 9.5)
        doc.setTextColor(0, 0, 0) 
      }
    }
    return { doc, drawLogo }
  }

  // --- 1. SMLOUVA A NABÍDKA PDF ---
  const handleGenerateCombinedPDF = async () => {
    if (!techData || !selectedMaterial || !customerName) return alert("Vyplňte jméno zákazníka a parametry.")
    setIsGeneratingCombined(true)
    
    try {
      const { doc, drawLogo } = await initPdf()
      
      const generateOfferDetails = () => {
        const today = new Date()
        const future = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
        const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        return {
          current: today.toLocaleDateString('cs-CZ'),
          valid: future.toLocaleDateString('cs-CZ'),
          number: `NB-${today.getFullYear()}-${rand}`
        }
      }
      const offer = generateOfferDetails()
      
      // 1. Logo vlevo nahoře
      drawLogo(15, 15, 45, 35)

      // 2. Dodavatel (vlevo pod logem)
      doc.setFontSize(10)
      doc.setFont("Roboto", "bold")
      doc.text("Dodavatel (Zhotovitel):", 15, 60)
      doc.setFont("Roboto", "normal")
      doc.text(companyProfile?.companyName || "IZOLACE RS", 15, 66)
      doc.text(`IČO: ${companyProfile?.ico || "88707351"}`, 15, 71)
      doc.text(`Sídlo: Jihlava, Kraj Vysočina`, 15, 76)
      doc.text(`E-mail: info@izolacers.cz`, 15, 81)

      // 3. Odběratel (vpravo pod logem - ZAROVNÁNO)
      doc.setFontSize(10)
      doc.setFont("Roboto", "bold")
      doc.text("Odběratel (Zákazník):", 110, 60)
      doc.setFont("Roboto", "normal")
      doc.text(customerName, 110, 66)
      
      let currentYRight = 71
      if (ico) {
        doc.text(`IČO: ${ico}`, 110, currentYRight)
        currentYRight += 5
      }
      if (street) {
        doc.text(street, 110, currentYRight)
        currentYRight += 5
      }
      doc.text(`${city} ${zip || ''}`, 110, currentYRight)

      // 4. Hlavní nadpis
      doc.setFontSize(14)
      doc.setFont("Roboto", "bold")
      doc.text("CENOVÁ NABÍDKA A NÁVRH SMLOUVY O DÍLO", 105, 100, { align: "center" })

      // 5. Hlavičková tabulka
      let y = 110
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.2)
      doc.rect(15, y, 180, 28) 
      doc.line(15, y+7, 195, y+7)
      doc.line(15, y+14, 195, y+14)
      doc.line(15, y+21, 195, y+21)
      doc.line(105, y, 105, y+28) 

      doc.setFontSize(9)
      doc.setFont("Roboto", "bold")
      doc.text("Číslo nabídky:", 17, y+5)
      doc.text("Objekt:", 17, y+12)
      doc.text("Zákazník:", 17, y+19)
      doc.text("Adresa:", 17, y+26)

      doc.text("Datum:", 107, y+5)
      doc.text("Platí do:", 107, y+12)
      doc.text("IČO:", 107, y+19)
      doc.text("Kontaktní osoba:", 107, y+26)

      doc.setFont("Roboto", "normal")
      doc.text(offer.number, 45, y+5)
      doc.text(city || "-", 45, y+12)
      doc.text(customerName, 45, y+19)
      doc.text(`${street}, ${zip} ${city}`, 45, y+26)

      doc.text(offer.current, 135, y+5)
      doc.text(offer.valid, 135, y+12)
      doc.text(ico || "-", 135, y+19)
      doc.text(customerName, 135, y+26)

      y += 38

      const checkPageBreak = (currentY: number, heightNeeded: number) => {
        if (currentY + heightNeeded > 280) { doc.addPage(); return 20 }
        return currentY
      }

      const printParagraph = (num: string, title: string, texts: string[], startY: number) => {
        let currentY = checkPageBreak(startY, 15)
        doc.setFont("Roboto", "bold")
        doc.text(`${num}. ${title}`, 15, currentY)
        currentY += 5
        doc.setFont("Roboto", "normal")
        texts.forEach(text => {
          const lines = doc.splitTextToSize(text, 180)
          currentY = checkPageBreak(currentY, lines.length * 5)
          doc.text(lines, 15, currentY)
          currentY += lines.length * 5 + 1
        })
        return currentY + 4
      }

      y = printParagraph("1", "Předmět díla", ["Zhotovitel se zavazuje provést pro objednatele dodávku a odbornou aplikaci tepelně izolačního systému na objektu uvedeném v této nabídce, v rozsahu a za podmínek uvedených níže. Objednatel se zavazuje dílo převzít a uhradit sjednanou cenu."], y)

      y = checkPageBreak(y, 60)
      doc.setFont("Roboto", "bold")
      doc.text("2. Cenová nabídka", 15, y)
      y += 5

      doc.setFillColor(245, 245, 245)
      doc.rect(15, y, 180, 8, 'F')
      doc.rect(15, y, 180, 24)
      doc.line(15, y+8, 195, y+8)
      doc.line(15, y+16, 195, y+16)
      
      const vLines = [75, 95, 120, 150, 165]
      vLines.forEach(vx => doc.line(vx, y, vx, y+24))

      doc.setFontSize(8)
      doc.text("Označení dodávky", 17, y+5.5)
      doc.text("Množství", 77, y+5.5)
      doc.text("J. cena", 97, y+5.5)
      doc.text("Cena bez DPH", 122, y+5.5)
      doc.text("DPH", 152, y+5.5)
      doc.text("Cena s DPH", 167, y+5.5)

      doc.setFont("Roboto", "normal")
      const unitPrice = Math.round(basePrice / Number(area))
      doc.text(`Aplikace PUR pěny (${thickness} cm)`, 17, y+13)
      doc.text(`${area} m²`, 77, y+13)
      doc.text(`${unitPrice} Kč`, 97, y+13)
      doc.text(`${basePrice.toLocaleString('cs-CZ')} Kč`, 122, y+13)
      doc.text("21 %", 152, y+13)
      doc.text(`${totalPrice.toLocaleString('cs-CZ')} Kč`, 167, y+13)

      doc.text("Doprava materiálu", 17, y+21)
      doc.text("1 ks", 77, y+21)
      doc.text("-", 97, y+21)
      doc.text("V ceně", 122, y+21)
      doc.text("21 %", 152, y+21)
      doc.text("V ceně", 167, y+21)

      y += 24

      doc.setFontSize(9)
      doc.setFont("Roboto", "bold")
      doc.text("Součet bez DPH", 100, y+7)
      doc.text(`${basePrice.toLocaleString('cs-CZ')} Kč`, 167, y+7)
      
      doc.text("DPH celkem", 100, y+14)
      doc.text(`${vat.toLocaleString('cs-CZ')} Kč`, 167, y+14)

      doc.setFillColor(255, 135, 48)
      doc.rect(15, y+18, 180, 9, 'F')
      doc.setTextColor(255, 255, 255)
      doc.text("CELKEM K ÚHRADĚ", 100, y+24)
      doc.text(`${totalPrice.toLocaleString('cs-CZ')} Kč`, 167, y+24)
      
      doc.setTextColor(0, 0, 0)
      y += 35

      y = printParagraph("3", "Rozsah nabídky a podmínky realizace", ["Nabídka vychází z dostupných podkladů a z předpokládaného rozsahu prací. Konečný rozsah dodávky bude potvrzen po prohlídce místa a upřesnění technického řešení. Uvedené ceny jsou kalkulovány bez DPH; daň bude účtována v zákonné výši. Změny rozsahu nebo požadavky nad rámec této nabídky budou předem odsouhlaseny objednatelem. Termín provedení bude stanoven po vzájemné dohodě s ohledem na připravenost stavby a kapacity realizačního týmu."], y)
      y = printParagraph("4", "Cena a platební podmínky", [
        "Zálohová faktura ve výši 50 % bude vystavena po uzavření smlouvy. Záloha bude započtena na cenu díla a její vyúčtování bude provedeno v konečné faktuře.",
        "Zhotovitel není povinen zahájit realizaci díla před připsáním sjednané zálohy na svůj účet, pokud se smluvní strany nedohodnou jinak.",
        "Doplatek ceny díla bude uhrazen na základě konečné faktury vystavené po dokončení a předání díla.",
        "Cena díla je stanovena na základě rozsahu uvedeného v této nabídce. Vícepráce a dodávky nad rámec nabídky budou provedeny pouze po předchozím odsouhlasení objednatelem."
      ], y)
      y = printParagraph("5", "Termín a předání díla", ["Předpokládaný termín zahájení bude stanoven po vzájemné dohodě.", "Dílo je provedeno jeho dokončením a předáním objednateli."], y)
      y = printParagraph("6", "Záruka a odpovědnost za vady", [
        "Zhotovitel poskytuje objednateli záruku za jakost provedeného díla v délce 5 let ode dne předání díla.",
        "Záruka se vztahuje na vady provedené aplikací PUR pěny, které mají původ ve vadném provedení nebo nedodržení technologického postupu zhotovitelem, zejména na prokazatelné vady soudržnosti, oddělování vrstev, nadměrné smršťování či jiné vady způsobené provedením aplikace.",
        "Záruka se poskytuje v rozsahu vlastností použitého systému garantovaných výrobcem, pokud byly při realizaci dodrženy podmínky výrobce a systém byl vhodný pro danou konstrukci.",
        "Záruka se nevztahuje na vady způsobené mechanickým poškozením, zásahem třetí osoby, následnými stavebními úpravami, konstrukčními vadami objektu, nevhodným stavem podkladu, který nebylo možné při běžné kontrole zjistit, dlouhodobým působením vlhkosti nebo zatékáním, pokud nebyly způsobeny zhotovitelem, nevhodným užíváním ani jinými vnějšími vlivy nezpůsobenými zhotovitelem.",
        "Objednatel je povinen oznámit zjištěnou vadu zhotoviteli bez zbytečného odkladu a umožnit mu její prohlídku. Oprávněnou reklamaci zhotovitel odstraní v přiměřené lhůtě."
      ], y)
      y = printParagraph("7", "Součinnost objednatele", ["Objednatel je povinen zajistit zhotoviteli přístup k objektu, potřebnou součinnost a podmínky umožňující bezpečné provedení prací. Objednatel odpovídá za pravdivost jím poskytnutých údajů o objektu a konstrukci."], y)
      y = printParagraph("8", "Uzavření smlouvy", [
        "Tato cenová nabídka je současně návrhem smlouvy o dílo. Podpisem objednatele objednatel potvrzuje, že se seznámil s celým obsahem této nabídky včetně smluvních, záručních a platebních podmínek a přijímá ji jako návrh smlouvy o dílo.",
        "Smlouva o dílo je uzavřena okamžikem, kdy je podepsaná nabídka doručena zhotoviteli, pokud si strany písemně nesjednají jiný okamžik účinnosti.",
        "Nedílnou součástí smlouvy jsou údaje uvedené v cenové nabídce a případné písemné přílohy nebo technické podklady, na které tato nabídka výslovně odkazuje."
      ], y)
      y = printParagraph("9", "Závěrečná ustanovení", [
        "Případné změny nebo doplnění této smlouvy musí být provedeny písemně a odsouhlaseny oběma smluvními stranami.",
        "Právní vztahy neupravené touto smlouvou se řídí právním řádem České republiky, zejména příslušnými ustanoveními občanského zákoníku.",
        "Tato nabídka je platná do data uvedeného v záhlaví. Po uplynutí této lhůty není zhotovitel návrhem smlouvy vázán, pokud písemně nepotvrdí její prodloužení."
      ], y)

      y = checkPageBreak(y, 30)
      doc.setDrawColor(0, 0, 0)
      doc.rect(15, y, 180, 20)
      doc.line(105, y, 105, y+20)
      doc.setFont("Roboto", "bold")
      doc.text("Za zhotovitele:", 17, y+6)
      doc.text("Za objednatele:", 107, y+6)
      doc.setFont("Roboto", "normal")
      doc.text("Richard Molnár", 17, y+16)

      doc.save(`Nabidka-Smlouva-${customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e) {
      alert("Chyba při generování PDF. Zkontrolujte složku public/fonts.")
    } finally {
      setIsGeneratingCombined(false)
    }
  }

  // --- 2. ZÁLOHOVÁ FAKTURA PDF ---
  const handleGenerateInvoicePDF = async () => {
    if (!techData || !selectedMaterial || !customerName) return alert("Vyplňte jméno zákazníka a parametry.")
    if (!companyProfile?.bankAccount) return alert("Pro fakturu si v Nastavení doplňte číslo bankovního účtu!")
    
    setIsGeneratingInvoice(true)
    
    try {
      const { doc, drawLogo } = await initPdf()
      
      const generateInvoiceDetails = () => {
        const invoiceDate = new Date()
        const due = new Date(invoiceDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        return {
          date: invoiceDate,
          dueDate: due,
          vs: `${invoiceDate.getFullYear()}${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}${invoiceDate.getDate().toString().padStart(2, '0')}`
        }
      }
      
      const invoice = generateInvoiceDetails()
      const zaloha = Math.round(totalPrice * 0.5)
      
      drawLogo(15, 15, 45, 35)

      // Dodavatel
      doc.setFontSize(10)
      doc.setFont("Roboto", "bold")
      doc.text('Dodavatel:', 15, 60)
      doc.setFont("Roboto", "normal")
      doc.text(companyProfile?.companyName || 'IZOLACE RS', 15, 66)
      doc.text(`IČO: ${companyProfile?.ico || "88707351"}`, 15, 71)
      doc.text(`Sídlo: Jihlava, Kraj Vysočina`, 15, 76)
      doc.text(`E-mail: info@izolacers.cz`, 15, 81)
      
      // Odběratel (ZAROVNÁNO S DODAVATELEM)
      doc.setFontSize(10)
      doc.setFont("Roboto", "bold")
      doc.text("Odběratel:", 110, 60)
      doc.setFont("Roboto", "normal")
      doc.text(customerName, 110, 66)
      let currentYRight = 71
      if (ico) {
        doc.text(`IČO: ${ico}`, 110, currentYRight)
        currentYRight += 5
      }
      if (street) {
        doc.text(street, 110, currentYRight)
        currentYRight += 5
      }
      doc.text(`${city} ${zip || ''}`, 110, currentYRight)

      // Nadpis a čáry
      doc.setFontSize(20)
      doc.setFont("Roboto", "bold")
      doc.text("ZÁLOHOVÁ FAKTURA", 15, 100)

      doc.setFontSize(10)
      doc.setDrawColor(200, 200, 200)
      doc.line(15, 108, 195, 108)

      doc.setFont("Roboto", "normal")
      doc.text(`Datum vystavení: ${invoice.date.toLocaleDateString('cs-CZ')}`, 15, 118)
      doc.setFont("Roboto", "bold")
      doc.setTextColor(220, 38, 38)
      doc.text(`Datum splatnosti: ${invoice.dueDate.toLocaleDateString('cs-CZ')}`, 110, 118)
      doc.setTextColor(0, 0, 0)

      doc.setFont("Roboto", "normal")
      doc.text('Položka', 15, 135)
      doc.text('Částka s DPH', 150, 135)
      doc.line(15, 140, 195, 140)
      
      doc.setFont("Roboto", "bold")
      doc.text(`Záloha 50% na aplikaci PUR pěny (${selectedMaterial.name})`, 15, 150)
      doc.text(`${zaloha.toLocaleString('cs-CZ')} Kč`, 150, 150)

      doc.setFillColor(245, 245, 245)
      doc.rect(15, 170, 180, 45, 'F')
      doc.setFontSize(12)
      doc.text('PLATEBNÍ ÚDAJE:', 20, 182)
      
      doc.setFontSize(14)
      doc.text(`Číslo účtu: ${companyProfile.bankAccount}`, 20, 195)
      doc.text(`Variabilní symbol: ${invoice.vs}`, 20, 205)

      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.setFont("Roboto", "normal")
      doc.text('Nejedná se o daňový doklad. Vyúčtování proběhne konečnou fakturou po ukoncení prací.', 15, 230)

      doc.save(`Zalohovka-${customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e) {
      alert("Chyba při generování PDF.")
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = {
      customerName, ico, street, city, zip,
      materialName: selectedMaterial?.name || 'Nespecifikováno',
      area: String(area), thickness: String(thickness),
      totalCost: String(basePrice),
      applicatorNotes
    }

    let result;
    if (initialData.id) result = await updateQuote(initialData.id, formData)
    else result = await createQuote(formData)

    if (result.success) {
      router.push('/admin/quotes')
      router.refresh()
    } else {
      alert(result.error || 'Něco se pokazilo při ukládání.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start">
      
      {/* LEVÝ SLOUPEC: Formulář */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#FEFEFA] p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200 space-y-6 md:space-y-8">
        
        <div className="space-y-5 md:space-y-6">
          <h3 className="text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2">Údaje o zákazníkovi</h3>
          
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">IČO (pro firmy)</label>
            <div className="flex gap-2 md:gap-3">
              <input type="text" value={ico} onChange={(e) => setIco(e.target.value.replace(/\D/g, ''))} placeholder="Např. 00006947" className="w-full px-3 py-3 md:px-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] bg-zinc-50"/>
              <button type="button" onClick={fetchAresData} disabled={isFetchingAres} className="px-4 md:px-6 py-3 bg-[#000000] hover:bg-zinc-800 text-[#FEFEFA] font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0">
                {isFetchingAres ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span className="hidden sm:inline">Načíst</span>
              </button>
            </div>
            {aresError && <p className="text-red-500 text-sm flex items-center gap-1 mt-1"><AlertCircle size={14} /> {aresError}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Název firmy / Jméno *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-400"><Building2 size={18} /></div>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 pr-3 md:pl-11 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-3 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Ulice a č.p.</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-400"><MapPin size={18} /></div>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full pl-10 pr-3 md:pl-11 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Město *</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
            <div className="sm:col-span-1 space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">PSČ</label>
              <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50"/>
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6 pt-5 md:pt-6 border-t border-zinc-200">
          <h3 className="text-lg font-bold text-[#000000] border-b border-zinc-200 pb-2">Technická specifikace</h3>
          
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Materiál *</label>
            <select value={selectedMaterialId} onChange={(e) => setSelectedMaterialId(e.target.value)} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-medium bg-zinc-50/50 truncate">
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.type}, {m.density} kg/m³)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Plocha (m²) *</label>
              <input type="number" required value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-bold bg-zinc-50/50"/>
            </div>
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide">Tloušťka (cm) *</label>
              <input type="number" required value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full px-3 md:px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FF8730] outline-none text-[#000000] font-bold bg-zinc-50/50"/>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="flex justify-between items-center">
              <label className="flex text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide items-center gap-2">
                <Settings size={16} className="text-[#FF8730]" /> Předpokládaný přestřik
              </label>
              <span className="font-black text-[#FF8730] text-lg">{lossPercent} %</span>
            </div>
            <input 
              type="range" min="5" max="15" step="1" value={lossPercent}
              onChange={(e) => setLossPercent(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF8730]"
            />
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>5 % (Ideální podmínky)</span>
              <span>15 % (Ztížený přístup)</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <label className="flex text-xs md:text-sm font-bold text-zinc-700 uppercase tracking-wide items-center gap-2">
              <AlertCircle size={16} className="text-[#FF8730]" />
              Upozornění a pokyny pro aplikátora na stavbě
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleAddPreset('Volat vždy 30 minut předem zákazníkovi')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF8730] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">+ Volat 30 min předem</button>
              <button type="button" onClick={() => handleAddPreset('Zakrýt: Trámy, omítky + střešní okna')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF8730] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">+ Zakrýt trámy/okna</button>
              <button type="button" onClick={() => handleAddPreset('Přípojka 380 V, jistič 25 A + zásuvka pětikolík')} className="text-xs bg-zinc-100 hover:bg-orange-50 hover:text-[#FF8730] text-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer">+ Přípojka 380V</button>
            </div>
            <textarea 
              rows={4} value={applicatorNotes} onChange={(e) => setApplicatorNotes(e.target.value)} placeholder="• Zde se propisují jednotné pokyny pro aplikátora na stavbě..."
              className="w-full p-3 bg-zinc-50/50 border border-zinc-200 rounded-xl font-medium text-sm text-[#000000] focus:ring-2 focus:ring-[#FF8730] outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 py-3.5 bg-[#FF8730] hover:bg-[#E67020] text-[#FEFEFA] font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 hover:scale-[1.01] cursor-pointer">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {initialData.id ? 'Uložit změny v databázi' : 'Uložit do evidence'}
          </button>
        </div>
      </form>

      {/* PRAVÝ SLOUPEC: Obchodní cenotvorba a Dokumenty */}
      <div className="lg:col-span-1 space-y-4 md:space-y-6">
        
        {techData && (
          <div className="bg-[#FEFEFA] p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200">
            <h3 className="font-bold text-[#000000] mb-4 text-sm uppercase tracking-wide">Technická predikce spotřeby</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-center">
                <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Odhad sad k naložení</p>
                <p className="text-2xl font-black text-[#000000]">{techData.totalSets} <span className="text-sm font-medium text-zinc-500">ks</span></p>
                <p className="text-[10px] text-zinc-400 mt-1">Přesně: {techData.exactSets}</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-center">
                <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Předpoklad Graco A25</p>
                <p className="text-xl font-black text-[#000000] mt-1">{techData.estimatedLifts.toLocaleString('cs-CZ')} <span className="text-xs font-medium text-zinc-500">zdvihů</span></p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-3">
              <span>Čistý objem: {techData.pureVolumeM3} m³</span>
              <span className="text-red-500 font-bold">+ {techData.wastedVolumeM3} m³ odpad</span>
            </div>
          </div>
        )}

        <div className="bg-[#FEFEFA] p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-sm border border-zinc-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Percent className="text-[#FF8730]" size={20} />
            <h3 className="font-bold text-[#000000]">Obchodní marže</h3>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 mb-4">Nastavte procentuální přirážku k nákupní ceně materiálu.</p>
          <input 
            type="range" min="0" max="300" step="5" value={marginPercent}
            onChange={(e) => setMarginPercent(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF8730]"
          />
          <div className="text-center mt-3 font-black text-2xl text-[#FF8730]">{marginPercent} %</div>
        </div>

        {techData && (
          <div className="bg-linear-to-br from-[#000000] to-[#1a1a1a] p-5 sm:p-6 rounded-xl md:rounded-2xl shadow-lg text-[#FEFEFA] border border-zinc-800">
            <p className="text-zinc-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-2 border-b border-zinc-800 pb-2">Rozpad ceny</p>
            
            <div className="space-y-2 text-xs md:text-sm text-zinc-300 mb-4">
              <div className="flex justify-between">
                <span>Cena bez DPH:</span>
                <span className="font-medium text-[#FEFEFA]">{basePrice.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>DPH (21 %):</span>
                <span className="font-medium text-[#FEFEFA]">{vat.toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            <div className="text-3xl md:text-4xl font-black mb-4 text-[#FF8730] truncate pt-4 border-t border-zinc-700">
              {totalPrice.toLocaleString('cs-CZ')} <span className="text-xl">Kč</span>
            </div>
            
            <div className="space-y-2 text-xs md:text-sm text-zinc-300 pt-2 border-t border-zinc-800 mb-6">
              <div className="flex justify-between">
                <span>Čistý náklad (vč. odpadu):</span>
                <span className="font-medium text-[#FEFEFA]">{techData.exactMaterialCost.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>Záloha pro klienta (50 %):</span>
                <span className="font-bold text-[#FF8730]">{(totalPrice / 2).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Generování PDF</p>
              <button onClick={handleGenerateCombinedPDF} disabled={isGeneratingCombined || !customerName} type="button" className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm transition-colors flex items-center gap-3 cursor-pointer">
                {isGeneratingCombined ? <Loader2 size={18} className="animate-spin text-[#FF8730]" /> : <FileDown size={18} className="text-[#FF8730]" />} Smlouva o dílo a nabídka
              </button>
              <button onClick={handleGenerateInvoicePDF} disabled={isGeneratingInvoice || !customerName} type="button" className="w-full py-2.5 px-4 bg-[#FEFEFA] text-[#000000] hover:bg-zinc-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-3 cursor-pointer mt-2">
                {isGeneratingInvoice ? <Loader2 size={18} className="animate-spin text-[#FF8730]" /> : <Receipt size={18} className="text-[#FF8730]" />} Zálohová faktura (50 %)
              </button>
            </div>
            {!customerName && <p className="text-xs text-red-400 text-center mt-4">Pro generování PDF vyplňte zákazníka</p>}
            {!companyProfile?.bankAccount && customerName && <p className="text-xs text-amber-400 text-center mt-4">Pro fakturu chybí číslo účtu (Nastavení)</p>}
          </div>
        )}
      </div>
    </div>
  )
}