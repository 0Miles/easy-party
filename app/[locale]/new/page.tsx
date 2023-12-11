import NProgressDone from '@/components/nprogress-done'
import EditPartyClient from '@/components/page-client/edit-party-client'
import { getDictionary } from '@/locales/locale'
import { Metadata } from 'next'

export async function generateMetadata(
    { params }: any
): Promise<Metadata> {
    const { t } = getDictionary(params.locale)

    return {
        title: t('New Party') + ' | Easy Party',
    }
}

export default function NewParty({ params: { locale } }: any) {

    return (

        <>
            <NProgressDone />
            <EditPartyClient locale={locale} />
        </>
    )
}
