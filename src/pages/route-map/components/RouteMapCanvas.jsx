import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { airportsByCode, arcBetween, legsFor } from '../utils/routeNetwork.js'
import VectorBaseLayer from './VectorBaseLayer.jsx'

const HUB = '#baa981'
const PIN = '#006080'
const PIN_BORDER = '#01263b'

/** Escape a URL for use inside a double-quoted HTML attribute. */
const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Default teardrop pin — network teal or new-route gold. */
function createPin({ selected, dimmed, isNew }) {
  const size = selected ? 20 : 16
  const color = isNew ? HUB : PIN
  const tip = Math.round(size * 0.45)
  const ring = selected ? `box-shadow:0 0 0 6px ${color}33,0 0 0 12px ${color}1a;` : ''

  return L.divIcon({
    className: 'route-map-pin',
    iconSize: [size, size + tip],
    iconAnchor: [size / 2, size + tip - 2],
    html: `<span style="display:flex;flex-direction:column;align-items:center;opacity:${dimmed ? 0.35 : 1};transition:opacity .2s ease;${ring}">
      <span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;
        background:${color};border:2.5px solid ${PIN_BORDER};box-sizing:border-box;"></span>
      <span style="width:0;height:0;border-left:${Math.round(size * 0.28)}px solid transparent;
        border-right:${Math.round(size * 0.28)}px solid transparent;border-top:${tip}px solid ${PIN_BORDER};
        margin-top:-2px;"></span>
    </span>`,
  })
}

/** Hover / focus pin: circular city photo with the city name under it. */
function createHoverPin({ imageUrl, label, isNew }) {
  const size = 64
  const color = isNew ? HUB : PIN
  const safeLabel = escapeHtml(label)
  const photo = imageUrl
    ? `<img loading="lazy" decoding="async" src="${escapeAttr(imageUrl)}" alt=""
        style="width:100%;height:100%;object-fit:cover;display:block;border-radius:9999px;" />`
    : `<span style="display:grid;place-items:center;width:100%;height:100%;border-radius:9999px;
        background:${color};color:#fdfdfc;font-size:12px;font-weight:700;">${safeLabel.slice(0, 3)}</span>`

  return L.divIcon({
    className: 'route-map-pin route-map-pin--hover',
    iconSize: [size, size + 28],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:flex;flex-direction:column;align-items:center;gap:6px;width:${size}px;">
      <span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;overflow:hidden;
        border:3px solid ${color};box-shadow:0 8px 20px rgba(1,38,59,0.28);background:#fdfdfc;box-sizing:border-box;">
        ${photo}
      </span>
      <span style="white-space:nowrap;font-size:13px;font-weight:700;color:#333333;
        text-shadow:0 1px 0 #fff,0 0 6px #fff;">${safeLabel}</span>
    </span>`,
  })
}

/**
 * A small plane sitting on the route line, rotated to face along it. The image
 * comes from the CMS (route-map-explorer `planeUrl`).
 */
function createPlaneIcon(angle, planeUrl) {
  const size = 50
  return L.divIcon({
    className: 'route-map-plane',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;transform:rotate(${angle}deg);
      filter:drop-shadow(0 1px 3px rgba(1,38,59,0.35));">
      <img loading="lazy" decoding="async" src="${escapeAttr(planeUrl)}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" />
    </span>`,
  })
}

function planeAtFraction(arc, t) {
  const f = t * (arc.length - 1)
  const i = Math.min(Math.floor(f), arc.length - 2)
  const frac = f - i
  const a = arc[i]
  const b = arc[i + 1]
  const lat = a[0] + (b[0] - a[0]) * frac
  const lng = a[1] + (b[1] - a[1]) * frac
  const dy = -(b[0] - a[0]) / Math.cos((lat * Math.PI) / 180)
  const angle = (Math.atan2(dy, b[1] - a[1]) * 180) / Math.PI + 90
  return { position: [lat, lng], angle }
}

const FlyingPlane = ({ arc, planeUrl }) => {
  const map = useMap()

  useEffect(() => {
    if (!arc || arc.length < 2 || !planeUrl) return

    const first = planeAtFraction(arc, 0)
    const marker = L.marker(first.position, {
      icon: createPlaneIcon(first.angle, planeUrl),
      interactive: false,
      keyboard: false,
    }).addTo(map)

    const DURATION = 5000
    let raf = 0
    let start = null

    const frame = (ts) => {
      if (start === null) start = ts
      const t = ((ts - start) % DURATION) / DURATION
      const { position, angle } = planeAtFraction(arc, t)
      marker.setLatLng(position)
      const span = marker.getElement()?.firstElementChild
      if (span) span.style.transform = `rotate(${angle}deg)`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      marker.remove()
    }
  }, [map, arc, planeUrl])

  return null
}

function createChip(label) {
  return L.divIcon({
    className: 'route-map-chip',
    iconSize: [0, 0],
    iconAnchor: [0, 34],
    html: `<span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;
      transform:translateX(-50%);background:#fdfdfc;color:#01263b;border:1px solid #e5e5e3;
      border-radius:6px;padding:4px 8px;font-size:12px;font-weight:600;
      box-shadow:0 4px 12px rgba(1,38,59,0.22);">${escapeHtml(label)}</span>`,
  })
}

