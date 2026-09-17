import { useTranslation } from 'react-i18next'
import { Shield, Cookie, AirplaneTilt, Scroll } from '@phosphor-icons/react'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import HelpCta from '../../shared/components/HelpCta.jsx'
import { typography } from '../../styles/typography.js'
import LegalHubCard from './components/LegalHubCard.jsx'

// The four legal documents this hub links to, in design order.
const CARDS = [
  { id: 'privacy', Icon: Shield, href: '/legal/privacy-policy' },
  { id: 'cookies', Icon: Cookie, href: '/legal/cookies' },
  { id: 'booking', Icon: AirplaneTilt, href: '/legal/terms-and-conditions' },
  { id: 'website', Icon: Scroll, href: '/legal/terms-and-conditions' },
]

const Legal = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('legal.hub.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <Container className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-4">
          <h1 className={`m-0 font-bold leading-tight text-primary-1 ${typography.pageTitle} lg:text-[64px]`}>
            {t('legal.hub.title')}
          </h1>
          <p className={`m-0 max-w-[900px] font-normal leading-relaxed text-700 ${typography.sectionDescription}`}>
            {t('legal.hub.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {CARDS.map((card) => (
            <LegalHubCard key={card.id} {...card} />
          ))}
        </div>

        <HelpCta
          contained={false}
          title={t('legal.hub.help.title')}
          description={t('legal.hub.help.description')}
          cta={t('legal.hub.help.cta')}
          imageAlt={t('legal.hub.help.imageAlt')}
          href="/help"
        />
      </Container>
    </main>
  )
}

export default Legal
