import type { Metadata } from 'next'
import './globals.css'
import { CSSProvider } from '@master/css.react'
import config from '@/master.css'
import { ThemeProvider } from '@/contexts/theme'
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase'
import Header from '@/components/header'
import { UserSessionProvider } from '@/contexts/user-session'


export const metadata: Metadata = {
    metadataBase: new URL('https://easy-party.latte.today'),
    title: 'Easy Party',
    description: 'Discover Your Shared Moments!',
    icons: {
        icon: '/favicon.ico?v=2'
    },
    openGraph: {
        images: ['https://easy-party.latte.today/images/default.png'],
    }
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: any
}) {
    const { currentUser } = await getAuthenticatedAppForUser()
    const { locale } = params

    return (
        <html lang={locale} suppressHydrationWarning style={{ display: 'none' }}>
            <body>
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
