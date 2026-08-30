import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import ContactHero from './components/ContactHero.jsx'
import ContactChannels from './components/ContactChannels.jsx'
import ContactForms from './components/ContactForms.jsx'
import GetInTouch from './components/GetInTouch.jsx'

const ContactUs = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.contactUs') },
  ]

  return (
    <main className="bg-100 min-h-screen">
      <div className="max-w-[1222px] mx-auto px-4 sm:px-8 md:px-10 py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <ContactHero />
        <ContactChannels />
        <ContactForms />
      </div>
      <GetInTouch />
    </main>
  )
}

export default ContactUs
