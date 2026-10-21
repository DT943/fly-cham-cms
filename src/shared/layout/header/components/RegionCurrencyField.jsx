import { useMemo } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Dropdown from '../../../components/Dropdown.jsx'
import useCurrentLanguage from '../../../hooks/useCurrentLanguage.js'
import { useCurrencyOptions } from '../../../booking-search/currencyOptions.js'
import {
  setPreferredCurrency,
  usePreferredCurrency,
} from '../../../booking-search/preferredCurrency.js'
import { posName } from '../../../pos/posList.js'

const FIELD_BG = '#F5F5F4'
const VALUE = '#212529'
const CARET = '#57534E'

/** Menu row: POS name first, its currency code at the end. */
const CurrencyRow = ({ name, code }) => (
  <span className="flex min-w-0 items-center justify-between gap-4 whitespace-nowrap">
    <span>{name}</span>
    <span className="font-semibold">{code}</span>
  </span>
)

/**
 * Header POS-panel currency picker — site `Dropdown`, no flags: the trigger
 * shows the code, each option the POS name then the code.
 */
export default function RegionCurrencyField({ className = '' }) {
  const { t } = useTranslation()
  const lang = useCurrentLanguage()
  const value = usePreferredCurrency()
  const currencies = useCurrencyOptions()

  const options = useMemo(
    () =>
      currencies.map((item) => ({
        value: item.currencyCode,
        label: <CurrencyRow name={posName(item.pos, lang)} code={item.currencyCode} />,
      })),
    [currencies, lang],
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
      renderButton={({ open, selected }) => (
        <>
          <span className="text-[16px] font-medium leading-none tracking-tight">
            {selected?.value || value}
          </span>
          <CaretDownIcon
            size={16}
            weight="bold"
            className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            style={{ color: CARET }}
            aria-hidden
          />
        </>
      )}
    />
  )
}
