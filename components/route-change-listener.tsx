'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import nProgress from 'nprogress'

export function RouteChangeListener() {
    const pathname = usePathname()

    useEffect(() => {
        nProgress.start()
    }, [pathname])

    return <></>
}