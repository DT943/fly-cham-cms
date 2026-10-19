import { useMemo, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { AirplaneLanding, AirplaneTakeoff, CaretDown, Check } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import LocalizedLink from '../../shared/components/LocalizedLink.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { typography } from '../../styles/typography.js'
import useScheduleAirports from '../flight-schedule/useScheduleAirports.js'
import { buildFares, CABINS } from './fareData.js'

const PAGE_SIZE = 10
const BOOKING_HREF = '/book-a-flight'

const startOfToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const FilterLabel = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-xs text-600">
    {children}
  </label>
)

/** Dropdown filter — `options` are `{ value, label }`; `''` is the "any" value. */
const SelectFilter = ({ label, icon: Icon, value, onChange, options, placeholder }) => {
  const selected = options.find((option) => option.value === value)
  return (
    <div className="min-w-0">
      <Listbox value={value} onChange={onChange}>
        <FilterLabel>{label}</FilterLabel>
        <ListboxButton className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-white px-3 text-start text-sm text-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none data-focus:ring-2 data-focus:ring-primary-1">
          {Icon ? <Icon size={18} className="shrink-0 text-700 rtl:-scale-x-100" aria-hidden /> : null}
          <span className={`min-w-0 flex-1 truncate ${selected ? '' : 'text-500'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <CaretDown size={16} className="shrink-0 text-700" aria-hidden />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 mt-1 max-h-72 w-(--button-width) overflow-y-auto rounded-lg border border-200 bg-white p-1 shadow-lg focus:outline-none"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value || 'any'}
              value={option.value}
              className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-700 data-focus:bg-100 data-selected:font-semibold data-selected:text-primary-1"
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              <Check size={14} className="invisible shrink-0 group-data-selected:visible" aria-hidden />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}

const BookFromSchedule = () => {
  const { t } = useTranslation()
  const lang = useCurrentLanguage()
  const { airports, destinationsFor } = useScheduleAirports(lang)
  const today = useMemo(startOfToday, [])

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [cabin, setCabin] = useState('economy')
  const [budget, setBudget] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const airportLabel = (code) => {
    const airport = airports[code]
    return airport ? `${airport.city} (${code})` : code
  }

  const routes = useMemo(
    () =>
      Object.keys(airports).flatMap((origin) =>
        destinationsFor(origin)
          .filter((destination) => airports[destination])
          .map((destination) => [origin, destination]),
      ),
    [airports, destinationsFor],
  )
  const fares = useMemo(() => buildFares(routes, today), [routes, today])

  const maxBudget = Number(budget)
  const results = useMemo(
    () =>
      fares
        .filter(
          (fare) =>
            fare.cabin === cabin &&
            (!from || fare.from === from) &&
            (!to || fare.to === to) &&
            (!maxBudget || fare.price <= maxBudget),
        )
        .sort((a, b) => a.date - b.date || a.price - b.price),
    [fares, cabin, from, to, maxBudget],
  )

  const originOptions = [
    { value: '', label: t('bookFromSchedule.filters.anyOrigin') },
    ...Object.keys(airports).map((code) => ({ value: code, label: airportLabel(code) })),
  ]
  const destinationCodes = from ? destinationsFor(from) : Object.keys(airports)
  const destinationOptions = [
    { value: '', label: t('bookFromSchedule.filters.anyDestination') },
    ...destinationCodes
      .filter((code) => airports[code] && code !== from)
      .map((code) => ({ value: code, label: airportLabel(code) })),
  ]
  const cabinOptions = CABINS.map((value) => ({ value, label: t(`bookFromSchedule.cabins.${value}`) }))

  const resetPaging = () => setVisible(PAGE_SIZE)
  const selectOrigin = (code) => {
    setFrom(code)
    if (to && code && !destinationsFor(code).includes(to)) setTo('')
    resetPaging()
  }

  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
        weekday: 'short',
        month: 'long',
        day: '2-digit',
      }),
    [lang],
  )

  const shown = results.slice(0, visible)

  const priceBlock = (fare) => (
    <div className="min-w-0">
      <p className="m-0 text-xs text-600">{t('bookFromSchedule.from')}</p>
      <p dir="ltr" className="m-0 text-sm font-bold text-primary-1 rtl:text-end">
        USD{fare.price.toLocaleString('en-US')}*
      </p>
      <p className="m-0 text-xs text-600">
        {t('bookFromSchedule.updated', { count: fare.updatedHoursAgo })}
      </p>
    </div>
  )

  const bookButton = (fare) => (
    <LocalizedLink
      to={BOOKING_HREF}
      aria-label={`${t('bookFromSchedule.bookNow')}: ${airportLabel(fare.from)} – ${airportLabel(fare.to)}`}
      className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary-1 px-4 text-sm font-medium text-50 no-underline transition-colors hover:bg-primary-800"
    >
      {t('bookFromSchedule.bookNow')}
    </LocalizedLink>
  )

  return (
    <main className="w-full bg-100 pb-12 md:pb-16">
      <Breadcrumbs
        items={[
          { label: t('bookFromSchedule.breadcrumbHome'), href: '/' },
          { label: t('bookFromSchedule.title') },
        ]}
      />

      <Container className="pt-5 md:pt-10">
        <h1 className={`m-0 font-semibold leading-tight text-primary-1 ${typography.pageTitle}`}>
          {t('bookFromSchedule.title')}
        </h1>
        <p className="m-0 mt-3 mb-12 text-base text-700 md:text-lg">{t('bookFromSchedule.description')}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectFilter
            label={t('bookFromSchedule.filters.from')}
            icon={AirplaneTakeoff}
            value={from}
            onChange={selectOrigin}
            options={originOptions}
            placeholder={t('bookFromSchedule.filters.origin')}
          />
          <SelectFilter
            label={t('bookFromSchedule.filters.to')}
            icon={AirplaneLanding}
            value={to}
            onChange={(code) => {
              setTo(code)
              resetPaging()
            }}
            options={destinationOptions}
            placeholder={t('bookFromSchedule.filters.destination')}
          />
          <SelectFilter
            label={t('bookFromSchedule.filters.cabin')}
            value={cabin}
            onChange={(value) => {
              setCabin(value)
              resetPaging()
            }}
            options={cabinOptions}
          />
          <div className="min-w-0">
            <FilterLabel htmlFor="book-from-schedule-budget">{t('bookFromSchedule.filters.budget')}</FilterLabel>
            <div className="flex h-11 items-center gap-2 rounded-lg bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-primary-1">
              <span className="rounded-sm bg-100 px-1.5 py-0.5 text-xs text-600">USD</span>
              <input
                id="book-from-schedule-budget"
                type="number"
                min="0"
                inputMode="numeric"
                value={budget}
                onChange={(event) => {
                  setBudget(event.target.value)
                  resetPaging()
                }}
                placeholder={t('bookFromSchedule.filters.budgetPlaceholder')}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-700 placeholder:text-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          {shown.length ? (
            <>
              <table className="hidden w-full border-collapse text-start text-sm text-700 md:table">
                <thead>
                  <tr className="bg-primary-100/40 text-600">
                    <th scope="col" className="px-4 py-4 text-start font-medium">{t('bookFromSchedule.columns.from')}</th>
                    <th scope="col" className="px-4 py-4 text-start font-medium">{t('bookFromSchedule.columns.to')}</th>
                    <th scope="col" className="px-4 py-4 text-start font-medium">{t('bookFromSchedule.columns.cabin')}</th>
                    <th scope="col" className="px-4 py-4 text-start font-medium">{t('bookFromSchedule.columns.dates')}</th>
                    <th scope="col" className="px-4 py-4 text-start font-medium">{t('bookFromSchedule.columns.price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((fare) => (
                    <tr key={fare.id} className="border-b border-200">
                      <td className="px-4 py-4">{airportLabel(fare.from)}</td>
                      <td className="px-4 py-4">{airportLabel(fare.to)}</td>
                      <td className="px-4 py-4">{t(`bookFromSchedule.cabins.${fare.cabin}`)}</td>
                      <td className="px-4 py-4">{dateFormat.format(fare.date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                          {priceBlock(fare)}
                          {bookButton(fare)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="m-0 flex list-none flex-col gap-3 p-0 md:hidden">
                {shown.map((fare) => (
                  <li key={fare.id} className="rounded-xl bg-white p-4">
                    <p className="m-0 text-base font-semibold text-800">
                      {airportLabel(fare.from)} <span className="text-500">→</span> {airportLabel(fare.to)}
                    </p>
                    <p className="m-0 mt-1 text-sm text-600">
                      {t(`bookFromSchedule.cabins.${fare.cabin}`)} · {dateFormat.format(fare.date)}
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-4 border-t border-200 pt-3">
                      {priceBlock(fare)}
                      {bookButton(fare)}
                    </div>
                  </li>
                ))}
              </ul>

              {results.length > visible ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((count) => count + PAGE_SIZE)}
                    className="cursor-pointer rounded-lg border border-solid border-primary-1 bg-transparent px-6 py-2.5 text-sm font-medium text-primary-1 transition-colors hover:bg-primary-1 hover:text-50"
                  >
                    {t('bookFromSchedule.showMore')}
                  </button>
                </div>
              ) : null}

              <p className="m-0 mt-4 text-xs text-600">{t('bookFromSchedule.note')}</p>
            </>
          ) : (
            <p className="m-0 rounded-xl bg-white px-4 py-8 text-center text-sm text-600">
              {t('bookFromSchedule.empty')}
            </p>
          )}
        </div>
      </Container>
    </main>
  )
}

export default BookFromSchedule
