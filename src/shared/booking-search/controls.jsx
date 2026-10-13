import { useEffect, useRef } from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { MUTED, SOFT } from './bookingSearchStyle.js'

/** Desktop radio — Material 24px control (20px ring, 10px dot). */
export const DesktopRadio = ({ checked, color }) => (
  <span aria-hidden className="relative flex size-6 shrink-0 items-center justify-center">
    <span
      className="flex size-5 items-center justify-center rounded-full border-2 border-solid"
      style={{ borderColor: checked ? color : SOFT }}
    >
      {checked ? <span className="size-[10px] rounded-full" style={{ backgroundColor: color }} /> : null}
    </span>
  </span>
)

/** Mobile radio — 16px ring (1.5px) with an 8px dot. */
export const MobileRadio = ({ checked, color }) => (
  <span
    aria-hidden
    className="flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid"
    style={{ borderColor: checked ? color : MUTED }}
  >
    {checked ? <span className="size-2 rounded-full" style={{ backgroundColor: color }} /> : null}
  </span>
)

/** iOS-style switch from the Figma (37 × 22.49). */
export const Toggle = ({ on, color }) => (
  <span
    aria-hidden
    className="relative block h-[22.49px] w-[37px] shrink-0 overflow-hidden rounded-[72.549px] transition-colors"
    style={{ backgroundColor: on ? color : 'rgba(120,120,128,0.16)' }}
  >
    <span
      className="absolute bottom-[6.45%] top-[6.45%] w-[19.588px] rounded-[72.549px] bg-white shadow-[0px_0px_0px_0px_rgba(0,0,0,0.04),0px_2.176px_5.804px_0px_rgba(0,0,0,0.15),0px_2.176px_0.725px_0px_rgba(0,0,0,0.06)] transition-[inset-inline-start] duration-200"
      style={{ insetInlineStart: on ? 'calc(100% - 21.038px)' : '1.45px' }}
    />
  </span>
)

/** 20px checkbox (accent fill + white tick when checked). */
export const Checkbox = ({ checked, color }) => (
  <span
    aria-hidden
    className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-solid"
    style={checked ? { backgroundColor: color, borderColor: color } : { backgroundColor: '#fff', borderColor: '#d2d5da' }}
  >
    {checked ? <CheckIcon size={16} weight="bold" color="#fff" /> : null}
  </span>
)

/** Close an open popover on an outside press or Escape. */
export const useDismiss = (open, rootRef, onClose) => {
  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) onClose()
    }
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, rootRef, onClose])
}

/** Wrapper for a trigger + its panel: closes the panel on an outside press / Escape. */
export const DismissArea = ({ open, onClose, className = '', children }) => {
  const ref = useRef(null)
  useDismiss(open, ref, onClose)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** White floating panel under a field. */
export const PopoverPanel = ({ className = '', children, ...props }) => (
  <div
    className={`absolute top-[calc(100%+8px)] z-40 rounded-[12px] bg-white shadow-[0px_8px_24px_rgba(33,37,41,0.16)] ${className}`}
    {...props}
  >
    {children}
  </div>
)
