import Calendar from '@/components/calendar'
import { getDictionary } from '@/locales/locale'
import Link from 'next/link'

export default function Home({ params: { locale } }: any) {
    const { t } = getDictionary(locale)
    return (
        <>
            <div className="m:0|auto max-w:xl p:16">
                <Link href={`/${locale}/new`}>{t('test')}</Link>
            </div>
        </>
    )
}
