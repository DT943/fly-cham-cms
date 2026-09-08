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

function createChip(label) {
  return L.divIcon({
    className: 'route-map-chip',
    iconSize: [0, 0],
    iconAnchor: [0, 34],
    html: `<span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;
      transform:translateX(-50%);background:#fdfdfc;color:#01263b;border:1px solid #e5e5e3;
      border-radius:6px;padding:4px 8px;font-size:12px;font-weight:600;
      box-shadow:0 4px 12px rgba(1,38,59,0.22);">${label}</span>`,
  })
}

const MapSync = ({ points, zoomIn }) => {
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
    if (!box || points.length === 0) return

    const bounds = L.latLngBounds(points)
    if (!bounds.isValid()) return

    /*
     * The search panel floats over the map, so fit into the part that is
     * actually visible: below lg it sits at the top, at lg it is a side column
     * (which swaps sides under RTL).
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
      animate: zoomIn,
      duration: 0.6,
      ...(zoomIn ? { maxZoom: 7 } : {}),
    })
  }, [map, points, zoomIn, box])

  return null
}

const RouteMapCanvas = ({ fromCode, toCode, onSelect, labelFor, className = '' }) => {
  const from = fromCode ? airportsByCode[fromCode] : null
  const to = toCode ? airportsByCode[toCode] : null
  const chosen = useMemo(
    () => [fromCode, toCode].filter(Boolean),
    [fromCode, toCode]
  )

  // With one end picked we highlight everywhere it flies; with both, just the leg.
  const activeLegs = useMemo(() => {
    if (fromCode && toCode) {
      return new Set([[fromCode, toCode].sort().join('-')])
    }
    const anchor = fromCode || toCode
    return new Set(anchor ? legsFor(anchor).map((leg) => leg.join('-')) : [])
  }, [fromCode, toCode])

  const drawnLeg = from && to ? arcBetween(from, to) : null

  /*
   * What the view frames: the chosen leg once both ends are set, everywhere a
   * single chosen airport flies while only one is set, otherwise the network.
   */
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
        <MapSync points={fitPoints} zoomIn={chosen.length > 0} />

        {routeLegs.map(([legFrom, legTo]) => {
          const key = `${legFrom}-${legTo}`
          const isActive = activeLegs.has(key)
          const isDimmed = chosen.length > 0 && !isActive

          return (
            <Polyline
              key={key}
              positions={arcBetween(airportsByCode[legFrom], airportsByCode[legTo])}
              pathOptions={{
                color: isActive ? HUB : SPOKE,
                weight: isActive ? 3 : 1.75,
                opacity: isDimmed ? 0.12 : isActive ? 0.95 : 0.45,
                dashArray: isActive ? null : '6 7',
                lineCap: 'round',
              }}
            />
          )
        })}

        {/* The chosen leg, drawn on top even when the pair is not a direct route. */}
        {drawnLeg && (
          <Polyline
            positions={drawnLeg}
            pathOptions={{ color: HUB, weight: 3.5, opacity: 1, lineCap: 'round' }}
          />
        )}

        {Object.values(airportsByCode).map((airport) => {
          const isChosen = chosen.includes(airport.code)
          const dimmed = chosen.length > 0 && !isChosen

          return (
            <Marker
              key={airport.code}
              position={[airport.lat, airport.lng]}
              zIndexOffset={isChosen ? 1000 : airport.hub ? 500 : 0}
              icon={createPin({ hub: airport.hub, selected: isChosen, dimmed })}
              eventHandlers={{ click: () => onSelect(airport.code) }}
            >
              {!isChosen && (
                <Tooltip direction="top" offset={[0, -12]} opacity={1} className="route-map-tooltip">
                  {labelFor(airport)}
                </Tooltip>
              )}
            </Marker>
          )
        })}

        {/* Endpoint chips, matching the reference's labelled pins. */}
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
