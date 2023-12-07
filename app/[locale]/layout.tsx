import type { Metadata } from 'next'
import './globals.css'
import { CSSProvider } from '@master/css.react'
import config from '@/master.css'
import { ThemeProvider } from '@/contexts/theme'
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase'
import Header from '@/components/header'


export const metadata: Metadata = {
    title: 'Easy Party',
    description: '',
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
        <html lang={locale} suppressHydrationWarning style={process.env.NODE_ENV === 'development' ? { display: 'none' } : undefined}>
            <body>
                <ThemeProvider>
                    <CSSProvider config={config}>
                        <Header initialUser={currentUser?.toJSON()} locale={locale} />
                        {children}
                    </CSSProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
