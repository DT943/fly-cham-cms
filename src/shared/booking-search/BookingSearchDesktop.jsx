import {
  AirplaneLandingIcon,
  AirplaneTakeoffIcon,
  ArrowsDownUpIcon,
  CalendarDotsIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  UserIcon,
  XIcon,
} from '@phosphor-icons/react'
import LocalizedLink from '../components/LocalizedLink.jsx'
import Dropdown from '../components/Dropdown.jsx'
import CalendarPanel, { formatFieldDate } from './CalendarPanel.jsx'
import PassengersPanel, { passengerSummary } from './PassengersPanel.jsx'
import { Checkbox, DesktopRadio, DismissArea, PopoverPanel, Toggle } from './controls.jsx'
import CurrencyField from './CurrencyField.jsx'
import {
  DESKTOP_BOTTOM_ACTIONS,
  DESKTOP_BOTTOM_ROW,
  DESKTOP_CARD,
  DESKTOP_COLUMN,
  DESKTOP_DATE_BOX,
  DESKTOP_DATES_GROUP,
  DESKTOP_FIELDS_ROW,
  DESKTOP_FIELDS_TOP,
  DESKTOP_HAIRLINE,
  DESKTOP_PAX_BOX,
  DESKTOP_ROUTE_TRIGGER,
  DESKTOP_ROUTE_TRIGGER_FROM,
  DESKTOP_ROUTE_TRIGGER_TO,
  DESKTOP_SEARCH,
  DESKTOP_SWAP,
  DESKTOP_TAB,
  DESKTOP_TAB_BAR,
  DESKTOP_TAB_WIDTH,
  DESKTOP_TABS,
  DESKTOP_TRIP_GROUP,
  DESKTOP_TRIP_OPTION,
  DESKTOP_TRIP_OPTION_SIZE,
  DESKTOP_TRIP_ROW,
  INK,
  MUTED,
  SOFT,
  routeNotchMask,
} from './bookingSearchStyle.js'

const INVALID_RING = { boxShadow: 'inset 0 0 0 1.5px #d93025' }
const TAB_WIDTH_INDEX = { book: 0, manage: 1, status: 2 }

/** 24px gold circle holding a 15px glyph (Figma AirplaneTakeoff / Landing badge). */
const Badge = ({ icon: Icon, theme, size = 15.158 }) => (
  <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: theme.iconBg }}>
    <Icon size={size} color={theme.iconColor} />
  </span>
)

/** Book / Manage / Flight status tabs + the accent bar and hairline. */
export const DesktopTabs = ({ tabs, active, onSelect, theme }) => (
  <div>
    <div role="tablist" className={DESKTOP_TABS}>
      {tabs.map((tab) => {
        const selected = tab.id === active
        const style = { color: selected ? theme.accent : MUTED, fontWeight: selected ? 600 : 500 }
        const bar = selected ? <span aria-hidden className={DESKTOP_TAB_BAR} style={{ backgroundColor: theme.accent }} /> : null
        return tab.href ? (
          <LocalizedLink key={tab.id} href={tab.href} className={`${DESKTOP_TAB} ${DESKTOP_TAB_WIDTH[TAB_WIDTH_INDEX[tab.id]]}`} style={style}>
            {tab.label}
          </LocalizedLink>
        ) : (
          <button key={tab.id} type="button" role="tab" aria-selected={selected} onClick={() => onSelect(tab.id)} className={`${DESKTOP_TAB} ${DESKTOP_TAB_WIDTH[TAB_WIDTH_INDEX[tab.id]]}`} style={style}>
            {tab.label}
            {bar}
          </button>
        )
      })}
    </div>
    <div aria-hidden className={DESKTOP_HAIRLINE} />
  </div>
)