const MapSync = ({ points, zoomIn }) => {
  const map = useMap()
  const [box, setBox] = useState(null)
  const sizeRef = useRef(null)

  useEffect(() => {
    const container = map.getContainer()
    let frame = 0
    let attempts = 0
    let cancelled = false

    const measure = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return false

      const previous = sizeRef.current
      if (previous && previous.w === w && previous.h === h) return true

      sizeRef.current = { w, h }
      map.invalidateSize()
      setBox({ w, h })
      return true
    }

    const poll = () => {
      if (cancelled || measure() || attempts > 120) return
      attempts += 1
      frame = requestAnimationFrame(poll)
    }
    poll()

    const observer = new ResizeObserver(() => measure())
    observer.observe(container)

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [map])

  useEffect(() => {
    if (!box || points.length === 0) return

    const bounds = L.latLngBounds(points)
    if (!bounds.isValid()) return

    const { w: width, h: height } = box
    const isDesktop = width >= 1024

    const topLeft = isDesktop ? [40, 96] : [24, 120]
    const bottomRight = isDesktop ? [40, 120] : [24, Math.round(height * 0.36) + 24]

    map.fitBounds(bounds, {
      paddingTopLeft: topLeft,
      paddingBottomRight: bottomRight,
      animate: zoomIn,
      duration: 0.6,
      ...(zoomIn ? { maxZoom: 7 } : {}),
    })
  }, [map, points, zoomIn, box])

  return null
}

const AirportMarker = ({
  airport,
  isChosen,
  dimmed,
  hovered,
  onHover,
  onSelect,
  label,
  cityName,
  imageUrl,
}) => {
  const icon = useMemo(() => {
    if (hovered && !isChosen) {
      return createHoverPin({ imageUrl, label: cityName, isNew: airport.isNew })
    }
    return createPin({
      selected: isChosen,
      dimmed,
      isNew: airport.isNew,
    })
  }, [hovered, isChosen, dimmed, airport.isNew, imageUrl, cityName])

  return (
    <Marker
      position={[airport.lat, airport.lng]}
      zIndexOffset={hovered || isChosen ? 1000 : airport.hub ? 500 : 0}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(airport.code),
        mouseover: () => onHover(airport.code),
        mouseout: () => onHover(null),
      }}
      title={label}
    />
  )
}

const RouteMapCanvas = ({
  fromCode,
  toCode,
  onSelect,
  labelFor,
  cityNameFor,
  planeUrl = '',
  cityImages = {},
  className = '',
}) => {
  const [hoveredCode, setHoveredCode] = useState(null)
  const from = fromCode ? airportsByCode[fromCode] : null
  const to = toCode ? airportsByCode[toCode] : null
  const chosen = useMemo(
    () => [fromCode, toCode].filter(Boolean),
    [fromCode, toCode],
  )

  const drawnLeg = from && to ? arcBetween(from, to) : null

  const fitPoints = useMemo(() => {
    if (from && to) return [from, to].map((a) => [a.lat, a.lng])

    const anchor = from || to
    if (anchor) {
      return [
        [anchor.lat, anchor.lng],
        ...legsFor(anchor.code).flatMap(([legFrom, legTo]) => [
          [airportsByCode[legFrom].lat, airportsByCode[legFrom].lng],
          [airportsByCode[legTo].lat, airportsByCode[legTo].lng],
        ]),
      ]
    }

    return Object.values(airportsByCode).map((airport) => [airport.lat, airport.lng])
  }, [from, to])

  return (
    <div
      dir="ltr"
      className={`relative overflow-hidden ${className} ${chosen.length > 0 ? 'route-map-searched' : ''}`}
    >
      <MapContainer
        center={[32.5, 45]}
        zoom={5}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
        className="route-map-canvas h-full w-full bg-100 z-0"
      >
        <ZoomControl position="topright" />
        <VectorBaseLayer />
        <MapSync points={fitPoints} zoomIn={chosen.length > 0} />

        {drawnLeg && (
          <Polyline
            positions={drawnLeg}
            pathOptions={{ color: HUB, weight: 3.5, opacity: 1, lineCap: 'round' }}
          />
        )}

        {drawnLeg && planeUrl && <FlyingPlane arc={drawnLeg} planeUrl={planeUrl} />}

        {Object.values(airportsByCode).map((airport) => {
          const isChosen = chosen.includes(airport.code)
          const dimmed = chosen.length > 0 && !isChosen
          const cityName = cityNameFor?.(airport) || airport.code
          const label = labelFor?.(airport) || cityName

          return (
            <AirportMarker
              key={airport.code}
              airport={airport}
              isChosen={isChosen}
              dimmed={dimmed}
              hovered={hoveredCode === airport.code}
              onHover={setHoveredCode}
              onSelect={onSelect}
              label={label}
              cityName={cityName}
              imageUrl={cityImages?.[airport.cityKey] || ''}
            />
          )
        })}

        {[from, to].filter(Boolean).map((airport) => (
          <Marker
            key={`chip-${airport.code}`}
            position={[airport.lat, airport.lng]}
            zIndexOffset={1200}
            interactive={false}
            icon={createChip(labelFor(airport))}
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default RouteMapCanvas
