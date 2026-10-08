import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowRight, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import {
  ALIGN,
  SECTION_PADDING,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const toCoord = (value) => {
  if (value === '' || value === null || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}
const toPhoneHref = (phone = '') => {
  const cleaned = String(phone).replace(/[^+\d]/g, '')
  return cleaned ? `tel:${cleaned}` : ''
}
const toMapsHref = (lat, lng) =>
  toCoord(lat) !== null && toCoord(lng) !== null
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : ''

/* ------------------------------- Map ------------------------------------ */
function createPinIcon(color, selected) {
  const size = selected ? 40 : 32
  return L.divIcon({
    className: 'gsa-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5 2.5 2.5 0 0 1 12 11.5z"/>
    </svg>`,
  })
}

const MapSync = ({ countryIndex, offices, selected }) => {
  const map = useMap()
  const previous = useRef(countryIndex)
  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(frame)
  }, [map, countryIndex])
  useEffect(() => {
    if (!selected || offices.length === 0) return
    const changed = previous.current !== countryIndex
    previous.current = countryIndex
    if (changed && offices.length > 1) {
      const bounds = L.latLngBounds(offices.map((o) => [o.lat, o.lng]))
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 })
      return
    }
    map.flyTo([selected.lat, selected.lng], 14, { duration: 0.55 })
  }, [countryIndex, offices, selected, map])
  return null
}

const GsaMap = ({ countryIndex, locations, selectedIndex, onSelect, pinColor }) => {
  const pinCss = colorVar(pinColor)
  const selectedIcon = useMemo(() => createPinIcon(pinCss, true), [pinCss])
  const defaultIcon = useMemo(() => createPinIcon(pinCss, false), [pinCss])
  const offices = useMemo(
    () =>
      (locations || [])
        .map((loc, index) => ({ index, lat: toCoord(loc.lat), lng: toCoord(loc.lng) }))
        .filter((o) => o.lat !== null && o.lng !== null),
    [locations],
  )
  const selectedOffice = offices.find((o) => o.index === selectedIndex) || offices[0]
  const center = useMemo(
    () => [selectedOffice?.lat ?? 40.1772, selectedOffice?.lng ?? 44.5035],
    [selectedOffice],
  )
  if (!selectedOffice) return null
  return (
    <div dir="ltr" className="h-[280px] md:h-[400px] lg:h-[580px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        attributionControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSync countryIndex={countryIndex} offices={offices} selected={selectedOffice} />
        {offices.map((office) => (
          <Marker
            key={office.index}
            position={[office.lat, office.lng]}
            icon={office.index === selectedIndex ? selectedIcon : defaultIcon}
            eventHandlers={{ click: () => onSelect(office.index) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}

/* ---------------------------- Country filter ---------------------------- */
const CountryFilter = ({ countries, activeIndex, onSelect, label, style }) => {
  const tabRefs = useRef({})
  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeIndex])
  return (
    <div
      role="tablist"
      aria-label={label || 'Countries'}
      className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {countries.map((country, index) => {
        const isActive = index === activeIndex
        return (
          <button
            key={`${country.label}-${index}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            ref={(node) => { tabRefs.current[index] = node }}
            onClick={() => onSelect(index)}
            className={cx(typography.caption, 'm-0 cursor-pointer font-medium rounded-lg px-4 py-2 md:px-5 whitespace-nowrap shrink-0 border border-solid')}
            style={{
              backgroundColor: colorVar(isActive ? style.activeTabBg : style.inactiveTabBg),
              color: colorVar(isActive ? style.activeTabText : style.inactiveTabText),
              borderColor: colorVar(style.tabBorderColor),
            }}
          >
            <span className="md:hidden">{country.shortLabel || country.label}</span>
            <span className="hidden md:inline">{country.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ----------------------------- Office card ------------------------------ */
const DetailRow = ({ icon: Icon, color, children }) => (
  <div className={cx('flex items-start gap-2 min-w-0', typography.caption)} style={{ color }}>
    <Icon size={16} weight="regular" className="shrink-0 mt-0.5" style={{ color }} />
    <span className="min-w-0 wrap-break-word">{children}</span>
  </div>
)

const OfficeCard = ({ office, isSelected, onSelect, openMapLabel, style, linkProps }) => {
  const rowColor = colorVar(style.rowColor)
  const iconColor = colorVar(style.iconColor)
  const linkTextColor = colorVar(style.linkTextColor)
  const arrowColor = colorVar(style.arrowColor)
  const hours = Array.isArray(office.hours) ? office.hours : []
  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={cx('rounded-lg p-5 flex flex-col gap-4 cursor-pointer border', !isSelected && '')}
      style={{ backgroundColor: colorVar(style.cardBg), borderColor: isSelected ? colorVar(style.selectedBorderColor) : 'transparent' }}
      onClick={() => onSelect()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect() }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'nameColor', 'secondary-2', 'semibold')}>
            <LinkedText text={office.name} {...linkProps} />
          </h3>
          {office.city && <p className={cx(typography.caption, 'm-0')} style={{ color: colorVar(style.cityColor) }}>{office.city}</p>}
        </div>
        {isSelected && toMapsHref(office.lat, office.lng) && (
          <a
            href={toMapsHref(office.lat, office.lng)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label={openMapLabel || 'Open in maps'}
            className="w-8 h-8 shrink-0 no-underline grid place-items-center"
          >
            <span className="w-6 h-6 border rotate-45 grid place-items-center" style={{ borderColor: arrowColor }}>
              <ArrowRight size={14} weight="bold" className="-rotate-45 rtl:-scale-x-100" style={{ color: arrowColor }} />
            </span>
          </a>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {office.address && (
          <DetailRow icon={MapPin} color={rowColor}>
            <LinkedText text={office.address} {...linkProps} />
          </DetailRow>
        )}
        {office.phone && (
          <DetailRow icon={Phone} color={rowColor}>
            <a href={toPhoneHref(office.phone)} dir="ltr" className="no-underline hover:underline" style={{ color: linkTextColor }} onClick={(e) => e.stopPropagation()}>
              {office.phone}
            </a>
          </DetailRow>
        )}
        {office.email && (
          <DetailRow icon={EnvelopeSimple} color={rowColor}>
            <a href={`mailto:${office.email}`} className="no-underline hover:underline break-all" style={{ color: linkTextColor }} onClick={(e) => e.stopPropagation()}>
              {office.email}
            </a>
          </DetailRow>
        )}
      </div>
      {hours.length > 0 && (
        <div
          className={cx(typography.caption, 'flex flex-col gap-1 pt-3 border-t', CMS_TEXT_HOVER_CLASS)}
          style={{ ...getTextStyleVars(style, 'hoursColor', 'primary-1', 'medium'), borderColor: colorVar(style.dividerColor) }}
        >
          {hours.map((row, index) => (
            <div key={`${row.days}-${index}`} className="flex items-center justify-between gap-3">
              <span>{row.days}</span>
              <span dir={/\d/.test(row.time) ? 'ltr' : undefined}>{row.time}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

/* ------------------------------- Section -------------------------------- */
const GsaNetwork = ({
  title,
  countriesLabel,
  openMapLabel,
  countries = [],
  showTitle = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  titleAlign = 'left',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  activeTabBg = 'primary-1',
  activeTabText = '50',
  inactiveTabBg = 'background',
  inactiveTabText = 'primary-1',
  tabBorderColor = 'primary-1',
  cardBg = 'background',
  selectedBorderColor = 'primary-1',
  dividerColor = '200',
  nameColor = 'secondary-2',
  nameFontWeight = 'semibold',
  nameColorHover,
  nameFontWeightHover,
  cityColor = '600',
  rowColor = '700',
  rowFontWeight = 'normal',
  rowColorHover,
  rowFontWeightHover,
  linkTextColor = '600',
  iconColor = '700',
  arrowColor = 'primary-1',
  hoursColor = 'primary-1',
  hoursFontWeight = 'medium',
  hoursColorHover,
  hoursFontWeightHover,
  pinColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const [countryIndex, setCountryIndex] = useState(0)
  const [officeIndex, setOfficeIndex] = useState(0)

  useEffect(() => {
    if (countryIndex >= countries.length) {
      setCountryIndex(0)
      setOfficeIndex(0)
    }
  }, [countries.length, countryIndex])

  if (!countries.length) return null

  const style = {
    activeTabBg, activeTabText, inactiveTabBg, inactiveTabText, tabBorderColor,
    cardBg, selectedBorderColor, dividerColor,
    nameColor, nameFontWeight, nameColorHover, nameFontWeightHover,
    cityColor, rowColor, rowFontWeight, rowColorHover, rowFontWeightHover,
    linkTextColor, iconColor, arrowColor,
    hoursColor, hoursFontWeight, hoursColorHover, hoursFontWeightHover,
  }
  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }

  const selectCountry = (index) => { setCountryIndex(index); setOfficeIndex(0) }
  const activeCountry = countries[countryIndex] || countries[0]
  const locations = activeCountry?.locations || []

  return (
    <section
      className={cx('flex flex-col gap-4 md:gap-6', SECTION_PADDING[sectionPadding], showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col gap-3 md:gap-4">
        {showTitle && title && (
          <div className={cx('flex flex-col', ALIGN[titleAlign])}>
            <h2 className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}>
              <LinkedText text={title} {...linkProps} />
            </h2>
          </div>
        )}
        <CountryFilter countries={countries} activeIndex={countryIndex} onSelect={selectCountry} label={countriesLabel} style={style} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">
        <GsaMap countryIndex={countryIndex} locations={locations} selectedIndex={officeIndex} onSelect={setOfficeIndex} pinColor={pinColor} />
        <div className="flex flex-col gap-4 w-full lg:max-h-[580px] lg:overflow-y-auto">
          {locations.map((office, index) => (
            <OfficeCard
              key={`${office.name}-${index}`}
              office={office}
              isSelected={index === officeIndex}
              onSelect={() => setOfficeIndex(index)}
              openMapLabel={openMapLabel}
              style={style}
              linkProps={linkProps}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default GsaNetwork
