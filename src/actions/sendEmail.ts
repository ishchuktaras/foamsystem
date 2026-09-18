// src/actions/sendEmail.ts
'use server'

import nodemailer from 'nodemailer'

export async function sendInquiryNotification(data: {
  customerName: string
  phone: string
  email: string
  message: string
  quoteId?: string
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'wes1-smtp.wedos.net',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'poptavky@izolacers.cz',
        pass: process.env.SMTP_PASSWORD, // Heslo z .env souboru
      },
    })

    const adminLink = data.quoteId 
      ? `https://izolacers.cz/admin/quotes/${data.quoteId}` 
      : `https://izolacers.cz/admin/quotes`

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FF8730; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Nová poptávka z webu</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-bottom: 8px;"><strong>Jméno / Firma:</strong> ${data.customerName}</p>
          <p style="margin-bottom: 8px;"><strong>Telefon:</strong> ${data.phone}</p>
          <p style="margin-bottom: 8px;"><strong>E-mail:</strong> ${data.email}</p>
          <p style="margin-top: 20px;"><strong>Zpráva / Parametry:</strong></p>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #f3f4f6; color: #374151;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${adminLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Otevřít v interním systému
            </a>
          </div>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: '"IZOLACE RS Web" <poptavky@izolacers.cz>',
      to: 'poptavky@izolacers.cz',
      subject: `Nová poptávka: ${data.customerName}`,
      html: htmlBody,
    })

    return { success: true }
  } catch (error) {
    console.error('Chyba při odesílání e-mailu:', error)
    return { success: false, error: 'Nepodařilo se odeslat e-mailové upozornění.' }
  }
}