import React from 'react'
import CalendarMonth from './calendar-month'
import { eachDayOfInterval } from 'date-fns'

export default function Calendar({ startDate, endDate }: any) {
    const months = []

    const availableDates = eachDayOfInterval({ start: startDate, end: endDate })

    let current = new Date(startDate)
    while (current <= endDate) {
        months.push(new Date(current))
        current.setMonth(current.getMonth() + 1)
        current.setDate(1)
    }

    return (
        <div>
            {
                months.map((month, index) => <CalendarMonth key={index} month={month} availableDates={availableDates} />)
            }
        </div>
    )
}
