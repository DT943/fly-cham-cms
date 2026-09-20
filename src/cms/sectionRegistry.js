import PageHero from '../shared/components/PageHero.jsx'
import CtaBanner from '../shared/components/CtaBanner.jsx'
import LiveChatBanner from '../shared/components/LiveChatBanner.jsx'
import SearchConsole from '../pages/help/components/SearchConsole/index.jsx'
import HelpCategories from '../pages/help/components/HelpCategories.jsx'
import JourneySection from '../pages/help/components/JourneySection.jsx'
import GetInTouch from '../pages/contact-us/components/GetInTouch.jsx'
import ContactChannels from '../pages/contact-us/components/ContactChannels.jsx'
import ContactForms from '../pages/contact-us/components/ContactForms.jsx'
import OfficeDirectory from '../pages/our-offices/components/OfficeDirectory.jsx'
import GetHelp from '../pages/our-offices/components/GetHelp.jsx'
import PromoBanner from '../shared/components/PromoBanner.jsx'
import FaqExplorer from '../shared/components/FaqExplorer.jsx'
import Faqs from '../shared/components/Faqs.jsx'
import { pageHeroProps } from './adapters/pageHeroAdapter.js'
import { searchConsoleProps } from './adapters/searchConsoleAdapter.js'
import { helpCategoriesProps } from './adapters/helpCategoriesAdapter.js'
import { ctaBannerProps } from './adapters/ctaBannerAdapter.js'
import { journeySectionProps } from './adapters/journeySectionAdapter.js'
import { liveChatBannerProps } from './adapters/liveChatBannerAdapter.js'
import { getInTouchProps } from './adapters/getInTouchAdapter.js'
import { contactChannelsProps } from './adapters/contactChannelsAdapter.js'
import { contactFormsProps } from './adapters/contactFormsAdapter.js'
import { officeDirectoryProps } from './adapters/officeDirectoryAdapter.js'
import { getHelpProps } from './adapters/getHelpAdapter.js'
import { promoBannerProps } from './adapters/promoBannerAdapter.js'
import { faqExplorerProps } from './adapters/faqExplorerAdapter.js'
import { faqsProps } from './adapters/faqsAdapter.js'

/**
 * Maps a block's `sectionId` to the component that renders it plus the adapter
 * that turns the block into that component's props.
 *
 * To make another section dynamic, add one entry here (Component + mapProps).
 * Everything else — fetching, ordering, looping — already handles it.
 */
export const sectionRegistry = {
  'page-hero': { Component: PageHero, mapProps: pageHeroProps },
  'search-console': { Component: SearchConsole, mapProps: searchConsoleProps },
  'help-categories': { Component: HelpCategories, mapProps: helpCategoriesProps },
  'cta-banner': { Component: CtaBanner, mapProps: ctaBannerProps },
  'journey-section': { Component: JourneySection, mapProps: journeySectionProps },
  'live-chat-banner': { Component: LiveChatBanner, mapProps: liveChatBannerProps },
  'get-in-touch': { Component: GetInTouch, mapProps: getInTouchProps },
  'contact-channels': { Component: ContactChannels, mapProps: contactChannelsProps },
  'contact-forms': { Component: ContactForms, mapProps: contactFormsProps },
  'office-directory': { Component: OfficeDirectory, mapProps: officeDirectoryProps },
  'get-help': { Component: GetHelp, mapProps: getHelpProps },
  'promo-banner': { Component: PromoBanner, mapProps: promoBannerProps },
  'faq-explorer': { Component: FaqExplorer, mapProps: faqExplorerProps },
  'faqs': { Component: Faqs, mapProps: faqsProps },
}

export function getSection(sectionId) {
  return sectionRegistry[sectionId] || null
}
