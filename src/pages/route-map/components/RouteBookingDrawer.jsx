import { useEffect } from 'react'
import { AirplaneTakeoff, ArrowRight, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import BookingWidget from '../../../shared/booking/BookingWidget.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * Slides down from under the sticky header once a leg is chosen on the map, so
 * the traveller can add dates, passengers and cabin before searching. Mounted
 * only while open — the booking box carries its own redux + query providers.
 */
const RouteBookingDrawer = ({ open, from, to, onClose }) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  /*
   * Deliberately no max-height or overflow: the booking box opens its calendar
   * and passenger popups as absolutely positioned children, and any overflow
   * other than `visible` clips them at the drawer's edge.
   */
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t('routeMap.drawer.title')}
      className="absolute inset-x-0 top-0 z-[600] border-b border-solid border-200 bg-background shadow-[0_18px_40px_rgba(1,38,59,0.22)] animate-[fadeSlide_0.25s_ease-out] motion-reduce:animate-none"
    >
      <Container className="flex flex-col gap-4 py-5 md:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className={`${typography.itemTitle} m-0 font-semibold text-secondary-2`}>
              {t('routeMap.drawer.title')}
            </h2>
            {from && to && (
              <p className={`${typography.caption} m-0 flex items-center gap-2 text-600`}>
                <AirplaneTakeoff size={16} className="shrink-0 text-primary-1" />
                <span className="font-semibold text-secondary-2">
                  {from.city} ({from.code})
                </span>
                <ArrowRight size={12} weight="bold" className="shrink-0 rtl:-scale-x-100" />
                <span className="font-semibold text-secondary-2">
                  {to.city} ({to.code})
                </span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('routeMap.drawer.close')}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-100 text-600 transition-colors hover:bg-200"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <BookingWidget initialFrom={from?.code} initialTo={to?.code} />
      </Container>
    </div>
  )
}

export default RouteBookingDrawer
