import {
  AirplaneLandingIcon,
  AirplaneTakeoffIcon,
  ArrowDownIcon,
  ArrowsDownUpIcon,
  CalendarBlankIcon,
  TicketIcon,
  UserIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import LocalizedLink from '../components/LocalizedLink.jsx'
import Dropdown from '../components/Dropdown.jsx'
import CalendarPanel, { formatFieldDate } from './CalendarPanel.jsx'
import PassengersPanel, { passengerSummary } from './PassengersPanel.jsx'
import { Checkbox, DismissArea, MobileRadio, PopoverPanel, Toggle } from './controls.jsx'
import CurrencyField from './CurrencyField.jsx'
import {
  INK,
  MOBILE_CURRENCY_TRIGGER,
  MOBILE_DATE_INPUT,
  MOBILE_FIELD,
  MOBILE_FIELD_TRIGGER,
  MOBILE_SEARCH,
  MOBILE_SWAP,
  MOBILE_TAB,
  MOBILE_TABS,
  MOBILE_TRIP_OPTION,
  MOBILE_TRIP_ROW,
  MUTED,
  SOFT,
} from './bookingSearchStyle.js'

const INVALID_RING = { boxShadow: 'inset 0 0 0 1.5px #d93025' }

export const MobileTabs = ({ tabs, active, onSelect, theme }) => (
  <div role="tablist" className={MOBILE_TABS}>
    {tabs.map((tab) => {
      const selected = tab.id === active
      const style = {
        color: selected ? theme.accent : MUTED,
        fontWeight: selected ? 600 : 500,
        borderBottom: selected ? `2px solid ${theme.accent}` : '0',
      }
      return tab.href ? (
        <LocalizedLink key={tab.id} href={tab.href} className={`${MOBILE_TAB} no-underline`} style={style}>
          {tab.label}
        </LocalizedLink>
      ) : (
        <button key={tab.id} type="button" role="tab" aria-selected={selected} onClick={() => onSelect(tab.id)} className={MOBILE_TAB} style={style}>
          {tab.label}
        </button>
      )
    })}
  </div>
)

const RouteField = ({ s, legIndex, type, labels, theme }) => {
  const isSource = type === 'source'
  const name = `${isSource ? 'from' : 'to'}-${legIndex}`
  const id = isSource ? s.leg(legIndex).source : s.leg(legIndex).destination
  const Icon = isSource ? AirplaneTakeoffIcon : AirplaneLandingIcon
  return (
    <Dropdown
      id={s.fieldId(name)}
      label={isSource ? labels.fromLabel : labels.toLabel}
      value={id}
      onChange={(airportId) => s.selectAirport(legIndex, type, airportId)}
      options={s.airportChoices(legIndex, type)}
      className="w-full"
      buttonClassName={MOBILE_FIELD_TRIGGER}
      buttonStyle={{ backgroundColor: theme.fieldBg, ...(s.invalid === name ? INVALID_RING : null) }}
      renderButton={() => (
        <>
          <Icon size={24} weight="fill" color={theme.iconBg} aria-hidden className="shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <span className="text-xs leading-[normal]" style={{ color: MUTED }}>{isSource ? labels.fromLabel : labels.toLabel}</span>
            <span className="flex h-6 items-center">
              {id ? (
                <span className="truncate text-[14px] font-semibold leading-[normal]" style={{ color: theme.accent }}>{s.airportText(id)}</span>
              ) : (
                <span className="truncate text-[14px] leading-[normal]" style={{ color: MUTED }}>
                  {isSource ? labels.fromPlaceholder : labels.toPlaceholder}
                </span>
              )}
            </span>
          </span>
        </>
      )}
    />
  )
}

const DateField = ({ label, value, placeholder, onClick, dimmed, invalid, theme }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-1" style={{ opacity: dimmed ? 0.5 : 1 }}>
    <span className="text-xs leading-[normal]" style={{ color: MUTED }}>{label}</span>
    <button type="button" onClick={onClick} className={MOBILE_DATE_INPUT} style={{ backgroundColor: theme.fieldBg, ...(invalid ? INVALID_RING : null) }}>
      <span className="truncate text-[14px] leading-[normal]" style={{ color: value ? INK : SOFT, fontWeight: value ? 500 : 400 }}>{value || placeholder}</span>
      <CalendarBlankIcon size={24} color={theme.iconBg} aria-hidden className="shrink-0" />
    </button>
  </div>
)

const LegFields = ({ s, legIndex, labels, theme, lang }) => {
  const l = s.leg(legIndex)
  const firstLeg = legIndex === 0
  const calendar = s.calendarFor(legIndex)
  return (
    <>
      <div className="relative flex w-full flex-col gap-2">
        <RouteField s={s} legIndex={legIndex} type="source" labels={labels} theme={theme} />
        <RouteField s={s} legIndex={legIndex} type="destination" labels={labels} theme={theme} />
        <button type="button" aria-label="Swap" onClick={() => s.swap(legIndex)} className={MOBILE_SWAP}>
          <ArrowsDownUpIcon size={18} color={INK} className="rotate-90" aria-hidden />
        </button>
      </div>
      <DismissArea open={s.open === `date-${legIndex}`} onClose={s.close} className="relative w-full">
        <div className="flex w-full gap-2">
          <DateField
            label={labels.departureLabel}
            value={formatFieldDate(l.dateStart, lang)}
            placeholder={labels.datesPlaceholder}
            onClick={() => s.openDates(legIndex, 'start')}
            invalid={s.invalid === `date-${legIndex}`}
            theme={theme}
          />
          {firstLeg ? (
            <DateField
              label={labels.returnLabel}
              value={s.isReturn ? formatFieldDate(s.values.dateEnd, lang) : ''}
              placeholder={labels.datesPlaceholder}
              dimmed={!s.isReturn}
              onClick={() => {
                if (!s.isReturn) s.setTripType('Return')
                s.openDates(0, 'end')
              }}
              invalid={s.invalid === 'return-0'}
              theme={theme}
            />
          ) : (
            <span className="flex-1" />
          )}
        </div>
        {s.open === `date-${legIndex}` ? (
          <PopoverPanel className="inset-x-0">
            <CalendarPanel
              key={`${legIndex}-${s.calendarTarget}`}
              lang={lang}
              months={1}
              start={calendar.start}
              end={calendar.end}
              range={calendar.range}
              minKey={calendar.minKey}
              maxKey={s.maxKey}
              available={calendar.available}
              loading={calendar.loading}
              accent={theme.accent}
              loadingLabel={labels.loadingLabel}
              onSelect={(key) => s.selectDate(legIndex, key)}
            />
          </PopoverPanel>
        ) : null}
      </DismissArea>
    </>
  )
}

/** Book tab, mobile (Figma 40954:91233). */
export const MobileBookPanel = ({ s, labels, theme, show, lang }) => {
  const trips = [
    { value: 'Return', label: labels.roundTripLabel },
    { value: 'OneWay', label: labels.oneWayLabel },
    ...(show.multiCity ? [{ value: 'MultiCity', label: labels.multiCityLabel }] : []),
  ]
  return (
    <>
      <div role="radiogroup" className={MOBILE_TRIP_ROW}>
        {trips.map((trip) => {
          const checked = s.tripType === trip.value
          return (
            <button
              key={trip.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => s.setTripType(trip.value)}
              className={MOBILE_TRIP_OPTION}
              style={{ color: checked ? theme.accent : SOFT }}
            >
              <MobileRadio checked={checked} color={theme.accent} />
              <span className="whitespace-nowrap">{trip.label}</span>
            </button>
          )
        })}
      </div>
      {show.miles ? (
        <button
          type="button"
          role="switch"
          aria-checked={s.miles}
          onClick={s.toggleMiles}
          className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-xs font-medium leading-[normal]"
          style={{ color: theme.accent }}
        >
          <Toggle on={s.miles} color={theme.accent} />
          {labels.milesLabel}
        </button>
      ) : null}
      <LegFields s={s} legIndex={0} labels={labels} theme={theme} lang={lang} />
      {s.isMultiCity ? (
        <>
          <p className="m-0 w-full text-[14px] font-semibold leading-[normal]" style={{ color: SOFT }}>{labels.flight2Label}</p>
          <LegFields s={s} legIndex={1} labels={labels} theme={theme} lang={lang} />
        </>
      ) : null}
      <DismissArea open={s.open === 'pax'} onClose={s.close} className="relative w-full">
        <button
          type="button"
          aria-expanded={s.open === 'pax'}
          onClick={() => s.toggle('pax')}
          className={MOBILE_FIELD}
          style={{ backgroundColor: theme.fieldBg }}
        >
          <UsersIcon size={24} color={INK} aria-hidden className="shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
            <span className="text-xs leading-[normal]" style={{ color: MUTED }}>{labels.passengersLabel}</span>
            <span className="truncate text-base leading-[normal]" style={{ color: INK }}>{passengerSummary(s.guests, labels)}</span>
          </span>
          <ArrowDownIcon size={24} color={INK} aria-hidden className="shrink-0" />
        </button>
        {s.open === 'pax' ? (
          <PopoverPanel className="inset-x-0">
            <PassengersPanel
              guests={s.guests}
              changeGuestCount={s.changeGuestCount}
              setCabinClass={s.setCabinClass}
              labels={labels}
              accent={theme.accent}
              onDone={s.close}
            />
          </PopoverPanel>
        ) : null}
      </DismissArea>
      {show.nearby ? (
        <button
          type="button"
          role="checkbox"
          aria-checked={s.nearby}
          onClick={s.toggleNearby}
          className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[13px] leading-[normal]"
          style={{ color: INK }}
        >
          <Checkbox checked={s.nearby} color={theme.accent} />
          {labels.nearbyLabel}
        </button>
      ) : null}
      <CurrencyField s={s} labels={labels} theme={theme} className="w-full" triggerClassName={MOBILE_CURRENCY_TRIGGER} />
      <button
        type="button"
        onClick={s.search}
        disabled={s.searching}
        className={`${MOBILE_SEARCH} ${theme.button.className}`}
        style={theme.button.style}
      >
        {s.searching ? labels.searchingLabel : labels.searchLabel}
      </button>
    </>
  )
}

const ManageField = ({ icon: Icon, label, value, placeholder, onChange, error, theme, inputProps }) => (
  <label className={`${MOBILE_FIELD} cursor-text`} style={{ backgroundColor: theme.fieldBg, ...(error ? INVALID_RING : null) }}>
    <Icon size={24} color={theme.iconBg} aria-hidden className="shrink-0" />
    <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
      <span className="text-xs leading-[normal]" style={{ color: MUTED }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-6 w-full border-0 bg-transparent p-0 text-[14px] font-semibold leading-[normal] outline-none placeholder:font-normal placeholder:text-[#8a8a88] focus:ring-0"
        style={{ color: theme.accent }}
        {...inputProps}
      />
    </span>
  </label>
)

/** Manage tab, mobile. */
export const MobileManagePanel = ({ m, labels, theme }) => {
  const error = m.errors.pnr || m.errors.lastName
  return (
    <form onSubmit={m.submit} noValidate className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <ManageField icon={TicketIcon} label={labels.pnrLabel} value={m.pnr} placeholder={labels.pnrPlaceholder} onChange={m.onPnrChange} error={m.errors.pnr} theme={theme} inputProps={{ autoComplete: 'off', 'aria-invalid': Boolean(m.errors.pnr) }} />
        <ManageField icon={UserIcon} label={labels.lastNameLabel} value={m.lastName} placeholder={labels.lastNamePlaceholder} onChange={m.onLastNameChange} error={m.errors.lastName} theme={theme} inputProps={{ autoComplete: 'family-name', 'aria-invalid': Boolean(m.errors.lastName) }} />
      </div>
      {error ? <p role="alert" className="m-0 text-[13px] leading-[normal] text-[#d93025]">{error}</p> : null}
      <button type="submit" disabled={m.redirecting} className={`${MOBILE_SEARCH} ${theme.button.className}`} style={theme.button.style}>
        {m.redirecting ? labels.searchingLabel : labels.manageButton}
      </button>
    </form>
  )
}
