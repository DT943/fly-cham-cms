import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  BookOpenText,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Circle,
  ForkKnife,
  MonitorPlay,
  PencilSimple,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../shared/components/Container.jsx'
import planeMark from '../../assets/images/logo.png'
import FlightScheduleHero from './components/FlightScheduleHero.jsx'
import FlightScheduleSearch from './components/FlightScheduleSearch.jsx'
import useScheduleAirports from './useScheduleAirports.js'
import { getRouteFlights, getRouteOperatingDays } from './scheduleData.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'

const DAY_MS = 24 * 60 * 60 * 1000

const buildJourneys = (search, airports) => {
  const legs = [
    { id: 'departure', labelKey: 'flightSchedulePage.departure', from: search.from, to: search.to, date: search.departure },
  ]
  if (search.tripType === 'roundTrip') {
    legs.push({ id: 'return', labelKey: 'flightSchedulePage.return', from: search.to, to: search.from, date: search.return })
  }
  return legs.map((leg) => ({
    id: leg.id,
    labelKey: leg.labelKey,
    from: airports[leg.from],
    to: airports[leg.to],
    startDate: leg.date,
    flights: getRouteFlights(leg.from, leg.to),
  }))
}

const addDays = (date, days) => new Date(date.getTime() + days * DAY_MS)

const weekDates = (startDate, offset) =>
  Array.from({ length: 7 }, (_, index) => addDays(startDate, offset * 7 + index))

const sameDay = (a, b) => a.toDateString() === b.toDateString()

const isoDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const AMENITIES = [
  { id: 'entertainment', Icon: MonitorPlay },
  { id: 'meal', Icon: ForkKnife },
  { id: 'magazine', Icon: BookOpenText },
]

