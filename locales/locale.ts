import en from './en.json'
import zhTw from './zh-tw.json'

export const locales = ['zh-tw', 'en']
export const defaultLocale = 'en'

const dictionaries: any = {
    en,
    'zh-tw': zhTw,
}

export function getDictionary(locale: string) {
    const dict = dictionaries[locale]
    const t = (key: string) => dict?.[key] ?? key
    return { t }
}

export const formatString = (template: string, ...args: any[]) => {
    return template.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === 'undefined' ? match : args[index]
    })
}