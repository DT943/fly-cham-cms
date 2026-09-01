import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchConsole from '../help/components/SearchConsole.jsx'

const popularSearchIds = ['baggage', 'bookingOnline', 'checkIn', 'flightStatus']

const Faqs = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.faqs') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero
          title={t('faq.hero.title')}
          subtitle={t('faq.hero.subtitle')}
        />
        <SearchConsole
          label={t('faq.search.label')}
          placeholder={t('faq.search.placeholder')}
          submit={null}
          popularLabel={t('faq.search.popular')}
          popularItems={popularSearchIds.map((id) => ({
            id,
            label: t(`faq.search.tags.${id}`),
          }))}
          showSuggestions={false}
        />
      </Container>
    </main>
  )
}

export default Faqs
