import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EditPartyClient from '@/components/page-client/edit-party-client'
import { getPartyData } from '../page'
import { getDictionary } from '@/locales/locale'
import NProgressDone from '@/components/nprogress-done'

export async function generateMetadata(
    { params }: any
): Promise<Metadata> {
    const { t } = getDictionary(params.locale)
    const party = await getPartyData(params.partyId)

    if (!party) {
        return {}
    }

    return {
        title: t('Edit') + ' ' + party.name + ' | Easy Party',
        description: party.desc ?? '',
        openGraph: {
            images: [party.image ?? '/images/default.png'],
        },
    }
}


export default async function PartyPage({ params: { locale, partyId } }: any) {
    const party = await getPartyData(partyId)
    if (!party) {
        return notFound()
    }

    return (
        <>
            <NProgressDone />
            <EditPartyClient locale={locale} party={party} />
        </>
    )
}
