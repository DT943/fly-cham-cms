import { useEffect, useState } from 'react'
import { COUNTDOWN_UNITS } from './dealsStyle.js'

/** Parse an `endsAt` value (datetime-local or ISO) → epoch ms, or null. */
export function parseEndsAt(value) {
  const raw = String(value || '').trim()
  if (!raw) return null
  const time = Date.parse(raw)
  return Number.isFinite(time) ? time : null
}

const pad = (n) => String(n).padStart(2, '0')

/**
 * '6h : 55m : 06s' under a day, '2d : 06h : 55m' from a day up (Figma
 * 'Ends in 6h : 55m : 66s'). Returns '' once the time has passed.
 */
export function formatCountdown(msLeft, lang = 'en') {
  if (!Number.isFinite(msLeft) || msLeft <= 0) return ''
  const units = COUNTDOWN_UNITS[lang] || COUNTDOWN_UNITS.en
  const total = Math.floor(msLeft / 1000)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (days > 0) {
    return `${days}${units.d} : ${pad(hours)}${units.h} : ${pad(minutes)}${units.m}`
  }
  return `${hours}${units.h} : ${pad(minutes)}${units.m} : ${pad(seconds)}${units.s}`
}

/** Current time, ticking every second while `active`. */
export function useNow(active) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return undefined
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [active])
  return now
}
