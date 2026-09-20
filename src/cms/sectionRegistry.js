import PageHero from '../shared/components/PageHero.jsx'
import PageMediaHero from '../shared/components/PageMediaHero.jsx'
import CtaBanner from '../shared/components/CtaBanner.jsx'
import LiveChatBanner from '../shared/components/LiveChatBanner.jsx'
import SearchConsole from '../pages/help/components/SearchConsole/index.jsx'
import HelpCategories from '../pages/help/components/HelpCategories.jsx'
import JourneySection from '../pages/help/components/JourneySection.jsx'
import GetInTouch from '../pages/contact-us/components/GetInTouch.jsx'
import ContactChannels from '../pages/contact-us/components/ContactChannels.jsx'
import ContactForms from '../pages/contact-us/components/ContactForms.jsx'
import FormsDirectory from '../pages/forms/components/FormsDirectory.jsx'
import TrackRequest from '../shared/components/TrackRequest.jsx'
import DestinationsExplore from '../shared/components/DestinationsExplore.jsx'
import DestinationsInspiration from '../shared/components/DestinationsInspiration.jsx'
import DestinationHeroStats from '../shared/components/DestinationHeroStats.jsx'
import DestinationNarratives from '../shared/components/DestinationNarratives.jsx'
import OfficeDirectory from '../pages/our-offices/components/OfficeDirectory.jsx'
import GetHelp from '../pages/our-offices/components/GetHelp.jsx'
import PromoBanner from '../shared/components/PromoBanner.jsx'
import FaqExplorer from '../shared/components/FaqExplorer.jsx'
import Faqs from '../shared/components/Faqs.jsx'
import GsaNetwork from '../shared/components/GsaNetwork.jsx'
import { pageHeroProps } from './adapters/pageHeroAdapter.js'
import { pageMediaHeroProps } from './adapters/pageMediaHeroAdapter.js'
import { searchConsoleProps } from './adapters/searchConsoleAdapter.js'
import { helpCategoriesProps } from './adapters/helpCategoriesAdapter.js'
import { ctaBannerProps } from './adapters/ctaBannerAdapter.js'
import { journeySectionProps } from './adapters/journeySectionAdapter.js'
import { liveChatBannerProps } from './adapters/liveChatBannerAdapter.js'
import { getInTouchProps } from './adapters/getInTouchAdapter.js'
import { contactChannelsProps } from './adapters/contactChannelsAdapter.js'
import { contactFormsProps } from './adapters/contactFormsAdapter.js'
import { formsDirectoryProps } from './adapters/formsDirectoryAdapter.js'
import { trackRequestProps } from './adapters/trackRequestAdapter.js'
import { destinationsExploreProps } from './adapters/destinationsExploreAdapter.js'
import { destinationsInspirationProps } from './adapters/destinationsInspirationAdapter.js'
import { destinationHeroStatsProps } from './adapters/destinationHeroStatsAdapter.js'
import { destinationNarrativesProps } from './adapters/destinationNarrativesAdapter.js'
import { officeDirectoryProps } from './adapters/officeDirectoryAdapter.js'
import { getHelpProps } from './adapters/getHelpAdapter.js'
import { promoBannerProps } from './adapters/promoBannerAdapter.js'
import { faqExplorerProps } from './adapters/faqExplorerAdapter.js'
import { faqsProps } from './adapters/faqsAdapter.js'
import { gsaNetworkProps } from './adapters/gsaNetworkAdapter.js'

/**
 * Maps a block's `sectionId` to the component that renders it plus the adapter
 * that turns the block into that component's props.
 *
 * To make another section dynamic, add one entry here (Component + mapProps).
 * Everything else — fetching, ordering, looping — already handles it.
 */
export const sectionRegistry = {
  'page-hero': { Component: PageHero, mapProps: pageHeroProps },
  // Full-bleed: rendered edge-to-edge outside the page's max-w Container.
  'page-media-hero': { Component: PageMediaHero, mapProps: pageMediaHeroProps, fullBleed: true },
  'search-console': { Component: SearchConsole, mapProps: searchConsoleProps },
  'help-categories': { Component: HelpCategories, mapProps: helpCategoriesProps },
  'cta-banner': { Component: CtaBanner, mapProps: ctaBannerProps },
  'journey-section': { Component: JourneySection, mapProps: journeySectionProps },
  'live-chat-banner': { Component: LiveChatBanner, mapProps: liveChatBannerProps },
  'get-in-touch': { Component: GetInTouch, mapProps: getInTouchProps },
  'contact-channels': { Component: ContactChannels, mapProps: contactChannelsProps },
  'contact-forms': { Component: ContactForms, mapProps: contactFormsProps },
  'forms-directory': { Component: FormsDirectory, mapProps: formsDirectoryProps },
  'track-request': { Component: TrackRequest, mapProps: trackRequestProps },
  'destinations-explore': { Component: DestinationsExplore, mapProps: destinationsExploreProps },
  'destinations-inspiration': { Component: DestinationsInspiration, mapProps: destinationsInspirationProps },
  // Full-bleed: hero spans edge-to-edge; the stats card overlaps it via -mt.
  'destination-hero-stats': { Component: DestinationHeroStats, mapProps: destinationHeroStatsProps, fullBleed: true },
  'destination-narratives': { Component: DestinationNarratives, mapProps: destinationNarrativesProps },
  'office-directory': { Component: OfficeDirectory, mapProps: officeDirectoryProps },
  'get-help': { Component: GetHelp, mapProps: getHelpProps },
  'promo-banner': { Component: PromoBanner, mapProps: promoBannerProps },
  'faq-explorer': { Component: FaqExplorer, mapProps: faqExplorerProps },
  'faqs': { Component: Faqs, mapProps: faqsProps },
  'gsa-network': { Component: GsaNetwork, mapProps: gsaNetworkProps },
}

export function getSection(sectionId) {
  return sectionRegistry[sectionId] || null
}
