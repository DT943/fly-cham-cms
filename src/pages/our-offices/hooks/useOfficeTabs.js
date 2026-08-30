import { useCallback, useId, useRef, useState } from 'react'

function useOfficeTabs(tabIds, defaultId = tabIds[0]) {
  const [activeId, setActiveId] = useState(defaultId)
  const tabRefs = useRef({})
  const baseId = useId()

  const focusTab = useCallback((id) => {
    setActiveId(id)
    tabRefs.current[id]?.focus()
  }, [])

  const onTabKeyDown = useCallback(
    (event, currentId) => {
      const index = tabIds.indexOf(currentId)
      if (index < 0) return

      const isRtl = document.documentElement.dir === 'rtl'
      const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight'
      const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft'

      if (event.key === nextKey) {
        event.preventDefault()
        focusTab(tabIds[(index + 1) % tabIds.length])
        return
      }

      if (event.key === prevKey) {
        event.preventDefault()
        focusTab(tabIds[(index - 1 + tabIds.length) % tabIds.length])
        return
      }

      if (event.key === 'Home') {
        event.preventDefault()
        focusTab(tabIds[0])
        return
      }

      if (event.key === 'End') {
        event.preventDefault()
        focusTab(tabIds[tabIds.length - 1])
      }
    },
    [focusTab, tabIds]
  )

  function tabId(id) {
    return `${baseId}-tab-${id}`
  }

  function panelId(id) {
    return `${baseId}-panel-${id}`
  }

  function setTabRef(id) {
    return (node) => {
      tabRefs.current[id] = node
    }
  }

  return {
    activeId,
    setActiveId,
    onTabKeyDown,
    tabId,
    panelId,
    setTabRef,
  }
}

export default useOfficeTabs
