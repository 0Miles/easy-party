import NewPartyForm from '@/components/new-party.form'
import { getDictionary } from '@/locales/locale'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params, searchParams }: any,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { t } = getDictionary(params.locale)

    return {
        title: t('New Party') + ' | Easy Party',
    }
}

export default function NewParty({ params: { locale } }: any) {
    const { t } = getDictionary(locale)


    return (

        <>
            <NewPartyForm locale={locale} />
        </>
    )
}
