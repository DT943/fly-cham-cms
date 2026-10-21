import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CurrencyField from './CurrencyField.jsx'
import { useCurrencyPicker } from './currencyOptions.js'
import { setPreferredCurrency, usePreferredCurrency } from './preferredCurrency.js'

/** The vendored widget's field grey (`bg-[#F5F5F4]`) and the site primary. */
const WIDGET_THEME = { fieldBg: '#F5F5F4', accent: 'var(--color-primary-1)' }

/**
 * Booking-search currency dropdown for the vendored Booking Widget (home page):
 * same component and same region-based list, bound to the widget form's
 * `currency` value (sent with the flycham.com search) and the header preference.
 */
export default function BookingWidgetCurrency({ value, onChange, className = '' }) {
  const { t } = useTranslation()
  const preferred = usePreferredCurrency()
  const code = value || preferred

  useEffect(() => {
    if (preferred && preferred !== value) onChange?.(preferred)
  }, [preferred, value, onChange])

  const s = useCurrencyPicker({
    value: code,
    onChange: (next) => {
      setPreferredCurrency(next)
      onChange?.(next)
    },
  })
  return (
    <CurrencyField
      s={s}
      labels={{ currencyLabel: t('layout.header.currencyLabel') }}
      theme={WIDGET_THEME}
      className={className}
    />
  )
}
