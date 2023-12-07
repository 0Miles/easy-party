"use client"

import { useTheme } from '@/contexts/theme'

export default function SwitchTheme() {
    const { theme, current, switchTheme } = useTheme()

    const handleChange = (e: any) => {
        switchTheme(e.target.value)
    }
    
    return (
        <select
            value={theme}
            onChange={handleChange}
        >
            <option value={'light'}>Light</option>
            <option value={'dark'}>Dark</option>
            <option value={'system'}>System</option>
        </select>
    )
}