import heroImage from '../../../assets/images/business-center/hero.png'
import b2bImage from '../../../assets/images/business-center/b2b.png'
import agentGuideImage from '../../../assets/images/business-center/agent-guide.png'
import partnershipImage from '../../../assets/images/business-center/partnership.jpg'
import apiImage from '../../../assets/images/business-center/api.jpg'
import enquiryImage from '../../../assets/images/business-center/enquiry.png'

/**
 * Business Center static content.
 * Copy lives under `businessCenter.*` in the locale files.
 */
export const businessServices = {
  featured: {
    id: 'b2bPortal',
    image: b2bImage,
    href: '/coming-soon',
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
