import { useEffect, useRef, useState } from 'react'
import LocalizedLink from '../LocalizedLink.jsx'
import { colorMix } from '../../../styles/cmsStyle.js'

const GAP = 16

const headerOffset = () => {
  const header = document.querySelector('header')
  if (!header) return 0
  return Math.max(0, Math.round(header.getBoundingClientRect().height))
}

/**
 * Align the section just under the header. Subtract the header's current
 * height so the title still lands in that gap after the bar shows or hides.
 */
const scrollToSection = (id) => {
  const target = document.getElementById(id)
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = window.scrollY + target.getBoundingClientRect().top - headerOffset() - GAP
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' })
}

const sectionAtReadingLine = (ids) => {
  const line = headerOffset() + GAP + 24
  let current = ids[0] || ''
  ids.forEach((id) => {
    const target = document.getElementById(id)
    if (target && target.getBoundingClientRect().top <= line) current = id
  })
  return current
}

/**
 * Sticky in-page legal navigation. Section items smooth-scroll to their
 * heading. Page links (no section id) still navigate.
 */
const LegalDocumentNav = ({ items = [], activeId = '' }) => {
  const scrollIds = items.filter((item) => item.id && !item.href).map((item) => item.id)
  const scrollKey = scrollIds.join('|')
  const [currentId, setCurrentId] = useState(activeId || scrollIds[0] || '')
  const scrolling = useRef(false)
  const generation = useRef(0)

  useEffect(() => {
    if (!scrollKey) return undefined
    const ids = scrollKey.split('|').filter(Boolean)

    const sync = () => {
      if (scrolling.current) return
      const nextId = sectionAtReadingLine(ids)
      if (nextId) setCurrentId((prev) => (prev === nextId ? prev : nextId))
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [scrollKey])

  if (!items.length) return null

  const activeWash = colorMix('secondary-1', 15)
  const hoverWash = colorMix('secondary-1', 10)

  const activate = (id) => {
    const gen = generation.current + 1
    generation.current = gen
    scrolling.current = true
    setCurrentId(id)
    scrollToSection(id)

    const release = () => {
      window.setTimeout(() => {
        if (generation.current !== gen) return
        scrolling.current = false
        const nextId = sectionAtReadingLine(scrollKey.split('|').filter(Boolean))
        if (nextId) setCurrentId(nextId)
      }, 380)
    }

    window.addEventListener('scrollend', release, { once: true })
    window.setTimeout(() => {
      if (generation.current === gen && scrolling.current) release()
    }, 1200)
  }

  return (
    <nav className="flex flex-col gap-1 rounded-xl bg-50 py-2">
      {items.map((item, index) => {
        const id = item.id || `nav-${index}`
        const isActive = scrollKey ? id === currentId : Boolean(activeId) && id === activeId
        const className = isActive
          ? 'cursor-pointer border-0 border-s-[3px] border-primary-1 bg-transparent px-4 py-3 text-start text-base font-semibold text-primary-1'
          : 'cursor-pointer rounded-lg border-0 bg-transparent px-4 py-3 text-start text-base font-medium text-800 transition-colors'

        if (!item.href && item.id) {
          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              className={className}
              style={isActive ? { backgroundColor: activeWash } : undefined}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => activate(id)}
              onMouseEnter={(event) => {
                if (!isActive) event.currentTarget.style.backgroundColor = hoverWash
              }}
              onMouseLeave={(event) => {
                if (!isActive) event.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </button>
          )
        }

        if (item.href) {
          return (
            <LocalizedLink
              key={id}
              href={item.href}
              className="rounded-lg px-4 py-3 text-base font-medium text-800 no-underline transition-colors"
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = hoverWash
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </LocalizedLink>
          )
        }

        return (
          <span key={id} className="rounded-lg px-4 py-3 text-base font-medium text-800">
            {item.label}
          </span>
        )
      })}
    </nav>
  )
}

export default LegalDocumentNav
