import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { airportsByCode, arcBetween, legsFor } from '../utils/routeNetwork.js'
import VectorBaseLayer from './VectorBaseLayer.jsx'
import planeImg from '../../../assets/images/routes-map/plane.png'

const HUB = '#baa981'
const PIN = '#006080'
const PIN_BORDER = '#5393c8'

/** Inline styles rather than utility classes — this markup is built outside React. */
function createPin({ hub, selected, dimmed }) {
  const size = selected ? 22 : hub ? 18 : 14
  const color = PIN
  const ring = selected ? `box-shadow:0 0 0 6px ${color}33,0 0 0 12px ${color}1a;` : ''

  return L.divIcon({
    className: 'route-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:2.5px solid ${PIN_BORDER};opacity:${dimmed ? 0.35 : 1};
      transition:opacity .2s ease;${ring}"></span>`,
  })
}

/** A small plane sitting on the route line, rotated to face along it. */
function createPlaneIcon(angle) {
  const size = 50
  return L.divIcon({
    className: 'route-map-plane',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;transform:rotate(${angle}deg);
      filter:drop-shadow(0 1px 3px rgba(1,38,59,0.35));">
      <img src="${planeImg}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" />
    </span>`,
  })
}

/**
 * Position and screen-space heading at fraction `t` (0 → 1) along the arc. Web
 * Mercator is conformal so the angle is zoom-invariant; the cos(lat) term
 * corrects for the projection's vertical stretch, and +90 aligns the plane art
 * (which points north) with the direction of travel.
 */
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

/** Flies the plane marker from origin to destination along the arc, on a loop. */
const FlyingPlane = ({ arc }) => {
  const map = useMap()

  useEffect(() => {
    if (!arc || arc.length < 2) return

    const first = planeAtFraction(arc, 0)
    const marker = L.marker(first.position, {
      icon: createPlaneIcon(first.angle),
      interactive: false,
      keyboard: false,
      zIndexOffset: 1100,
    }).addTo(map)

    const DURATION = 5000 // ms for one origin → destination pass
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
  }, [map, arc])

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

    // The search/card panel is pinned to the left edge (max-w-440 + padding), so
    // keep the framed route clear of it. Narrow desktops get a proportionally
    // smaller panel, capped at the panel's own max width.
    const sidePanel = Math.round(Math.min(480, width - 48) + 28)

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

  // A single line is drawn only once both ends are chosen.
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
    <div
      dir="ltr"
      className={`relative overflow-hidden ${className} ${chosen.length > 0 ? 'route-map-searched' : ''}`}
    >
      <MapContainer
        center={[32.5, 45]}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl={false}
        className="route-map-canvas h-full w-full bg-100 z-0"
      >
        {/* Zoom sits on the right so it clears the left-edge search panel. */}
        <ZoomControl position="topright" />
        {/*
         * OpenFreeMap vector basemap (OSM-like colours) with every label except
         * country / continent / water names hidden — so the map keeps its
         * original colours but shows country names only, no cities.
         */}
        <VectorBaseLayer />
        <MapSync points={fitPoints} zoomIn={chosen.length > 0} />

        {/* The one line: the chosen origin → destination, and nothing else. */}
        {drawnLeg && (
          <Polyline
            positions={drawnLeg}
            pathOptions={{ color: HUB, weight: 3.5, opacity: 1, lineCap: 'round' }}
          />
        )}

        {/* A plane flying the route, origin → destination, on a smooth loop. */}
        {drawnLeg && <FlyingPlane arc={drawnLeg} />}

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
