import { getDictionary } from '@/locales/locale'
import Image from 'next/image'
import Link from 'next/link'
import photo1 from '@/public/photo.jpg'
import photo2 from '@/public/photo2.webp'
import photo3 from '@/public/photo3.png'

export default function Home({ params: { locale } }: any) {
    const { t } = getDictionary(locale)
    return (
        <>
            <section className="flex flex:col align-items:center justify-content:center my:80 my:30@<sm overflow:clip">
                <div className="
                        rel min-w:770 min-h:540 opacity:.35
                        {b:5|solid|gray-90;box-shadow:3|5|3|gray-20/.7;~transform|.35s}>img
                        {transform:scale(1.1)|rotate(0deg);z-index:9}>img:hover
                    ">
                    <Image className="abs top:45 left:42 rotate(-12deg)" src={photo3} width={300} height={428} alt="photo" />
                    <Image className="abs top:295 left:342 rotate(5deg)" src={photo2} width={384} height={216} alt="photo" />
                    <Image className="abs top:45 left:242 rotate(10deg)" src={photo1} width={500} height={284} alt="photo" />
                </div>
                <div className="abs z:9 pointer-events:none px:24 ">
                    <h1 className="f:52 f:48@<sm mb:30 mb:16@<sm">{t('index title')}</h1>
                    <h2 className="f:18@<sm font-weight:normal mb:10">{t('index subtitle')}</h2>
                    <h2 className="f:18@<sm font-weight:normal">{t('index subtitle2')}</h2>
                </div>
                <Link href={`/${locale}/new`}>
                    <button className="
                            p:16|32 r:3
                            ~background|.2s
                            bg:white fg:black bg:gray-70:hover@dark bg:gray-50:active@dark
                            bg:black@light fg:white@light bg:gray-30:hover@light bg:gray-50:active@light
                        ">
                        {t('Create a party now')}
                    </button>
                </Link>
            </section>
        </>
    )
}
