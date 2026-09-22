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
  iconColor = '800',
  focusColor = 'primary-1',
  activeTabColor,
  inactiveTabColor = '800',
  focusWashColor = 'primary-100',
  hasNestedTopics,
}) => {
  const currentCategory =
    categories.find((category) =>
      (category.topics || []).some((topic) => topic.id === topicId),
    ) ||
    categories.find((category) => category.id === topicId) ||
    categories[0]
  const currentTopic =
    (currentCategory?.topics || []).find((topic) => topic.id === topicId) ||
    currentCategory?.topics?.[0] ||
    null
  const CurrentIcon = getHelpFaqsIcon(currentCategory?.icon)
  const currentTopicTitle = currentTopic?.title || ''
  const showTopicHint = currentTopic && currentTopic.id !== currentCategory?.id

  const resolvedFocus = focusColor || activeTabColor || 'primary-1'
  const focusCss = colorVar(resolvedFocus)
  const inactiveCss = colorVar(inactiveTabColor)
  const iconCss = colorVar(iconColor)
  const washSoft = colorMix(focusWashColor, 30)
  const washStrong = colorMix(focusWashColor, 55)

  return (
    <nav
      aria-label={navLabel}
      className="bg-background rounded-xl h-fit lg:sticky lg:top-24"
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
        <span className="flex-1 min-w-0">
          <span
            className={`${typography.body} font-medium block truncate`}
            style={{ color: inactiveCss }}
          >
            {currentCategory?.title}
          </span>
          <span className={`${typography.caption} text-600 block truncate`}>
            {showTopicHint ? currentTopicTitle : changeTopic}
          </span>
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
        } lg:flex lg:border-t-0 list-none m-0 p-0 flex-col max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain lg:max-h-none`}
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
                className="w-full flex items-center gap-3 px-4 py-3.5 border-none cursor-pointer text-start transition-colors"
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
                  style={{ color: inactiveCss }}
                >
                  {category.title}
                </span>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`shrink-0 text-700 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {nestedTopics && (
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <ul className="overflow-hidden min-h-0 list-none m-0 p-0 pb-3 pt-1 flex flex-col">
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
                            className={`${typography.caption} w-full bg-transparent border-none cursor-pointer text-start ps-12 pe-4 py-2`}
                            style={{
                              color: isActiveTopic ? focusCss : inactiveCss,
                              fontWeight: isActiveTopic ? 600 : 400,
                            }}
                            onMouseEnter={(event) => {
                              if (!isActiveTopic) {
                                event.currentTarget.style.color = focusCss
                              }
                            }}
                            onMouseLeave={(event) => {
                              if (!isActiveTopic) {
                                event.currentTarget.style.color = inactiveCss
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
