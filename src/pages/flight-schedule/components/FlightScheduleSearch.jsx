import { useEffect, useMemo, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { arSA, enUS } from 'date-fns/locale'
import {
  AirplaneLanding,
  AirplaneTakeoff,
  ArrowCounterClockwise,
  CalendarBlank,
  CaretDown,
  CaretUp,
  X,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { trackScheduleSearch } from '../../../shared/analytics/cmsEvents.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import CityBox from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/components/CityBox.jsx'
import AirportDropdown from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/components/AirportDropdown.jsx'
import SwapIcon from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/components/SwapIcon.jsx'
import MonthNavigation from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/components/widget/Dates/MonthNavigation.jsx'
import { formatBookingBoxDisplayDate } from '../../../vendor/flycham/util/calendarI18n.js'
import '../../../vendor/styles/booking-box.css'

// Same calendar paint as the home booking box (booking-box-v2 Dates.jsx).
const RANGE_DAY_BUTTON_RESET =
  '[&>.rdp-day_button]:!bg-transparent [&>.rdp-day_button]:!rounded-none [&>.rdp-day_button]:!border-0'
const RANGE_CAP_START_CLASS = `!bg-secondary !text-white !rounded-s-xl !rounded-e-none ${RANGE_DAY_BUTTON_RESET}`
const RANGE_CAP_END_CLASS = `!bg-secondary !text-white !rounded-e-xl !rounded-s-none ${RANGE_DAY_BUTTON_RESET}`
const RANGE_MIDDLE_CLASS = `!bg-[#e6dabc61] !text-black !rounded-none ${RANGE_DAY_BUTTON_RESET}`
const SINGLE_DAY_CLASS = 'relative w-full min-h-8 sm:min-h-10 text-sm sm:text-md text-black rounded-xl'
const RANGE_DAY_CLASS = 'relative w-full min-h-8 sm:min-h-10 text-sm sm:text-md text-black rounded-none'

const dayPickerClassNames = (isRange) => ({
  weekday: 'uppercase text-xs sm:text-sm font-bold text-gray-500 text-center w-8 sm:w-10',
  month_caption: 'hidden',
  caption_label: 'hidden',
  day: isRange ? RANGE_DAY_CLASS : SINGLE_DAY_CLASS,
  today: isRange ? RANGE_DAY_CLASS : SINGLE_DAY_CLASS,
  day_button: isRange
    ? 'w-full h-full min-h-8 sm:min-h-10 rounded-none border-0 bg-transparent'
    : 'w-full h-full min-h-8 sm:min-h-10 rounded-xl border-0 bg-transparent',
  selected: isRange ? RANGE_DAY_BUTTON_RESET : 'text-white !bg-secondary !rounded-xl',
  range_middle: RANGE_MIDDLE_CLASS,
  range_start: RANGE_CAP_START_CLASS,
  range_end: RANGE_CAP_END_CLASS,
  outside: '!cursor-default !bg-transparent !text-transparent after:!hidden',
})

const MODIFIER_CLASS_NAMES = {
  outside:
    '!cursor-default !bg-transparent !text-transparent !opacity-100 after:!hidden after:!content-none pointer-events-none',
  available:
    'cursor-pointer after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-secondary',
  noFlights: '!text-gray-400',
  previewRange: `${RANGE_MIDDLE_CLASS} !opacity-100 after:!hidden`,
  previewRangeEnd: `${RANGE_CAP_END_CLASS} !opacity-100 after:!hidden`,
}

const DAY_PICKER_CLASS =
  'booking-calendar-range booking-calendar-hide-rdp-caption w-full [&_.rdp-nav]:hidden [&_.rdp-months]:flex [&_.rdp-months]:w-full [&_.rdp-months]:justify-between [&_.rdp-months]:gap-6 [&_.rdp-month]:min-w-0 [&_.rdp-month]:flex-1 [&_.rdp-table]:w-full [&_.rdp-cell]:text-center'

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
const isSameDay = (a, b) => Boolean(a && b) && a.toDateString() === b.toDateString()

// Phone-only layout (≤767px), same breakpoint as the booking box.
const SMALL_SCREEN = '(max-width: 767px)'
const useIsSmallScreen = () => {
  const [small, setSmall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(SMALL_SCREEN).matches,
  )
  useEffect(() => {
    const query = window.matchMedia(SMALL_SCREEN)
    const onChange = () => setSmall(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return small
}

/** Search + list inside the booking box's AirportDropdown, styled like its AirportList. */
const AirportPanel = ({ airports, exclude, allowed, selected, onSelect }) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const needle = query.trim().toLowerCase()
  const items = Object.values(airports).filter(
    (airport) =>
      airport.code !== exclude &&
      (!allowed || allowed.includes(airport.code)) &&
      (!needle ||
        [airport.city, airport.country, airport.name, airport.code].some((value) =>
          value?.toLowerCase().includes(needle),
        )),
  )

  return (
    <>
      <div className="py-4">
        <div className="flex items-center border-b border-gray-300">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('flightSchedulePage.form.searchAirport')}
            className="w-full border-0 bg-transparent px-0 py-2 text-start text-[16px] text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('flightSchedulePage.form.clear')}
              className="cursor-pointer border-0 bg-transparent px-2 text-gray-700 hover:text-black"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>
      </div>

      <p className="m-0 mb-1 text-start text-sm font-medium text-gray-500">
        {t('flightSchedulePage.form.allAirports')}
      </p>
      <div className="max-h-75 overflow-y-auto">
        {items.length ? (
          items.map((airport) => (
            <button
              key={airport.code}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(airport.code)}
              className={`flex w-full cursor-pointer items-center gap-3 border-0 border-b border-solid border-gray-200 bg-transparent p-3 text-start transition-colors duration-150 hover:rounded-lg hover:bg-[#F5F5F4] sm:gap-4 ${
                selected === airport.code ? 'bg-[#E5E5E3]' : ''
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-800">
                  {airport.city}, {airport.country}
                </span>
                <span className="mt-1 block text-xs text-gray-500">{airport.name}</span>
              </span>
              <span
                dir="ltr"
                className="font-en w-14 shrink-0 rounded-md bg-primary-1 py-2 text-center text-xs font-semibold text-white"
              >
                {airport.code}
              </span>
            </button>
          ))
        ) : (
          <p className="m-0 py-3 text-sm text-gray-500">{t('flightSchedulePage.form.noAirports')}</p>
        )}
      </div>
    </>
  )
}

/** Date trigger — same box as the booking box's DateBox. */
const DateBox = ({ label, value, open, disabled = false, onClick, lang }) => (
  <div
    role="button"
    tabIndex={disabled ? -1 : 0}
    aria-disabled={disabled}
    aria-expanded={open}
    onClick={disabled ? undefined : onClick}
    onKeyDown={(event) => {
      if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return
      event.preventDefault()
      onClick()
    }}
    className={`flex min-h-18 min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#F5F5F4] px-4 py-4 sm:px-6 ${
      disabled
        ? 'cursor-default opacity-60'
        : 'cursor-pointer transition-colors duration-200 hover:bg-[#E7E7E5]'
    }`}
  >
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
      <CalendarBlank size={16} weight="fill" color="white" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-start text-sm text-gray-500">{label}</span>
      {value ? (
        <strong
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className={`block text-start font-semibold text-gray-900 ${lang === 'ar' ? '' : 'font-en'}`}
        >
          {formatBookingBoxDisplayDate(value, lang)}
        </strong>
      ) : null}
    </span>
    <span className="shrink-0 text-gray-500">
      {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
    </span>
  </div>
)

const TripTypeOption = ({ name, value, checked, label, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="peer sr-only"
    />
    <span
      className={`flex size-4 items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-primary-1 ${
        checked ? 'border-primary-1' : 'border-500'
      }`}
    >
      {checked ? <span className="size-2 rounded-full bg-primary-1" /> : null}
    </span>
    <span className={checked ? 'text-primary-1' : 'text-700'}>{label}</span>
  </label>
)

/**
 * Flight schedule search — the home booking box's From/To fields, airport
 * dropdowns and two-month calendar, wired to this page's own airport list.
 * `operatingDays(from, to)` returns the weekdays (0–6) the route flies; those
 * days get the booking box's availability dot.
 */
const FlightScheduleSearch = ({ airports, destinationsFor, initialValue, onSubmit, operatingDays }) => {
  const { t } = useTranslation()
  const lang = useCurrentLanguage()
  const isRtl = lang === 'ar'
  const isSmallScreen = useIsSmallScreen()
  const rootRef = useRef(null)
  const today = useMemo(() => startOfDay(new Date()), [])

  const [form, setForm] = useState(initialValue)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(null)
  const [pickReturn, setPickReturn] = useState(false)
  const [hovered, setHovered] = useState(null)
  const monthToShow = (date) => startOfMonth(date && date > today ? date : today)
  const [viewMonth, setViewMonth] = useState(() => monthToShow(initialValue.departure))

  const roundTrip = form.tripType === 'roundTrip'
  const fromAirport = airports[form.from]
  const toAirport = airports[form.to]
  const airportListOpen = open === 'from' || open === 'to'
  const datesOpen = open === 'dates'

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(null)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const update = (patch) => {
    setError('')
    setForm((current) => ({ ...current, ...patch }))
  }

  const toggleAirports = (field) => setOpen((current) => (current === field ? null : field))

  const openDates = (returnSide) => {
    if (datesOpen && pickReturn === returnSide) {
      setOpen(null)
      return
    }
    setPickReturn(returnSide)
    setHovered(null)
    setViewMonth(monthToShow((returnSide ? form.return : form.departure) || form.departure))
    setOpen('dates')
  }

  const selectAirport = (field, code) => {
    if (field === 'from') {
      const keepTo =
        form.to && form.to !== code && (!destinationsFor || destinationsFor(code).includes(form.to))
      update({ from: code, ...(keepTo ? {} : { to: '' }) })
      setOpen(keepTo ? null : 'to')
      return
    }
    update({ to: code })
    openDates(false)
  }

  const handleDayClick = (day, modifiers) => {
    if (modifiers.disabled) return
    if (!roundTrip) {
      update({ departure: day })
      setOpen(null)
      return
    }
    if (!pickReturn || !form.departure || day < form.departure) {
      update({ departure: day, return: null })
      setPickReturn(true)
      return
    }
    update({ return: day })
    setPickReturn(false)
    setHovered(null)
    setOpen(null)
  }

  const legFrom = roundTrip && pickReturn ? form.to : form.from
  const legTo = roundTrip && pickReturn ? form.from : form.to
  const flyingDays = useMemo(
    () => (legFrom && legTo ? operatingDays?.(legFrom, legTo) || [] : []),
    [operatingDays, legFrom, legTo],
  )
  const previewing = roundTrip && pickReturn && form.departure && hovered && hovered > form.departure

  const modifiers = {
    available: (date) => date >= today && flyingDays.includes(date.getDay()),
    noFlights: (date) => date >= today && flyingDays.length > 0 && !flyingDays.includes(date.getDay()),
    previewRange: (date) => Boolean(previewing) && date > form.departure && date < hovered,
    previewRangeEnd: (date) => Boolean(previewing) && isSameDay(date, hovered),
  }

  const selected = roundTrip
    ? { from: form.departure || undefined, to: pickReturn ? undefined : form.return || undefined }
    : form.departure || undefined

  const submit = (event) => {
    event.preventDefault()
    setOpen(null)
    if (!form.from || !form.to) return setError(t('flightSchedulePage.errors.airports'))
    if (form.from === form.to) return setError(t('flightSchedulePage.errors.sameAirport'))
    if (!form.departure) return setError(t('flightSchedulePage.errors.departure'))
    if (roundTrip && (!form.return || form.return < form.departure)) {
      return setError(t('flightSchedulePage.errors.return'))
    }
    const travelDate = form.departure
    trackScheduleSearch({
      originIata: form.from,
      destinationIata: form.to,
      travelDate: travelDate instanceof Date
        ? `${travelDate.getFullYear()}-${String(travelDate.getMonth() + 1).padStart(2, '0')}-${String(travelDate.getDate()).padStart(2, '0')}`
        : undefined,
    })
    return onSubmit(form)
  }

  const planeIconClass = isRtl ? 'scale-x-[-1]' : undefined
  const swapPosition = isSmallScreen
    ? `${isRtl ? 'left-1/7' : 'right-1/7'} top-1/2 -translate-y-1/2`
    : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'

  return (
    <form
      ref={rootRef}
      onSubmit={submit}
      noValidate
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative rounded-2xl bg-white px-4 py-5 shadow-[0_8px_24px_-8px_rgba(33,37,41,0.18)] md:px-6"
    >
      {/* <fieldset className="m-2 flex flex-wrap gap-6 border-0 p-0">
        <legend className="sr-only">{t('flightSchedulePage.form.tripType')}</legend>
        <TripTypeOption
          name="flight-schedule-trip-type"
          value="roundTrip"
          checked={roundTrip}
          label={t('flightSchedulePage.form.roundTrip')}
          onChange={(tripType) => update({ tripType })}
        />
        <TripTypeOption
          name="flight-schedule-trip-type"
          value="oneWay"
          checked={!roundTrip}
          label={t('flightSchedulePage.form.oneWay')}
          onChange={(tripType) => update({ tripType })}
        />
      </fieldset> */}

      <div
        className={`relative grid items-stretch gap-3 overflow-visible md:grid-cols-2 md:gap-x-7 ${
          airportListOpen ? 'z-200' : 'z-0'
        }`}
      >
        <div className={`relative w-full min-w-0 ${open === 'from' ? 'z-50' : 'z-0'}`}>
          <CityBox
            icon={<AirplaneTakeoff weight="fill" size={16} color="white" className={planeIconClass} />}
            label={t('flightSchedulePage.form.from')}
            city={fromAirport ? fromAirport.city : t('flightSchedulePage.form.selectOrigin')}
            airport={fromAirport?.name || ''}
            hasSelection={Boolean(fromAirport)}
            showRemove={Boolean(fromAirport)}
            onClick={() => toggleAirports('from')}
            onRemove={() => {
              update({ from: '' })
              setOpen('from')
            }}
          />
          <AirportDropdown isOpen={open === 'from'}>
            <AirportPanel
              airports={airports}
              selected={form.from}
              onSelect={(code) => selectAirport('from', code)}
            />
          </AirportDropdown>
        </div>

        <button
          type="button"
          onClick={() => update({ from: form.to, to: form.from })}
          aria-label={t('flightSchedulePage.form.swap')}
          className={`absolute ${swapPosition} ${
            airportListOpen ? 'z-10' : 'z-40'
          } cursor-pointer rounded-full border-0 bg-transparent p-0 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-1`}
        >
          <SwapIcon isMobile={isSmallScreen} />
        </button>

        <div className={`relative w-full min-w-0 ${open === 'to' ? 'z-50' : 'z-0'}`}>
          <CityBox
            icon={<AirplaneLanding weight="fill" size={16} color="white" className={planeIconClass} />}
            label={t('flightSchedulePage.form.to')}
            city={toAirport ? toAirport.city : t('flightSchedulePage.form.selectDestination')}
            airport={toAirport?.name || ''}
            hasSelection={Boolean(toAirport)}
            showRemove={Boolean(toAirport)}
            onClick={() => toggleAirports('to')}
            onRemove={() => {
              update({ to: '' })
              setOpen('to')
            }}
          />
          <AirportDropdown isOpen={open === 'to'}>
            <AirportPanel
              airports={airports}
              exclude={form.from}
              allowed={form.from && destinationsFor ? destinationsFor(form.from) : undefined}
              selected={form.to}
              onSelect={(code) => selectAirport('to', code)}
            />
          </AirportDropdown>
        </div>
      </div>

      <div className={`relative mt-4 flex flex-col gap-3 md:flex-row md:gap-4 ${datesOpen ? 'z-200' : 'z-0'}`}>
        <DateBox
          label={t('flightSchedulePage.form.departureDate')}
          value={form.departure}
          open={datesOpen && !pickReturn}
          onClick={() => openDates(false)}
          lang={lang}
        />
        {roundTrip ? (
          <DateBox
            label={t('flightSchedulePage.form.returnDate')}
            value={form.return}
            open={datesOpen && pickReturn}
            disabled={!form.departure}
            onClick={() => openDates(true)}
            lang={lang}
          />
        ) : (
          <div className="hidden flex-1 md:block" aria-hidden />
        )}

        {datesOpen ? (
          <div className="booking-calendar-popover absolute inset-x-0 top-full z-200 mt-1 rounded-lg border border-[var(--bg-300)] bg-white shadow-xl ring-1 ring-black/5">
            <div className="booking-calendar-panel relative">
              <div className="booking-calendar-nav relative">
                <MonthNavigation
                  currentMonth={viewMonth}
                  minMonth={startOfMonth(today)}
                  handleMonthChange={setViewMonth}
                  visibleMonths={isSmallScreen ? 1 : 2}
                />
              </div>
              <div className="booking-calendar-grid w-full overflow-x-hidden">
                <DayPicker
                  month={viewMonth}
                  onMonthChange={setViewMonth}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  hideNavigation
                  fixedWeeks
                  showOutsideDays
                  dir={isRtl ? 'rtl' : 'ltr'}
                  locale={isRtl ? arSA : enUS}
                  mode={roundTrip ? 'range' : 'single'}
                  selected={selected}
                  onDayClick={handleDayClick}
                  onDayMouseEnter={(date) => {
                    if (roundTrip && pickReturn && form.departure) setHovered(date)
                  }}
                  onDayMouseLeave={() => setHovered(null)}
                  disabled={{ before: today }}
                  modifiers={modifiers}
                  modifiersClassNames={MODIFIER_CLASS_NAMES}
                  className={DAY_PICKER_CLASS}
                  classNames={dayPickerClassNames(roundTrip)}
                />
              </div>
              <div className="booking-calendar-footer mt-3 flex items-center justify-end border-t border-stone-200/90 pt-3">
                <button
                  type="button"
                  disabled={!form.departure && !form.return}
                  onClick={() => {
                    update({ departure: null, return: null })
                    setPickReturn(false)
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-0 bg-transparent px-4 py-0.5 text-sm font-medium text-600 hover:text-secondary disabled:cursor-default disabled:opacity-0"
                >
                  <ArrowCounterClockwise size={16} weight="bold" className="shrink-0" />
                  {t('flightSchedulePage.form.clearDates')}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-200 pt-5">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-700">
          {/* <input
            type="checkbox"
            className="peer sr-only"
            checked={form.nearby}
            onChange={(event) => update({ nearby: event.target.checked })}
          />
          <span
            className={`flex size-4 items-center justify-center rounded-sm border peer-focus-visible:ring-2 peer-focus-visible:ring-primary-1 ${
              form.nearby ? 'border-primary-1 bg-primary-1 text-white' : 'border-400 bg-white'
            }`}
          >
            {form.nearby ? <Check size={12} weight="bold" /> : null}
          </span>
          {t('flightSchedulePage.nearby')} */}
        </label>
        <button
          type="submit"
          className="cursor-pointer rounded-lg border-0 bg-secondary-800 px-6 py-3 text-sm font-medium text-white hover:bg-secondary-900"
        >
          {t('flightSchedulePage.form.viewSchedule')}
        </button>
      </div>

      {error ? (
        <p role="alert" className="m-0 mt-3 text-sm text-alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}

export default FlightScheduleSearch
