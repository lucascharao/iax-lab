/** WhatsApp com mensagem pronta: a pessoa veio do site. */
const PHONE = '5551991882447'

const DEFAULT_MESSAGE =
  'Olá! Vim pelo site da IAX LAB (iaxlab.top) e quero conversar sobre IA na minha empresa.'

export function whatsappUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

/** Link padrão usado em todos os CTAs do site. */
export const WA = whatsappUrl()
