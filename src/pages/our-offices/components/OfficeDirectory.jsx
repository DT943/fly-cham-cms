import { typography } from '../../../styles/typography.js'
import { SECTION_PADDING, CMS_TEXT_HOVER_CLASS, colorVar } from '../../../styles/cmsStyle.js'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'
import OfficeDirectoryList from './OfficeDirectoryList.jsx'
import useOfficeDirectoryTabs from '../hooks/useOfficeDirectoryTabs.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

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
            role="tablist"
            aria-label={tabsLabel || 'Locations'}
            className="flex items-center gap-6 border-b border-200"
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
                  ref={setTabRef(index)}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cx(
                    typography.itemTitle,
                    'm-0 -mb-px cursor-pointer border-0 border-b border-solid bg-transparent px-0 pb-3',
                  )}
                  style={{
                    color: isActive
                      ? colorVar(style.activeTabColor)
                      : colorVar(style.inactiveTabColor),
                    borderColor: isActive ? colorVar(style.activeTabColor) : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <LinkedText text={tab.label} {...linkProps} />
                </button>
              )
            })}
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
