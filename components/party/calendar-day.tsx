'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { format, startOfDay} from 'date-fns'
import { useUserSession } from '@/contexts/user-session'
import { PartyContext } from '@/components/page-client/party-client'
import { updateParticipantToParty } from '@/lib/firebase/firestore'
import CalendarAvatar from './calendar-avatar'
import * as Tooltip from '@radix-ui/react-tooltip'

export default function CalendarDay({ day, availableDates }: any) {

    const { myFreeDays, setMyFreeDays, party, participants, updateTimeout, setUpdateTimeout, selectedCharacter, filterResult } = useContext<any>(PartyContext)
    const { user } = useUserSession()
    const available = day && day >= startOfDay(new Date()) && availableDates.find((x: Date) => x.getTime() === day.getTime())
    const dayString = day && format(day, 'yyyy-MM-dd')
    const [isMyFreeDay, setIsMyFreeDay] = useState(!!myFreeDays.find((x: any) => x === dayString))
    const [isHighlight, setIsHighlight] = useState(false)

    const otherFreeParticipants = useMemo(() => {
        if (!dayString || !participants || !participants.length) return []
        
        return participants.filter((x: any) => (
            (selectedCharacter.googleUser && x.uid !== user?.uid || 
            !selectedCharacter.googleUser && x.characterId !== selectedCharacter.id) && 
            x.freeDays.includes(dayString)
        ))
    }, [dayString, participants, selectedCharacter, user?.uid])
    
    const headcountRatio = useMemo(() => {
        const participantCount = participants?.length || 1
        const freeCount = (otherFreeParticipants?.length || 0) + (isMyFreeDay ? 1 : 0)
        return (freeCount / participantCount) * 100
    }, [isMyFreeDay, otherFreeParticipants, participants])

    useEffect(() => {
        setIsHighlight(filterResult?.length && filterResult.find((x: string) => x === dayString))
    }, [dayString, filterResult]);

    const handleMyFreeDayChange = useCallback(() => {
        if (!available) return
        
        const updatedFreeDays = [...myFreeDays]
        
        if (!isMyFreeDay) {
            updatedFreeDays.push(dayString)
        } else {
            const index = updatedFreeDays.indexOf(dayString)
            if (index >= 0) {
                updatedFreeDays.splice(index, 1)
            }
        }
        
        setMyFreeDays(updatedFreeDays)
        setIsMyFreeDay(!isMyFreeDay)

        clearTimeout(updateTimeout)
        const newTimeout = setTimeout(async () => {
            await updateParticipantToParty(party.id, {
                freeDays: updatedFreeDays
            }, selectedCharacter)
        }, 1000)
        
        setUpdateTimeout(newTimeout)
    }, [available, isMyFreeDay, myFreeDays, dayString, updateTimeout, party.id, selectedCharacter, setMyFreeDays, setUpdateTimeout]);

    return (
        <div className={`
                    ${!day ? 'hide@<xs' : ''}
                    ${available ? 'cursor:pointer' : 'opacity:.35 hide@<xs'}
                    bg:hsl(${20 + headcountRatio}|${headcountRatio}%|12%) bg:hsl(${20 + headcountRatio * .9}|${headcountRatio * .8}%|84%)@light
                    ${isHighlight ? 'b:#356b11 b:#68d14b@light' : 'b:gray/.0'} b:3 b:solid
                    ~background-color|.2s,border-color|.2s overflow:clip r:2
                    p:8 text-align:left min-h:80 flex flex:col ml:2:hover>div>:is(img,.avatar)
                `}
            onClick={() => handleMyFreeDayChange()}
            onKeyDown={(e) => {
                if ((e.key === ' ' || e.keyCode === 32)) {
                    e.preventDefault()
                    handleMyFreeDayChange()
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
            <div className="flex flex:1 flex:row-reverse align-items:end {r:50%;24x24;ml:-16;~margin-left|.2s}>:is(img,.avatar) user-select:none">
                {
                    isMyFreeDay &&
                    <CalendarAvatar src={selectedCharacter.avatarUrl} displayName={selectedCharacter.name ?? ''} />
                }
                {
                    otherFreeParticipants.slice(0, isMyFreeDay ? 1 : 2).map(
                        (participant: any, index: number) =>
                            <CalendarAvatar key={participant.uid ?? participant.characterId} src={participant.avatarUrl} displayName={participant.displayName ?? ''} />
                    )
                }
                {
                    otherFreeParticipants.length > (isMyFreeDay ? 1 : 2) && (
                        <Tooltip.Provider>
                            <Tooltip.Root delayDuration={200}>
                                <Tooltip.Trigger asChild>
                                    <div className="avatar f:12 flex jc:center ai:center overflow:hidden color:gray-80 color:gray-10@light 24x24 r:50% bg:gray-10 bg:gray-80@light">+{otherFreeParticipants.length - (isMyFreeDay ? 1 : 2)}</div>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content 
                                        className="r:3 p:8|16 f:16 max-w:450 bg:gray-20 bg:gray-95@light box-shadow:0|0|5|black/.5 box-shadow:0|0|5|gray-80/.5@light @transition-up|.2s" 
                                        sideOffset={5}
                                    >
                                        { 
                                            otherFreeParticipants.slice(2).map((x: any) => 
                                                <div key={x.uid ?? x.characterId} className="mb:8">
                                                    { x.displayName ?? '' }
                                                </div>
                                            )
                                        }
                                        <Tooltip.Arrow className="fill:gray-20 fill:gray-95@light" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    )
                }
            </div>
        </div>
    )
}