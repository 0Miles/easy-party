'use client'

import { eachDayOfInterval } from 'date-fns'
import CalendarMonth from './calendar-month'
import { useContext } from 'react'
import { PartyContext } from './page-client/party-client'

export default function Calendar() {
    const { startDate, endDate } = useContext<any>(PartyContext)

    const months = []
    const availableDates = eachDayOfInterval({ start: startDate, end: endDate })

    let current = new Date(startDate)
    while (current <= endDate) {
        months.push(new Date(current))
        current.setMonth(current.getMonth() + 1)
        current.setDate(1)
    }

    return (
        <div className="@transition-up|.3s">
            {
                months.map((month) => <CalendarMonth key={month.getTime()} month={month} availableDates={availableDates} />)
            }
        </div>
    )
}