const FlightDetailsDialog = ({ flight, from, to, date, onClose }) => {
  const { t } = useTranslation()
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-1100 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${flight.id}-details-title`}
        className="w-full max-w-152 rounded-2xl bg-white px-6 pt-6 pb-8 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-200 pb-5">
          <h2 id={`${flight.id}-details-title`} className="m-0 text-lg font-semibold text-800">
            {t('flightSchedulePage.flightDetails')}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-800 hover:bg-100 focus-visible:ring-2 focus-visible:ring-primary-1"
            aria-label={t('flightSchedulePage.close')}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="pt-6">
          <p className="m-0 flex items-center gap-3 text-sm text-primary-1">
            {from.city}
            <ArrowRight size={18} className="text-400 rtl:rotate-180" aria-hidden />
            {to.city}
          </p>
          <p className="m-0 mt-2 text-sm text-700">{isoDate(date)}</p>
          <p className="m-0 text-sm text-700">
            {t('flightSchedulePage.totalDuration', { duration: flight.duration })}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[4.5rem_1rem_minmax(0,1fr)] gap-x-4">
          <p className="m-0 text-sm text-700">{flight.depart}</p>
          <div className="flex justify-center pt-1">
            <span className="size-2.5 rounded-full bg-primary-1" />
          </div>
          <p className="m-0 text-sm text-800">{from.name}</p>

          <p className="m-0 flex items-center text-xs text-primary-1">{flight.duration}</p>
          <div className="flex justify-center">
            <span className="w-px border-s border-dashed border-primary-1" />
          </div>
          <div className="py-6">
            <p className="m-0 flex items-center gap-2 text-sm text-500">
              <img loading="lazy" decoding="async" src={planeMark} alt="" className="w-4" />
              {flight.number}
            </p>
            <ul className="m-0 mt-3 flex w-full max-w-[18rem] list-none flex-col gap-2 rounded-lg bg-primary-100/35 px-3 py-3">
              {AMENITIES.map(({ id, Icon }) => (
                <li key={id} className="flex items-center gap-3 text-sm text-700">
                  <Icon size={18} aria-hidden />
                  {t(`flightSchedulePage.amenities.${id}`)}
                </li>
              ))}
            </ul>
          </div>

          <p className="m-0 text-sm text-700">
            {flight.arrive}
            {flight.nextDay ? <sup className="ms-0.5 text-[0.65em] text-primary-1">+1</sup> : null}
          </p>
          <div className="flex justify-center pt-1">
            <span className="size-2.5 rounded-full border-2 border-primary-1 bg-white" />
          </div>
          <p className="m-0 text-sm text-800">{to.name}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

const DayChip = ({ date, active, selected }) => {
  const { t } = useTranslation()
  let StatusIcon = XCircle
  if (selected) StatusIcon = CheckCircle
  else if (active) StatusIcon = Circle

  return (
    <div
      className={`flex h-17 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md text-center ${
        active ? 'bg-primary-1 text-white' : 'bg-200/70 text-400'
      }`}
    >
      <span className="text-sm leading-tight">
        {t(`flightSchedulePage.weekdays.${date.getDay()}`)}
      </span>
      <span className="text-xs leading-tight">
        {date.getDate()} {t(`flightSchedulePage.months.${date.getMonth()}`)}
      </span>
      <StatusIcon size={18} weight={selected ? 'fill' : 'regular'} aria-hidden />
    </div>
  )
}

const FlightRow = ({ flight, from, to, dates, selectedDate, open, onToggle }) => {
  const { t } = useTranslation()

  return (
    <article className="rounded-lg bg-100 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="w-20 shrink-0 text-center">
            <p className="m-0 text-2xl font-light text-800 md:text-3xl">{flight.depart}</p>
            <p className="m-0 mt-1 text-sm text-600">{from.code}</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 mb-2 text-center text-sm text-600">
              {t('flightSchedulePage.nonStop')}, {flight.duration}
            </p>
            <div className="flex items-center">
              <span className="size-2.5 shrink-0 rounded-full bg-primary-1" />
              <span className="mx-1 flex-1 border-t-2 border-dotted border-primary-1" />
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-1">
                <img loading="lazy" decoding="async" src={planeMark} alt="" className="w-6" />
              </span>
              <span className="mx-1 flex-1 border-t-2 border-dotted border-primary-1" />
              <span className="size-2.5 shrink-0 rounded-full border-2 border-primary-1 bg-white" />
            </div>
          </div>
          <div className="w-20 shrink-0 text-center">
            <p className="m-0 whitespace-nowrap text-2xl font-light text-800 md:text-3xl">
              {flight.arrive}
              {flight.nextDay ? (
                <sup className="ms-0.5 text-[0.45em] font-medium text-primary-1">+1</sup>
              ) : null}
            </p>
            <p className="m-0 mt-1 text-sm text-600">{to.code}</p>
          </div>
        </div>

        <span className="hidden h-24 w-px shrink-0 bg-300 lg:block" aria-hidden />

        <div className="shrink-0 text-sm lg:w-32">
          <p className="m-0 flex items-center gap-2 text-800">
            <img loading="lazy" decoding="async" src={planeMark} alt="" className="w-5" />
            {flight.number}
          </p>
          <button
            type="button"
            className="mt-1 cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-primary-1 underline"
            aria-haspopup="dialog"
            onClick={onToggle}
          >
            {t('flightSchedulePage.flightDetails')}
          </button>
        </div>

        <span className="hidden h-24 w-px shrink-0 bg-300 lg:block" aria-hidden />

        <div className="flex gap-2 overflow-x-auto">
          {dates.map((date) => {
            const active = flight.days.includes(date.getDay())
            return (
              <DayChip
                key={date.toISOString()}
                date={date}
                active={active}
                selected={active && sameDay(date, selectedDate)}
              />
            )
          })}
        </div>
      </div>
      {open ? (
        <FlightDetailsDialog
          flight={flight}
          from={from}
          to={to}
          date={selectedDate}
          onClose={onToggle}
        />
      ) : null}
    </article>
  )
}

const JourneySection = ({ journey, initialNearby }) => {
  const { t } = useTranslation()
  const [weekOffset, setWeekOffset] = useState(0)
  const [nearby, setNearby] = useState(initialNearby)
  const [openId, setOpenId] = useState(null)
  const dates = useMemo(() => weekDates(journey.startDate, weekOffset), [journey.startDate, weekOffset])
  const { from, to, flights } = journey

  return (
    <section className="mt-10" aria-labelledby={`${journey.id}-title`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id={`${journey.id}-title`} className="m-0 text-base font-normal text-700">
            {t(journey.labelKey)}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {to.image ? <img loading="lazy" decoding="async" src={to.image} alt="" className="size-12 rounded-full object-cover" /> : null}
            <div className="flex flex-wrap items-center gap-5">
              <div>
                <p className="m-0 text-xl font-bold text-800">{from.city}</p>
                <p className="m-0 text-xs text-500">{from.airport}</p>
              </div>
              <span className="text-lg text-400" aria-hidden>
                →
              </span>
              <div>
                <p className="m-0 text-xl font-bold text-800">{to.city}</p>
                <p className="m-0 text-xs text-500">{to.airport}</p>
              </div>
            </div>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-500">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={nearby}
            onChange={(event) => setNearby(event.target.checked)}
          />
          <span className="relative h-6 w-11 rounded-full bg-200 transition-colors peer-checked:bg-primary-1 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-1">
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${
                nearby ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </span>
          {t('flightSchedulePage.nearby')}
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm text-600">
          ({t('flightSchedulePage.results', { count: flights.length })})
        </p>
        <div className="flex items-center gap-4 text-base">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-400 hover:text-600"
            onClick={() => setWeekOffset((value) => value - 1)}
          >
            <CaretLeft size={18} />
            {t('flightSchedulePage.previousWeek')}
          </button>
          <span className="h-8 w-px bg-primary-1" aria-hidden />
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-primary-1"
            onClick={() => setWeekOffset((value) => value + 1)}
          >
            {t('flightSchedulePage.nextWeek')}
            <CaretRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-5">
        {flights.length === 0 ? (
          <p className="m-0 rounded-lg bg-100 px-6 py-8 text-center text-sm text-600">
            {t('flightSchedulePage.noFlights')}
          </p>
        ) : null}
        {flights.map((flight) => (
          <FlightRow
            key={flight.id}
            flight={flight}
            from={from}
            to={to}
            dates={dates}
            selectedDate={journey.startDate}
            open={openId === flight.id}
            onToggle={() => setOpenId((current) => (current === flight.id ? null : flight.id))}
          />
        ))}
      </div>
    </section>
  )
}

const formatDate = (date, t) =>
  `${date.getDate()} ${t(`flightSchedulePage.months.${date.getMonth()}`)} ${date.getFullYear()}`

const DEFAULT_SEARCH = {
  tripType: 'roundTrip',
  from: 'DAM',
  to: 'DXB',
  departure: new Date(2026, 6, 24),
  return: new Date(2026, 6, 30),
  nearby: true,
}

const ScheduleResults = ({ search, airports, onChangeSearch }) => {
  const { t } = useTranslation()
  const journeys = useMemo(() => buildJourneys(search, airports), [search, airports])
  const roundTrip = search.tripType === 'roundTrip'
  const range = roundTrip
    ? t('flightSchedulePage.range', {
        from: formatDate(search.departure, t).toUpperCase(),
        to: formatDate(search.return, t).toUpperCase(),
        trip: t('flightSchedulePage.roundTrip'),
      })
    : t('flightSchedulePage.rangeOneWay', {
        date: formatDate(search.departure, t).toUpperCase(),
        trip: t('flightSchedulePage.oneWay'),
      })

  return (
    <main className="bg-white py-6 md:py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-100 px-5 py-5 md:px-6">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-800 md:text-4xl">
              {t('flightSchedulePage.title')}
            </h1>
            <p className="m-0 mt-1 text-sm text-600">{range}</p>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-secondary-800 px-4 py-2.5 text-sm font-medium text-800"
            onClick={onChangeSearch}
          >
            <PencilSimple size={16} />
            {t('flightSchedulePage.changeSearch')}
          </button>
        </div>

        {journeys.map((journey) => (
          <JourneySection key={journey.id} journey={journey} initialNearby={search.nearby} />
        ))}
      </Container>
    </main>
  )
}

const FlightSchedule = () => {
  const [search, setSearch] = useState(null)
  const [draft, setDraft] = useState(DEFAULT_SEARCH)
  const lang = useCurrentLanguage()
  const { airports, destinationsFor } = useScheduleAirports(lang)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [search])

  if (search) {
    return <ScheduleResults search={search} airports={airports} onChangeSearch={() => setSearch(null)} />
  }

  return (
    <main className="bg-white pb-12 md:pb-20">
      <FlightScheduleHero />
      <Container className="relative z-10 -mt-12 md:-mt-16">
        <FlightScheduleSearch
          airports={airports}
          destinationsFor={destinationsFor}
          initialValue={draft}
          operatingDays={getRouteOperatingDays}
          onSubmit={(value) => {
            setDraft(value)
            setSearch(value)
          }}
        />
      </Container>
    </main>
  )
}

export default FlightSchedule
