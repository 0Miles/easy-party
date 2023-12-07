import React from 'react'
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import CalendarDay from './calendar-day'

export default function CalendarMonth({ month, availableDates }: any) {
    const firstDay = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const lastDay = endOfMonth(month)
    const days = eachDayOfInterval({ start: firstDay, end: lastDay })

    return (
        <div className="flex flex:col align-items:center">
            <h3>
                {format(month, 'MMMM yyyy')}
            </h3>
            <div className="grid grid-cols:7 w:100% gap:4 hide@<sm">
                {
                    [0, 1, 2, 3, 4, 5, 6].map(offset =>
                        <div key={offset} className="p:8 text-align:center">
                            {format(addDays(firstDay, offset), 'E')}
                        </div>
                    )
                }
            </div>
            <div className="grid grid-cols:7 grid-cols:1@<sm w:100% gap:4">
                {
                    days.map((day, index) =>
                        <CalendarDay key={index} month={month} day={isSameMonth(day, month) && day} availableDates={availableDates} />
                    )
                }
            </div>
        </div>
    )
}