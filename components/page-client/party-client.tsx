/* eslint-disable @next/next/no-img-element */
'use client'

import Calendar from '@/components/calendar'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'
import CharacterSelector from '../character-selector'
import { createContext, useEffect, useState } from 'react'
import { getParticipantsSnapshotByPartyId } from '@/lib/firebase/firestore'
import PartyInfoCard from '../party-info-card'

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

    useEffect(() => {
        const unsubscribe = getParticipantsSnapshotByPartyId(
            party.id,
            (results) => {
                setParticipants(results ?? [])
                if (loading && selectedCharacter) {
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

    return (
        <>
            {
                !selectedCharacter && !!party.characters?.length &&
                <CharacterSelector characters={party.characters} locale={locale} onChange={(character: any) => setSelectedCharacter(character)} />
            }
            {
                !party.characters?.length &&
                !user && user !== undefined &&
                <PleaseSignIn locale={locale} />
            }
            {
                !!selectedCharacter &&
                <PartyContext.Provider value={{ party, myFreeDays, setMyFreeDays, participants, updateTimeout, setUpdateTimeout, selectedCharacter, filterResult, setFilterResult, mustHave, setMustHave }}>
                    <div className="p:16 pb:60">
                        {
                            !!party &&
                            <>
                                <PartyInfoCard locale={locale} />

                                {
                                    !!party.characters?.length &&
                                    <div className="flex mt:-40 justify-content:end align-items:center {flex:col;align-items:stretch}@<sm">
                                        <div className="my:16 mr:10">
                                            {t('Currently logged in character')}
                                        </div>
                                        <div className={`
                                                            p:8|16
                                                            bg:gray-10@<sm bg:gray-90@light@<sm
                                                            flex align-items:center @transition-up|.3s
                                                            r:3 user-select:none overflow:clip
                                                            justify-content:space-between@<sm
                                                        `}>
                                            <div className="flex align-items:center">
                                                <div className="flex 36x36 r:50% flex:0|0|auto overflow:clip">
                                                    <img className="w:full h:full object-fit:cover" src={selectedCharacter.avatarUrl} alt={selectedCharacter.name} />
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
                                                onClick={() => setSelectedCharacter(null)}>
                                                {t('Change')}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    !loading &&
                                    <Calendar party={party} />
                                }
                            </>
                        }
                    </div>
                </PartyContext.Provider>
            }
        </>
    )
}
