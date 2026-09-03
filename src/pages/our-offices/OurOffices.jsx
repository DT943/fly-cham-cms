import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import heroPhoto from '../../assets/images/our-offices/ph1.png'
import heroMask from '../../assets/images/contact-us/mask.png'
import OfficeTabs from './components/OfficeTabs.jsx'
import GetHelp from './components/GetHelp.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import LiveChatBanner from '../../shared/components/LiveChatBanner.jsx'

const faqIds = ['baggageAllowance', 'infantWeight', 'extraBag']

const OurOffices = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.contactUs'), href: '/help/contact-us' },
    { label: t('common.ourOffices') },
  ]

  const faqs = faqIds.map((id) => ({
    id,
    question: t(`offices.faqs.items.${id}.question`),
    answer: t(`offices.faqs.items.${id}.answer`),
  }))

  return (
    <main className="bg-100 w-full">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero
          title={t('offices.hero.title')}
          subtitle={t('offices.hero.subtitle')}
          image={heroPhoto}
          mask={heroMask}
          imageAlt={t('offices.hero.imageAlt')}
        />
        <OfficeTabs />
        <LiveChatBanner
          title={t('common.liveChat.title')}
          description={t('common.liveChat.description')}
          cta={t('common.liveChat.cta')}
        />
        <GetHelp />
        <Faqs
          title={t('offices.faqs.title')}
          items={faqs}
          browseLabel={t('offices.faqs.browse')}
          browseHref="/help/faqs"
        />
      </Container>
    </main>
  )
}

export default OurOffices
