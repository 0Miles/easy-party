import { getDictionary } from '@/locales/locale'

export default function PleaseSignIn({ locale }: any) {
    const { t } = getDictionary(locale)

    return (
        <div className="flex flex:col justify-content:center align-items:center p:48 p:16@<sm overflow:clip">
            <h1 className="mt:60 f:52 f:36@<sm">{t('Please sign in first')}</h1>
            <h2 className="mt:30 mb:60 f:28 f:16@<sm font-weight:normal">{t('You need to sign in to proceed with subsequent operations')}</h2>
        </div>
    )
}