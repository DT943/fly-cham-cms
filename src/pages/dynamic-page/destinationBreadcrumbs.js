import { destinationFromSlug } from '../../shared/components/destinationHeroStats/liveStats.js'
import { pickContent } from '../../cms/adapters/pick.js'

const DEST_PATH = /^\/our-destinations\/(flights-to|things-to-do-in)-([^/]+)$/
const MEDIA_PATH = /^\/media-center(?:\/(.*))?$/

function cityLabel(citySlug, language) {
  const known = destinationFromSlug(`flights-to-${citySlug}`)
  if (known?.name?.[language]) return known.name[language]
  if (known?.name?.en) return known.name.en
  return citySlug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Home / Where we fly / Flights to {city}
 * Home / Where we fly / Flights to {city} / Things to do in {city}
 */
export function destinationBreadcrumbItems(path, t, language) {
  const match = String(path || '').match(DEST_PATH)
  if (!match) return null

  const [, kind, citySlug] = match
  const city = cityLabel(citySlug, language)
  const flights = {
    label: t('destinations.breadcrumb.flights', { city }),
    href: `/our-destinations/flights-to-${citySlug}`,
  }
  const home = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly'), href: '/our-destinations' },
  ]

  if (kind === 'flights-to') {
    return [...home, { label: flights.label }]
  }

  return [
    ...home,
    flights,
    { label: t('destinations.breadcrumb.thingsToDo', { city }) },
  ]
}

function titleFromSlug(slug) {
  return String(slug || '')
    .split(/[-/]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Home / Media Center
 * Home / Media Center / Recent News
 * Home / Media Center / Newsletter
 * Home / Media Center / Recent News / {article}
 */
export function mediaCenterBreadcrumbItems(path, t) {
  const match = String(path || '').match(MEDIA_PATH)
  if (!match) return null

  const rest = match[1] || ''
  const home = { label: t('common.home'), href: '/' }
  const center = { label: t('mediaCenter.breadcrumb'), href: '/media-center' }

  if (!rest) return [home, { label: center.label }]

  if (rest === 'recent-news') {
    return [home, center, { label: t('recentNews.breadcrumb') }]
  }

  if (rest === 'newsletter') {
    return [home, center, { label: t('mediaCenter.newsletter.breadcrumb') }]
  }

  const articleId = rest.match(/^news\/([^/]+)$/)?.[1]
  if (articleId) {
    const titleKey = `newsDetail.articles.${articleId}.title`
    const translated = t(titleKey)
    return [
      home,
      center,
      { label: t('recentNews.breadcrumb'), href: '/media-center/recent-news' },
      { label: translated === titleKey ? titleFromSlug(articleId) : translated },
    ]
  }

  const segments = rest.split('/').filter(Boolean)
  const crumbs = [home, center]
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    const href = `/media-center/${segments.slice(0, index + 1).join('/')}`
    crumbs.push(isLast ? { label: titleFromSlug(segment) } : { label: titleFromSlug(segment), href })
  })
  return crumbs
}

function blockHasCrumbs(block, language) {
  if (block?.sectionId !== 'breadcrumbs') return false
  const items = pickContent(block.content, language).items
  return Array.isArray(items) && items.some((item) => item?.label)
}

/** Prepend the shared trail when the CMS page has no breadcrumbs of its own. */
export function withDestinationBreadcrumbs(blocks, path, t, language) {
  const list = Array.isArray(blocks) ? blocks : []
  if (list.some((block) => blockHasCrumbs(block, language))) return list

  const items =
    destinationBreadcrumbItems(path, t, language) ||
    mediaCenterBreadcrumbItems(path, t)
  if (!items) return list

  return [
    {
      uid: 'auto-breadcrumbs',
      sectionId: 'breadcrumbs',
      order: -1,
      content: {
        [language]: {
          items,
          separator: '/',
          ariaLabel: 'Breadcrumb',
        },
      },
      style: {},
    },
    ...list,
  ]
}
