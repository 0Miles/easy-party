'use client'

import { getDictionary } from "@/locales/locale"
import Link from "next/link"
import nProgress from "nprogress"

export default function CreateAPartyNowButton({ locale }: any) {
    const { t } = getDictionary(locale)

    return <Link className="user-drag:none" href={`/${locale}/new`} onClick={() => nProgress.start()}>
        <button className="
                            p:16|32 r:3
                            ~background|.2s
                            bg:white fg:black bg:gray-70:hover@dark bg:gray-50:active@dark
                            bg:black@light fg:white@light bg:gray-30:hover@light bg:gray-50:active@light
                        ">
            {t('Create a party now')}
        </button>
    </Link>
}