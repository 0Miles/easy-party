/* eslint-disable @next/next/no-img-element */
'use client'

import Calendar from '@/components/party/calendar'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'
import nProgress from 'nprogress'
import CharacterSelector from '@/components/party/character-selector'
import { createContext, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { getParticipantsSnapshotByPartyId, updateParticipantDisplay } from '@/lib/firebase/firestore'
import PartyInfoCard from '@/components/party/party-info-card'
import CalendarResult from '@/components/party/calendar-result'
import CharacterDisplay from '@/components/party/character-display'
import { uploadImage } from '@/lib/firebase/storage'
import { calculateArrayHash } from '@/utils/hash'

export const PartyContext: any = createContext<any>(null)

export default function PartyClient({ locale, party }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()
    const [selectedCharacter, setSelectedCharacter] = useState<any>()

    const [loading, setLoading] = useState<boolean>(true)
    const [myFreeDays, setMyFreeDays] = useState<string[]>([])
    const [participants, setParticipants] = useState<any[]>([])
    const participantsHashRef = useRef<number | null>(null)
    const [updateTimeout, setUpdateTimeout] = useState<any>()

    const [mustHave, setMustHave] = useState<string[]>([])
    const [filterResult, setFilterResult] = useState<string[]>([])

    const [isResultView, setIsResultView] = useState<boolean>(false)

    const [startDate, _setStartDate] = useState(new Date(party.startDate))
    const [endDate, _setEndDate] = useState(new Date(party.endDate))

    const startDateRef = useRef(startDate)
    const endDateRef = useRef(endDate)
    const loadingRef = useRef(loading)
    const selectedCharacterRef = useRef(selectedCharacter)
    const userRef = useRef(user)

    const updateSelectedCharacter = useCallback(() => {
        if (selectedCharacter?.googleUser) {            
            const existingParticipant = participants?.find(x => x.uid === user.uid)
            if (selectedCharacter.avatarUrl !== existingParticipant?.avatarUrl || selectedCharacter.name !== existingParticipant?.displayName) {
                setSelectedCharacter({
                    googleUser: true,
                    id: user.uid,
                    avatarUrl: existingParticipant?.avatarUrl ?? user.photoURL,
                    name: existingParticipant?.displayName ?? user.displayName
                })
            }
        }
    }, [participants, selectedCharacter, user])
    
    useEffect(() => {
        startDateRef.current = startDate;
        endDateRef.current = endDate;
        loadingRef.current = loading;
        selectedCharacterRef.current = selectedCharacter;
        userRef.current = user;
    }, [startDate, endDate, loading, selectedCharacter, user])
    
    useEffect(() => {
        if (!party.id) return
        
        const unsubscribe = getParticipantsSnapshotByPartyId(
            party.id,
            (results) => {
                const processedResults = results.map(participant => {
                    const freeDays = participant.freeDays
                        .filter((freeDay: string) => {
                            const date = new Date(freeDay);
                            return date >= startDateRef.current && date <= endDateRef.current;
                        })
                    
                    return {
                        ...participant,
                        freeDays
                    }
                })
                
                const newHash = calculateArrayHash(processedResults)
                
                if (participantsHashRef.current === null || participantsHashRef.current !== newHash) {
                    participantsHashRef.current = newHash
                    setParticipants(processedResults)
                    updateSelectedCharacter()
                    if (loadingRef.current && selectedCharacterRef.current) {
                        const currentUserFreeDays = processedResults
                            .find((x: any) =>
                                selectedCharacterRef.current.googleUser && x.uid === userRef.current?.uid
                                || !selectedCharacterRef.current.googleUser && x.characterId === selectedCharacterRef.current.id
                            )?.freeDays ?? []
                            
                        setMyFreeDays(currentUserFreeDays)
                        setLoading(false);
                        nProgress.done()
                    }
                }
            }
        )

        return () => {
            unsubscribe()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [party.id, selectedCharacter])

    useEffect(() => {
        if (user === null) {
            setSelectedCharacter(null)
        } else if (!!user && !party.characters?.length && !selectedCharacter) {
            setSelectedCharacter({
                googleUser: true,
                id: user.uid,
                avatarUrl: user.photoURL,
                name: user.displayName
            })
        }
    }, [user, party.characters, participants, selectedCharacter])

    const selectCharacterHandle = (character: any) => {
        setSelectedCharacter(character)
        nProgress.start()
    }

    const changeCharacterHandle = () => {
        setSelectedCharacter(null)
        setLoading(true)
    }
    
    const handleEditName = async (newName: string) => {
        if (!selectedCharacter || !party.id) return
        
        nProgress.start()
        try {
            if (selectedCharacter.googleUser && user && selectedCharacter.id === user.uid) {
                await updateParticipantDisplay(party.id, user.uid, newName)
                
                setSelectedCharacter({
                    ...selectedCharacter,
                    name: newName
                })
            }
        } catch (error) {
            console.error("Update display name failed:", error)
        } finally {
            nProgress.done()
        }
    }
    
    const handleUpdateAvatar = async (file: File, previewUrl: string) => {
        if (!selectedCharacter || !party.id) return
        
        nProgress.start()
        try {
            let avatarUrl = ''
            if (file) {
                avatarUrl = await uploadImage(party.id, file, ['avatars'])
            }
            
            if (selectedCharacter.googleUser && user && selectedCharacter.id === user.uid) {
                await updateParticipantDisplay(party.id, user.uid, selectedCharacter.name, avatarUrl)
                setSelectedCharacter({
                    ...selectedCharacter,
                    avatarUrl: avatarUrl || previewUrl
                })
            }
            
        } catch (error) {
            console.error("Update avatar failed:", error)
        } finally {
            nProgress.done()
        }
    }

    const contextValue = useMemo(() => ({
        party,
        startDate,
        endDate,
        myFreeDays,
        setMyFreeDays,
        participants,
        updateTimeout,
        setUpdateTimeout,
        selectedCharacter,
        filterResult,
        setFilterResult,
        mustHave,
        setMustHave
    }), [
        party,
        startDate,
        endDate,
        myFreeDays,
        participants,
        updateTimeout,
        selectedCharacter,
        filterResult,
        mustHave,
    ])

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
                <PartyContext.Provider value={contextValue}>
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
                                        <CharacterDisplay 
                                            character={selectedCharacter} 
                                            locale={locale} 
                                            hasChangeButton={!!party.characters?.length} 
                                            onChangeCharacter={changeCharacterHandle} 
                                            isCurrentUser={!!selectedCharacter?.googleUser && !!user}
                                            onEditName={handleEditName}
                                            onUpdateAvatar={handleUpdateAvatar}
                                        />
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
