'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { PartyContext } from './page-client/party-client'
import CalendarAvatar from './calendar-avatar'

export default function CalendarResultItem({ day, dayString, freeParticipants, notFreeParticipants }: any) {
    const { participants, filterResult, mustHave } = useContext<any>(PartyContext)

    const [isHighlight, setIsHighlight] = useState(false)

    const headcountRatio = freeParticipants.length / (freeParticipants.length + notFreeParticipants.length) * 100

    useEffect(() => {
        setIsHighlight(filterResult?.length && filterResult.find((x: string) => x === dayString))
    }, [dayString, filterResult, participants])


    return (
        <div className={`
                    ${mustHave.length && !isHighlight ? 'hide' : ''}
                    ${isHighlight ? 'b:#356b11 b:#68d14b@light' : 'b:gray/.0'} b:3 b:solid
                    bg:hsl(${20 + headcountRatio}|${headcountRatio}%|12%) bg:hsl(${20 + headcountRatio*.9}|${headcountRatio*.8}%|84%)@light
                    ~background-color|.2s,border-color|.2s overflow:clip r:3
                    p:16 text-align:left min-h:80 flex flex:col
                `}>

            {
                !!day &&
                <div className="flex f:18 m:8">
                    <div className="mr:8">
                        {format(day, 'yyyy/MM/dd')}
                    </div>
                    <div className={`${['1', '7'].includes(format(day, 'e')) ? 'fg:red-70 fg:red-50@light' : ''}`}>
                        {format(day, 'E')}
                    </div>
                </div>
            }
            <div className="flex flex:1 flex-wrap:wrap mt:16 align-items:end">

                {
                    freeParticipants.map(
                        (participant: any) =>
                            <div key={participant.uid ?? participant.characterId} className="flex gap:8 align-items:center m:8">
                                <CalendarAvatar className={`
                                        r:50% 36x36! ~margin-right|.2s
                                        transform-origin:center ~transform|.2s
                                        ${mustHave.includes(participant.uid ?? participant.characterId) ? 'b:solid b:rgb(78,177,11) b:#4f9c18@light b:3 box-shadow:2|2|3|black/.3 transform:scale(1.3)|translate(0,-4)' : ''}
                                    `} 
                                    src={participant.avatarUrl} displayName={participant.displayName ?? ''} />
                                <div className="hide@<sm">
                                    {participant.displayName ?? ''}
                                </div>
                            </div>

                    )
                }
            </div>
            <div className="flex flex:1 flex-wrap:wrap mt:8 align-items:end opacity:.3">
                {
                    notFreeParticipants.map(
                        (participant: any) =>
                            <div key={participant.uid ?? participant.characterId} className="flex gap:8 align-items:center m:8">
                                <CalendarAvatar className="r:50% 36x36! ~margin-right|.2s" src={participant.avatarUrl} displayName={participant.displayName ?? ''} />

                                <div className="hide@<sm">
                                    {participant.displayName ?? ''}
                                </div>
                            </div>

                    )
                }
            </div>
        </div>
    )
}