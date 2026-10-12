import { useEffect, useId, useRef, useState } from 'react'
import { colorVar } from '../../../styles/cmsStyle.js'

/**
 * Small listbox used by the Flight deals origin and class pickers. The trigger
 * markup comes from the caller (`children`); the menu is a white card under it.
 * Closes on outside press, Escape, or a choice.
 */
export default function DealsDropdown({
  label,
  options = [],
  value,
  onChange,
  className = '',
  buttonClassName = '',
  buttonStyle,
  menuClassName = 'start-0',
  children,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        className={`cursor-pointer border-0 ${buttonClassName}`.trim()}
        style={buttonStyle}
      >
        {children}
      </button>
      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label={label}
          className={`absolute top-full z-30 m-0 mt-2 flex min-w-full list-none flex-col rounded-[12px] bg-white p-2 shadow-[0px_8px_24px_rgba(33,37,41,0.12)] ${menuClassName}`}
        >
          {options.map((option) => {
            const selected = option.value === value
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                  className="flex w-full cursor-pointer items-center whitespace-nowrap rounded-lg border-0 bg-transparent px-3 py-2 text-start text-sm leading-[normal] transition-colors hover:bg-[#f5f5f4]"
                  style={{
                    color: colorVar(selected ? 'primary-1' : '700'),
                    fontWeight: selected ? 600 : 500,
                  }}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
