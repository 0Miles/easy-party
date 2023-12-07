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
}: {
    children: React.ReactNode
}) {
    const { currentUser } = await getAuthenticatedAppForUser()
    
    return (
        <html lang="en" suppressHydrationWarning style={process.env.NODE_ENV === 'development' ? { display: 'none' } : undefined}>
            <body>
                <CSSProvider config={config}>
                    <ThemeProvider>
                        <Header initialUser={currentUser?.toJSON()} />
                        {children}
                    </ThemeProvider>
                </CSSProvider>
            </body>
        </html>
    )
}
