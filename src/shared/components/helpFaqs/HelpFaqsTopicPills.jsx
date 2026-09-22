import { useEffect, useRef } from 'react'
import { typography } from '../../../styles/typography.js'

/**
 * Small-screen topic switcher: renders the active category's topics as a
 * horizontal, scrollable pill row (matches the mobile Figma design). Hidden on
 * lg+ where the sidebar exposes the same topics inline.
 */
const HelpFaqsTopicPills = ({ topics = [], activeId, onSelect, label }) => {
  const activeRef = useRef(null)

  useEffect(() => {
    const el = activeRef.current
    if (!el) return
    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
    el.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeId])

  if (topics.length < 2) return null

  return (
    <div
      role="tablist"
      aria-label={label}
      className="lg:hidden flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {topics.map((topic) => {
        const isActive = topic.id === activeId

        return (
          <button
            key={topic.id || topic.title}
            ref={isActive ? activeRef : null}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(topic)}
            className={`${typography.caption} m-0 shrink-0 cursor-pointer font-medium rounded-3xl px-4 py-2.5 border text-start transition-colors duration-200 ease-in-out motion-reduce:transition-none ${
              isActive
                ? 'bg-primary-1 text-white border-primary-1'
                : 'bg-background text-700 border-200'
            }`}
          >
            {topic.title}
          </button>
        )
      })}
    </div>
  )
}

export default HelpFaqsTopicPills
