import { CaretDownIcon, CaretUpIcon, GlobeHemisphereWestIcon } from '@phosphor-icons/react'
import { DismissArea, PopoverPanel } from './controls.jsx'
import { DESKTOP_CURRENCY_TRIGGER, INK, MUTED, SOFT } from './bookingSearchStyle.js'

const CodeBadge = ({ code, accent }) => (
  <span
    className="inline-flex shrink-0 items-center rounded-[4px] px-[6px] py-[2px] text-[11px] font-semibold leading-[normal] tracking-[0.02em] text-white"
    style={{ backgroundColor: accent }}
  >
    {code}
  </span>
)

/** Region flag (same images as the header country picker); Global → globe. */
const Flag = ({ src }) =>
  src ? (
    <img loading="lazy" decoding="async"
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

/**
 * Currency picker for the booking search bottom row (flag + truncated name +
 * code pill). Open menu matches the reference: scrollable list with hover row.
 */
export default function CurrencyField({ s, labels, theme, className = '', triggerClassName = DESKTOP_CURRENCY_TRIGGER }) {
  const open = s.open === 'currency'
  const selected = s.selectedCurrency
  const Caret = open ? CaretUpIcon : CaretDownIcon

  return (
    <DismissArea open={open} onClose={s.close} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={labels.currencyLabel}
        onClick={() => s.toggle('currency')}
        className={triggerClassName}
        style={{
          backgroundColor: theme.fieldBg,
          boxShadow: open ? `inset 0 0 0 1.5px ${theme.accent}` : undefined,
        }}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-[4px] text-start leading-[normal]">
          <span className="text-[12px] leading-[normal]" style={{ color: MUTED }}>
            {labels.currencyLabel}
          </span>
          <span className="flex min-w-0 items-center gap-[8px]">
            <Flag src={selected.flag} />
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[normal]" style={{ color: INK }}>
              {selected.currencyName || selected.currencyCode}
            </span>
            <CodeBadge code={selected.currencyCode} accent={theme.accent} />
          </span>
        </span>
        <Caret size={16} color={SOFT} aria-hidden className="shrink-0" />
      </button>
      {open ? (
        <PopoverPanel className="end-0 w-full min-w-[220px] overflow-hidden p-1" role="listbox" aria-label={labels.currencyLabel}>
          <div className="max-h-[220px] overflow-y-auto overscroll-contain pe-0.5">
            {s.currenciesLoading && s.currencies.length === 0 ? (
              <div className="space-y-1 p-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-md bg-[#f0f0ee]" />
                ))}
              </div>
            ) : (
              s.currencies.map((item) => {
                const code = item.currencyCode
                const active = code === selected.currencyCode
                return (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => s.setCurrency(code)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-[8px] border-0 bg-transparent px-2.5 py-2.5 text-start transition-colors hover:bg-[#e8f3f6]"
                    style={active ? { backgroundColor: '#e8f3f6' } : undefined}
                  >
                    <Flag src={item.flag} />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[normal]" style={{ color: theme.accent }}>
                      {item.currencyName || code}
                    </span>
                    <CodeBadge code={code} accent={theme.accent} />
                  </button>
                )
              })
            )}
          </div>
        </PopoverPanel>
      ) : null}
    </DismissArea>
  )
}
