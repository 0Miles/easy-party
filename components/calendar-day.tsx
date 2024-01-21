'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react'
import { format, startOfDay} from 'date-fns'
import { useUserSession } from '@/contexts/user-session'
import { PartyContext } from './page-client/party-client'
import { updateParticipantToParty } from '@/lib/firebase/firestore'
import CalendarAvatar from './calendar-avatar'

export default function CalendarDay({ day, availableDates }: any) {

    const { myFreeDays, setMyFreeDays, party, participants, updateTimeout, setUpdateTimeout, selectedCharacter, filterResult } = useContext<any>(PartyContext)
    const { user } = useUserSession()
    const available = day && day >= startOfDay(new Date()) && availableDates.find((x: Date) => x.getTime() === day.getTime())
    const dayString = day && format(day, 'yyyy-MM-dd')
    const [isMyFreeDay, setIsMyFreeDay] = useState(!!myFreeDays.find((x: any) => x === dayString))
    const [isHighlight, setIsHighlight] = useState(false)

    const [otherFreeParticipants, setOtherFreeParticipants] = useState([])
    const [headcountRatio, setHeadcountRatio] = useState<number>(0)

    useEffect(() => {
        setHeadcountRatio((((otherFreeParticipants?.length ?? 0) + (isMyFreeDay ? 1 : 0)) / (participants?.length ? participants.length : 1)) * 100)
    }, [isMyFreeDay, otherFreeParticipants, participants])

    useEffect(() => {
        setOtherFreeParticipants(participants.filter((x: any) => (selectedCharacter.googleUser && x.uid !== user?.uid
            || !selectedCharacter.googleUser && x.characterId !== selectedCharacter.id)
            && x.freeDays.includes(dayString)))
    }, [dayString, participants, selectedCharacter, user])

    useEffect(() => {
        setIsHighlight(filterResult?.length && filterResult.find((x: string) => x === dayString))
    }, [dayString, filterResult, participants])

    const handleMyFreeDayChange = () => {
        if (!isMyFreeDay) {
            myFreeDays.push(dayString)
        } else {
            myFreeDays.splice(myFreeDays.indexOf(dayString), 1)
        }
        setMyFreeDays(myFreeDays)
        setIsMyFreeDay(!isMyFreeDay)

        clearTimeout(updateTimeout)
        const newTimeout = setTimeout(async () => {
            await updateParticipantToParty(party.id, {
                freeDays: myFreeDays
            }, selectedCharacter)
        }, 1000)
        setUpdateTimeout(newTimeout)
    }

    return (
        <div className={`
                    ${!day ? 'hide@<xs' : ''}
                    ${available ? 'cursor:pointer' : 'opacity:.35 hide@<xs'}
                    bg:hsl(${20 + headcountRatio}|${headcountRatio}%|12%) bg:hsl(${20 + headcountRatio * .9}|${headcountRatio * .8}%|84%)@light
                    ${isHighlight ? 'b:#356b11 b:#68d14b@light' : 'b:gray/.0'} b:3 b:solid
                    ~background-color|.2s,border-color|.2s overflow:clip r:2
                    p:8 text-align:left min-h:80 flex flex:col mr:2:hover>div>img
                `}
            onClick={() => available && handleMyFreeDayChange()}
            onKeyDown={(e) => {
                if ((e.key === ' ' || e.keyCode === 32)) {
                    e.preventDefault()
                    available && handleMyFreeDayChange()
                }
            }}
            tabIndex={0}>

            {
                !!day &&
                <div className="flex">
                    <div className="mr:8">
                        <span className="hide@xs">
                            {format(day, 'yyyy/MM/')}
                        </span>
                        {format(day, 'dd')}
                    </div>
                    <div className={`w:36 hide@xs ${['1', '7'].includes(format(day, 'e')) ? 'fg:red-70 fg:red-50@light' : ''}`}>
                        {format(day, 'E')}
                    </div>
                </div>
            }
            <div className="flex flex:1 align-items:end {r:50%;24x24;mr:-16;~margin-right|.2s}>img user-select:none">
                {
                    isMyFreeDay &&
                    <CalendarAvatar className={`z:999`} src={selectedCharacter.avatarUrl} displayName={selectedCharacter.name ?? ''} />
                }
                {
                    otherFreeParticipants.map(
                        (participant: any, index: number) =>
                            <CalendarAvatar key={participant.uid ?? participant.characterId} className={`z:${998 - index}`} src={participant.avatarUrl} displayName={participant.displayName ?? ''} />
                    )
                }
            </div>
        </div>
    )
}