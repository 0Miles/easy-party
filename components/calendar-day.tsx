import React from 'react'
import { format } from 'date-fns'

export default function CalendarDay({ day, availableDates }: any) {
    const available = day && availableDates.find((x: Date) => x.getTime() === day.getTime())

    return <div className={`
                    ${!day ? 'hide@<sm' : 'bg:gray'}
                    ${available ? '' : 'opacity:.5'}
                    p:8 text-align:left 
                `}>
        {
            !!day && format(day, 'd')
        }
    </div>
}