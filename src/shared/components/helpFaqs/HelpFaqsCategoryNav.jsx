import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { colorMix, colorVar } from '../../../styles/cmsStyle.js'
import { getHelpFaqsIcon } from './icons.jsx'

const HelpFaqsCategoryNav = ({
  categories,
  expandedId,
  topicId,
  onSelectCategory,
  onSelectTopic,
  mobileOpen = false,
  onToggleMobile,
  navLabel = '',
  changeTopic = '',
  iconColor = '700',
  focusColor = 'primary-1',
  activeTabColor,
  focusWashColor = 'secondary-1',
  hasNestedTopics,
}) => {
  const currentCategory =
    categories.find((category) =>
      (category.topics || []).some((topic) => topic.id === topicId),
    ) ||
    categories.find((category) => category.id === topicId) ||
    categories[0]
  const CurrentIcon = getHelpFaqsIcon(currentCategory?.icon)

  const resolvedFocus = focusColor || activeTabColor || 'primary-1'
  const focusCss = colorVar(resolvedFocus)
  const iconCss = colorVar(iconColor)
  const washSoft = colorMix(focusWashColor, 10)
  const washStrong = colorMix(focusWashColor, 15)

  return (
    <nav
      aria-label={navLabel}
      className="bg-background overflow-hidden rounded-[12px] h-fit border border-200 lg:border-0"
    >
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="help-faqs-topic-list"
        onClick={onToggleMobile}
        className="lg:hidden w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-0 cursor-pointer text-start"
      >
        <CurrentIcon
          size={22}
          weight="regular"
          className="shrink-0"
          style={{ color: iconCss }}
        />
        <span
          className={`${typography.body} font-medium flex-1 min-w-0 truncate`}
          style={{ color: colorVar('700') }}
        >
          {currentCategory?.title}
        </span>
        <CaretDown
          size={14}
          weight="bold"
          className={`shrink-0 text-700 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            mobileOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <ul
        id="help-faqs-topic-list"
        className={`${
          mobileOpen ? 'flex border-t border-200' : 'hidden'
        } lg:flex lg:gap-2 lg:border-t-0 list-none m-0 p-0 flex-col max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain lg:max-h-none`}
      >
        {categories.map((category) => {
          const Icon = getHelpFaqsIcon(category.icon)
          const nestedTopics = hasNestedTopics(category)
          const isExpanded = expandedId === category.id
          const isActiveCategory =
            topicId === category.id ||
            (category.topics || []).some((topic) => topic.id === topicId)
          const isHot = isExpanded || (isActiveCategory && !nestedTopics)

          return (
            <li
              key={category.id || category.title}
              style={{ backgroundColor: isHot ? washSoft : 'transparent' }}
            >
              <button
                type="button"
                aria-expanded={nestedTopics ? isExpanded : undefined}
                onClick={() => onSelectCategory(category.id)}
                className="w-full flex items-center gap-2 px-3.5 py-3.5 lg:h-[38px] lg:py-0 border-none cursor-pointer text-start transition-colors"
                style={{ backgroundColor: isHot ? washStrong : 'transparent' }}
                onMouseEnter={(event) => {
                  if (!isHot) {
                    event.currentTarget.style.backgroundColor = washStrong
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isHot) {
                    event.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon
                  size={22}
                  weight="regular"
                  className="shrink-0"
                  style={{ color: iconCss }}
                />
                <span
                  className={`${typography.body} font-medium flex-1 min-w-0`}
                  style={{ color: colorVar('700') }}
                >
                  {category.title}
                </span>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`hidden lg:block shrink-0 text-700 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {nestedTopics && (
                <div
                  className={`hidden lg:grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <ul className="overflow-hidden min-h-0 list-none m-0 flex flex-col p-0 pb-3 pt-1 lg:pb-0 lg:pt-0">
                    {(category.topics || []).map((topic) => {
                      const isActiveTopic = topic.id === topicId

                      return (
                        <li key={topic.id || topic.title}>
                          <button
                            type="button"
                            tabIndex={isExpanded ? 0 : -1}
                            onClick={() =>
                              onSelectTopic(category.id, topic.id, topic.questions || [])
                            }
                            className={`${typography.caption} flex w-full items-center bg-transparent border-none cursor-pointer text-start ps-[50px] pe-3.5 py-2 lg:h-[34px] lg:py-0`}
                            style={{
                              color: isActiveTopic ? focusCss : colorVar('700'),
                              fontWeight: isActiveTopic ? 600 : 500,
                            }}
                            onMouseEnter={(event) => {
                              if (!isActiveTopic) {
                                event.currentTarget.style.color = focusCss
                              }
                            }}
                            onMouseLeave={(event) => {
                              if (!isActiveTopic) {
                                event.currentTarget.style.color = colorVar('700')
                              }
                            }}
                          >
                            {topic.title}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default HelpFaqsCategoryNav
