import { useEffect } from 'react'
import { X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import BookingWidget from '../../../shared/booking/BookingWidget.jsx'

/**
 * Slides down from under the sticky header once a leg is chosen on the map, so
 * the traveller can add dates, passengers and cabin before searching. Mounted
 * only while open — the booking box carries its own redux + query providers.
 *
 * The booking widget sits at content width so the map stays visible around it.
 * Overflow stays visible so calendar and passenger popovers are not clipped.
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

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t('routeMap.drawer.title')}
      className="pointer-events-none absolute inset-x-0 top-0 z-[600]"
    >
      <Container className="pointer-events-auto py-4 md:py-5">
        <div className="relative animate-[fadeSlide_0.25s_ease-out] motion-reduce:animate-none">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('routeMap.drawer.close')}
            className="absolute end-3 top-3 z-30 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-100 text-600 transition-colors hover:bg-200"
          >
            <X size={18} weight="bold" />
          </button>

          <BookingWidget initialFrom={from?.code} initialTo={to?.code} />
        </div>
      </Container>
    </div>
  )
}

export default RouteBookingDrawer
