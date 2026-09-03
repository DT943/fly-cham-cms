import { useEffect, useRef, useState } from 'react'

function useHideOnScroll({ enabled = true, resetKey, threshold = 8, topOffset = 16 } = {}) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = typeof window === 'undefined' ? 0 : window.scrollY
    setHidden(false)
  }, [resetKey])

  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return undefined
    }

    lastY.current = window.scrollY

    function onScroll() {
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY.current

      if (y <= topOffset) {
        setHidden(false)
      } else if (delta > threshold) {
        setHidden(true)
      } else if (delta < -threshold) {
        setHidden(false)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, threshold, topOffset])

  return hidden
}

export default useHideOnScroll
