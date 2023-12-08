import Calendar from '@/components/calendar'
import PartyPageDisplay from '@/components/party-page-display'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getParty } from '@/lib/firebase/firestore'
import { getDictionary } from '@/locales/locale'
import { notFound, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default async function PartyPage({ params: { locale, partyId } }: any) {
    const { t } = getDictionary(locale)

    const party = await getParty(partyId)
    if (!party) {
        return notFound()
    }

    return (
        <>
            <PartyPageDisplay locale={locale} party={party} />
        </>
    )
}
