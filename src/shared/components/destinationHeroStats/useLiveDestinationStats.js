import { useEffect, useState } from 'react'
import { buildLiveStats, fetchDestinationWeather } from './liveStats.js'

/**
 * Live stats for a destination (see liveStats.js), or null when the page is
 * not a known destination. Weather loads once per city (cached 15 min); the
 * local-time stat re-renders every 30 s so the clock stays current.
 */
export default function useLiveDestinationStats(destination, lang) {
  const key = destination?.key || null
  const [weather, setWeather] = useState(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!key) return undefined
    let alive = true
    setWeather(null)
    fetchDestinationWeather(destination)
      .then((data) => alive && setWeather(data))
      .catch(() => alive && setWeather({ error: true }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the city changes
  }, [key])

  useEffect(() => {
    if (!key) return undefined
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [key])

  return destination ? buildLiveStats(destination, lang, weather, now) : null
}
