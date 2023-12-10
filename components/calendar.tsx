'use client'

import { useState, createContext, useEffect } from 'react'
import { eachDayOfInterval } from 'date-fns'
import { useUserSession } from '@/contexts/user-session'
import { getParticipantsSnapshotByPartyId } from '@/lib/firebase/firestore'
import CalendarMonth from './calendar-month'


export const CalendarContext: any = createContext<any>(null)

export default function Calendar({ party, selectedCharacter }: any) {

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
                    setMyFreeDays((results ?? [])
                        .find((x: any) => 
                            selectedCharacter.googleUser && x.uid === user.uid
                            || !selectedCharacter.googleUser && x.characterId === selectedCharacter.id
                            )?.freeDays ?? [])
                    setLoading(false)
                }
            }
        )

        return () => {
            unsubscribe()
        }
    }, [loading, party, selectedCharacter, user])


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
        <CalendarContext.Provider value={{ myFreeDays, setMyFreeDays, participants, party, updateTimeout, setUpdateTimeout, selectedCharacter }}>
            <div>
                {
                    !loading &&
                    months.map((month, index) => <CalendarMonth key={index} month={month} availableDates={availableDates} />)
                }
            </div>
        </CalendarContext.Provider>
    )
}
