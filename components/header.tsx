/* eslint-disable @next/next/no-img-element */
'use client'

import {
    signInWithGoogle,
    signOut
} from '@/lib/firebase/auth'
import useUserSession from '@/lib/use-user-session'
import { getDictionary } from '@/locales/locale'
import Image from 'next/image'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import SwitchTheme from './switch-theme'

export default function Header({ initialUser, locale }: any) {
    const user = useUserSession(initialUser ?? false)

    const { t } = getDictionary(locale)

    const handleSignOut = (event: any) => {
        event.preventDefault()
        signOut()
    }

    const handleSignIn = (event: any) => {
        event.preventDefault()
        signInWithGoogle()
    }

    return (
        <header className="py:8">
            <div className="flex justify-content:space-between m:0|auto max-w:xl px:16 align-items:center">
                <div>
                </div>
                <div className="flex gap:8 align-items:center">
                    <SwitchTheme locale={locale} />
                    {
                        !!user &&
                        <>
                            
                            <div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <div className="flex user-select:none h:40 align-items:center justify-content:center gap:8 px:8 r:3 ~background|.3s|ease bg:gray-30:hover bg:gray-90:hover@light">
                                            <div className="32x32 r:50% overflow:clip">
                                                <img src={user.photoURL} alt={'avatar'} />
                                            </div>
                                            <div>
                                                {user.displayName}
                                            </div>
                                        </div>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="bg:gray-30 bg:gray-90@light p:4 r:3 @transition-down|.2s|ease-out mx:16 
                                                        {cursor:pointer;p:4|16;b:0;outline:none;~background|.2s|ease-out;user-select:none}>div
                                                        bg:gray-10>div:hover
                                                        bg:gray-80>div:hover@light"
                                            sideOffset={5}>
                                            <DropdownMenu.Item onClick={handleSignOut}>
                                                {t('Sign Out')}
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Arrow className="fill:gray-30 fill:gray-90@light" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                        </>
                    }
                    {
                        !user && user !== false && <button onClick={handleSignIn}>
                            {t('Sign In with Google')}
                        </button>
                    }
                    {
                        user === false &&
                        <div>loading</div>
                    }
                </div>
            </div>
        </header>
    )
}