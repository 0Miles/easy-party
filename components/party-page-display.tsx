/* eslint-disable @next/next/no-img-element */
'use client'

import Calendar from '@/components/calendar'
import PleaseSignIn from '@/components/please-sign-in'
import { useUserSession } from '@/contexts/user-session'
import { getDictionary } from '@/locales/locale'
import defaultImage from '@/public/images/default.png'
import Image from 'next/image'

export default function PartyPageDisplay({ locale, party }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()

    return (
        <>
            {
                !user && user !== undefined &&
                <PleaseSignIn locale={locale} />
            }
            {
                !!user &&
                <div className="p:16 pb:60">
                    {
                        !!party &&
                        <>
                            <div className="flex {flex-wrap:wrap}@<sm mb:50 bg:gray-10 bg:gray-90@light r:3">
                                <div className="rel flex flex:1|0|100% flex:1@sm  aspect-ratio:16/9 overflow:clip r:3">
                                    <Image src={party.image ?? defaultImage} layout="fill" objectFit="cover" alt="preview" />
                                </div>
                                <div className="flex flex:1 w:0 flex:col mx:16 justify-content:center">
                                    <h1 className="f:28 f:24@<sm mt:20 white-space:nowrap overflow:clip text-overflow:ellipsis">
                                        {party.name}
                                    </h1>
                                    <h2 className="f:18 {f:16;my:4}@<sm my:8 font-weight:normal fg:gray-60 fg:gray-50@light">{party.startDate} ~ {party.endDate}</h2>
                                    <p className="mt:16 mb:26 f:18 f:16@<sm">
                                        {party.desc}

                                    </p>
                                </div>
                            </div>

                            <Calendar party={party} />
                        </>
                    }
                </div>
            }
        </>
    )
}
