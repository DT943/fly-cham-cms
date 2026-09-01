import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { gsaLocations } from '../utils/gsaLocations.js'

const PIN_COLOR = '#006080'

function createPinIcon(selected) {
  const size = selected ? 40 : 32
  return L.divIcon({
    className: 'gsa-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${PIN_COLOR}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5 2.5 2.5 0 0 1 12 11.5z"/>
    </svg>`,
  })
}

const selectedIcon = createPinIcon(true)
const defaultIcon = createPinIcon(false)

const MapSync = ({ countryId, offices, selected }) => {
  const map = useMap()
  const previousCountryId = useRef(countryId)

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(frame)
  }, [map, countryId])

  useEffect(() => {
    if (!selected || offices.length === 0) return

    const countryChanged = previousCountryId.current !== countryId
    previousCountryId.current = countryId

    if (countryChanged && offices.length > 1) {
      const bounds = L.latLngBounds(offices.map((office) => [office.lat, office.lng]))
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 })
      return
    }

    map.flyTo([selected.lat, selected.lng], 14, { duration: 0.55 })
  }, [countryId, offices, selected, map])

  return null
}

const GsaMap = ({ countryId, locationIds, selectedId, onSelect }) => {
  const selected = gsaLocations[selectedId]
  const offices = useMemo(
    () => locationIds.map((id) => gsaLocations[id]).filter(Boolean),
    [locationIds]
  )
  const center = useMemo(
    () => [selected?.lat ?? 40.1772, selected?.lng ?? 44.5035],
    [selected]
  )

  if (!selected) return null

  return (
    <div dir="ltr" className="h-[280px] md:h-[400px] lg:h-[580px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSync countryId={countryId} offices={offices} selected={selected} />
        {locationIds.map((id) => {
          const office = gsaLocations[id]
          if (!office) return null

          return (
            <Marker
              key={id}
              position={[office.lat, office.lng]}
              icon={id === selectedId ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => onSelect(id),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}

export default GsaMap
