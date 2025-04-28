'use client'

import React, { useMemo } from 'react'
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import CalendarDay from './calendar-day'

export default function CalendarMonth({ month, availableDates }: any) {
    const { days, weekDays } = useMemo(() => {
        const firstDay = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
        const lastDay = endOfMonth(month)
        const days = eachDayOfInterval({ start: firstDay, end: lastDay })
        const weekDays = [0, 1, 2, 3, 4, 5, 6].map(offset => 
            format(addDays(firstDay, offset), 'E')
        )
        
        return { days, weekDays }
    }, [month])

    const formattedMonth = useMemo(() => format(month, 'MMMM yyyy'), [month])

    return (
        <div className="flex flex:col align-items:center">
            <h3 className="mb:20 mt:30">
                {formattedMonth}
            </h3>
            <div className="grid grid-cols:7 w:100% gap:4 hide@<xs">
                {
                    weekDays.map((weekDay, offset) =>
                        <div key={offset} className="p:8 text-align:center">
                            {weekDay}
                        </div>
                    )
                }
            </div>
            <div className="grid grid-cols:7 grid-cols:1@<xs w:100% gap:4">
                {
                    days.map((day) => (
                        <CalendarDay 
                            key={day.getTime()} 
                            month={month} 
                            day={isSameMonth(day, month) && day} 
                            availableDates={availableDates} 
                        />
                    ))
                }
            </div>
        </div>
    )
}