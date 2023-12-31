import Image from 'next/image'
import { getDictionary } from '@/locales/locale'
import photo1 from '@/public/images/photo.jpg'
import photo2 from '@/public/images/photo2.webp'
import photo3 from '@/public/images/photo3.png'
import NProgressDone from '@/components/nprogress-done'
import CreateAPartyNowButton from '@/components/create-a-party-now-button'

export default function Home({ params: { locale } }: any) {
    const { t } = getDictionary(locale)

    return (
        <>
            <NProgressDone />
            <div className="abs inset:0 flex align-items:center justify-content:center overflow-x:clip">
                <section className="flex flex:col w:full align-items:center justify-content:center pt:20 pb:42">
                    <div className="
                            rel min-w:770 min-h:540 opacity:.35
                            {b:5|solid|gray-90;box-shadow:3|5|3|gray-20/.7;~transform|.35s;user-drag:none}>img
                            {transform:scale(1.1)|rotate(0deg);z-index:9}>img:hover
                        ">
                        <Image className="abs top:45 left:42 rotate(-12deg)" src={photo3} width={300} height={428} alt="photo" loading="eager" priority={true} />
                        <Image className="abs top:295 left:342 rotate(5deg)" src={photo2} width={384} height={216} alt="photo" loading="eager" priority={true} />
                        <Image className="abs top:45 left:242 rotate(10deg)" src={photo1} width={500} height={284} alt="photo" loading="eager" priority={true} />
                    </div>
                    <div className="abs z:9 pointer-events:none px:24">
                        <h1 className="f:52 f:48@<sm mb:30 mb:16@<sm">{t('index title')}</h1>
                        <h2 className="f:18@<sm font-weight:normal mb:10">{t('index subtitle')}</h2>
                        <h2 className="f:18@<sm font-weight:normal">{t('index subtitle2')}</h2>
                    </div>
                    <CreateAPartyNowButton locale={locale} />
                </section>
            </div>
        </>
    )
}
