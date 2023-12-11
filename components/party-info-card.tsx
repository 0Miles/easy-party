'use client'
/* eslint-disable @next/next/no-img-element */

import { useContext, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import nProgress from 'nprogress'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary, formatString } from '@/locales/locale'
import defaultImage from '@/public/images/default.png'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import CalendarAvatar from './calendar-avatar'
import { PartyContext } from './page-client/party-client'

export default function PartyInfoCard({ locale }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()

    const { party, participants, filterResult, setFilterResult, mustHave, setMustHave } = useContext<any>(PartyContext)

    useEffect(() => {
        const targetFreeDays = participants.filter((x: any) => mustHave.includes(x.uid) || mustHave.includes(x.characterId)).map((x: any) => x.freeDays)
        if (targetFreeDays.length) {
            setFilterResult(targetFreeDays[0].filter((x: string) =>
                targetFreeDays.every((array: string[]) => array.includes(x))
            ))
        } else {
            setFilterResult([])
        }
    }, [mustHave, participants, setFilterResult])

    const toggleGroupValueChangeHandle = (value: string[]) => {
        setMustHave(value)
    }

    return (
        <div className="rel flex {flex-wrap:wrap}@<sm bg:gray-10 bg:gray-90@light r:3">
            {
                user?.uid === party.createdBy &&
                <Link href={`/${locale}/${party.id}/edit`} onClick={() => nProgress.start()}>
                    <button className="abs top:16 right:16 r:3 p:4 
                                                                cursor:pointer user-select:none overflow:clip
                                                                ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                    </button>
                </Link>
            }
            <div className="rel flex flex:1|0|100% flex:1@sm aspect-ratio:16/9 overflow:clip r:3">
                <Image src={party.image ?? defaultImage} layout="fill" objectFit="cover" alt="preview" />
            </div>
            <div className="flex flex:1 w:0 flex:col mx:16 ml:32@md justify-content:center">
                <h1 className="f:28 f:24@<md mt:20 white-space:nowrap overflow:clip text-overflow:ellipsis">
                    {party.name}
                </h1>
                <h2 className="f:18 {f:16;my:4}@<md my:8 font-weight:normal fg:gray-60 fg:gray-50@light">{party.startDate} ~ {party.endDate}</h2>
                <p className="mt:16 mb:42 f:18 f:16@<md">
                    {party.desc}

                </p>
                <div className="flex flex-wrap:wrap align-items:center user-select:none mb:20">
                    <ToggleGroup.Root
                        className="ToggleGroup"
                        type="multiple"
                        defaultValue={mustHave}
                        aria-label="Must have"
                        onValueChange={toggleGroupValueChangeHandle}
                    >
                        {
                            participants.map(
                                (participant: any, index: number) =>
                                    <ToggleGroup.Item key={index} className="r:50% 36x36 mr:6 overflow:clip b:solid b:green b:green@light transform-origin:center ~transform|.2s {b:3;transform:scale(1.3)|translate(0,-4);box-shadow:0|3|3|black/.3}[data-state='on']" value={participant.uid ?? participant.characterId}>
                                        <CalendarAvatar src={participant.avatarUrl} displayName={participant.displayName ?? ''} />
                                    </ToggleGroup.Item>
                            )
                        }

                    </ToggleGroup.Root>
                    <div className="mt:16 min-h:20 flex:1|0|100%">
                        {
                            (mustHave?.length ?? 0) === 1 &&
                            <div>
                                {formatString(t('Someone available for n days'), participants.find((x: any) => x.uid === mustHave[0] || x.characterId === mustHave[0]).displayName, filterResult.length)}
                            </div>
                        }
                        {
                            (mustHave?.length ?? 0) > 1 &&
                            <div>
                                {
                                    formatString(
                                        t('Selected n people are available on n dates at the same time'),
                                        mustHave.length,
                                        filterResult.length
                                    )
                                }
                            </div>
                        }
                        {
                            !mustHave?.length &&
                            <>
                                {participants.length} {t('people have provided available dates')}
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
