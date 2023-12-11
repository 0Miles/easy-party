/* eslint-disable @next/next/no-img-element */
'use client'

import Calendar from '@/components/calendar'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'
import nProgress from 'nprogress'
import CharacterSelector from '../character-selector'
import { createContext, useEffect, useState } from 'react'
import { getParticipantsSnapshotByPartyId } from '@/lib/firebase/firestore'
import PartyInfoCard from '../party-info-card'
import CalendarResult from '../calendar-result'

export const PartyContext: any = createContext<any>(null)

export default function PartyClient({ locale, party }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()
    const [selectedCharacter, setSelectedCharacter] = useState<any>()

    const [loading, setLoading] = useState<boolean>(true)
    const [myFreeDays, setMyFreeDays] = useState<string[]>([])
    const [participants, setParticipants] = useState<any[]>([])
    const [updateTimeout, setUpdateTimeout] = useState<any>()

    const [mustHave, setMustHave] = useState<string[]>([])
    const [filterResult, setFilterResult] = useState<string[]>([])

    const [isResultView, setIsResultView] = useState<boolean>(false)

    const [startDate] = useState(new Date(party.startDate))
    const [endDate] = useState(new Date(party.endDate))

    useEffect(() => {
        const unsubscribe = getParticipantsSnapshotByPartyId(
            party.id,
            (results) => {
                results.forEach(participant => {
                    participant.freeDays = participant.freeDays
                        .filter((freeDay:string) => {
                            const date = new Date(freeDay)
                            return date >= startDate && date <= endDate
                        })
                })

                setParticipants(results ?? [])
                if (loading && selectedCharacter) {
                    setMyFreeDays((results ?? [])
                        .find((x: any) =>
                            selectedCharacter.googleUser && x.uid === user.uid
                            || !selectedCharacter.googleUser && x.characterId === selectedCharacter.id
                        )?.freeDays ?? [])
                    setLoading(false)
                    nProgress.done()
                }
            }
        )

        return () => {
            unsubscribe()
        }
    }, [endDate, loading, party, selectedCharacter, startDate, user])

    useEffect(() => {
        if (user === null) {
            setSelectedCharacter(null)
        }
        if (!!user && !party.characters?.length) {
            setSelectedCharacter(
                {
                    googleUser: true,
                    id: user.uid,
                    avatarUrl: user.photoURL,
                    name: user.displayName
                }
            )
        }
    }, [user, party])

    const selectCharacterHandle = (character:any) => {
        setSelectedCharacter(character)
        nProgress.start()
    }

    const changeCharacterHandle = () => {
        setSelectedCharacter(null)
        setLoading(true)
    }

    return (
        <>
            {
                !selectedCharacter && !!party.characters?.length &&
                <CharacterSelector characters={party.characters} locale={locale} onChange={selectCharacterHandle} />
            }
            {
                !party.characters?.length &&
                !user && user !== undefined &&
                <PleaseSignIn locale={locale} />
            }
            {
                !!selectedCharacter &&
                <PartyContext.Provider value={{ party, startDate, endDate, myFreeDays, setMyFreeDays, participants, updateTimeout, setUpdateTimeout, selectedCharacter, filterResult, setFilterResult, mustHave, setMustHave }}>
                    <div className="p:16 pb:60">
                        {
                            !!party &&
                            <>
                                <PartyInfoCard locale={locale} />

                                <div className="mb:-24 flex justify-content:space-between align-items:center {flex:col-reverse;align-items:stretch}@<sm">
                                    {
                                        !isResultView &&
                                        <button className="p:8|16 p:16@<sm r:3 my:24 flex justify-content:center align-items:center gap:8
                                                           bg:gray-10 bg:gray-90@light cursor:pointer user-select:none overflow:clip
                                                           ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light
                                                        "
                                                onClick={() => setIsResultView(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M11 15h1" /><path d="M12 15v3" /></svg>
                                            {t('View Results')}
                                        </button>
                                    }

                                    {
                                            isResultView &&
                                            <button className="p:8|16 p:16@<sm r:3 my:24 flex justify-content:center align-items:center gap:8
                                                        bg:gray-10 bg:gray-90@light cursor:pointer user-select:none overflow:clip
                                                        ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light
                                                    "
                                                    onClick={() => setIsResultView(false)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" /></svg>
                                                {t('Back Calendar')}
                                            </button>
                                    }

                                    {
                                        !!party.characters?.length &&
                                        <div className="flex flex-wrap:wrap w:fit-content w:full@<sm">
                                            <div className="my:16 mr:10">
                                                {t('Currently logged in character')}
                                            </div>
                                            <div className={`
                                                            p:8|16
                                                            bg:gray-10@<sm bg:gray-90@light@<sm
                                                            flex w:full@<sm align-items:center @transition-up|.3s
                                                            r:3 user-select:none overflow:clip
                                                            justify-content:space-between@<sm
                                                        `}>
                                                <div className="flex align-items:center">
                                                    <div className="flex 36x36 r:50% flex:0|0|auto overflow:clip">
                                                        <img className="w:full h:full object-fit:cover" src={selectedCharacter.avatarUrl} alt={selectedCharacter.name} referrerPolicy="no-referrer" />
                                                    </div>
                                                    <div className="mx:8 f:18">
                                                        {selectedCharacter.name}
                                                    </div>
                                                </div>
                                                <div className="
                                                            p:4|8 p:8|16@<sm r:3 f:12 f:16@<sm
                                                            bg:gray-20 bg:gray-86@light cursor:pointer user-select:none overflow:clip
                                                            ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light
                                                            "
                                                    onClick={changeCharacterHandle}>
                                                    {t('Change')}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>

                                {
                                    !loading && !isResultView &&
                                    <Calendar />
                                }

                                {
                                    !loading && isResultView &&
                                    <CalendarResult />
                                }
                            </>
                        }
                    </div>
                </PartyContext.Provider>
            }
        </>
    )
}
