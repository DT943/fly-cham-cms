import { useEffect, useRef, useState } from 'react'

// Matches the header's 300ms height transition, plus a frame of layout settle.
const TRANSITION_MS = 340

function useHideOnScroll({ enabled = true, resetKey, threshold = 8, topOffset = 16 } = {}) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const hiddenRef = useRef(false)
  const ignoreUntil = useRef(0)

  useEffect(() => {
    lastY.current = typeof window === 'undefined' ? 0 : window.scrollY
    hiddenRef.current = false
    ignoreUntil.current = 0
    setHidden(false)
  }, [resetKey])

  useEffect(() => {
    if (!enabled) {
      hiddenRef.current = false
      setHidden(false)
      return undefined
    }

    lastY.current = window.scrollY

    const commit = (next) => {
      if (hiddenRef.current === next) return
      hiddenRef.current = next
      // Collapsing the sticky bar changes scroll anchoring. Ignore that
      // adjustment so it cannot immediately reverse the hide state.
      ignoreUntil.current = performance.now() + TRANSITION_MS
      setHidden(next)
    }

    function onScroll() {
      const y = Math.max(0, window.scrollY)

      if (performance.now() < ignoreUntil.current) {
        lastY.current = y
        return
      }

      const delta = y - lastY.current
      lastY.current = y

      if (y <= topOffset) commit(false)
      else if (delta > threshold) commit(true)
      else if (delta < -threshold) commit(false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, threshold, topOffset])

  return hidden
}

export default useHideOnScroll
