import BookingWidget from '../../shared/booking/BookingWidget.jsx'

const OFFSET_MIN = -240
const OFFSET_MAX = 120

/**
 * CMS "booking-widget" block: the live booking box plus the CMS vertical
 * offset (px; negative pulls it up over the block above, e.g. the home hero).
 * Full offset from md up, half on small screens — same classes as cms2's
 * BookingWidgetSection so both apps position the box identically.
 */
const BookingWidgetBlock = ({ offsetY = 0 }) => {
  const offset = Math.min(OFFSET_MAX, Math.max(OFFSET_MIN, Math.round(Number(offsetY) || 0)))
  // Below md the vendored box starts with its tab bar's `my-2` (no card yet);
  // -mt-2 cancels it so only the page gap sits above the widget.
  if (!offset) return <BookingWidget className="w-full -mt-2 md:mt-0" />

  return (
    <div
      className="relative z-20 mt-[calc(var(--bw-offset)*0.5)] md:mt-[var(--bw-offset)]"
      style={{ '--bw-offset': `${offset}px` }}
    >
      <BookingWidget className="w-full" />
    </div>
  )
}

export default BookingWidgetBlock
