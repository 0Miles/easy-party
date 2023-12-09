'use client'

import { useState, createContext, useEffect } from 'react'
import CalendarMonth from './calendar-month'
import { eachDayOfInterval } from 'date-fns'
import { useUserSession } from '@/contexts/user-session'
import { getParticipantsSnapshotByPartyId } from '@/lib/firebase/firestore'


export const CalendarContext: any = createContext<any>(null)

export default function Calendar({ party }: any) {

    const { user } = useUserSession()
    const [loading, setLoading] = useState<boolean>(true)
    const [myFreeDays, setMyFreeDays] = useState<string[]>([])
    const [participants, setParticipants] = useState<any[]>([])
    const [updateTimeout, setUpdateTimeout] = useState<any>()



    useEffect(() => {
        const unsubscribe = getParticipantsSnapshotByPartyId(
            party.id,
            (results) => {
                setParticipants(results ?? [])
                if (loading) {
                    setMyFreeDays((results ?? []).find((x: any) => x.uid === user.uid)?.freeDays ?? [])
                    setLoading(false)
                }
            }
        )

        return () => {
            unsubscribe()
        }
    }, [loading, party, user])


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
        <CalendarContext.Provider value={{ myFreeDays, setMyFreeDays, participants, party, updateTimeout, setUpdateTimeout }}>
            <div>
                {
                    !loading &&
                    months.map((month, index) => <CalendarMonth key={index} month={month} availableDates={availableDates} />)
                }
            </div>
        </CalendarContext.Provider>
    )
}
