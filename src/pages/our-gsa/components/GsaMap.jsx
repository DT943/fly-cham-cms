import { useEffect, useMemo } from 'react'
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

const MapSync = ({ lat, lng }) => {
  const map = useMap()

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(frame)
  }, [map])

  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 0.55 })
  }, [lat, lng, map])

  return null
}

const GsaMap = ({ locationIds, selectedId, onSelect }) => {
  const selected = gsaLocations[selectedId]
  const center = useMemo(
    () => [selected?.lat ?? 29.3759, selected?.lng ?? 47.9774],
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
        <MapSync lat={selected.lat} lng={selected.lng} />
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
