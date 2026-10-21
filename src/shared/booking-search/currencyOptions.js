import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePosList } from '../pos/posList.js'
import { DEFAULT_CURRENCY, normalizeCurrencyCode } from './currenciesService.js'
import { setPreferredCurrency } from './preferredCurrency.js'

/**
 * Booking currencies come from the CMS POS list (admin /cms2/pos — the same
 * list as the header country/region picker): each POS's `currency` and flag
 * (no flag → globe), named via `layout.header.currencies.<CODE>` (code when
 * untranslated). Order follows the POS list; duplicates are dropped (`pos` is
 * the first POS row using that currency).
 */
export function useCurrencyOptions() {
  const { t } = useTranslation()
  const posList = usePosList()
  return useMemo(() => {
    const seen = new Set()
    return posList
      .filter((pos) => {
        const code = normalizeCurrencyCode(pos.currency)
        if (!code || seen.has(code)) return false
        seen.add(code)
        return true
      })
      .map((pos) => {
        const code = normalizeCurrencyCode(pos.currency)
        return {
          currencyCode: code,
          currencyName: t(`layout.header.currencies.${code}`, { defaultValue: code }),
          flag: pos.flagUrl,
          pos,
        }
      })
  }, [t, posList])
}

/**
 * Standalone currency picker state in the shape `CurrencyField` expects
 * (`s.open === 'currency'`, toggle/close, list, selection) — for widgets that
 * don't run the booking-search state machine, e.g. the vendored Booking Widget.
 */
export function useCurrencyPicker({ value, onChange }) {
  const currencies = useCurrencyOptions()
  const [open, setOpen] = useState(null)
  const code = normalizeCurrencyCode(value) || DEFAULT_CURRENCY

  const selectedCurrency = useMemo(
    () =>
      currencies.find((item) => item.currencyCode === code) || {
        currencyCode: code,
        currencyName: code,
        flag: '',
      },
    [currencies, code],
  )

  const toggle = useCallback((name) => setOpen((prev) => (prev === name ? null : name)), [])
  const close = useCallback(() => setOpen(null), [])
  const setCurrency = useCallback(
    (next) => {
      const code = normalizeCurrencyCode(next) || DEFAULT_CURRENCY
      setPreferredCurrency(code)
      onChange?.(code)
      setOpen(null)
    },
    [onChange],
  )

  return {
    open,
    toggle,
    close,
    currencies,
    currenciesLoading: false,
    selectedCurrency,
    setCurrency,
  }
}
