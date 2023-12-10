import Link from 'next/link'
import SwitchTheme from './switch-theme'
import UserMenu from './user-menu'
import Image from 'next/image'

export default function Header({ locale }: any) {

    return (
        <header className="py:8">
            <div className="flex justify-content:space-between m:0|auto px:16 align-items:center">
                <Link className="font-weight:bold flex gap:8 align-items:center" href="/">
                    <Image className="r:3" src="/favicon.ico" width={24} height={24} alt="logo" />
                    Easy Party
                </Link>
                <div className="flex gap:8 align-items:center">
                    <SwitchTheme locale={locale} />
                    <UserMenu locale={locale} />
                </div>
            </div>
        </header>
    )
}