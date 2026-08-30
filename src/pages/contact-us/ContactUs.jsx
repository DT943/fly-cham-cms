import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import HeroText from './components/HeroText.jsx'
import SearchConsole from './components/SearchConsole.jsx'
import HelpCategories from './components/HelpCategories.jsx'
import UrgentHelp from './components/UrgentHelp.jsx'
import JourneySection from './components/JourneySection.jsx'

const helpBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Help' },
]

const ContactUs = () => (
  <main className="bg-background min-h-screen">
    <div className="max-w-[1222px] mx-auto px-4 sm:px-8 md:px-10 py-6 md:py-10 flex flex-col gap-8">
      <Breadcrumbs items={helpBreadcrumbs} />
      <HeroText />
      <SearchConsole />
      <HelpCategories />
      <UrgentHelp />
      <JourneySection />
    </div>
  </main>
)

export default ContactUs