const RouteBox = ({ s, legIndex, type, labels, theme, rtl }) => {
  const isSource = type === 'source'
  const name = `${isSource ? 'from' : 'to'}-${legIndex}`
  const id = isSource ? s.leg(legIndex).source : s.leg(legIndex).destination
  const filled = Boolean(id)
  // From's notch faces the swap button on its end side, To's on its start side.
  const notch = isSource ? (rtl ? 'left' : 'right') : rtl ? 'right' : 'left'
  return (
    <div className="relative h-full w-[298px] shrink-0">
      <Dropdown
        id={s.fieldId(name)}
        label={isSource ? labels.fromLabel : labels.toLabel}
        value={id}
        onChange={(airportId) => s.selectAirport(legIndex, type, airportId)}
        options={s.airportChoices(legIndex, type)}
        className="h-full"
        buttonClassName={`${DESKTOP_ROUTE_TRIGGER} ${isSource ? DESKTOP_ROUTE_TRIGGER_FROM : DESKTOP_ROUTE_TRIGGER_TO}`}
        buttonStyle={{ backgroundColor: theme.fieldBg, ...routeNotchMask(notch), ...(s.invalid === name ? INVALID_RING : null) }}
        renderButton={() => (
          <>
            <Badge icon={isSource ? AirplaneTakeoffIcon : AirplaneLandingIcon} theme={theme} />
            <span className="flex min-w-0 flex-col gap-[5.7px] pt-[1.5px]">
              <span className="text-[14px] leading-[normal]" style={filled ? { color: MUTED, fontWeight: 500 } : { color: SOFT, fontWeight: 600 }}>
                {isSource ? labels.fromLabel : labels.toLabel}
              </span>
              {filled ? (
                <span className="truncate text-base font-semibold leading-[normal]" style={{ color: theme.accent }}>{s.airportText(id)}</span>
              ) : (
                <span className="truncate text-[14px] leading-[normal]" style={{ color: MUTED }}>
                  {isSource ? labels.fromPlaceholder : labels.toPlaceholder}
                </span>
              )}
            </span>
          </>
        )}
      />
      {filled ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => s.clearAirport(legIndex, type)}
          className="absolute end-[35.12px] top-1/2 z-[1] flex size-[13.104px] -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <XIcon size={13.104} color="#1b1f23" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}

const DateBox = ({ label, value, placeholder, onClick, dimmed, invalid, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className={DESKTOP_DATE_BOX}
    style={{ backgroundColor: theme.fieldBg, opacity: dimmed ? 0.5 : 1, ...(invalid ? INVALID_RING : null) }}
  >
    <Badge icon={CalendarDotsIcon} theme={theme} size={16} />
    <span className="flex min-w-[97px] max-w-[calc(100%-34px)] flex-col gap-[10px] text-base leading-[normal]" style={{ color: SOFT }}>
      <span className="truncate">{label}</span>
      <span className="truncate" style={value ? { color: INK, fontWeight: 500 } : undefined}>{value || placeholder}</span>
    </span>
  </button>
)

const FieldsRow = ({ s, legIndex, labels, theme, lang, rtl }) => {
  const calendarOpen = s.open === `date-${legIndex}`
  const calendar = s.calendarFor(legIndex)
  const l = s.leg(legIndex)
  const firstLeg = legIndex === 0
  return (
    <div className={`${DESKTOP_FIELDS_ROW} ${firstLeg ? DESKTOP_FIELDS_TOP : 'mt-3'}`}>
      <RouteBox s={s} legIndex={legIndex} type="source" labels={labels} theme={theme} rtl={rtl} />
      <button
        type="button"
        aria-label="Swap"
        onClick={() => s.swap(legIndex)}
        className={DESKTOP_SWAP}
      >
        <ArrowsDownUpIcon size={21.069} color="#3e3e3b" className="rotate-90" aria-hidden />
      </button>
      <div className="ms-[6.5px] h-full">
        <RouteBox s={s} legIndex={legIndex} type="destination" labels={labels} theme={theme} rtl={rtl} />
      </div>
      <DismissArea open={calendarOpen} onClose={s.close} className={`relative ${DESKTOP_DATES_GROUP}`}>
        <DateBox
          label={labels.departureLabel}
          value={formatFieldDate(l.dateStart, lang)}
          placeholder={labels.datesPlaceholder}
          onClick={() => s.openDates(legIndex, 'start')}
          invalid={s.invalid === `date-${legIndex}`}
          theme={theme}
        />
        {firstLeg ? (
          <DateBox
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
        {firstLeg ? (
          <DismissArea open={s.open === 'pax'} onClose={s.close} className="relative flex min-w-0 flex-1">
            <button
              type="button"
              aria-expanded={s.open === 'pax'}
              onClick={() => s.toggle('pax')}
              className={DESKTOP_PAX_BOX}
              style={{ backgroundColor: theme.fieldBg }}
            >
              <span className="flex h-[52px] w-[132px] min-w-0 flex-col justify-between">
                <span className="text-[13px] leading-[normal]" style={{ color: SOFT }}>{labels.passengersLabel}</span>
                <span className="truncate text-base font-medium leading-[normal]" style={{ color: INK }}>
                  {passengerSummary(s.guests, labels)}
                </span>
              </span>
            </button>
            {s.open === 'pax' ? (
              <PopoverPanel className="end-0 w-[320px]">
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
        ) : (
          <span className="flex-1" />
        )}
        {calendarOpen ? (
          <PopoverPanel className="end-0 w-[640px]">
            <CalendarPanel
              key={`${legIndex}-${s.calendarTarget}`}
              lang={lang}
              months={2}
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
    </div>
  )
}

/** Book tab, desktop (Figma 40951:24421). */
export const DesktopBookPanel = ({ s, labels, theme, show, lang }) => {
  const rtl = lang === 'ar'
  const trips = [
    { value: 'Return', label: labels.roundTripLabel },
    { value: 'OneWay', label: labels.oneWayLabel },
    ...(show.multiCity ? [{ value: 'MultiCity', label: labels.multiCityLabel }] : []),
  ]
  return (
    <>
      <div className={DESKTOP_COLUMN}>
        <div className={DESKTOP_TRIP_ROW}>
          <div role="radiogroup" className={DESKTOP_TRIP_GROUP}>
            {trips.map((trip, index) => {
              const checked = s.tripType === trip.value
              return (
                <button
                  key={trip.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => s.setTripType(trip.value)}
                  className={`${DESKTOP_TRIP_OPTION} ${DESKTOP_TRIP_OPTION_SIZE[index]}`}
                  style={{ color: checked ? theme.accent : SOFT, fontWeight: 500 }}
                >
                  <DesktopRadio checked={checked} color={theme.accent} />
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
              className="flex cursor-pointer items-center gap-[10px] border-0 bg-transparent p-0 text-[14px] font-medium leading-[normal]"
              style={{ color: theme.accent }}
            >
              <Toggle on={s.miles} color={theme.accent} />
              <span className="whitespace-nowrap">{labels.milesLabel}</span>
            </button>
          ) : null}
        </div>
        <FieldsRow s={s} legIndex={0} labels={labels} theme={theme} lang={lang} rtl={rtl} />
        {s.isMultiCity ? (
          <>
            <p className="m-0 mt-4 text-[14px] font-semibold leading-[normal]" style={{ color: SOFT }}>{labels.flight2Label}</p>
            <FieldsRow s={s} legIndex={1} labels={labels} theme={theme} lang={lang} rtl={rtl} />
          </>
        ) : null}
      </div>
      <div className={DESKTOP_BOTTOM_ROW}>
        {show.nearby ? (
          <button
            type="button"
            role="checkbox"
            aria-checked={s.nearby}
            onClick={s.toggleNearby}
            className="flex cursor-pointer items-center gap-[9px] border-0 bg-transparent p-0 text-base leading-[normal]"
            style={{ color: INK }}
          >
            <Checkbox checked={s.nearby} color={theme.accent} />
            {labels.nearbyLabel}
          </button>
        ) : (
          <span />
        )}
        <div className={DESKTOP_BOTTOM_ACTIONS}>
          <CurrencyField s={s} labels={labels} theme={theme} />
          <button
            type="button"
            onClick={s.search}
            disabled={s.searching}
            className={`${DESKTOP_SEARCH} ${theme.button.className}`}
            style={theme.button.style}
          >
            <span className="whitespace-nowrap">{s.searching ? labels.searchingLabel : labels.searchLabel}</span>
            <MagnifyingGlassIcon size={24} aria-hidden className="shrink-0" />
          </button>
        </div>
      </div>
    </>
  )
}

const ManageInput = ({ icon, label, value, placeholder, onChange, error, theme, inputProps }) => (
  <label
    className="flex h-full w-[298px] shrink-0 cursor-text items-start gap-[18px] rounded-[10.384px] pe-4 ps-3 pt-[9px]"
    style={{ backgroundColor: theme.fieldBg, ...(error ? INVALID_RING : null) }}
  >
    <Badge icon={icon} theme={theme} size={14} />
    <span className="flex min-w-0 flex-1 flex-col gap-[5.7px] pt-[1.5px]">
      <span className="text-[14px] font-medium leading-[normal]" style={{ color: MUTED }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent p-0 text-base font-semibold leading-[normal] outline-none placeholder:font-normal placeholder:text-[#8a8a88] focus:ring-0"
        style={{ color: theme.accent }}
        {...inputProps}
      />
    </span>
  </label>
)

/** Manage tab, desktop: PNR + last name in the Figma field style. */
export const DesktopManagePanel = ({ m, labels, theme }) => {
  const error = m.errors.pnr || m.errors.lastName
  return (
    <form onSubmit={m.submit} noValidate>
      <div className={DESKTOP_COLUMN}>
        <div className={`${DESKTOP_FIELDS_ROW} ${DESKTOP_FIELDS_TOP} gap-[6.5px]`}>
          <ManageInput icon={TicketIcon} label={labels.pnrLabel} value={m.pnr} placeholder={labels.pnrPlaceholder} onChange={m.onPnrChange} error={m.errors.pnr} theme={theme} inputProps={{ autoComplete: 'off', 'aria-invalid': Boolean(m.errors.pnr) }} />
          <ManageInput icon={UserIcon} label={labels.lastNameLabel} value={m.lastName} placeholder={labels.lastNamePlaceholder} onChange={m.onLastNameChange} error={m.errors.lastName} theme={theme} inputProps={{ autoComplete: 'family-name', 'aria-invalid': Boolean(m.errors.lastName) }} />
        </div>
      </div>
      <div className={DESKTOP_BOTTOM_ROW}>
        <p role={error ? 'alert' : undefined} className="m-0 text-[14px] leading-[normal] text-[#d93025]">{error || ''}</p>
        <button type="submit" disabled={m.redirecting} className={`${DESKTOP_SEARCH} ${theme.button.className}`} style={theme.button.style}>
          <span className="whitespace-nowrap">{m.redirecting ? labels.searchingLabel : labels.manageButton}</span>
        </button>
      </div>
    </form>
  )
}

