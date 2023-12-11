'use client'

import { eachDayOfInterval } from 'date-fns'
import CalendarResultItem from './calendar-result-item'
import { useUserSession } from '@/contexts/user-session'
import { useContext } from 'react'
import { PartyContext } from './page-client/party-client'
import { format } from 'date-fns'

export default function CalendarResult({ party }: any) {
    const { user } = useUserSession()
    const { selectedCharacter, participants, filterResult } = useContext<any>(PartyContext)

    const startDate = new Date(party.startDate)
    const endDate = new Date(party.endDate)

    const availableDays = eachDayOfInterval({ start: startDate, end: endDate })
                                .map(date => {
                                    const dayString = format(date, 'yyyy-MM-dd')
                                    return {
                                        day: date,
                                        dayString, 
                                        freeParticipants: participants?.filter((x: any) => x.freeDays.includes(dayString)) ?? [],
                                        notFreeParticipants: participants?.filter((x: any) => !x.freeDays.includes(dayString)) ?? []
                                    }
                                })
                                .sort((a: any, b: any) => b.freeParticipants.length - a.freeParticipants.length)
                                .filter(x => x.freeParticipants.length)

    return (
        <div className="@transition-up|.3s flex flex:col my:30 gap:8">
            {
                availableDays.map((availableDay) => 
                    <CalendarResultItem key={availableDay.day}
                        day={availableDay.day}
                        dayString={availableDay.dayString}
                        freeParticipants={availableDay.freeParticipants}
                        notFreeParticipants={availableDay.notFreeParticipants} />)
            }
        </div>
    )
}
