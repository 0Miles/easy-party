'use client'

import { useState, useEffect, createContext, useContext, useMemo } from 'react'
import {
    onAuthStateChanged
} from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'
import { User } from 'firebase/auth'

const UserSessionContext: any = createContext(null)

export const UserSessionProvider = ({ initialUser, children }: any) => {
    const [user, setUser] = useState(initialUser ?? undefined)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((authUser: any) => {
            setUser(authUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        onAuthStateChanged((authUser: any) => {
            if (user === undefined) return
            if (user?.email !== authUser?.email) {
                router.refresh()
            }
        })
    }, [router, user])

    const contextValue = useMemo(() => ({
        user
    }), [user])

    return (
        <UserSessionContext.Provider
            value={contextValue} >
            {children}
        </UserSessionContext.Provider>
    )
}

export const useUserSession = (): { user: User } => {
    return useContext(UserSessionContext) as any
}