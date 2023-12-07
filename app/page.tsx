import Calendar from '@/components/calendar'
import Link from 'next/link'

export default function Home() {

    return (
        <>
            <div className="m:0|auto max-w:xl p:16">
                <Link href="/new">建立活動</Link>
            </div>
        </>
    )
}
