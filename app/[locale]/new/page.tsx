import Calendar from '@/components/calendar'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '新活動 | Easy Party',
    description: '',
}

export default function NewParty() {

    return (
        <>
            <div className="m:0|auto max-w:xl p:16">
                新活動
            </div>
        </>
    )
}
