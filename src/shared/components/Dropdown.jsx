import { useEffect, useId, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Custom listbox dropdown. Replaces native `<select>` so the open menu can
 * follow Fly Cham colours (teal selected row, rounded panel) in every browser.
 *
 * `options` is `{ value, label }[]`. `value` / `onChange` use the option value.
 */
const Dropdown = ({
  id,
  label,
  labelHidden = true,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  className = '',
}) => {
  const generatedId = useId()
  const buttonId = id || generatedId
  const listboxId = `${buttonId}-listbox`
  const labelId = `${buttonId}-label`
  const rootRef = useRef(null)
  const optionRefs = useRef([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const selectIndex = (index) => {
    const option = options[index]
    if (!option) return
    onChange?.(option.value)
    setOpen(false)
  }

  const moveActive = (next) => {
    if (!options.length) return
    setActiveIndex(Math.min(options.length - 1, Math.max(0, next)))
  }

  const handleKeyDown = (event) => {
    if (disabled) return

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        setOpen(true)
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveActive((activeIndex < 0 ? selectedIndex : activeIndex) + 1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive((activeIndex < 0 ? selectedIndex : activeIndex) - 1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      moveActive(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      moveActive(options.length - 1)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectIndex(activeIndex >= 0 ? activeIndex : selectedIndex)
    }
  }

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      {label && !labelHidden && (
        <span
          id={labelId}
          className={`mb-1 block font-medium text-700 ${typography.caption}`}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        id={buttonId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={labelHidden ? label : undefined}
        aria-labelledby={!labelHidden && label ? labelId : undefined}
        onClick={() => !disabled && setOpen((isOpen) => !isOpen)}
        onKeyDown={handleKeyDown}
        className={cx(
          'flex w-full min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border bg-50 px-4 py-3 text-start font-semibold text-700',
          typography.body,
          open ? 'border-primary-1' : 'border-500',
          'focus:border-primary-1 focus:outline-none',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span className="min-w-0 truncate">{selected?.label ?? placeholder}</span>
        <CaretDown
          size={16}
          weight="bold"
          className={cx('shrink-0 text-700 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className="absolute inset-x-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-200 bg-background py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex

            return (
              <li
                key={String(option.value)}
                ref={(node) => {
                  optionRefs.current[index] = node
                }}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectIndex(index)}
                className={cx(
                  'cursor-pointer px-4 py-2.5 font-medium',
                  typography.body,
                  isSelected && 'bg-primary-1 text-50',
                  !isSelected && isActive && 'bg-100 text-700',
                  !isSelected && !isActive && 'bg-background text-700',
                )}
              >
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
