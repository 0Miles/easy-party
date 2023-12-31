import { cache } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getParty } from '@/lib/firebase/firestore'
import PartyClient from '@/components/page-client/party-client'
import NProgressDone from '@/components/nprogress-done'

export const getPartyData = cache(async (partyId: string) => {
    const party = await getParty(partyId)
    if (party?.timestamp) {
        delete party.timestamp
    }
    return party
})

export async function generateMetadata(
    { params }: any
): Promise<Metadata> {
    
    const party = await getPartyData(params.partyId)

    if (!party) {
        return {}
    }

    return {
        title: party.name + ' | Easy Party',
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
            <PartyClient locale={locale} party={party} />
        </>
    )
}
