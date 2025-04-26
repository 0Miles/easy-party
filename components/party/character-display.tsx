/* eslint-disable @next/next/no-img-element */
'use client'

import { getDictionary } from '@/locales/locale'

interface CharacterDisplayProps {
    character: any;
    locale: string;
    hasChangeButton?: boolean;
    onChangeCharacter?: () => void;
}

export default function CharacterDisplay({ character, locale, hasChangeButton = true, onChangeCharacter }: CharacterDisplayProps) {
    const { t } = getDictionary(locale)

    return (
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
                        <img className="w:full h:full object-fit:cover" src={character.avatarUrl} alt={character.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="mx:8 f:18">
                        {character.name}
                    </div>
                </div>
                {
                    hasChangeButton && onChangeCharacter &&
                    <div className="
                            p:4|8 p:8|16@<sm r:3 f:12 f:16@<sm
                            bg:gray-20 bg:gray-86@light cursor:pointer user-select:none overflow:clip
                            ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light
                            "
                        onClick={onChangeCharacter}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.keyCode === 32) {
                                e.preventDefault()
                                onChangeCharacter()
                            }
                        }}
                        tabIndex={0}
                    >
                        {t('Change')}
                    </div>
                }
            </div>
        </div>
    )
}