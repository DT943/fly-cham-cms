import { useEffect, useMemo, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '../../vendor/flycham/store/index.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import { colorVar, getButtonStyle } from '../../styles/cmsStyle.js'
import { resolveLabels } from './labels.js'
import useBookingSearch from './useBookingSearch.js'
import useManageBooking from './useManageBooking.js'
import { DesktopBookPanel, DesktopManagePanel, DesktopTabs } from './BookingSearchDesktop.jsx'
import { MobileBookPanel, MobileManagePanel, MobileTabs } from './BookingSearchMobile.jsx'
import { DESKTOP_CARD, DESKTOP_COLUMN, MOBILE_CARD } from './bookingSearchStyle.js'

/** Own query cache (same approach as the vendored BookingWidget). */
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
})

const OFFSET_MIN = -240
const OFFSET_MAX = 120
const clampOffset = (value) => Math.min(OFFSET_MAX, Math.max(OFFSET_MIN, Math.round(Number(value) || 0)))
const hasValue = (value) => value !== null && value !== undefined && value !== ''

const SEARCH_BUTTON = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  bgHoverFallback: 'secondary-800',
  textKey: 'buttonText',
  textFallback: '700',
  weightFallback: 'semibold',
}

/** Desktop row from 1024px (the 1161px field row needs the room). */
const useIsDesktop = () => {
  const query = '(min-width: 1024px)'
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : true,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return matches
}

const BookingSearchInner = ({ content, style }) => {
  const language = useCurrentLanguage()
  const lang = language === 'ar' ? 'ar' : 'en'
  const labels = useMemo(() => resolveLabels(content), [content])
  const isDesktop = useIsDesktop()
  const [tab, setTab] = useState('book')
  const s = useBookingSearch({ language: lang, labels })
  const m = useManageBooking(labels)

  const show = {
    manage: style.showManageTab !== false,
    flightStatus: style.showFlightStatusTab !== false,
    multiCity: style.showMultiCity !== false,
    miles: style.showMilesToggle !== false,
    nearby: style.showNearby !== false,
  }
  const theme = {
    cardBg: colorVar(style.cardBg || 'white'),
    fieldBg: colorVar(style.fieldBg || '100'),
    accent: colorVar(style.accentColor || 'primary-1'),
    iconBg: colorVar(style.iconBg || 'secondary'),
    iconColor: colorVar(style.iconColor || '100'),
    button: getButtonStyle(style, SEARCH_BUTTON),
  }
  const tabs = [
    { id: 'book', label: labels.bookTab },
    ...(show.manage ? [{ id: 'manage', label: labels.manageTab }] : []),
    ...(show.flightStatus ? [{ id: 'status', label: labels.flightStatusTab, href: labels.flightStatusHref }] : []),
  ]
  const activeTab = tab === 'manage' && !show.manage ? 'book' : tab

  if (isDesktop) {
    return (
      <div className={DESKTOP_CARD} style={{ backgroundColor: theme.cardBg }}>
        <div className={DESKTOP_COLUMN}>
          <DesktopTabs tabs={tabs} active={activeTab} onSelect={setTab} theme={theme} />
        </div>
        {activeTab === 'manage' ? (
          <DesktopManagePanel m={m} labels={labels} theme={theme} />
        ) : (
          <DesktopBookPanel s={s} labels={labels} theme={theme} show={show} lang={lang} />
        )}
      </div>
    )
  }

  return (
    <div className={MOBILE_CARD} style={{ backgroundColor: theme.cardBg }}>
      <MobileTabs tabs={tabs} active={activeTab} onSelect={setTab} theme={theme} />
      {activeTab === 'manage' ? (
        <MobileManagePanel m={m} labels={labels} theme={theme} />
      ) : (
        <MobileBookPanel s={s} labels={labels} theme={theme} show={show} lang={lang} />
      )}
    </div>
  )
}

/**
 * CMS "booking-search" block — the Offers & Deals booking box (Figma
 * 40951:24421 desktop / 40954:91233 mobile). A new Figma UI on top of the live
 * flycham.com booking engine: Search hands off to flycham.com search results,
 * Manage to its manage-booking deep link. `offsetY` / `offsetYMobile` pull the
 * box up over the hero, like the booking-widget block.
 */
const BookingSearch = ({ content = {}, style = {} }) => {
  const offset = clampOffset(style.offsetY)
  const mobile = hasValue(style.offsetYMobile) ? clampOffset(style.offsetYMobile) : null
  const wrapper = mobile !== null
    ? { className: 'relative z-20 mt-[var(--bs-offset-sm)] lg:mt-[var(--bs-offset)]', style: { '--bs-offset': `${offset}px`, '--bs-offset-sm': `${mobile}px` } }
    : offset
      ? { className: 'relative z-20 mt-[calc(var(--bs-offset)*0.5)] lg:mt-[var(--bs-offset)]', style: { '--bs-offset': `${offset}px` } }
      : { className: 'relative z-20', style: undefined }

  return (
    <div className={wrapper.className} style={wrapper.style}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BookingSearchInner content={content} style={style} />
        </QueryClientProvider>
      </ReduxProvider>
    </div>
  )
}

export default BookingSearch
