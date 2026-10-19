import { useEffect, useId, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Custom listbox dropdown. Replaces native `<select>` so the open menu can
 * follow Fly Cham colours (teal selected row, rounded panel) in every browser.
 *
 * `options` is `{ value, label }[]`. `value` / `onChange` use the option value.
 * Long lists use the same teal scrollbar + end gutter as the airport picker.
 */
const Dropdown = ({
  id,
  name,
  label,
  labelHidden = true,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  className = '',
  buttonClassName = '',
  buttonStyle,
  renderButton,
}) => {
  const generatedId = useId()
  const buttonId = id || generatedId
  const listboxId = `${buttonId}-listbox`
  const labelId = `${buttonId}-label`
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const optionRefs = useRef([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [scrollMetrics, setScrollMetrics] = useState(null)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  useEffect(() => {
    if (!open) return undefined

    const doc = rootRef.current?.ownerDocument || document
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    doc.addEventListener('pointerdown', handlePointerDown)
    return () => doc.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    setActiveIndex(selectedIndex)
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  useEffect(() => {
    if (!open) {
      setScrollMetrics(null)
      return undefined
    }
    const list = listRef.current
    if (!list) return undefined

    const measure = () => {
      setScrollMetrics({
        scrollTop: list.scrollTop,
        clientHeight: list.clientHeight,
        scrollHeight: list.scrollHeight,
      })
    }

    measure()
    list.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [open, options.length])

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

  const showScroll =
    scrollMetrics &&
    scrollMetrics.scrollHeight > scrollMetrics.clientHeight + 1
  const thumbHeight = showScroll
    ? Math.max(
        28,
        (scrollMetrics.clientHeight / scrollMetrics.scrollHeight) *
          scrollMetrics.clientHeight,
      )
    : 0
  const thumbTop = showScroll
    ? (scrollMetrics.scrollTop /
        (scrollMetrics.scrollHeight - scrollMetrics.clientHeight)) *
      (scrollMetrics.clientHeight - thumbHeight)
    : 0

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      {name != null ? <input type="hidden" name={name} value={value ?? ''} /> : null}
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
        style={buttonStyle}
        className={cx(
          'flex w-full min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border bg-50 px-4 py-3 text-start font-normal text-700',
          typography.body,
          open ? 'border-primary-1' : 'border-500',
          'focus:border-primary-1 focus:outline-none',
          disabled && 'cursor-not-allowed opacity-50',
          buttonClassName,
        )}
      >
        {renderButton ? (
          renderButton({ open, selected, placeholder })
        ) : (
          <>
            <span className="min-w-0 truncate">{selected?.label ?? placeholder}</span>
            <CaretDown
              size={16}
              weight="bold"
              className={cx('shrink-0 text-700 transition-transform', open && 'rotate-180')}
              aria-hidden
            />
          </>
        )}
      </button>

      {open ? (
        <div className="absolute inset-x-0 z-30 mt-1 overflow-hidden rounded-lg bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={buttonId}
            // pe-2.5 = gutter so the teal thumb sits beside rows, not on them
            // (same idea as AirportList scrollArea padding-right: 10px).
            className="dropdown-menu-scroll max-h-60 overflow-y-auto py-1 pe-2.5"
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
                    isActive ? 'bg-primary-1 text-50' : 'text-700',
                  )}
                >
                  {option.label}
                </li>
              )
            })}
          </ul>
          {showScroll ? (
            <div
              className="pointer-events-none absolute inset-y-1 end-0.5 w-1.5"
              aria-hidden
            >
              <div
                className="absolute inset-x-0 rounded-full bg-primary-1"
                style={{
                  height: thumbHeight,
                  transform: `translateY(${thumbTop}px)`,
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default Dropdown
