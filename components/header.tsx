import SwitchTheme from './switch-theme'
import UserMenu from './user-menu'

export default function Header({ locale }: any) {

    return (
        <header className="py:8">
            <div className="flex justify-content:space-between m:0|auto px:16 align-items:center">
                <div>
                </div>
                <div className="flex gap:8 align-items:center">
                    <SwitchTheme locale={locale} />
                    <UserMenu locale={locale} />
                </div>
            </div>
        </header>
    )
}