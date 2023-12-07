'use client'

import { useState, useEffect } from 'react'
import {
    onAuthStateChanged
} from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

export default function useUserSession(initialUser: any) {
    const [user, setUser] = useState(initialUser)
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

    return user
}