'use client'

import { useEffect, createContext, useState, useContext } from 'react'


const MatchMediaDark = typeof matchMedia !== 'undefined' ? matchMedia?.('(prefers-color-scheme:dark)') : undefined
// init theme
const storageTheme = typeof localStorage !== 'undefined' && localStorage.getItem('theme') || 'system'
const isDark = storageTheme === 'system' ? MatchMediaDark?.matches : storageTheme === 'dark'
typeof document !== 'undefined' && document.documentElement.classList.toggle('dark', isDark)
typeof document !== 'undefined' && document.documentElement.classList.toggle('light', !isDark)

const ThemeContext: any = createContext(null)

export const ThemeProvider = ({ children }: any) => {
    const [theme, setTheme] = useState(storageTheme ?? 'system')
    const [current, setCurrent] = useState(isDark ? 'dark' : 'light')

    const switchTheme = (value: string) => {
        if (value && value !== theme) {
            setTheme(value)
        }
    }

    useEffect(() => {
        const isDark = current === 'dark'
        document.documentElement.classList.toggle('dark', isDark)
        document.documentElement.classList.toggle('light', !isDark)
    }, [current])

    useEffect(() => {
        localStorage.setItem('theme', theme)
        if (theme === 'system') {
            const isDark = MatchMediaDark?.matches
            setCurrent(isDark ? 'dark' : 'light')
        } else {
            setCurrent(theme)
        }
        
        const onSystemThemeChange = (matchMediaDark: any) => {
            if (theme === 'system') {
                setCurrent(matchMediaDark.matches ? 'dark' : 'light')
            }
        }

        MatchMediaDark?.addEventListener('change', onSystemThemeChange)
        return () => {
            MatchMediaDark?.removeEventListener('change', onSystemThemeChange)
        }
    }, [theme])

    return (
        <ThemeContext.Provider
            value={{
                theme,
                switchTheme,
                current
            }} >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): {theme: string, current: string, switchTheme: (value:string) => void} => {
    return useContext(ThemeContext) as any
}