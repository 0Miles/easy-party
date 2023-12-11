'use client'

import nProgress from 'nprogress'
import { useEffect } from 'react'

export default function NProgressDone() {
    useEffect(() => {
        nProgress.done()
    }, [])
    return (
        <></>
    )
}