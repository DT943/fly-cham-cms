import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { typography } from '../../../styles/typography.js'
import { SECTION_PADDING, CMS_TEXT_HOVER_CLASS, colorVar } from '../../../styles/cmsStyle.js'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'
import OfficeDirectoryList from './OfficeDirectoryList.jsx'
import useOfficeDirectoryTabs from '../hooks/useOfficeDirectoryTabs.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Source-token defaults so an un-styled call renders like the original design. */
const DEFAULT_OFFICE_DIRECTORY_STYLE = {
  showPin: true,
  showDashedLine: true,
  showWeekend: true,
  showButtons: true,
  showSectionBg: false,
  sectionBg: '100',
  sectionPadding: 'default',
  activeTabColor: 'primary-1',
  inactiveTabColor: '600',
  pinBg: 'secondary-700',
  pinColor: '700',
  lineColor: 'secondary-700',
  nameColor: '700',
  rowColor: '800',
  dividerColor: '200',
  buttonColor: 'primary-1',
  nameFontWeight: 'semibold',
  rowFontWeight: 'normal',
  buttonFontWeight: 'semibold',
  nameColorHover: '700',
  nameFontWeightHover: 'semibold',
  rowColorHover: '800',
  rowFontWeightHover: 'normal',
  buttonColorHover: 'primary-1',
  buttonFontWeightHover: 'semibold',
}

const OfficeDirectory = ({
  tabs = [],
  tabsLabel,
  callLabel,
  emailLabel,
  weekendLabel,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...styleProps
}) => {
  const style = { ...DEFAULT_OFFICE_DIRECTORY_STYLE, ...styleProps }
  const { activeIndex, setActiveIndex, onTabKeyDown, tabId, panelId, setTabRef } =
    useOfficeDirectoryTabs(tabs.length)
  const tablistRef = useRef(null)
  const buttonRefs = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })

  const measureIndicator = useCallback(() => {
    const el = buttonRefs.current[activeIndex]
    if (!el) return
    const left = el.offsetLeft
    const width = el.offsetWidth
    setIndicator((prev) => {
      if (prev.left === left && prev.width === width && prev.ready) return prev
      return { left, width, ready: prev.ready || width > 0 }
    })
  }, [activeIndex])

  useIsoLayoutEffect(() => {
    measureIndicator()
  }, [measureIndicator, tabs.length])

  useEffect(() => {
    const node = tablistRef.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => measureIndicator())
    observer.observe(node)
    return () => observer.disconnect()
  }, [measureIndicator])

  if (!tabs.length) return null

  const showTabs = tabs.length > 1
  const labels = { callLabel, emailLabel, weekendLabel }
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  return (
    <div
      className="w-full"
      style={style.showSectionBg ? { backgroundColor: colorVar(style.sectionBg) } : undefined}
    >
      <section className={cx(SECTION_PADDING[style.sectionPadding] || '')}>
        {showTabs && (
          <div
            ref={tablistRef}
            role="tablist"
            aria-label={tabsLabel || 'Locations'}
            className="relative flex items-center gap-6 border-b border-200"
          >
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={`${tab.label}-${index}`}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={isActive}
                  aria-controls={panelId(index)}
                  tabIndex={isActive ? 0 : -1}
                  ref={(node) => {
                    buttonRefs.current[index] = node
                    setTabRef(index)(node)
                  }}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cx(
                    typography.itemTitle,
                    'm-0 cursor-pointer border-0 bg-transparent px-0 pb-3 transition-colors duration-300',
                  )}
                  style={{
                    color: isActive
                      ? colorVar(style.activeTabColor)
                      : colorVar(style.inactiveTabColor),
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <LinkedText text={tab.label} {...linkProps} />
                </button>
              )
            })}
            <span
              aria-hidden
              className={cx(
                'pointer-events-none absolute bottom-0 z-[1] h-0.5',
                indicator.ready &&
                  'transition-[left,width] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] motion-reduce:transition-none',
              )}
              style={{
                left: indicator.left,
                width: indicator.width,
                backgroundColor: colorVar(style.activeTabColor),
                opacity: indicator.ready ? 1 : 0,
              }}
            />
          </div>
        )}

        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={`${tab.label}-${index}`}
              role="tabpanel"
              id={panelId(index)}
              aria-labelledby={showTabs ? tabId(index) : undefined}
              hidden={!isActive}
              className="pt-4"
            >
              {isActive && (
                <OfficeDirectoryList
                  offices={tab.offices || []}
                  labels={labels}
                  style={style}
                  links={links}
                  showLinks={showLinks}
                  linkProps={linkProps}
                />
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default OfficeDirectory
