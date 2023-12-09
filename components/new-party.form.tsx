/* eslint-disable @next/next/no-img-element */
'use client'

import { getDictionary } from '@/locales/locale'
import { useState, useRef, useEffect } from 'react'
import ImageSelector from './image-selector'
import { addParty, updatePartyImage } from '@/lib/firebase/firestore'
import { uploadImage } from '@/lib/firebase/storage'
import * as Toast from '@radix-ui/react-toast'
import Link from 'next/link'
import { useUserSession } from '@/contexts/user-session'
import PleaseSignIn from './please-sign-in'
import Image from 'next/image'
import defaultImage from '@/public/images/default.png'
import { format } from 'date-fns'

export default function NewPartyForm({ locale }: any) {
    const { t } = getDictionary(locale)
    const { user } = useUserSession()
    const [step, setStep] = useState(1)
    const [partyName, setPartyName] = useState('')
    const [partyDesc, setPartyDesc] = useState('')
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd'))
    const [previewImg, setPreviewImg] = useState(null) as any

    const [creating, setCreating] = useState(false)
    const [partyId, setPartyId] = useState('')
    const [partyLink, setPartyLink] = useState('')
    const [partyImgUrl, setPartyImgUrl] = useState('')

    const [open, setOpen] = useState(false)
    const timerRef = useRef(0)

    useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    const createParty = async () => {
        setCreating(true)
        const partyId = await addParty({
            name: partyName,
            desc: partyDesc,
            startDate,
            endDate
        })
        if (previewImg) {
            const imageUrl = await uploadImage(partyId, previewImg)
            updatePartyImage(partyId, imageUrl)
            setPartyImgUrl(imageUrl)
        }
        setPartyId(partyId)
        setPartyLink(`${window.location.protocol}//${window.location.host}/${partyId}`)
        setCreating(false)
    }

    return (
        <>
            {
                !user && user !== undefined &&
                <PleaseSignIn locale={locale} />
            }
            {
                !!user &&
                <div className="p:48 p:16@<sm overflow:clip">
                    {
                        step === 1 &&
                        <div className="mt:80 flex flex:col @transition-left|.3s">
                            <div className="mb:8">{t(`Step ${step}`)} <span className="fg:gray-50">({step}/4)</span></div>
                            <label htmlFor="name" className="f:36 f:28@<sm mb:40">{t('First, enter a party name')}</label>
                            <input className="
                                    f:54 f:36@<sm
                                    outline:none
                                    border-width:0|0|2|0 border-style:solid border-color:white border-color:gray-80@light
                                    border-color:blue-50:focus border-color:sky-60:focus@light
                                    mb:30
                                    "
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && partyName) {
                                        e.preventDefault();
                                        setStep(2)
                                    }
                                }}
                                value={partyName} onChange={(e) => setPartyName(e.target.value)}
                                id="name" type="text" placeholder={t('Enter party name')} />

                            <div className="flex justify-content:space-between gap:8 align-items:center">
                                <div></div>
                                <button className="
                                        w:180
                                        p:16|32 p:8|16@<sm r:3
                                        ~background|.2s f:18 f:16@<sm
                                        bg:blue-50 fg:white bg:blue-40:hover bg:blue-30:active 
                                        bg:sky-60@light fg:white bg:sky-70:hover@light bg:sky-80:active@light
                                        bg:blue-50/.2:disabled fg:blue-60:disabled cursor:not-allowed:disabled
                                        bg:sky-70/.2:disabled@light fg:sky-76:disabled@light
                                    "
                                    onClick={() => setStep(2)}
                                    disabled={!partyName}>
                                    {t('Next step')}
                                </button>
                            </div>
                        </div>
                    }
                    {
                        step === 2 &&
                        <div className="mt:80 flex flex:col @transition-left|.3s">
                            <div className="mb:8">{t(`Step ${step}`)} <span className="fg:gray-50">({step}/4)</span></div>
                            <div className="f:36 f:28@<sm mb:10">{t('Please set the party time range')}</div>
                            <div className="f:24 f:16@<sm mb:40">{t('Select a time range and let participants choose when they are available')}</div>

                            <div className="mb:60">
                                <div className="flex flex:col">
                                    <label htmlFor="startDate" className="mb:8">{t('Start date')}</label>
                                    <input
                                        id="startDate"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setStep(3)
                                            }
                                        }}
                                        className="
                                            f:36 f:28@<sm
                                            outline:none
                                            border-width:0|0|2|0 border-style:solid border-color:white border-color:gray-80@light
                                            border-color:blue-50:focus border-color:sky-60:focus@light
                                        "
                                        type="date" value={startDate} onChange={(e) => {
                                            setStartDate(e.target.value)
                                            if (new Date(e.target.value) > new Date(endDate)) {
                                                setEndDate(format(new Date(e.target.value).setDate(new Date(e.target.value).getDate() + 1), 'yyyy-MM-dd'))
                                            }
                                        }} />
                                </div>
                                <div className="f:36 my:20">
                                    ~
                                </div>
                                <div className="flex flex:col">
                                    <label htmlFor="endDate" className="mb:8">{t('End date')}</label>
                                    <input
                                        id="endDate"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setStep(3)
                                            }
                                        }}
                                        className="
                                            f:36 f:28@<sm
                                            outline:none
                                            border-width:0|0|2|0 border-style:solid border-color:white border-color:gray-80@light
                                            border-color:blue-50:focus border-color:sky-60:focus@light
                                        "
                                        min={format(new Date(startDate).setDate(new Date(startDate).getDate() + 1), 'yyyy-MM-dd')}
                                        type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex justify-content:space-between gap:8 align-items:center">
                                <button className="
                                        fg:blue-70
                                        fg:sky-50@light
                                        text-decoration:underline:hover
                                    "
                                    onClick={() => setStep(1)}>
                                    {t('Previous step')}
                                </button>
                                <button className="
                                        w:180
                                        p:16|32 p:8|16@<sm r:3
                                        ~background|.2s f:18 f:16@<sm
                                        bg:blue-50 fg:white bg:blue-40:hover bg:blue-30:active 
                                        bg:sky-60@light fg:white bg:sky-70:hover@light bg:sky-80:active@light
                                        bg:blue-50/.2:disabled fg:blue-60:disabled cursor:not-allowed:disabled
                                        bg:sky-70/.2:disabled@light fg:sky-76:disabled@light
                                    "
                                    onClick={() => setStep(3)}>
                                    {t('Next step')}
                                </button>
                            </div>
                        </div>
                    }
                    {
                        step === 3 &&
                        <div className="mt:80 flex flex:col @transition-left|.3s">
                            <div className="mb:8">{t(`Step ${step}`)} <span className="fg:gray-50">({step}/4)</span></div>
                            <label htmlFor="desc" className="f:36 f:28@<sm mb:10">{t('Please enter a description of this party')}</label>
                            <label htmlFor="desc" className="f:24 f:16@<sm mb:40">{t('For example: party location, itinerary...')}</label>
                            <textarea className="
                                    f:42 f:28@<sm
                                    outline:none
                                    border-width:0|0|2|0 border-style:solid border-color:white border-color:gray-80@light
                                    border-color:blue-50:focus border-color:sky-60:focus@light
                                    mb:30 resize:vertical
                                    "
                                value={partyDesc} onChange={(e) => setPartyDesc(e.target.value)}
                                id="desc" placeholder={t('Enter party description')}>

                            </textarea>
                            <div className="flex justify-content:space-between gap:8 align-items:center">
                                <button className="
                                        fg:blue-70
                                        fg:sky-50@light
                                        text-decoration:underline:hover
                                    "
                                    onClick={() => setStep(2)}>
                                    {t('Previous step')}
                                </button>
                                <button className="
                                        w:180
                                        p:16|32 p:8|16@<sm r:3
                                        ~background|.2s f:18 f:16@<sm
                                        bg:blue-50 fg:white bg:blue-40:hover bg:blue-30:active 
                                        bg:sky-60@light fg:white bg:sky-70:hover@light bg:sky-80:active@light
                                        bg:blue-50/.2:disabled fg:blue-60:disabled cursor:not-allowed:disabled
                                        bg:sky-70/.2:disabled@light fg:sky-76:disabled@light
                                    "
                                    onClick={() => setStep(4)}>
                                    {t('Next step')}
                                </button>
                            </div>
                        </div>
                    }
                    {
                        step === 4 &&
                        <div className="mt:80 flex flex:col @transition-left|.3s">
                            <div className="mb:8">{t(`Step ${step}`)} <span className="fg:gray-50">({step}/4)</span></div>
                            <div className="f:36 mb:10 f:28@<sm">{t('Please upload a preview image')}</div>
                            <div className="f:24 mb:40 f:16@<sm">{t('The preview image will appear on the invitation link and date selection page')}</div>

                            <ImageSelector className="mb:60 aspect-ratio:16/9 max-w:580"
                                onChange={(data: any) => { setPreviewImg(data) }}
                                locale={locale}
                            />

                            <div className="flex justify-content:space-between gap:8 align-items:center">
                                <button className="
                                        fg:blue-70
                                        fg:sky-50@light
                                        text-decoration:underline:hover
                                    "
                                    onClick={() => setStep(3)}>
                                    {t('Previous step')}
                                </button>
                                <button className="
                                        w:180
                                        p:16|32 p:8|16@<sm r:3
                                        ~background|.2s f:18 f:16@<sm
                                        bg:blue-50 fg:white bg:blue-40:hover bg:blue-30:active 
                                        bg:sky-60@light fg:white bg:sky-70:hover@light bg:sky-80:active@light
                                        bg:blue-50/.2:disabled fg:blue-60:disabled cursor:not-allowed:disabled
                                        bg:sky-70/.2:disabled@light fg:sky-76:disabled@light
                                    "
                                    onClick={() => { createParty(); setStep(5) }}>
                                    {t('Complete')}
                                </button>
                            </div>
                        </div>
                    }
                    {
                        step === 5 &&
                        <div className="mt:80 mt:40@<sm flex flex:col justify-content:center @transition-left|.3s">

                            {
                                creating &&
                                <div className="flex flex:col align-items:center justify-content:center">
                                    <svg className="my:30" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|0s" d="M7.75 7.75l-2.15 -2.15"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.125s" d="M12 6l0 -3"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.25s" d="M16.25 7.75l2.15 -2.15"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.375s" d="M18 12l3 0"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.5s" d="M16.25 16.25l2.15 2.15"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.625s" d="M12 18l0 3"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.75s" d="M7.75 16.25l-2.15 2.15"></path>
                                        <path className="@fade|1s|ease-out|reverse|infinite|.875s" d="M6 12l-3 0"></path>
                                    </svg>
                                    <div className="f:36 f:28@<sm">
                                        {t('Creating party information')}...
                                    </div>
                                </div>
                            }

                            {
                                !creating && partyId &&
                                <div className="flex flex:col align-items:center @transition-up|.3s">
                                    <div className="f:36 f:28@<sm mb:30">
                                        {t('Completed')}!
                                    </div>
                                    <Link href={partyLink}>
                                        <div className="max-w:500 mb:30 bg:gray-20 bg:gray-96@light r:3 overflow:clip b:1|solid border-color:gray-40 border-color:gray-80@light">
                                            <div className="rel max-w:500 aspect-ratio:16/9 overflow:clip">
                                                <Image src={partyImgUrl ? partyImgUrl : defaultImage} layout="fill" objectFit="cover" alt="preview" />
                                            </div>
                                            <div className="px:16 mt:8 fg:gray-60 fg:gray-60@light white-space:nowrap overflow:clip text-overflow:ellipsis">{partyLink}</div>
                                            <h1 className="px:16 mt:6 white-space:nowrap overflow:clip text-overflow:ellipsis">{partyName}</h1>
                                            <h2 className="px:16 mb:12 font-weight:normal fg:gray-80 fg:gray-40@light white-space:nowrap overflow:clip text-overflow:ellipsis">{partyDesc}</h2>
                                        </div>
                                    </Link>
                                    <div className="flex justify-content:center align-items:center gap:8 mb:30">
                                        <input className="h:42 p:8 r:3 b:1|solid border-color:white border-color:gray-80@light outline:none" type="text" readOnly value={partyLink} />

                                        <button className="
                                                    h:42 p:8 r:3
                                                    b:1|solid border-color:white border-color:gray-80@light
                                                    bg:gray/.2:hover bg:gray/.3:active ~background|.2s
                                                "
                                            onClick={() => {
                                                navigator.clipboard.writeText(partyLink)
                                                setOpen(false)
                                                window.clearTimeout(timerRef.current)
                                                timerRef.current = window.setTimeout(() => {
                                                    setOpen(true)
                                                }, 100)
                                            }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>
                                        </button>

                                        <Toast.Provider swipeDirection="down">
                                            <Toast.Root className="p:16 bg:gray-10 bg:gray-90@light r:3 text-align:center @transition-down|.3s" open={open} onOpenChange={setOpen}>
                                                {t('Copied')}
                                            </Toast.Root>
                                            <Toast.Viewport className="fixed top:0 left:calc(50vw-100px) flex flex:col p:16 gap:10 w:200 m:0 list-style:none z:999 outline:none" />
                                        </Toast.Provider>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            }
        </>
    )
}
