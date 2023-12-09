'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useUserSession } from '@/contexts/user-session'
import { CalendarContext } from './calendar'
import { updateParticipantToParty } from '@/lib/firebase/firestore'
import * as Tooltip from '@radix-ui/react-tooltip'

export default function CalendarDay({ day, availableDates }: any) {

    const { myFreeDays, setMyFreeDays, party, participants, updateTimeout, setUpdateTimeout } = useContext<any>(CalendarContext)
    const { user } = useUserSession()
    const available = day && availableDates.find((x: Date) => x.getTime() === day.getTime())
    const dayString = day && format(day, 'yyyy-MM-dd')
    const [isMyFreeDay, setIsMyFreeDay] = useState(!!myFreeDays.find((x: any) => x === dayString))

    const [otherFreeParticipants, setOtherFreeParticipants] = useState([])

    useEffect(() => {
        setOtherFreeParticipants(participants.filter((x: any) => x.uid !== user.uid && x.freeDays.includes(dayString)))
    }, [dayString, participants, user])

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
            })
        }, 1000)
        setUpdateTimeout(newTimeout)
    }

    return (
        <div className={`
                    ${!day ? 'hide@<xs' : ''}
                    ${available ? 'cursor:pointer' : 'opacity:.35 hide@<xs'}
                    ${isMyFreeDay ? 'bg:rgb(48,53,47) bg:rgb(222,240,217)@light' : 'bg:gray-10 bg:gray-90@light'}
                    ~background-color|.2s
                    p:8 text-align:left min-h:80 flex flex:col mr:2:hover>div>img
                `}
            onClick={() => available && handleMyFreeDayChange()}>

            {
                !!day &&
                <div className="flex">
                    <span className="inline-block w:86@<xs">
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
            <div className="flex flex:1 align-items:end {r:50%;24x24;mr:-16;~margin-right|.2s}>img">
                {
                    otherFreeParticipants.map(
                        (participant: any, index: number) =>
                            <Tooltip.Provider key={index}>
                                <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                        <img src={participant.avatar} alt={participant.displayName} />
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className="r:3 p:8|16 f:16 bg:gray-20 bg:gray-95@light box-shadow:0|0|5|black/.5 box-shadow:0|0|5|gray-80/.5@light @transition-up|.2s" sideOffset={5}>
                                            {participant.displayName ?? ''}
                                            <Tooltip.Arrow className="fill:gray-20 fill:gray-95@light" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>

                    )
                }
                {
                    isMyFreeDay &&
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <img src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content className="r:3 p:8|16 f:16 bg:gray-20 bg:gray-95@light box-shadow:0|0|5|black/.5 box-shadow:0|0|5|gray-80/.5@light @transition-up|.2s" sideOffset={5}>
                                    {user.displayName ?? ''}
                                    <Tooltip.Arrow className="fill:gray-20 fill:gray-95@light" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                }
            </div>
        </div>
    )
}