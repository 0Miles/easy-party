/* eslint-disable @next/next/no-img-element */
'use client'

import { getDictionary } from '@/locales/locale'
import EditableText from '@/components/editable-text'
import ImageSelector from '@/components/image-selector'
import { useState } from 'react'

interface CharacterDisplayProps {
    character: any
    locale: string
    hasChangeButton?: boolean
    onChangeCharacter?: () => void
    isCurrentUser?: boolean
    onEditName?: (newName: string) => void | Promise<void>
    onUpdateAvatar?: (file: File, previewUrl: string) => void | Promise<void>
}

export default function CharacterDisplay({ 
    character, 
    locale, 
    hasChangeButton = true, 
    onChangeCharacter,
    isCurrentUser = false,
    onEditName,
    onUpdateAvatar
}: CharacterDisplayProps) {
    const { t } = getDictionary(locale)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    
    const handleAvatarChange = (file: File) => {
        if (onUpdateAvatar && file) {
            onUpdateAvatar(file, avatarPreview || '')
        }
    }

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
                        {isCurrentUser && onUpdateAvatar ? (
                            <ImageSelector 
                                locale={locale}
                                className="w:36 h:36 r:50%"
                                onChange={handleAvatarChange}
                                defaultImage={character.avatarUrl}
                                onPreviewChange={setAvatarPreview}
                            />
                        ) : (
                            <img className="w:full h:full object-fit:cover" src={character.avatarUrl} alt={character.name} referrerPolicy="no-referrer" />
                        )}
                    </div>
                    <div className="mx:8 f:18">
                        <EditableText 
                            text={character.name}
                            isEditable={isCurrentUser}
                            onSave={onEditName}
                            editButtonTitle={t('Edit name')}
                            saveButtonTitle={t('Save')}
                        />
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