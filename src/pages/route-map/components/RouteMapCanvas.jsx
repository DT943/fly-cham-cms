import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { airportsByCode, arcBetween, legsFor, routeLegs } from '../utils/routeNetwork.js'

const HUB = '#baa981'
const SPOKE = '#006080'

/** Inline styles rather than utility classes — this markup is built outside React. */
function createPin({ hub, selected, dimmed }) {
  const size = selected ? 22 : hub ? 18 : 14
  const color = hub ? HUB : SPOKE
  const ring = selected ? `box-shadow:0 0 0 6px ${color}33,0 0 0 12px ${color}1a;` : ''

  return L.divIcon({
    className: 'route-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:2.5px solid #fdfdfc;opacity:${dimmed ? 0.35 : 1};
      transition:opacity .2s ease;${ring}"></span>`,
  })
}

const MapSync = ({ selected, hasSelection }) => {
  const map = useMap()
  const [box, setBox] = useState(null)
  const sizeRef = useRef(null)

  /*
   * The canvas is absolutely positioned, so it can measure 0x0 before layout
   * settles — and fitting bounds on a zero-size map yields a NaN centre that
   * throws. Observe the element, re-measure on every change (this also covers
   * breakpoints, which a one-shot invalidateSize misses), and only report ready
   * once it actually has a box.
   */
  useEffect(() => {
    const container = map.getContainer()
    let frame = 0
    let attempts = 0
    let cancelled = false

    const measure = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return false

      // Bail unless the box genuinely changed: the observer also fires while the
      // fly animation resizes panes, and invalidateSize() there cancels the
      // flight mid-way, stranding the view short of the padded target.
      const previous = sizeRef.current
      if (previous && previous.w === w && previous.h === h) return true

      sizeRef.current = { w, h }
      map.invalidateSize()
      // Drives the refit, whose padding differs per breakpoint.
      setBox({ w, h })
      return true
    }

    // The container is 0x0 for the first frames, and a single ResizeObserver
    // notification can be missed entirely — poll until it has a box so the
    // opening fit always runs, then leave later resizes to the observer.
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
    if (!box) return

    const points = selected
      ? [
          [selected.lat, selected.lng],
          ...legsFor(selected.code).flatMap(([from, to]) => [
            [airportsByCode[from].lat, airportsByCode[from].lng],
            [airportsByCode[to].lat, airportsByCode[to].lng],
          ]),
        ]
      : Object.values(airportsByCode).map((airport) => [airport.lat, airport.lng])
    const bounds = L.latLngBounds(points)
    if (!bounds.isValid()) return

    /*
     * The destination card floats over the map, so fit into the part that is
     * actually visible: below lg it is pinned to the bottom, at lg it is a side
     * column (which swaps sides under RTL).
     */
    const { w: width, h: height } = box
    const isDesktop = width >= 1024
    const rtl = getComputedStyle(document.body).direction === 'rtl'

    // The panel sits inside the page's content width, so its far edge is the
    // container gutter plus the panel itself — not the panel width alone.
    const gutter = Math.max((width - Math.min(width, 1219)) / 2, 40)
    const sidePanel = Math.round(gutter + (width >= 1280 ? 352 : 320) + 24)

    const topLeft = isDesktop ? [rtl ? 40 : sidePanel, 40] : [24, 72]
    const bottomRight = isDesktop
      ? [rtl ? sidePanel : 40, 40]
      : [24, Math.round(height * 0.48) + 24]
    /*
     * fitBounds, not flyToBounds: flyTo drives itself with requestAnimationFrame,
     * so if rAF is throttled (background tab, hidden view) the flight stalls and
     * the opening view never arrives. fitBounds resolves through setView, which
     * always lands on target and still eases when animation is available.
     */
    map.fitBounds(bounds, {
      paddingTopLeft: topLeft,
      paddingBottomRight: bottomRight,
      animate: Boolean(selected),
      duration: 0.6,
      ...(selected ? { maxZoom: 7 } : {}),
    })
  }, [map, selected, hasSelection, box])

  return null
}

const RouteMapCanvas = ({ airports, selectedCode, onSelect, labelFor, className = '' }) => {
  const visible = useMemo(() => new Set(airports.map((a) => a.code)), [airports])
  const selected = selectedCode ? airportsByCode[selectedCode] : null
  const activeLegs = useMemo(
    () => new Set(selectedCode ? legsFor(selectedCode).map((leg) => leg.join('-')) : []),
    [selectedCode]
  )

  return (
    <div dir="ltr" className={`relative overflow-hidden ${className}`}>
      <MapContainer
        center={[32.5, 45]}
        zoom={5}
        scrollWheelZoom={false}
        className="route-map-canvas h-full w-full bg-100 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSync selected={selected} hasSelection={Boolean(selectedCode)} />

        {routeLegs.map(([from, to]) => {
          const key = `${from}-${to}`
          const isActive = activeLegs.has(key)
          const isDimmed = selectedCode ? !isActive : false

          return (
            <Polyline
              key={key}
              positions={arcBetween(airportsByCode[from], airportsByCode[to])}
              pathOptions={{
                color: isActive ? HUB : SPOKE,
                weight: isActive ? 3 : 1.75,
                opacity: isDimmed ? 0.15 : isActive ? 0.95 : 0.45,
                dashArray: isActive ? null : '6 7',
                lineCap: 'round',
              }}
            />
          )
        })}

        {Object.values(airportsByCode).map((airport) => {
          const isSelected = airport.code === selectedCode
          const dimmed = !visible.has(airport.code) || (Boolean(selectedCode) && !isSelected)

          return (
            <Marker
              key={airport.code}
              position={[airport.lat, airport.lng]}
              zIndexOffset={isSelected ? 1000 : airport.hub ? 500 : 0}
              icon={createPin({ hub: airport.hub, selected: isSelected, dimmed })}
              eventHandlers={{ click: () => onSelect(airport.code) }}
            >
              <Tooltip direction="top" offset={[0, -12]} opacity={1} className="route-map-tooltip">
                {labelFor(airport)}
              </Tooltip>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default RouteMapCanvas
