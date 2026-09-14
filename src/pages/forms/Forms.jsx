import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchConsole from '../help/components/SearchConsole/index.jsx'
import AllForms from './components/AllForms.jsx'
import TrackRequest from './components/TrackRequest.jsx'
import CtaBanner from '../../shared/components/CtaBanner.jsx'
import heroPhoto from '../../assets/images/forms/ph1.png'
import heroMask from '../../assets/images/contact-us/mask.png'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'

const popularSearchIds = ['baggage', 'refund', 'payment', 'lostBaggage']

const Forms = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.contactUs'), href: '/help/contact-us' },
    { label: t('common.forms') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <SearchAnchor hit="forms-hero">
          <PageHero
            title={t('forms.hero.title')}
            subtitle={t('forms.hero.subtitle')}
            image={heroPhoto}
            mask={heroMask}
            imageAlt={t('forms.hero.imageAlt')}
          />
        </SearchAnchor>
        <SearchConsole
          label={t('forms.search.label')}
          placeholder={t('forms.search.placeholder')}
          submit={null}
          popularLabel={t('forms.search.popular')}
          popularItems={popularSearchIds.map((id) => ({
            id,
            label: t(`forms.search.tags.${id}`),
          }))}
          onQueryChange={setSearchQuery}
          types={['form']}
        />
        <AllForms query={searchQuery} />
        <TrackRequest />
        <CtaBanner
          title={t('forms.guide.title')}
          description={t('forms.guide.description')}
          cta={t('forms.guide.cta')}
          href="/help/contact-us"
        />
      </Container>
    </main>
  )
}

export default Forms
