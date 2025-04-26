'use client'

/* eslint-disable @next/next/no-img-element */
import SignInButton from '../sign-in-button'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'

export default function CharacterSelector({ locale, className, characters, onChange }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()

    return (
        <div className={`flex flex:col align-items:center ${className ?? ''}`}>
            <div className="f:24 my:30">
                {t('Select an existing character to continue')}
            </div>
            <div className="flex flex:col">
                {
                    !!characters?.length &&
                    characters.map((character: any, index: number) =>
                        <div key={character.id}
                            onClick={() => onChange?.(character)}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.keyCode === 32) {
                                    e.preventDefault()
                                    onChange?.(character)
                                }
                            }}
                            tabIndex={0}
                            className={`
                                flex align-items:center mb:8 @transition-up|.3s
                                p:12|24 r:3
                                bg:gray-10@<sm bg:gray-90@light@<sm cursor:pointer user-select:none overflow:clip
                                ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light
                            `}>
                            <div className="flex 64x64 r:50% flex:0|0|auto overflow:clip">
                                <img className="w:full h:full object-fit:cover" src={character.avatarUrl} alt={character.name} referrerPolicy="no-referrer" />
                            </div>
                            <div className="mx:16 f:24">
                                {character.name}
                            </div>
                        </div>
                    )
                }
            </div>
            {
                !!user &&
                <>
                    <div className="f:24 mt:60 mb:30 @transition-up|.3s">
                        {t('Continue with a signed in Google Account')}
                    </div>
                    <div className={`
                                    flex align-items:center mb:8 @transition-up|.3s
                                    p:12|24 r:3
                                    bg:gray-10@<sm bg:gray-90@light@<sm cursor:pointer user-select:none overflow:clip
                                    ~background|.3s|ease bg:gray-30:hover bg:gray-10:active bg:gray-80:hover@light bg:gray-96:active@light
                                `}
                        onClick={() => onChange?.({
                            googleUser: true,
                            id: user.uid,
                            avatarUrl: user.photoURL,
                            name: user.displayName
                        })}

                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.keyCode === 32) {
                                e.preventDefault()
                                onChange?.({
                                    googleUser: true,
                                    id: user.uid,
                                    avatarUrl: user.photoURL,
                                    name: user.displayName
                                })
                            }
                        }}
                        tabIndex={0}
                    >

                        <div className="flex 64x64 r:50% flex:0|0|auto overflow:clip">
                            <img className="w:full h:full object-fit:cover" src={user.photoURL ?? ''} alt={user.displayName ?? ''} referrerPolicy="no-referrer" />
                        </div>
                        <div className="mx:16 f:24">
                            {user.displayName}
                        </div>
                    </div>
                </>
            }
            {
                user === undefined &&
                <div className="f:24 my:30 @transition-up|.3s">
                    Loading...
                </div>
            }
            {
                user !== undefined &&
                <>
                    <div className="f:24 mt:60 mb:10 @transition-up|.3s">
                        {t('None of the above?')}
                    </div>
                    <div className="flex flex:col align-items:center mb:80 @transition-up|.3s">
                        <div className="my:16 bg:gray-10 bg:gray-90@light r:3">
                            <SignInButton locale={locale} />
                        </div>
                    </div>
                </>
            }
        </div>
    )
}