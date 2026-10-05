/**
 * Default look of the seven CMS offer banners. Mirrors flychamadmin
 * src/cms2/cmsComponents/OfferBanner/utils/{variants,style}.js — keep the
 * visuals and default style values in sync.
 */

const LIGHT_TEXT = {
  titleColor: '50',
  descriptionColor: '200',
  routeColor: '50',
  labelColor: '300',
  valueColor: '50',
  priceColor: 'secondary',
  termsColor: '400',
}

const DARK_TEXT = {
  titleColor: 'secondary-2',
  descriptionColor: '700',
  routeColor: 'primary-1',
  labelColor: '600',
  valueColor: 'primary-1',
  priceColor: 'primary-1',
  termsColor: '500',
}

export const OFFER_VARIANTS = {
  'offer-destination': {
    visual: 'stat',
    style: {
      layout: 'overlay',
      imageSide: 'right',
      height: 'tall',
      cardBg: 'primary-1',
      accentColor: 'secondary-300',
      badgeBg: 'secondary-300',
      badgeText: 'secondary-2',
      buttonBg: 'secondary-300',
      buttonBgHover: '50',
      buttonText: 'secondary-2',
      ...LIGHT_TEXT,
      descriptionColor: 'primary-100',
      valueColor: 'secondary-2',
      labelColor: '50',
      priceColor: 'secondary-300',
      termsColor: 'primary-100',
    },
  },
  'offer-one-way': {
    visual: 'route-oneway',
    style: {
      layout: 'split',
      imageSide: 'right',
      cardBg: 'secondary-2',
      accentColor: 'secondary',
      badgeBg: 'secondary',
      badgeText: 'secondary-2',
      buttonBg: 'secondary',
      buttonBgHover: 'secondary-300',
      buttonText: 'secondary-2',
      ...LIGHT_TEXT,
    },
  },
  'offer-round-trip': {
    visual: 'route-return',
    style: {
      layout: 'overlay',
      imageSide: 'right',
      cardBg: 'primary-800',
      accentColor: 'secondary-700',
      badgeBg: 'secondary-700',
      badgeText: 'secondary-2',
      buttonBg: 'secondary-700',
      buttonBgHover: 'secondary-300',
      buttonText: 'secondary-2',
      ...LIGHT_TEXT,
      priceColor: 'secondary-700',
    },
  },
  'offer-multi-city': {
    visual: 'stops',
    style: {
      layout: 'split',
      imageSide: 'left',
      cardBg: 'secondary-100',
      accentColor: 'primary-1',
      badgeBg: 'primary-1',
      badgeText: '50',
      buttonBg: 'primary-1',
      buttonBgHover: 'primary-700',
      buttonText: '50',
      ...DARK_TEXT,
    },
  },
  'offer-baggage': {
    visual: 'stat',
    style: {
      layout: 'split',
      imageSide: 'right',
      cardBg: 'primary-1',
      accentColor: 'secondary-700',
      badgeBg: 'secondary-700',
      badgeText: 'secondary-2',
      buttonBg: 'secondary-700',
      buttonBgHover: 'secondary-300',
      buttonText: 'secondary-2',
      ...LIGHT_TEXT,
      valueColor: 'secondary-2',
      priceColor: 'secondary-700',
      termsColor: 'primary-100',
      descriptionColor: 'primary-100',
      labelColor: '50',
    },
  },
  'offer-seat': {
    visual: 'stat',
    style: {
      layout: 'split',
      imageSide: 'left',
      cardBg: '50',
      showCardBorder: true,
      accentColor: 'primary-1',
      badgeBg: 'secondary-200',
      badgeText: 'secondary-2',
      buttonBg: 'primary-1',
      buttonBgHover: 'primary-700',
      buttonText: '50',
      ...DARK_TEXT,
      valueColor: '50',
      labelColor: '700',
    },
  },
  'offer-payment-option': {
    visual: 'stat',
    style: {
      layout: 'overlay',
      imageSide: 'right',
      cardBg: 'secondary-2',
      accentColor: 'secondary',
      badgeBg: 'secondary',
      badgeText: 'secondary-2',
      buttonBg: 'secondary',
      buttonBgHover: 'secondary-300',
      buttonText: 'secondary-2',
      ...LIGHT_TEXT,
      valueColor: 'secondary-2',
      labelColor: '50',
    },
  },
}

export const OFFER_VARIANT_IDS = Object.keys(OFFER_VARIANTS)

const TEXT_ROLES = [
  ['badgeText', 'semibold'],
  ['titleColor', 'bold'],
  ['descriptionColor', 'normal'],
  ['routeColor', 'bold'],
  ['labelColor', 'medium'],
  ['valueColor', 'bold'],
  ['priceColor', 'bold'],
  ['termsColor', 'normal'],
]

const BASE_STYLE = {
  layout: 'split',
  imageSide: 'right',
  height: 'default',
  cardRadius: '3xl',
  cardBg: 'secondary-2',
  showCardBorder: false,
  accentColor: 'secondary',
  sectionPadding: 'default',
  showSectionBg: false,
  sectionBg: '100',
  showBadge: true,
  showDescription: true,
  showVisual: true,
  showPrice: true,
  showTerms: true,
  badgeBg: 'secondary',
  showButton: true,
  showButtonIcon: true,
  buttonBg: 'secondary',
  buttonBgHover: '',
  buttonText: 'secondary-2',
  buttonTextFontWeight: 'semibold',
  buttonTextFontWeightHover: 'semibold',
  showLinks: true,
}

export function getOfferVariant(id) {
  return OFFER_VARIANTS[id] || OFFER_VARIANTS['offer-one-way']
}

/** Variant defaults + whatever the CMS stored. */
export function resolveOfferStyle(variantId, style = {}) {
  const merged = { ...BASE_STYLE, ...getOfferVariant(variantId).style }
  for (const [key, weight] of TEXT_ROLES) {
    const weightKey = key.endsWith('Color') ? key.replace(/Color$/, 'FontWeight') : `${key}FontWeight`
    merged[`${key}Hover`] = merged[key]
    merged[weightKey] = weight
    merged[`${weightKey}Hover`] = weight
  }
  merged.buttonTextHover = merged.buttonText
  return { ...merged, ...style }
}
