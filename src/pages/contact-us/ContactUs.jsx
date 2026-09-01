import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import heroPhoto from '../../assets/images/contact-us/ph1.png'
import heroMask from '../../assets/images/contact-us/mask.png'
import ContactChannels from './components/ContactChannels.jsx'
import ContactForms from './components/ContactForms.jsx'
import LiveChatBanner from '../../shared/components/LiveChatBanner.jsx'
import GetInTouch from './components/GetInTouch.jsx'
import PromoBanner from '../../shared/components/PromoBanner.jsx'
import flightBanner from '../../assets/images/contact-us/banner.png'

const ContactUs = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.contactUs') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero
          title={t('contact.hero.title')}
          subtitle={t('contact.hero.subtitle')}
          image={heroPhoto}
          mask={heroMask}
          imageAlt={t('contact.hero.imageAlt')}
        />
        <ContactChannels />
        <ContactForms />
        <LiveChatBanner
          title={t('common.liveChat.title')}
          description={t('common.liveChat.description')}
          cta={t('common.liveChat.cta')}
        />
      </Container>
      <GetInTouch />
      <Container className="pb-6 md:pb-10">
        <PromoBanner
          title={t('contact.flightStatus.title')}
          description={t('contact.flightStatus.description')}
          cta={t('contact.flightStatus.cta')}
          image={flightBanner}
          imageAlt={t('contact.flightStatus.imageAlt')}
        />
      </Container>
    </main>
  )
}

export default ContactUs
