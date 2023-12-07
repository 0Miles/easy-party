"use client"

import { useTheme } from '@/contexts/theme'
import { getDictionary } from '@/locales/locale'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useEffect, useState } from 'react'

export default function SwitchTheme({locale}: any) {
    const { t } = getDictionary(locale)
    const { theme, current, switchTheme } = useTheme()
    const [triggerText, setTriggerText] = useState('')

    useEffect(() => {
        setTriggerText(current === 'dark' ? '🌙' : '☀️')
    }, [current])

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <div className="flex 40x40 f:26 r:3 user-select:none justify-content:center align-items:center ~background|.3s|ease bg:gray-30:hover bg:gray-90:hover@light">
                    {triggerText}
                </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="bg:gray-30 bg:gray-90@light p:4 r:3 @transition-down|.2s|ease-out
                        {cursor:pointer;p:4|16;b:0;outline:none;~background|.2s|ease-out;user-select:none}>div
                        bg:gray-10>div:hover
                        bg:gray-80>div:hover@light"
                    sideOffset={5}>
                    <DropdownMenu.Item onClick={() => switchTheme('light')}>☀️ {t('Light')}</DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => switchTheme('dark')}>🌙 {t('Dark')}</DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => switchTheme('system')}>🖥️ {t('System')}</DropdownMenu.Item>

                    <DropdownMenu.Arrow className="fill:gray-30 fill:gray-90@light" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root >
    )
}