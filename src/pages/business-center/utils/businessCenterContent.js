import heroImage from '../../../assets/images-webp/business-center/hero.webp'
import b2bImage from '../../../assets/images-webp/business-center/b2b-portal.webp'
import agentGuideImage from '../../../assets/images-webp/business-center/agent-guide.webp'
import partnershipImage from '../../../assets/images-webp/business-center/partnership.webp'
import apiImage from '../../../assets/images-webp/business-center/api-integration.webp'
import enquiryImage from '../../../assets/images-webp/business-center/b2b-portal.webp'

/**
 * Business Center static content.
 * Copy lives under `businessCenter.*` in the locale files.
 */
export const businessServices = {
  featured: {
    id: 'b2bPortal',
    image: b2bImage,
    href: '/login-travel-agent',
  },
  cards: [
    {
      id: 'agentGuide',
      image: agentGuideImage,
      href: '/coming-soon',
    },
    {
      id: 'partnership',
      image: partnershipImage,
      href: '/help/contact-us/forms',
    },
    {
      id: 'apiIntegration',
      image: apiImage,
      href: '/help/contact-us/forms',
    },
  ],
}

export const businessEnquiry = {
  image: enquiryImage,
  href: '/help/contact-us',
}

export const businessQuickAccess = [
  { id: 'customerCare', href: '/help/contact-us' },
  { id: 'latestNews', href: '/recent-news' },
  { id: 'whereWeFly', href: '/our-destinations' },
  { id: 'responsibility', href: '/our-responsibility' },
]

export const businessCenterHero = {
  image: heroImage,
  objectPosition: 'center 30%',
}

export default businessServices
