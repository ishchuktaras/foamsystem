// src/lib/pdfGenerator.ts
import jsPDF from 'jspdf'

export interface PDFDataParams {
  customerName: string
  ico: string
  street: string
  city: string
  zip: string
  materialName: string
  area: string | number
  thickness: string | number
  basePrice: number
  vat: number
  totalPrice: number
  companyProfile: {
    companyName?: string | null
    ico?: string | null
    email?: string | null
    phone?: string | null
    bankAccount?: string | null
  } | null
}

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

export const initPdf = async () => {
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

export const generateCombinedPDF = async (data: PDFDataParams) => {
  const { doc, drawLogo } = await initPdf()
      
  const today = new Date()
  const future = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const offerNumber = `NB-${today.getFullYear()}-${rand}`
  const offerCurrent = today.toLocaleDateString('cs-CZ')
  const offerValid = future.toLocaleDateString('cs-CZ')
  
  drawLogo(15, 15, 45, 35)

  doc.setFontSize(10)
  doc.setFont("Roboto", "bold")
  doc.text("Dodavatel (Zhotovitel):", 15, 60)
  doc.setFont("Roboto", "normal")
  doc.text(data.companyProfile?.companyName || "IZOLACE RS", 15, 66)
  doc.text(`IČO: ${data.companyProfile?.ico || "88707351"}`, 15, 71)
  doc.text(`Sídlo: Jihlava, Kraj Vysočina`, 15, 76)
  doc.text(`E-mail: info@izolacers.cz`, 15, 81)

  doc.setFontSize(10)
  doc.setFont("Roboto", "bold")
  doc.text("Odběratel (Zákazník):", 110, 60)
  doc.setFont("Roboto", "normal")
  doc.text(data.customerName, 110, 66)
  
  let currentYRight = 71
  if (data.ico) { doc.text(`IČO: ${data.ico}`, 110, currentYRight); currentYRight += 5 }
  if (data.street) { doc.text(data.street, 110, currentYRight); currentYRight += 5 }
  doc.text(`${data.city} ${data.zip || ''}`, 110, currentYRight)

  doc.setFontSize(14)
  doc.setFont("Roboto", "bold")
  doc.text("CENOVÁ NABÍDKA A NÁVRH SMLOUVY O DÍLO", 105, 100, { align: "center" })

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
  doc.text(offerNumber, 45, y+5)
  doc.text(data.city || "-", 45, y+12)
  doc.text(data.customerName, 45, y+19)
  doc.text(`${data.street}, ${data.zip} ${data.city}`, 45, y+26)

  doc.text(offerCurrent, 135, y+5)
  doc.text(offerValid, 135, y+12)
  doc.text(data.ico || "-", 135, y+19)
  doc.text(data.customerName, 135, y+26)

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
  const unitPrice = Math.round(data.basePrice / Number(data.area))
  doc.text(`Aplikace PUR pěny (${data.thickness} cm)`, 17, y+13)
  doc.text(`${data.area} m²`, 77, y+13)
  doc.text(`${unitPrice} Kč`, 97, y+13)
  doc.text(`${data.basePrice.toLocaleString('cs-CZ')} Kč`, 122, y+13)
  doc.text("21 %", 152, y+13)
  doc.text(`${data.totalPrice.toLocaleString('cs-CZ')} Kč`, 167, y+13)

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
  doc.text(`${data.basePrice.toLocaleString('cs-CZ')} Kč`, 167, y+7)
  
  doc.text("DPH celkem", 100, y+14)
  doc.text(`${data.vat.toLocaleString('cs-CZ')} Kč`, 167, y+14)

  doc.setFillColor(255, 135, 48)
  doc.rect(15, y+18, 180, 9, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text("CELKEM K ÚHRADĚ", 100, y+24)
  doc.text(`${data.totalPrice.toLocaleString('cs-CZ')} Kč`, 167, y+24)
  
  doc.setTextColor(0, 0, 0)
  y += 35

  y = printParagraph("3", "Rozsah nabídky a podmínky realizace", ["Nabídka vychází z dostupných podkladů a z předpokládaného rozsahu prací. Konečný rozsah dodávky bude potvrzen po prohlídce místa a upřesnění technického řešení. Uvedené ceny jsou kalkulovány bez DPH; daň bude účtována v zákonné výši. Změny rozsahu nebo požadavky nad rámec této nabídky budou předem odsouhlaseny objednatelem. Termín provedení bude stanoven po vzájemné dohodě s ohledem na připravenost stavby a kapacity realizačního týmu."], y)
  y = printParagraph("4", "Cena a platební podmínky", [
    "Zálohová faktura ve výši 80 % bude vystavena po uzavření smlouvy. Záloha bude započtena na cenu díla a její vyúčtování bude provedeno v konečné faktuře.",
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

  doc.save(`Nabidka-Smlouva-${data.customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

export const generateInvoicePDF = async (data: PDFDataParams) => {
  const { doc, drawLogo } = await initPdf()
      
  const invoiceDate = new Date()
  const dueDate = new Date(invoiceDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  const vs = `${invoiceDate.getFullYear()}${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}${invoiceDate.getDate().toString().padStart(2, '0')}`
  const zaloha = Math.round(data.totalPrice * 0.8)
  
  drawLogo(15, 15, 45, 35)

  doc.setFontSize(10)
  doc.setFont("Roboto", "bold")
  doc.text('Dodavatel:', 15, 60)
  doc.setFont("Roboto", "normal")
  doc.text(data.companyProfile?.companyName || 'IZOLACE RS', 15, 66)
  doc.text(`IČO: ${data.companyProfile?.ico || "88707351"}`, 15, 71)
  doc.text(`Sídlo: Jihlava, Kraj Vysočina`, 15, 76)
  doc.text(`E-mail: info@izolacers.cz`, 15, 81)
  
  doc.setFontSize(10)
  doc.setFont("Roboto", "bold")
  doc.text("Odběratel:", 110, 60)
  doc.setFont("Roboto", "normal")
  doc.text(data.customerName, 110, 66)
  let currentYRight = 71
  if (data.ico) { doc.text(`IČO: ${data.ico}`, 110, currentYRight); currentYRight += 5 }
  if (data.street) { doc.text(data.street, 110, currentYRight); currentYRight += 5 }
  doc.text(`${data.city} ${data.zip || ''}`, 110, currentYRight)

  doc.setFontSize(20)
  doc.setFont("Roboto", "bold")
  doc.text("ZÁLOHOVÁ FAKTURA", 15, 100)

  doc.setFontSize(10)
  doc.setDrawColor(200, 200, 200)
  doc.line(15, 108, 195, 108)

  doc.setFont("Roboto", "normal")
  doc.text(`Datum vystavení: ${invoiceDate.toLocaleDateString('cs-CZ')}`, 15, 118)
  doc.setFont("Roboto", "bold")
  doc.setTextColor(220, 38, 38)
  doc.text(`Datum splatnosti: ${dueDate.toLocaleDateString('cs-CZ')}`, 110, 118)
  doc.setTextColor(0, 0, 0)

  doc.setFont("Roboto", "normal")
  doc.text('Položka', 15, 135)
  doc.text('Částka s DPH', 150, 135)
  doc.line(15, 140, 195, 140)
  
  doc.setFont("Roboto", "bold")
  doc.text(`Záloha 80 % na aplikaci PUR pěny (${data.materialName})`, 15, 150)
  doc.text(`${zaloha.toLocaleString('cs-CZ')} Kč`, 150, 150)

  doc.setFillColor(245, 245, 245)
  doc.rect(15, 170, 180, 45, 'F')
  doc.setFontSize(12)
  doc.text('PLATEBNÍ ÚDAJE:', 20, 182)
  
  doc.setFontSize(14)
  doc.text(`Číslo účtu: ${data.companyProfile?.bankAccount || ''}`, 20, 195)
  doc.text(`Variabilní symbol: ${vs}`, 20, 205)

  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.setFont("Roboto", "normal")
  doc.text('Nejedná se o daňový doklad. Vyúčtování proběhne konečnou fakturou po ukoncení prací.', 15, 230)

  doc.save(`Zalohovka-${data.customerName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}