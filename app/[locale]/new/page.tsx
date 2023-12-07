import Calendar from '@/components/calendar'
import { getDictionary } from '@/locales/locale'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(
    { params, searchParams }: any,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { t } = getDictionary(params.locale)

    return {
        title: t('New Party') + ' | Easy Party',
    }
}

export default function NewParty() {

    return (
        <>
            <div className="m:0|auto max-w:xl p:16">

            </div>
        </>
    )
}
