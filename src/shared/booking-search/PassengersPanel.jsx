import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { INK, MUTED } from './bookingSearchStyle.js'

const MAX_TOTAL = 9

/** "1 Adult" / "2 Adults, 1 Child" for the passengers field. */
export const passengerSummary = (guests, labels) => {
  const parts = []
  const add = (count, one, many) => {
    if (count > 0) parts.push(`${count} ${count === 1 ? one : many}`)
  }
  add(guests.adults, labels.adultSingular, labels.adultPlural)
  add(guests.children, labels.childSingular, labels.childPlural)
  add(Number(guests.infants || 0) + Number(guests.infantsWithSeat || 0), labels.infantSingular, labels.infantPlural)
  return parts.join(', ')
}

const Stepper = ({ value, onMinus, onPlus, minusDisabled, plusDisabled, accent, label }) => {
  const button = 'flex size-8 cursor-pointer items-center justify-center rounded-full border border-solid bg-white p-0 transition-opacity disabled:cursor-default disabled:opacity-30'
  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label={`- ${label}`} disabled={minusDisabled} onClick={onMinus} className={button} style={{ borderColor: accent, color: accent }}>
        <MinusIcon size={14} weight="bold" aria-hidden />
      </button>
      <span className="w-5 text-center text-base font-semibold leading-[normal]" style={{ color: INK }}>{value}</span>
      <button type="button" aria-label={`+ ${label}`} disabled={plusDisabled} onClick={onPlus} className={button} style={{ borderColor: accent, color: accent }}>
        <PlusIcon size={14} weight="bold" aria-hidden />
      </button>
    </div>
  )
}

/**
 * Passenger counts + cabin class. Counts go through the booking engine's
 * guests reducer (max 9 travellers, at least 1 adult, infants ≤ adults).
 */
const PassengersPanel = ({ guests, changeGuestCount, setCabinClass, labels, accent, onDone }) => {
  const infants = Number(guests.infants || 0) + Number(guests.infantsWithSeat || 0)
  const total = guests.adults + guests.children + infants
  const full = total >= MAX_TOTAL
  const rows = [
    { key: 'adults', label: labels.adultPlural, hint: labels.adultsHint, min: 1, plusDisabled: full },
    { key: 'children', label: labels.childPlural, hint: labels.childrenHint, min: 0, plusDisabled: full },
    { key: 'infants', label: labels.infantPlural, hint: labels.infantsHint, min: 0, plusDisabled: full || infants >= guests.adults },
  ]
  const cabins = [
    { value: 'Economy', label: labels.economyLabel },
    { value: 'Business', label: labels.businessLabel },
  ]

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-[normal]" style={{ color: INK }}>{row.label}</span>
            <span className="mt-0.5 block text-xs leading-[normal]" style={{ color: MUTED }}>{row.hint}</span>
          </span>
          <Stepper
            value={Number(guests[row.key] || 0)}
            label={row.label}
            accent={accent}
            minusDisabled={Number(guests[row.key] || 0) <= row.min}
            plusDisabled={row.plusDisabled}
            onMinus={() => changeGuestCount(row.key, -1)}
            onPlus={() => changeGuestCount(row.key, 1)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2 border-0 border-t border-solid border-[#e5e5e3] pt-4">
        <span className="text-xs leading-[normal]" style={{ color: MUTED }}>{labels.classLabel}</span>
        <div className="flex gap-1 rounded-[8px] bg-[#f5f5f4] p-1" role="radiogroup" aria-label={labels.classLabel}>
          {cabins.map((cabin) => {
            const active = guests.cabinClass === cabin.value
            return (
              <button
                key={cabin.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCabinClass(cabin.value)}
                className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[6px] border-0 text-sm leading-[normal] transition-colors"
                style={active
                  ? { backgroundColor: accent, color: '#fff', fontWeight: 600 }
                  : { backgroundColor: 'transparent', color: accent, fontWeight: 500 }}
              >
                {cabin.label}
              </button>
            )
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="h-10 cursor-pointer rounded-[8px] border-0 text-sm font-semibold leading-[normal] text-white"
        style={{ backgroundColor: accent }}
      >
        {labels.doneLabel}
      </button>
    </div>
  )
}

export default PassengersPanel
