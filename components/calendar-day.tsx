'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useUserSession } from '@/contexts/user-session'
import { PartyContext } from './page-client/party-client'
import { updateParticipantToParty } from '@/lib/firebase/firestore'
import * as Tooltip from '@radix-ui/react-tooltip'
import CalendarAvatar from './calendar-avatar'

export default function CalendarDay({ day, availableDates }: any) {

    const { myFreeDays, setMyFreeDays, party, participants, updateTimeout, setUpdateTimeout, selectedCharacter, filterResult } = useContext<any>(PartyContext)
    const { user } = useUserSession()
    const available = day && availableDates.find((x: Date) => x.getTime() === day.getTime())
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
                    bg:hsl(${20 + headcountRatio}|${headcountRatio}%|12%) bg:hsl(${120}|${headcountRatio}%|90%)@light
                    ${isHighlight ? 'transform:translate(-10,0) transform:translate(-5,-10)@sm b:1 b:solid b:#46841c b:#68d14b@light bg:#003602! bg:#ccf3ba!@light box-shadow:5|10|5|black/.2' : ''}
                    ~background-color|.2s,transform|.2s overflow:clip r:2
                    p:8 text-align:left min-h:80 flex flex:col mr:2:hover>div>img
                `}
            onClick={() => available && handleMyFreeDayChange()}>

            {
                !!day &&
                <div className="flex">
                    <span className="mr:8">
                        <span className="hide@xs">
                            {format(day, 'yyyy/MM/')}
                        </span>
                        {format(day, 'dd')}
                    </span>
                    <span className={`inline-block w:36 hide@xs ${['1', '7'].includes(format(day, 'e')) ? 'fg:red-70 fg:red-50@light' : ''}`}>
                        {format(day, 'E')}
                    </span>
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
                            <CalendarAvatar key={index} className={`z:${998 - index}`} src={participant.avatarUrl} displayName={participant.displayName ?? ''} />

                    )
                }
            </div>
        </div>
    )
}