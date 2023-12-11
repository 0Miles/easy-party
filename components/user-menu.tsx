'use client'
/* eslint-disable @next/next/no-img-element */

import {
    signOut
} from '@/lib/firebase/auth'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import SignInButton from './sign-in-button'

export default function UserMenu({ locale }: any) {
    const { user } = useUserSession()
    const { t } = getDictionary(locale)

    const handleSignOut = (event: any) => {
        event.preventDefault()
        signOut()
    }

    return (
        <>
            {
                !!user &&
                <>

                    <div>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <div className="flex user-select:none h:40 align-items:center justify-content:center gap:8 px:8 r:3 ~background|.3s|ease bg:gray-30:hover bg:gray-95:hover@light">
                                    <div className="26x26 r:50% overflow:clip">
                                        <img src={user.photoURL ?? ''} alt={'avatar'} referrerPolicy="no-referrer" />
                                    </div>
                                    <div>
                                        {user.displayName}
                                    </div>
                                </div>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="bg:gray-20 bg:gray-95@light p:4 r:3 @transition-down|.2s|ease-out mx:16 
                                                        {r:3;cursor:pointer;p:4|24;b:0;outline:none;~background|.2s|ease-out;user-select:none}>div
                                                        bg:gray-40>div:hover
                                                        bg:gray-80>div:hover@light"
                                    sideOffset={5}>
                                    <DropdownMenu.Item onClick={handleSignOut}>
                                        {t('Sign Out')}
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Arrow className="fill:gray-20 fill:gray-95@light" />
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </>
            }
            {
                !user && user !== undefined &&
                <SignInButton locale={locale} />
            }
            {
                user === undefined &&
                <div>loading</div>
            }
        </>
    )
}