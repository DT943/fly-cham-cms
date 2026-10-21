import { useMemo } from 'react'
import { CaretDownIcon, GlobeHemisphereWestIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Dropdown from '../../../components/Dropdown.jsx'
import { useCurrencyOptions } from '../../../booking-search/currencyOptions.js'
import {
  setPreferredCurrency,
  usePreferredCurrency,
} from '../../../booking-search/preferredCurrency.js'

const FIELD_BG = '#F5F5F4'
const VALUE = '#212529'
const CARET = '#57534E'

/** Region flag (same images as the POS list); empty → globe. */
const Flag = ({ src }) =>
  src ? (
    <img
      loading="lazy"
      decoding="async"
      src={src}
      alt=""
      width={22}
      height={16}
      className="h-4 w-[22px] shrink-0 rounded-[2px] object-cover"
      aria-hidden
    />
  ) : (
    <GlobeHemisphereWestIcon size={18} className="w-[22px] shrink-0 text-[#57534e]" aria-hidden />
  )

const CurrencyRow = ({ flag, code }) => (
  <span className="flex min-w-0 items-center gap-2">
    <Flag src={flag} />
    <span className="text-[16px] font-medium leading-none tracking-tight">{code}</span>
  </span>
)

/**
 * Header POS-panel currency picker — site `Dropdown` with flag + code rows.
 */
export default function RegionCurrencyField({ className = '' }) {
  const { t } = useTranslation()
  const value = usePreferredCurrency()
  const currencies = useCurrencyOptions()

  const options = useMemo(
    () =>
      currencies.map((item) => ({
        value: item.currencyCode,
        flag: item.flag,
        label: <CurrencyRow flag={item.flag} code={item.currencyCode} />,
      })),
    [currencies],
  )

  return (
    <Dropdown
      label={t('layout.header.currencyLabel')}
      value={value}
      onChange={setPreferredCurrency}
      options={options}
      portal
      portalAlign="end"
      className={`z-30 w-auto shrink-0 ${className}`}
      buttonClassName="h-[44px] min-h-0 w-auto min-w-[96px] gap-3 rounded-[10px] border-0 px-3.5 py-2 font-medium shadow-none"
      buttonStyle={{ backgroundColor: FIELD_BG, color: VALUE, border: 'none' }}
      renderButton={({ open, selected }) => {
        const code = selected?.value || value
        const flag = selected?.flag ?? currencies.find((item) => item.currencyCode === code)?.flag
        return (
          <>
            <CurrencyRow flag={flag} code={code} />
            <CaretDownIcon
              size={16}
              weight="bold"
              className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              style={{ color: CARET }}
              aria-hidden
            />
          </>
        )
      }}
    />
  )
}
