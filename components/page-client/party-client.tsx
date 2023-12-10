/* eslint-disable @next/next/no-img-element */
'use client'

import Calendar from '@/components/calendar'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'
import defaultImage from '@/public/images/default.png'
import Image from 'next/image'
import CharacterSelector from '../character-selector'
import { useEffect, useState } from 'react'

export default function PartyClient({ locale, party }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()
    const [selectedCharacter, setSelectedCharacter] = useState<any>()

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
                <div className="p:16 pb:60">
                    {
                        !!party &&
                        <>
                            <div className="flex {flex-wrap:wrap}@<sm mb:50 bg:gray-10 bg:gray-90@light r:3">
                                <div className="rel flex flex:1|0|100% flex:1@sm  aspect-ratio:16/9 overflow:clip r:3">
                                    <Image src={party.image ?? defaultImage} layout="fill" objectFit="cover" alt="preview" />
                                </div>
                                <div className="flex flex:1 w:0 flex:col mx:16 justify-content:center">
                                    <h1 className="f:28 f:24@<sm mt:20 white-space:nowrap overflow:clip text-overflow:ellipsis">
                                        {party.name}
                                    </h1>
                                    <h2 className="f:18 {f:16;my:4}@<sm my:8 font-weight:normal fg:gray-60 fg:gray-50@light">{party.startDate} ~ {party.endDate}</h2>
                                    <p className="mt:16 mb:26 f:18 f:16@<sm">
                                        {party.desc}

                                    </p>
                                </div>
                            </div>

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

                            <Calendar party={party} selectedCharacter={selectedCharacter} />
                        </>
                    }
                </div>
            }
        </>
    )
}
