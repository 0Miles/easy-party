/* eslint-disable @next/next/no-img-element */
'use client'

import {
    signInWithGoogle,
    signOut
} from '@/lib/firebase/auth'
import useUserSession from '@/lib/use-user-session'
import Image from 'next/image'

export default function Header({ initialUser }: any) {
    const user = useUserSession(initialUser ?? false)

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
                <div>
                    {
                        !!user &&
                        <>
                            <div className="flex gap:8 align-items:center">
                                <div className="32x32 r:50% overflow:clip">
                                    <img src={user.photoURL} alt={'avatar'} />
                                </div>
                                <div>
                                    <button onClick={handleSignOut}>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    }
                    {
                        !user && user !== false && <button onClick={handleSignIn}>
                            Sign In with Google
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