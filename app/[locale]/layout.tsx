import type { Metadata } from 'next'
import './globals.css'
import { CSSProvider } from '@master/css.react'
import config from '@/master.css'

import { ThemeProvider } from '@/contexts/theme'
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase'
import Header from '@/components/header'
import { UserSessionProvider } from '@/contexts/user-session'

import { RouteChangeListener } from '@/components/route-change-listener'
import 'nprogress/nprogress.css'
import nProgress from 'nprogress'
nProgress.configure({ easing: 'ease', speed: 300, showSpinner: false })

export const metadata: Metadata = {
    metadataBase: new URL('https://easy-party.latte.today'),
    title: 'Easy Party',
    description: 'Discover Your Shared Moments!',
    icons: {
        icon: '/favicon.ico?v=2'
    },
    openGraph: {
        images: ['/images/default.png'],
    }
}

export default async function RootLayout({
    children,
    params
}: {
    readonly children: React.ReactNode,
    readonly params: any
}) {
    const { currentUser } = await getAuthenticatedAppForUser()
    const { locale } = params

    return (
        <html lang={locale} suppressHydrationWarning style={{ display: 'none' }}>
            <body className="overflow-x:clip user-select:none w:full h:full">
                <RouteChangeListener />
                <ThemeProvider>
                    <UserSessionProvider initialUser={currentUser?.toJSON()}>
                        <CSSProvider config={config}>
                            <Header locale={locale} />
                            <div className="m:0|auto max-w:lg">
                                {children}
                            </div>
                        </CSSProvider>
                    </UserSessionProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
