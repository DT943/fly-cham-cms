import PageHero from '../../../shared/components/PageHero.jsx'
import CtaBanner from '../../../shared/components/CtaBanner.jsx'
import LiveChatBanner from '../../../shared/components/LiveChatBanner.jsx'
import SearchConsole from '../../help/components/SearchConsole/index.jsx'
import HelpCategories from '../../help/components/HelpCategories.jsx'
import JourneySection from '../../help/components/JourneySection.jsx'
import GetInTouch from '../../contact-us/components/GetInTouch.jsx'
import ContactChannels from '../../contact-us/components/ContactChannels.jsx'
import { pageHeroProps } from './adapters/pageHeroAdapter.js'
import { searchConsoleProps } from './adapters/searchConsoleAdapter.js'
import { helpCategoriesProps } from './adapters/helpCategoriesAdapter.js'
import { ctaBannerProps } from './adapters/ctaBannerAdapter.js'
import { journeySectionProps } from './adapters/journeySectionAdapter.js'
import { liveChatBannerProps } from './adapters/liveChatBannerAdapter.js'
import { getInTouchProps } from './adapters/getInTouchAdapter.js'
import { contactChannelsProps } from './adapters/contactChannelsAdapter.js'

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
}

export function getSection(sectionId) {
  return sectionRegistry[sectionId] || null
}
