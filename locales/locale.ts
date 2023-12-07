import en from './en.json'
import zhTw from './zh-tw.json'

export const locales = ['zh-tw', 'en']
export const defaultLocale = 'zh-tw'

const dictionaries: any = {
    en,
    'zh-tw': zhTw,
}

export function useTranslation(locale: string) {
    const dict = dictionaries[locale]
    const t = (key: string) => dict?.[key] ?? key
    return { t }
}