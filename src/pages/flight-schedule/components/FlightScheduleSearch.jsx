import { useId, useRef, useState } from 'react'
import {
  AirplaneLanding,
  AirplaneTakeoff,
  ArrowsLeftRight,
  CalendarBlank,
  Check,
  X,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

const toInputValue = (date) =>
  date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : ''

const fromInputValue = (value) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const FieldIcon = ({ Icon }) => (
  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary-800 text-white">
    <Icon size={15} weight="fill" aria-hidden />
  </span>
)

const AirportField = ({ label, Icon, value, airports, onChange, onClear, clearLabel }) => {
  const id = useId()
  const airport = airports[value]

  return (
    <div className="relative flex min-h-16 flex-1 items-center gap-3 rounded-lg bg-100 px-3 py-2.5">
      <FieldIcon Icon={Icon} />
      <div className="relative min-w-0 flex-1">
        <label htmlFor={id} className="block text-xs text-500">
          {label}
        </label>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm font-semibold text-800 outline-none focus-visible:underline"
        >
          <option value="" disabled>
            —
          </option>
          {Object.values(airports).map((option) => (
            <option key={option.code} value={option.code}>
              {option.city}, {option.code}
            </option>
          ))}
        </select>
        <p className="m-0 truncate text-xs text-500">{airport ? airport.name : '\u00a0'}</p>
      </div>
      {onClear && value ? (
        <button
          type="button"
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-700 hover:bg-200"
          aria-label={clearLabel}
          onClick={onClear}
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  )
}

const DateField = ({ label, value, min, onChange }) => {
  const { t } = useTranslation()
  const id = useId()
  const inputRef = useRef(null)
  const display = value
    ? `${value.getDate()} ${t(`flightSchedulePage.months.${value.getMonth()}`)} ${value.getFullYear()}`.toUpperCase()
    : ''

  return (
    <div
      className="relative flex min-h-16 flex-1 cursor-pointer items-center gap-3 rounded-lg bg-100 px-3 py-2.5"
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <FieldIcon Icon={CalendarBlank} />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-xs text-500">
          {label}
        </label>
        <p className="m-0 text-sm font-medium text-800">{display || '\u00a0'}</p>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="date"
        value={toInputValue(value)}
        min={toInputValue(min)}
        onChange={(event) => onChange(fromInputValue(event.target.value))}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </div>
  )
}

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

const FlightScheduleSearch = ({ airports, initialValue, onSubmit }) => {
  const { t } = useTranslation()
  const tripName = useId()
  const [form, setForm] = useState(initialValue)
  const [error, setError] = useState('')
  const roundTrip = form.tripType === 'roundTrip'

  const update = (patch) => {
    setError('')
    setForm((current) => ({ ...current, ...patch }))
  }

  const submit = (event) => {
    event.preventDefault()
    if (!form.from || !form.to) return setError(t('flightSchedulePage.errors.airports'))
    if (form.from === form.to) return setError(t('flightSchedulePage.errors.sameAirport'))
    if (!form.departure) return setError(t('flightSchedulePage.errors.departure'))
    if (roundTrip && (!form.return || form.return < form.departure)) {
      return setError(t('flightSchedulePage.errors.return'))
    }
    return onSubmit(form)
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl bg-white px-4 py-5 shadow-[0_8px_24px_-8px_rgba(33,37,41,0.18)] md:px-6"
    >
      <fieldset className="m-2 flex flex-wrap gap-6 border-0 p-0">
        <legend className="sr-only">{t('flightSchedulePage.form.tripType')}</legend>
        <TripTypeOption
          name={tripName}
          value="roundTrip"
          checked={roundTrip}
          label={t('flightSchedulePage.form.roundTrip')}
          onChange={(tripType) => update({ tripType })}
        />
        <TripTypeOption
          name={tripName}
          value="oneWay"
          checked={!roundTrip}
          label={t('flightSchedulePage.form.oneWay')}
          onChange={(tripType) => update({ tripType })}
        />
      </fieldset>

      <div className="relative mt-4 flex flex-col gap-2 md:flex-row">
        <AirportField
          label={t('flightSchedulePage.form.from')}
          Icon={AirplaneTakeoff}
          value={form.from}
          airports={airports}
          onChange={(from) => update({ from })}
          onClear={() => update({ from: '' })}
          clearLabel={t('flightSchedulePage.form.clear')}
        />
        <button
          type="button"
          className="absolute top-1/2 left-1/2 z-10 inline-flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-700 shadow-sm hover:text-primary-1 max-md:rotate-90"
          aria-label={t('flightSchedulePage.form.swap')}
          onClick={() => update({ from: form.to, to: form.from })}
        >
          <ArrowsLeftRight size={16} />
        </button>
        <AirportField
          label={t('flightSchedulePage.form.to')}
          Icon={AirplaneLanding}
          value={form.to}
          airports={airports}
          onChange={(to) => update({ to })}
        />
      </div>

      <div className="mt-2 flex flex-col gap-2 md:flex-row">
        <DateField
          label={t('flightSchedulePage.departure')}
          value={form.departure}
          onChange={(departure) => update({ departure })}
        />
        {roundTrip ? (
          <DateField
            label={t('flightSchedulePage.return')}
            value={form.return}
            min={form.departure}
            onChange={(value) => update({ return: value })}
          />
        ) : (
          <div className="hidden flex-1 md:block" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-200 pt-5">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-700">
          <input
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
          {t('flightSchedulePage.nearby')}
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
