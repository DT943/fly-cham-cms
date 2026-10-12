import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { colorVar } from '../../styles/cmsStyle.js'
import useHelpFaqs from './helpFaqs/useHelpFaqs.js'
import HelpFaqsCategoryNav from './helpFaqs/HelpFaqsCategoryNav.jsx'
import HelpFaqsTopicPills from './helpFaqs/HelpFaqsTopicPills.jsx'
import HelpFaqsTopicPanel from './helpFaqs/HelpFaqsTopicPanel.jsx'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Nested Help FAQs explorer: category sidebar, topic panel, accordion, optional
 * payment-method tabs, and fare/baggage table extras. Defaults match the static
 * /help/faqs explorer.
 */
const HelpFaqs = ({
  categories = [],
  navLabel = '',
  changeTopic = '',
  openAll = '',
  closeAll = '',
  empty = '',
  language = 'en',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  iconColor = '700',
  focusColor = 'primary-1',
  activeTabColor,
  inactiveTabColor = '700',
  focusWashColor = 'secondary-1',
  links = [],
  showLinks = true,
  titleColor = '800',
  titleFontWeight = 'bold',
  titleColorHover,
  titleFontWeightHover,
  questionColor = '800',
  questionFontWeight = 'medium',
  questionColorHover,
  questionFontWeightHover,
  answerColor = '600',
  answerFontWeight = 'normal',
  answerColorHover,
  answerFontWeightHover,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const explorer = useHelpFaqs(categories)
  const [navOpen, setNavOpen] = useState(false)
  const closeMobileNav = () => setNavOpen(false)
  const { t } = useTranslation()
  // The open label must differ from the close label. A saved copy of the close
  // text (or a blank field) falls back to "Open all Questions".
  const openLabel = String(openAll || '').trim()
  const closeLabel = String(closeAll || '').trim()
  const resolvedOpenAll =
    openLabel && openLabel !== closeLabel ? openLabel : t('faq.explorer.openAll')
  const resolvedCloseAll = closeLabel || t('faq.explorer.closeAll')

  const resolvedFocus = focusColor || activeTabColor || 'primary-1'

  const style = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
    questionColor,
    questionFontWeight,
    questionColorHover,
    questionFontWeightHover,
    answerColor,
    answerFontWeight,
    answerColorHover,
    answerFontWeightHover,
    showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const handleSelectCategory = (id) => {
    explorer.selectCategory(id)
    // Topics are switched via the mobile pill row, so the dropdown only
    // needs to pick a category — close it once one is chosen.
    closeMobileNav()
  }

  const handleSelectTopic = (categoryId, nextTopicId, nextQuestions = []) => {
    explorer.selectTopic(categoryId, nextTopicId, nextQuestions)
    closeMobileNav()
  }

  const sectionRef = useRef(null)
  const navStickyRef = useRef(null)
  const navScrollRef = useRef(null)

  // Keep the whole category box under the live header. Do not cap its height:
  // a max-height clips the last categories.
  useEffect(() => {
    const section = sectionRef.current
    const box = navStickyRef.current
    const scroller = navScrollRef.current
    if (!section || !box || !scroller) return undefined

    const header = document.querySelector('header')
    const desktop = window.matchMedia('(min-width: 1024px)')

    const place = () => {
      if (!desktop.matches) {
        box.style.top = ''
        scroller.style.maxHeight = ''
        scroller.style.overflowY = ''
        return
      }
      const headerBottom = header
        ? Math.max(0, Math.round(header.getBoundingClientRect().bottom))
        : 0
      const minTop = headerBottom + 12
      box.style.top = `${minTop}px`
      const available = window.innerHeight - minTop - 8
      if (scroller.scrollHeight > available + 1) {
        scroller.style.maxHeight = `${Math.floor(available)}px`
        scroller.style.overflowY = 'auto'
      } else {
        scroller.style.maxHeight = ''
        scroller.style.overflowY = 'visible'
      }
    }

    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    desktop.addEventListener('change', place)
    const observer = header ? new ResizeObserver(place) : null
    if (header && observer) observer.observe(header)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
      desktop.removeEventListener('change', place)
      observer?.disconnect()
    }
  }, [explorer.category?.id])

  if (!categories.length || !explorer.category) return null

  return (
    <section
      ref={sectionRef}
      className={cx(SECTION_PADDING[sectionPadding] ?? SECTION_PADDING.default)}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col lg:flex-row gap-3 md:gap-5 items-stretch">
        <div className="w-full shrink-0 self-stretch lg:w-[252px]">
          <div ref={navStickyRef} className="lg:sticky lg:top-24 lg:z-10">
            <div ref={navScrollRef} className="flex flex-col gap-3">
              <HelpFaqsCategoryNav
                categories={explorer.categories}
                expandedId={explorer.expandedId}
                topicId={explorer.topicId}
                onSelectCategory={handleSelectCategory}
                onSelectTopic={handleSelectTopic}
                mobileOpen={navOpen}
                onToggleMobile={() => setNavOpen((open) => !open)}
                navLabel={navLabel}
                changeTopic={changeTopic}
                iconColor={iconColor}
                focusColor={resolvedFocus}
                inactiveTabColor={inactiveTabColor}
                focusWashColor={focusWashColor}
                hasNestedTopics={explorer.hasNestedTopics}
              />
              {explorer.hasNestedTopics(explorer.category) && (
                <HelpFaqsTopicPills
                  topics={explorer.category.topics || []}
                  activeId={explorer.topicId}
                  onSelect={(topic) =>
                    handleSelectTopic(
                      explorer.category.id,
                      topic.id,
                      topic.questions || [],
                    )
                  }
                  label={explorer.category.title}
                />
              )}
            </div>
          </div>
        </div>
        <HelpFaqsTopicPanel
          category={explorer.category}
          topic={explorer.topic}
          questions={explorer.questions}
          openIds={explorer.openIds}
          onToggleQuestion={explorer.toggleQuestion}
          onToggleAll={explorer.toggleAll}
          onFocusQuestion={explorer.focusQuestion}
          focusQuestionId={explorer.focusQuestionId}
          openAll={resolvedOpenAll}
          closeAll={resolvedCloseAll}
          empty={empty}
          language={language}
          links={links}
          showLinks={showLinks}
          style={style}
        />
      </div>
    </section>
  )
}

export default HelpFaqs
