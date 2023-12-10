'use client'

import { eachDayOfInterval } from 'date-fns'
import CalendarMonth from './calendar-month'

export default function Calendar({ party }: any) {

    const startDate = new Date(party.startDate)
    const endDate = new Date(party.endDate)

    const months = []
    const availableDates = eachDayOfInterval({ start: startDate, end: endDate })

    let current = new Date()
    while (current <= endDate) {
        months.push(new Date(current))
        current.setMonth(current.getMonth() + 1)
        current.setDate(1)
    }

    return (
        <div className="@transition-up|.3s">
            {
                months.map((month, index) => <CalendarMonth key={index} month={month} availableDates={availableDates} />)
            }
        </div>
    )
}
