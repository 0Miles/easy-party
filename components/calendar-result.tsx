'use client'

import { eachDayOfInterval, format, startOfDay } from 'date-fns'
import CalendarResultItem from './calendar-result-item'
import { useContext } from 'react'
import { PartyContext } from './page-client/party-client'

export default function CalendarResult() {
    const { participants, startDate, endDate } = useContext<any>(PartyContext)
    const today = startOfDay(new Date())
    const resultStartDay = startDate > today ? startDate : today
    const availableDays = endDate < resultStartDay ? [] : eachDayOfInterval({ start: resultStartDay, end: endDate })
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
                    <CalendarResultItem key={availableDay.day.getTime()}
                        day={availableDay.day}
                        dayString={availableDay.dayString}
                        freeParticipants={availableDay.freeParticipants}
                        notFreeParticipants={availableDay.notFreeParticipants} />)
            }
        </div>
    )
}
