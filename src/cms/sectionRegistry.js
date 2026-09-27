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
import DestinationThingsToDo from '../shared/components/DestinationThingsToDo.jsx'
import LandmarkFeature from '../shared/components/LandmarkFeature.jsx'
import SightsGrid from '../shared/components/SightsGrid.jsx'
import MagazineBanner from '../shared/components/MagazineBanner.jsx'
import NewsletterSignup from '../shared/components/NewsletterSignup.jsx'
import OfficeDirectory from '../pages/our-offices/components/OfficeDirectory.jsx'
import GetHelp from '../pages/our-offices/components/GetHelp.jsx'
import PromoBanner from '../shared/components/PromoBanner.jsx'
import FaqExplorer from '../shared/components/FaqExplorer.jsx'
import Faqs from '../shared/components/Faqs.jsx'
import GsaNetwork from '../shared/components/GsaNetwork.jsx'
import TravelExperienceCards from '../shared/components/TravelExperienceCards.jsx'
import SeatJourney from '../shared/components/SeatJourney.jsx'
import SeatChoose from '../shared/components/SeatChoose.jsx'
import SeatPlan from '../shared/components/SeatPlan.jsx'
import InfoAccordion from '../shared/components/InfoAccordion.jsx'
import ResponsibilitySections from '../shared/components/ResponsibilitySections.jsx'
import BeforeYouFlyServices from '../shared/components/BeforeYouFlyServices.jsx'
import JourneyStageNextSteps from '../shared/components/JourneyStageNextSteps.jsx'
import MarhabaIntro from '../shared/components/MarhabaIntro.jsx'
import ExploreMarhaba from '../shared/components/ExploreMarhaba.jsx'
import PageIntro from '../shared/components/PageIntro.jsx'
import LatestNews from '../shared/components/LatestNews.jsx'
import NewsGrid from '../shared/components/NewsGrid.jsx'
import MediaContactCards from '../shared/components/MediaContactCards.jsx'
import MediaNewsletterSignup from '../shared/components/MediaNewsletterSignup.jsx'
import FleetExplore from '../shared/components/FleetExplore.jsx'
import MediaCards from '../shared/components/MediaCards.jsx'
import AboutValues from '../shared/components/AboutValues.jsx'
import RecentNews from '../shared/components/RecentNews.jsx'
import HelpFaqs from '../shared/components/HelpFaqs.jsx'
import LegalHub from '../shared/components/LegalHub.jsx'
import LegalDocument from '../shared/components/LegalDocument.jsx'
import LegalMoreInfo from '../shared/components/LegalMoreInfo.jsx'
import Breadcrumbs from '../shared/components/Breadcrumbs.jsx'
import BookingWidgetBlock from './components/BookingWidgetBlock.jsx'
import NewsDetailHeader from '../shared/components/NewsDetailHeader.jsx'
import NewsDetailParagraphs from '../shared/components/NewsDetailParagraphs.jsx'
import NewsDetailGallery from '../shared/components/NewsDetailGallery.jsx'
import NewsDetailFigure from '../shared/components/NewsDetailFigure.jsx'
import HomePlanTrip from '../shared/components/HomePlanTrip.jsx'
import { homePlanTripProps } from './adapters/homePlanTripAdapter.js'
import HomeExtraServices from '../shared/components/HomeExtraServices.jsx'
import { homeExtraServicesProps } from './adapters/homeExtraServicesAdapter.js'
import HomeTravelExperience from '../shared/components/HomeTravelExperience.jsx'
import { homeTravelExperienceProps } from './adapters/homeTravelExperienceAdapter.js'
import HomeChamMilesBanner from '../shared/components/HomeChamMilesBanner.jsx'
import { homeChamMilesBannerProps } from './adapters/homeChamMilesBannerAdapter.js'
import HomeAbout from '../shared/components/HomeAbout.jsx'
import { homeAboutProps } from './adapters/homeAboutAdapter.js'
import TravelUpdatesAdvisory from '../shared/components/TravelUpdatesAdvisory.jsx'
import { travelUpdatesAdvisoryProps } from './adapters/travelUpdatesAdvisoryAdapter.js'
import TravelUpdatesList from '../shared/components/TravelUpdatesList.jsx'
import { travelUpdatesListProps } from './adapters/travelUpdatesListAdapter.js'
import CargoShipmentTypes from '../shared/components/CargoShipmentTypes.jsx'
import { cargoShipmentTypesProps } from './adapters/cargoShipmentTypesAdapter.js'
import CargoInfoCards from '../shared/components/CargoInfoCards.jsx'
import { cargoInfoCardsProps } from './adapters/cargoInfoCardsAdapter.js'
import CargoStationsExplorer from '../shared/components/CargoStationsExplorer.jsx'
import { cargoStationsExplorerProps } from './adapters/cargoStationsExplorerAdapter.js'
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
import { destinationThingsToDoProps } from './adapters/destinationThingsToDoAdapter.js'
import { landmarkFeatureProps } from './adapters/landmarkFeatureAdapter.js'
import { sightsGridProps } from './adapters/sightsGridAdapter.js'
import { magazineBannerProps } from './adapters/magazineBannerAdapter.js'
import { newsletterSignupProps } from './adapters/newsletterSignupAdapter.js'
import { officeDirectoryProps } from './adapters/officeDirectoryAdapter.js'
import { getHelpProps } from './adapters/getHelpAdapter.js'
import { promoBannerProps } from './adapters/promoBannerAdapter.js'
import { faqExplorerProps } from './adapters/faqExplorerAdapter.js'
import { faqsProps } from './adapters/faqsAdapter.js'
import { gsaNetworkProps } from './adapters/gsaNetworkAdapter.js'
import { travelExperienceCardsProps } from './adapters/travelExperienceCardsAdapter.js'
import { seatJourneyProps } from './adapters/seatJourneyAdapter.js'
import { seatChooseProps } from './adapters/seatChooseAdapter.js'
import { seatPlanProps } from './adapters/seatPlanAdapter.js'
import { infoAccordionProps } from './adapters/infoAccordionAdapter.js'
import { responsibilitySectionsProps } from './adapters/responsibilitySectionsAdapter.js'
import { beforeYouFlyServicesProps } from './adapters/beforeYouFlyServicesAdapter.js'
import { journeyStageNextStepsProps } from './adapters/journeyStageNextStepsAdapter.js'
import { marhabaIntroProps } from './adapters/marhabaIntroAdapter.js'
import { exploreMarhabaProps } from './adapters/exploreMarhabaAdapter.js'
import { pageIntroProps } from './adapters/pageIntroAdapter.js'
import { latestNewsProps } from './adapters/latestNewsAdapter.js'
import { newsGridProps } from './adapters/newsGridAdapter.js'
import { mediaContactCardsProps } from './adapters/mediaContactCardsAdapter.js'
import { mediaNewsletterSignupProps } from './adapters/mediaNewsletterSignupAdapter.js'
import { fleetExploreProps } from './adapters/fleetExploreAdapter.js'
import { mediaCardsProps } from './adapters/mediaCardsAdapter.js'
import { aboutValuesProps } from './adapters/aboutValuesAdapter.js'
import { recentNewsProps } from './adapters/recentNewsAdapter.js'
import { helpFaqsProps } from './adapters/helpFaqsAdapter.js'
import { legalHubProps } from './adapters/legalHubAdapter.js'
import { legalDocumentProps } from './adapters/legalDocumentAdapter.js'
import { legalMoreInfoProps } from './adapters/legalMoreInfoAdapter.js'
import { breadcrumbsProps } from './adapters/breadcrumbsAdapter.js'
import { newsDetailHeaderProps } from './adapters/newsDetailHeaderAdapter.js'
import { newsDetailParagraphsProps } from './adapters/newsDetailParagraphsAdapter.js'
import { newsDetailGalleryProps } from './adapters/newsDetailGalleryAdapter.js'
import { newsDetailFigureProps } from './adapters/newsDetailFigureAdapter.js'
import BusinessQuickAccess from '../shared/components/BusinessQuickAccess.jsx'
import { businessQuickAccessProps } from './adapters/businessQuickAccessAdapter.js'

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
  'get-in-touch': { Component: GetInTouch, mapProps: getInTouchProps, fullBleed: true },
  'contact-channels': { Component: ContactChannels, mapProps: contactChannelsProps },
  'contact-forms': { Component: ContactForms, mapProps: contactFormsProps },
  'forms-directory': { Component: FormsDirectory, mapProps: formsDirectoryProps },
  'track-request': { Component: TrackRequest, mapProps: trackRequestProps },
  'destinations-explore': { Component: DestinationsExplore, mapProps: destinationsExploreProps },
  'destinations-inspiration': { Component: DestinationsInspiration, mapProps: destinationsInspirationProps },
  // Full-bleed: hero spans edge-to-edge; the stats card overlaps it via -mt.
  'destination-hero-stats': { Component: DestinationHeroStats, mapProps: destinationHeroStatsProps, fullBleed: true },
  'destination-narratives': { Component: DestinationNarratives, mapProps: destinationNarrativesProps },
  'destination-things-to-do': { Component: DestinationThingsToDo, mapProps: destinationThingsToDoProps },
  'landmark-feature': { Component: LandmarkFeature, mapProps: landmarkFeatureProps, fullBleed: true },
  'sights-grid': { Component: SightsGrid, mapProps: sightsGridProps },
  'magazine-banner': { Component: MagazineBanner, mapProps: magazineBannerProps },
  // Full-bleed only in the photo-banner variant (the gradient card sits in the Container).
  'newsletter-signup': {
    Component: NewsletterSignup,
    mapProps: newsletterSignupProps,
    fullBleed: (style) => style.variant === 'photo',
  },
  'office-directory': { Component: OfficeDirectory, mapProps: officeDirectoryProps },
  'get-help': { Component: GetHelp, mapProps: getHelpProps },
  'promo-banner': { Component: PromoBanner, mapProps: promoBannerProps },
  'faq-explorer': { Component: FaqExplorer, mapProps: faqExplorerProps },
  'faqs': { Component: Faqs, mapProps: faqsProps },
  'gsa-network': { Component: GsaNetwork, mapProps: gsaNetworkProps },
  'travel-experience-cards': { Component: TravelExperienceCards, mapProps: travelExperienceCardsProps },
  'seat-journey': { Component: SeatJourney, mapProps: seatJourneyProps },
  'seat-choose': { Component: SeatChoose, mapProps: seatChooseProps },
  'seat-plan': { Component: SeatPlan, mapProps: seatPlanProps },
  'info-accordion': { Component: InfoAccordion, mapProps: infoAccordionProps },
  'responsibility-sections': { Component: ResponsibilitySections, mapProps: responsibilitySectionsProps },
  'before-you-fly-services': { Component: BeforeYouFlyServices, mapProps: beforeYouFlyServicesProps },
  'journey-stage-next-steps': { Component: JourneyStageNextSteps, mapProps: journeyStageNextStepsProps },
  'marhaba-intro': { Component: MarhabaIntro, mapProps: marhabaIntroProps },
  'explore-marhaba': { Component: ExploreMarhaba, mapProps: exploreMarhabaProps },
  'page-intro': { Component: PageIntro, mapProps: pageIntroProps },
  'latest-news': { Component: LatestNews, mapProps: latestNewsProps },
  'news-grid': { Component: NewsGrid, mapProps: newsGridProps },
  'media-contact-cards': { Component: MediaContactCards, mapProps: mediaContactCardsProps },
  'media-newsletter-signup': {
    Component: MediaNewsletterSignup,
    mapProps: mediaNewsletterSignupProps,
    fullBleed: true,
  },
  'news-detail-header': { Component: NewsDetailHeader, mapProps: newsDetailHeaderProps },
  'news-detail-paragraphs': { Component: NewsDetailParagraphs, mapProps: newsDetailParagraphsProps },
  'news-detail-gallery': { Component: NewsDetailGallery, mapProps: newsDetailGalleryProps },
  'news-detail-figure': { Component: NewsDetailFigure, mapProps: newsDetailFigureProps },
  'fleet-explore': { Component: FleetExplore, mapProps: fleetExploreProps },
  'media-cards': { Component: MediaCards, mapProps: mediaCardsProps },
  'about-values': { Component: AboutValues, mapProps: aboutValuesProps },
  'recent-news': { Component: RecentNews, mapProps: recentNewsProps },
  'help-faqs': { Component: HelpFaqs, mapProps: helpFaqsProps },
  'legal-hub': { Component: LegalHub, mapProps: legalHubProps },
  'legal-document': { Component: LegalDocument, mapProps: legalDocumentProps },
  'legal-more-info': {
    Component: LegalMoreInfo,
    mapProps: legalMoreInfoProps,
    fullBleed: true,
  },
  'breadcrumbs': { Component: Breadcrumbs, mapProps: breadcrumbsProps },
  // Marker block: the live booking box; CMS style only sets its vertical offset.
  'booking-widget': {
    Component: BookingWidgetBlock,
    mapProps: (block) => ({ offsetY: block.style?.offsetY }),
  },
  // Home page sections — each renders its own full-width <section> + Container.
  'home-plan-trip': { Component: HomePlanTrip, mapProps: homePlanTripProps, fullBleed: true },
  'home-extra-services': { Component: HomeExtraServices, mapProps: homeExtraServicesProps, fullBleed: true },
  'home-travel-experience': { Component: HomeTravelExperience, mapProps: homeTravelExperienceProps, fullBleed: true },
  'home-cham-miles-banner': { Component: HomeChamMilesBanner, mapProps: homeChamMilesBannerProps, fullBleed: true },
  'home-about': { Component: HomeAbout, mapProps: homeAboutProps, fullBleed: true },
  'travel-updates-advisory': { Component: TravelUpdatesAdvisory, mapProps: travelUpdatesAdvisoryProps },
  'travel-updates-list': { Component: TravelUpdatesList, mapProps: travelUpdatesListProps },
  'cargo-shipment-types': { Component: CargoShipmentTypes, mapProps: cargoShipmentTypesProps },
  'cargo-info-cards': { Component: CargoInfoCards, mapProps: cargoInfoCardsProps },
  'cargo-stations-explorer': { Component: CargoStationsExplorer, mapProps: cargoStationsExplorerProps, fullBleed: true },
  'business-quick-access': { Component: BusinessQuickAccess, mapProps: businessQuickAccessProps },
}

export function getSection(sectionId) {
  return sectionRegistry[sectionId] || null
}
