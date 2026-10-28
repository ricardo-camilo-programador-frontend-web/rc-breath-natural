import emailjs from '@emailjs/browser'
import type { ContactFormData } from '@/schemas/contactSchema'

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

export interface EmailjsConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

/** Returns the EmailJS config when every variable is set, otherwise null (form must not send). */
export function getEmailjsConfig(
  serviceId: string | undefined = EMAILJS_SERVICE_ID,
  templateId: string | undefined = EMAILJS_TEMPLATE_ID,
  publicKey: string | undefined = EMAILJS_PUBLIC_KEY
): EmailjsConfig | null {
  if (!serviceId || !templateId || !publicKey) return null
  return { serviceId, templateId, publicKey }
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const config = getEmailjsConfig()
  if (!config) throw new Error('emailjs-not-configured')
  await emailjs.send(
    config.serviceId,
    config.templateId,
    { ...data },
    { publicKey: config.publicKey }
  )
}
