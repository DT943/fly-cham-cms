import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@maplibre/maplibre-gl-leaflet'

// OpenFreeMap's Liberty style — OSM-like colours, fully free, no API key.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

// The only text labels we keep: countries, continents and water bodies (seas,
// gulfs). Everything else — cities, towns, states, roads, POIs — is hidden so
// the map reads as "country names only", matching the reference.
const KEEP_LABEL = /country|continent|water|ocean|sea|marine|bay|strait/i

/**
 * Renders the OpenFreeMap vector basemap inside the existing Leaflet map (so all
 * the route overlays keep working) and trims its labels down to country names,
 * localised to the active language.
 */
const VectorBaseLayer = () => {
  const map = useMap()
  const { i18n } = useTranslation()
  const language = (i18n.language || 'en').split('-')[0]

  useEffect(() => {
    const glLayer = L.maplibreGL({
      style: STYLE_URL,
      attribution:
        '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const glMap = glLayer.getMaplibreMap()
    const nameField = [
      'coalesce',
      ['get', `name:${language}`],
      ['get', 'name:latin'],
      ['get', 'name'],
    ]

    const applyLabels = () => {
      const style = glMap.getStyle()
      if (!style?.layers) return

      style.layers.forEach((layer) => {
        if (layer.type !== 'symbol') return
        try {
          if (KEEP_LABEL.test(layer.id)) {
            // Keep it, but show the name in the current language.
            if (layer.layout && 'text-field' in layer.layout) {
              glMap.setLayoutProperty(layer.id, 'text-field', nameField)
            }
          } else {
            glMap.setLayoutProperty(layer.id, 'visibility', 'none')
          }
        } catch {
          /* layer without the expected props — leave it as-is */
        }
      })
    }

    // The route-map canvas is absolutely positioned and measures 0×0 for the
    // first frames; the GL map paints nothing until it is resized to the real
    // box. Resize it exactly when the container's size changes (0 → full), which
    // a ResizeObserver reports reliably regardless of the plugin's own throttle.
    const repaint = () => {
      try {
        glMap.resize()
      } catch {
        /* GL map not ready yet — the load handler covers that case */
      }
    }

    if (glMap.isStyleLoaded()) applyLabels()
    glMap.on('styledata', applyLabels)
    glMap.once('load', () => {
      applyLabels()
      repaint()
    })

    const observer = new ResizeObserver(repaint)
    observer.observe(map.getContainer())

    // Browsers pause WebGL while the tab is hidden; repaint when it returns.
    const onVisible = () => {
      if (document.visibilityState === 'visible') repaint()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisible)
      glMap.off('styledata', applyLabels)
      glLayer.remove()
    }
  }, [map, language])

  return null
}

export default VectorBaseLayer
