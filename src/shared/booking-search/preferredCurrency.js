import { useSyncExternalStore } from 'react'
import { DEFAULT_POS, getPosFromPath } from '../../i18n/languages.js'
import useCurrentPos from '../hooks/useCurrentPos.js'
import { usePosList } from '../pos/posList.js'
import { DEFAULT_CURRENCY, normalizeCurrencyCode } from './currenciesService.js'

/**
 * Site-wide preferred booking currency (header POS panel + booking search).
 * A pick is stored in localStorage with the POS it was made on and only
 * applies there: switching country/region shows that POS's currency until
 * the user picks another one.
 */

const STORAGE_KEY = 'flycham:preferred-currency:v2'
// v1 stored a bare code that applied on every POS — dropped.
const LEGACY_STORAGE_KEY = 'flycham:preferred-currency:v1'

const EMPTY = { pos: '', code: '' }

function readStored() {
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    const pos = typeof raw?.pos === 'string' ? raw.pos : ''
    const code = normalizeCurrencyCode(raw?.code)
    return pos && code ? { pos, code } : EMPTY
  } catch {
    return EMPTY
  }
}

function writeStored(entry) {
  try {
    if (entry.code) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage full / disabled */
  }
}

const currentPos = () => getPosFromPath(window.location.pathname) || DEFAULT_POS

let current = typeof window !== 'undefined' ? readStored() : EMPTY
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => current
const getServerSnapshot = () => EMPTY

/** Raw stored pick `{ pos, code }` (empty strings when none). */
export function useStoredPreferredCurrency() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Remember `value` as the currency for the POS in the current URL. */
export function setPreferredCurrency(value) {
  const code = normalizeCurrencyCode(value)
  const next = code ? { pos: currentPos(), code } : EMPTY
  if (next.pos === current.pos && next.code === current.code) return
  current = next
  writeStored(next)
  emit()
}

/**
 * Currency shown / used across the site: the pick made on the current POS,
 * else the current POS's currency, else SYP.
 */
export function usePreferredCurrency() {
  const stored = useStoredPreferredCurrency()
  const pos = useCurrentPos()
  const posList = usePosList()

  if (stored.code && stored.pos === pos) return stored.code
  const fromPos = normalizeCurrencyCode(posList.find((row) => row.code === pos)?.currency)
  return fromPos || DEFAULT_CURRENCY
}
