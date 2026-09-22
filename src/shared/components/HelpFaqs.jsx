import { useState } from 'react'
import { colorVar } from '../../styles/cmsStyle.js'
import useHelpFaqs from './helpFaqs/useHelpFaqs.js'
import HelpFaqsCategoryNav from './helpFaqs/HelpFaqsCategoryNav.jsx'
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
  iconColor = '800',
  focusColor = 'primary-1',
  activeTabColor,
  inactiveTabColor = '800',
  focusWashColor = 'primary-100',
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
    const next = categories.find((item) => item.id === id)
    const collapsing = explorer.expandedId === id
    explorer.selectCategory(id)
    if (next && !explorer.hasNestedTopics(next) && !collapsing) closeMobileNav()
  }

  const handleSelectTopic = (categoryId, nextTopicId, nextQuestions = []) => {
    explorer.selectTopic(categoryId, nextTopicId, nextQuestions)
    closeMobileNav()
  }

  if (!categories.length || !explorer.category) return null

  return (
    <section
      className={cx(SECTION_PADDING[sectionPadding] ?? SECTION_PADDING.default)}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col lg:flex-row gap-3 md:gap-5 items-stretch lg:items-start">
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
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
          openAll={openAll}
          closeAll={closeAll}
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
