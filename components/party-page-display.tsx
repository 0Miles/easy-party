'use client'

import Calendar from '@/components/calendar'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'

export default function PartyPageDisplay({ locale, party }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()

    return (
        <>
            {
                !user && user !== undefined &&
                <PleaseSignIn locale={locale} />
            }
            {
                !!user &&
                <div className="p:16">
                    {
                        !!party &&
                        <Calendar startDate={new Date(party.startDate)} endDate={new Date(party.endDate)} />
                    }
                </div>
            }
        </>
    )
}
