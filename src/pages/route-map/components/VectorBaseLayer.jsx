import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@maplibre/maplibre-gl-leaflet'

// OpenFreeMap Liberty — free vector tiles, no API key. Colours are overridden
// below to match the route-map theme (cream land, soft blue water, no labels).
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

const THEME = {
  land: '#FFF8E7',
  water: '#D6E4F0',
  waterway: '#C5D8E8',
  border: '#2C4B5F',
  disputed: '#5A7385',
}

/** Layers whose geometry we keep but recolour to flat land. */
const LAND_FILL = /^(background|park|landuse_|landcover_|aeroway_fill)/i

/** Water fills / lines. */
const WATER = /^(water$|waterway_)/i

/** Country / admin borders. */
const BORDER = /^boundary_/i

/**
 * Flat cream-and-blue basemap with country borders only — no country, city,
 * road or water labels. Route pins stay on the Leaflet overlay.
 */
const VectorBaseLayer = () => {
  const map = useMap()

  useEffect(() => {
    const glLayer = L.maplibreGL({
      style: STYLE_URL,
      attribution:
        '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const glMap = glLayer.getMaplibreMap()

    const applyTheme = () => {
      const style = glMap.getStyle()
      if (!style?.layers) return

      style.layers.forEach((layer) => {
        const id = layer.id
        try {
          // No labels of any kind (countries, cities, water, roads, …).
          if (layer.type === 'symbol') {
            glMap.setLayoutProperty(id, 'visibility', 'none')
            return
          }

          // Drop the Natural Earth raster underlay — it fights the flat palette.
          if (layer.type === 'raster' || id === 'natural_earth') {
            glMap.setLayoutProperty(id, 'visibility', 'none')
            return
          }

          // Hide roads, rails, buildings, patterns — keep land/water/borders only.
          if (
            /^(road_|tunnel_|bridge_|building|housenumber|ferry|cable|aerialway|highway)/i.test(
              id,
            )
          ) {
            glMap.setLayoutProperty(id, 'visibility', 'none')
            return
          }

          if (layer.type === 'background' || LAND_FILL.test(id)) {
            if (layer.type === 'background') {
              glMap.setPaintProperty(id, 'background-color', THEME.land)
            } else if (layer.type === 'fill') {
              glMap.setPaintProperty(id, 'fill-color', THEME.land)
              if (layer.paint && 'fill-opacity' in layer.paint) {
                glMap.setPaintProperty(id, 'fill-opacity', 1)
              }
            } else if (layer.type === 'line') {
              glMap.setPaintProperty(id, 'line-color', THEME.land)
            }
            return
          }

          if (WATER.test(id)) {
            if (layer.type === 'fill') {
              glMap.setPaintProperty(id, 'fill-color', THEME.water)
              if (layer.paint && 'fill-opacity' in layer.paint) {
                glMap.setPaintProperty(id, 'fill-opacity', 1)
              }
            } else if (layer.type === 'line') {
              glMap.setPaintProperty(id, 'line-color', THEME.waterway)
            }
            return
          }

          if (BORDER.test(id)) {
            if (layer.type === 'line') {
              glMap.setPaintProperty(
                id,
                'line-color',
                /disputed/i.test(id) ? THEME.disputed : THEME.border,
              )
              glMap.setPaintProperty(id, 'line-opacity', 0.9)
              // Keep country borders readable without dominating the pins.
              if (id === 'boundary_2') {
                glMap.setPaintProperty(id, 'line-width', 0.8)
              }
            }
            return
          }
        } catch {
          /* layer without the expected props — leave it as-is */
        }
      })
    }

    const repaint = () => {
      try {
        glMap.resize()
      } catch {
        /* GL map not ready yet */
      }
    }

    if (glMap.isStyleLoaded()) applyTheme()
    glMap.on('styledata', applyTheme)
    glMap.once('load', () => {
      applyTheme()
      repaint()
    })

    const observer = new ResizeObserver(repaint)
    observer.observe(map.getContainer())

    const onVisible = () => {
      if (document.visibilityState === 'visible') repaint()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisible)
      glMap.off('styledata', applyTheme)
      glLayer.remove()
    }
  }, [map])

  return null
}

export default VectorBaseLayer
