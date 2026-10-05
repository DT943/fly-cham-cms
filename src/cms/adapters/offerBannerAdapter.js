import { pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS offer block (offer-destination, offer-one-way, offer-round-trip, offer-multi-city,
 * offer-baggage, offer-seat, offer-payment-option) to <OfferBanner /> props.
 *
 * Stores the cms2 editor shape: `{ badge, title, description, imageUrl, imageAlt,
 * originCode/City, destinationCode/City, tripLabel, stops[], statValue,
 * statLabel, features[], pricePrefix, price, priceNote, ctaLabel, ctaIcon,
 * terms, links }`. The style is forwarded whole; OfferBanner merges it over the
 * variant's defaults.
 */
export const offerBannerProps = (variant) => (block, lang) => {
  const content = pickContent(block.content, lang)
  return {
    variant,
    content: {
      ...content,
      imageUrl: resolveCmsAsset(content.imageUrl) || '',
      stops: Array.isArray(content.stops) ? content.stops : [],
      features: Array.isArray(content.features) ? content.features : [],
      links: Array.isArray(content.links)
        ? content.links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
        : [],
    },
    style: block.style || {},
  }
}
