import NewPartyClient from '@/components/page-client/new-party-client'
import { getDictionary } from '@/locales/locale'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params }: any
): Promise<Metadata> {
    const { t } = getDictionary(params.locale)

    return {
        title: t('New Party') + ' | Easy Party',
    }
}

export default function NewParty({ params: { locale } }: any) {
    const { t } = getDictionary(locale)


    return (

        <>
            <NewPartyClient locale={locale} />
        </>
    )
}
