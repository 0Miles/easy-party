import Calendar from '@/components/calendar'
import { useTranslation } from '@/locales/locale'
import Link from 'next/link'

export default function Home({ params: { locale } }: any) {
    const { t } = useTranslation(locale)
    return (
        <>
            <div className="m:0|auto max-w:xl p:16">
                <Link href="/new">{t('test')}</Link>
            </div>
        </>
    )
}
