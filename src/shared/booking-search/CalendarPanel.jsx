import { useMemo, useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { INK, MUTED } from './bookingSearchStyle.js'

const pad = (n) => String(n).padStart(2, '0')

/** Local calendar key "YYYY-MM-DD". */
export const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const parseDateKey = (key) => {
  const m = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null
}

export const localeFor = (lang) => (lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB')

/** "Wed 25 Nov" for a field value. */
export const formatFieldDate = (key, lang) => {
  const date = parseDateKey(key)
  if (!date) return ''
  return new Intl.DateTimeFormat(localeFor(lang), { weekday: 'short', day: 'numeric', month: 'short' }).format(date)
}

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
const addMonths = (date, n) => new Date(date.getFullYear(), date.getMonth() + n, 1)

/**
 * Month grid(s) for the booking dates. `available` is the booking engine's
 * route availability (Set of day keys) — null means "no restriction" (e.g. the
 * availability API failed), an empty Set means "no flights on this route".
 * Month arrows sit physically left/right and move the way they point, so no
 * icon is mirrored in Arabic (left = earlier in English, later in Arabic).
 */
const CalendarPanel = ({
  lang = 'en',
  months = 2,
  start = '',
  end = '',
  range = false,
  minKey,
  maxKey,
  available = null,
  loading = false,
  accent,
  loadingLabel,
  onSelect,
}) => {
  const rtl = lang === 'ar'
  const [view, setView] = useState(() => startOfMonth(parseDateKey(start) || parseDateKey(minKey) || new Date()))
  const minMonth = startOfMonth(parseDateKey(minKey) || new Date())
  const maxMonth = startOfMonth(parseDateKey(maxKey) || addMonths(new Date(), 12))
  const firstWeekday = rtl ? 6 : 0

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(localeFor(lang), { weekday: 'narrow' })
    // 2023-01-01 was a Sunday.
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + ((firstWeekday + i) % 7))))
  }, [lang, firstWeekday])

  const monthTitle = (date) =>
    new Intl.DateTimeFormat(localeFor(lang), { month: 'long', year: 'numeric' }).format(date)

  const canGoBack = view > minMonth
  const canGoForward = addMonths(view, months - 1) < maxMonth
  const step = (delta) => setView((current) => addMonths(current, delta))
  // Physical arrows: in Arabic the grid reads right-to-left, so left = forward.
  const leftDelta = rtl ? 1 : -1
  const rightDelta = rtl ? -1 : 1
  const leftEnabled = rtl ? canGoForward : canGoBack
  const rightEnabled = rtl ? canGoBack : canGoForward

  const isDisabled = (key) =>
    (minKey && key < minKey) || (maxKey && key > maxKey) || (available instanceof Set && !available.has(key))

  const renderMonth = (monthDate) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const lead = (new Date(year, month, 1).getDay() - firstWeekday + 7) % 7
    const cells = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ]
    return (
      <div key={`${year}-${month}`} className="min-w-0 flex-1">
        <p className="m-0 mb-3 text-center text-sm font-semibold leading-[normal]" style={{ color: INK }}>
          {monthTitle(monthDate)}
        </p>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {weekdays.map((day, i) => (
            <span key={i} className="pb-1 text-xs leading-[normal]" style={{ color: MUTED }}>{day}</span>
          ))}
          {cells.map((date, i) => {
            if (!date) return <span key={`blank-${i}`} />
            const key = toDateKey(date)
            const disabled = isDisabled(key)
            const isStart = key === start
            const isEnd = range && key === end
            const inRange = range && start && end && key > start && key < end
            return (
              <span
                key={key}
                className="flex h-9 items-center justify-center"
                style={inRange || (range && end && (isStart || isEnd))
                  ? {
                      backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`,
                      ...(isStart ? { borderStartStartRadius: 999, borderEndStartRadius: 999 } : null),
                      ...(isEnd ? { borderStartEndRadius: 999, borderEndEndRadius: 999 } : null),
                    }
                  : undefined}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(key)}
                  aria-pressed={isStart || isEnd}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-sm leading-[normal] transition-colors enabled:hover:bg-[#f5f5f4] disabled:cursor-default"
                  style={
                    isStart || isEnd
                      ? { backgroundColor: accent, color: '#fff', fontWeight: 600 }
                      : { color: disabled ? '#c4c4c2' : INK, textDecoration: disabled ? 'line-through' : undefined }
                  }
                >
                  {date.getDate()}
                </button>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative p-4" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-between" dir="ltr">
        <button
          type="button"
          aria-label={rtl ? 'Next month' : 'Previous month'}
          disabled={!leftEnabled}
          onClick={() => step(leftDelta)}
          className="pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-colors enabled:hover:bg-[#f5f5f4] disabled:cursor-default disabled:opacity-30"
        >
          <CaretLeftIcon size={16} weight="bold" color={INK} aria-hidden />
        </button>
        <button
          type="button"
          aria-label={rtl ? 'Previous month' : 'Next month'}
          disabled={!rightEnabled}
          onClick={() => step(rightDelta)}
          className="pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-colors enabled:hover:bg-[#f5f5f4] disabled:cursor-default disabled:opacity-30"
        >
          <CaretRightIcon size={16} weight="bold" color={INK} aria-hidden />
        </button>
      </div>
      <div className={`flex gap-6 ${loading ? 'pointer-events-none opacity-40' : ''}`}>
        {Array.from({ length: months }, (_, i) => renderMonth(addMonths(view, i)))}
      </div>
      {loading ? (
        <p className="absolute inset-x-0 bottom-3 m-0 text-center text-xs" style={{ color: MUTED }}>{loadingLabel}</p>
      ) : null}
    </div>
  )
}

export default CalendarPanel
