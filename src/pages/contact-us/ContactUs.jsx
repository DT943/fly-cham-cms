import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import HeroText from './components/HeroText.jsx'
import SearchConsole from './components/SearchConsole.jsx'
import HelpCategories from './components/HelpCategories.jsx'
import UrgentHelp from './components/UrgentHelp.jsx'
import JourneySection from './components/JourneySection.jsx'

const ContactUs = () => {
  const { t } = useTranslation()

  const helpBreadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help') },
  ]

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-[1222px] mx-auto px-4 sm:px-8 md:px-10 py-6 md:py-10 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumbs items={helpBreadcrumbs} />
          <LanguageSwitcher />
        </div>
        <HeroText />
        <SearchConsole />
        <HelpCategories />
        <UrgentHelp />
        <JourneySection />
      </div>
    </main>
  )
}

export default ContactUs
