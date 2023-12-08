import React from 'react'
import { format } from 'date-fns'

export default function CalendarDay({ day, availableDates }: any) {
    const available = day && availableDates.find((x: Date) => x.getTime() === day.getTime())

    return (
        <div className={`
                    ${!day ? 'hide@<xs' : 'bg:gray-10 bg:gray-90@light'}
                    ${available ? 'cursor:pointer' : 'opacity:.35 hide@<xs'}
                    p:8 text-align:left min-h:80
                `}>
            {
                !!day &&
                <>
                    <span className="inline-block w:86@<xs">
                        <span className="hide@xs">
                            {format(day, 'yyyy/MM/')}
                        </span>
                        {format(day, 'dd')}
                    </span>
                    <span className={`inline-block w:36 hide@xs ${['1', '7'].includes(format(day, 'e')) ? 'fg:red-70 fg:red-50@light' : ''}`}>
                        {format(day, 'E')}
                    </span>
                </>
            }
        </div>
    )
}