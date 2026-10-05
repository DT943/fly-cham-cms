import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretDown, SealQuestion } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import {
  colorVar,
  CMS_TEXT_HOVER_CLASS,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const ITEM_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
}

const SECTION_PADDING_CLASS = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const TITLE_ALIGN_CLASS = {
  left: 'text-start items-start',
  center: 'text-center items-center',
  right: 'text-end items-end',
}

/** Sidebar category list — mirrors the /faqs FaqCategoryNav (flat categories). */
const CategoryNav = ({ categories, activeIndex, onSelect, mobileOpen, onToggleMobile, iconColor, activeTabColor, inactiveTabColor }) => {
  const { t } = useTranslation()
  const active = categories[activeIndex] || categories[0]

  return (
    <nav
      aria-label={t('faq.explorer.navLabel')}
      className="bg-background rounded-xl  h-fit lg:sticky lg:top-24"
    >
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="faq-category-list"
        onClick={onToggleMobile}
        className="lg:hidden w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-0 cursor-pointer text-start"
      >
        <SealQuestion size={22} weight="regular" className="shrink-0 text-800" style={{ color: colorVar(iconColor) }} />
        <span className="flex-1 min-w-0">
          <span className={cx(typography.body, 'font-medium text-800 block truncate')}>
            {active?.label}
          </span>
          <span className={cx(typography.caption, 'text-600 block truncate')}>
            {t('faq.explorer.changeTopic')}
          </span>
        </span>
        <CaretDown
          size={14}
          weight="bold"
          className={cx(
            'shrink-0 text-700 transition-transform duration-300 ease-in-out motion-reduce:transition-none',
            mobileOpen && 'rotate-180',
          )}
        />
      </button>

      <ul
        id="faq-category-list"
        className={cx(
          mobileOpen ? 'flex border-t border-200' : 'hidden',
          'lg:flex lg:border-t-0 list-none m-0 p-0 flex-col max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain lg:max-h-none',
        )}
      >
        {categories.map((category, index) => {
          const isActive = index === activeIndex
          return (
            <li key={`${category.label}-${index}`} className={isActive ? 'bg-primary-100/30' : 'bg-transparent'}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className={cx(
                  'w-full flex items-center gap-3 px-4 py-3.5 border-none cursor-pointer text-start',
                  isActive ? 'bg-primary-100/55' : 'bg-transparent',
                )}
              >
                <SealQuestion
                  size={22}
                  weight="regular"
                  className="shrink-0 text-800"
                  style={{ color: colorVar(iconColor) }}
                />
                <span
                  className={cx(typography.body, 'font-medium flex-1 min-w-0')}
                  style={{ color: colorVar(isActive ? activeTabColor : inactiveTabColor) }}
                >
                  {category.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** One accordion row — mirrors the /faqs FaqAccordionItem, with backlinks. */
const AccordionItem = ({ item, linkProps, open, onToggle, questionStyleKeys, answerStyleKeys }) => {
  const paragraphs = String(item.answer || '')
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean)
  const hasBody = paragraphs.length > 0

  return (
    <div className="border-b border-200 last:border-b-0 scroll-mt-28">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className={cx(
            typography.itemTitle,
            CMS_TEXT_HOVER_CLASS,
            'w-full bg-transparent border-0 flex items-start justify-between gap-3 md:items-center md:gap-6 cursor-pointer px-4 sm:px-8 md:px-10 py-4 md:py-5 text-start transition-colors duration-300 ease-in-out motion-reduce:transition-none',
          )}
          style={getTextStyleVars(questionStyleKeys, 'questionColor', '800', 'medium')}
        >
          <span className="min-w-0">
            <LinkedText text={item.question} {...linkProps} />
          </span>
          <CaretDown
            size={16}
            weight="bold"
            className={cx(
              'shrink-0 mt-1 md:mt-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none',
              open ? 'rotate-180' : '',
            )}
            style={{ color: open ? colorVar('primary-1') : colorVar('500') }}
          />
        </button>
      </h3>
      <div
        className={cx(
          'grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden min-h-0">
          {hasBody && (
            <div
              className={cx(
                'flex flex-col gap-3 pb-6 transition-opacity duration-300 ease-in-out motion-reduce:transition-none',
                open ? 'opacity-100' : 'opacity-0',
              )}
            >
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cx(
                    typography.itemDescription,
                    'm-0 px-4 sm:px-8 md:px-10 leading-relaxed whitespace-pre-line',
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={getTextStyleVars(answerStyleKeys, 'answerColor', '600', 'normal')}
                >
                  <LinkedText text={paragraph} {...linkProps} />
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * FAQ Explorer — sidebar category nav + topic panel accordion, mirroring the
 * /faqs page design (FaqCategoryNav + FaqTopicPanel + FaqAccordionItem) but
 * driven by CMS content. Colours, weights, per-role hover, and backlinks are
 * CMS-drivable; defaults reproduce the original /faqs look.
 */
const FaqExplorer = ({
  title,
  browseLabel,
  browseHref = '#',
  categories = [],
  showTitle = true,
  showBrowse = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  titleAlign = 'left',
  titleColor = '800',
  titleFontWeight = 'bold',
  titleColorHover,
  titleFontWeightHover,
  activeTabColor = 'primary-1',
  inactiveTabColor = '800',
  showItemBg = true,
  itemBg = 'background',
  itemRadius = 'lg',
  questionColor = '800',
  questionFontWeight = 'medium',
  questionColorHover,
  questionFontWeightHover,
  answerColor = '600',
  answerFontWeight = 'normal',
  answerColorHover,
  answerFontWeightHover,
  iconColor = '800',
  browseBg = 'secondary',
  browseBgHover,
  browseText = 'btn',
  browseTextFontWeight = 'medium',
  browseTextHover,
  browseTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [openIds, setOpenIds] = useState([0])
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (activeIndex >= categories.length) {
      setActiveIndex(0)
      setOpenIds([0])
    }
  }, [categories.length, activeIndex])

  if (!categories.length) return null

  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.default
  const alignClass = TITLE_ALIGN_CLASS[titleAlign] ?? TITLE_ALIGN_CLASS.left
  const panelRadius = ITEM_RADIUS_CLASS[itemRadius] ?? ITEM_RADIUS_CLASS.lg
  const activeCategory = categories[activeIndex] || categories[0]
  const questions = activeCategory?.questions || []
  const visibleAllOpen = questions.length > 0 && questions.every((_, index) => openIds.includes(index))

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const questionStyleKeys = {
    questionColor,
    questionFontWeight,
    questionColorHover,
    questionFontWeightHover,
  }
  const answerStyleKeys = { answerColor, answerFontWeight, answerColorHover, answerFontWeightHover }
  const browseButtonStyle = getButtonStyle(
    {
      browseBg,
      browseBgHover,
      browseText,
      browseTextFontWeight,
      browseTextHover,
      browseTextFontWeightHover,
    },
    {
      bgKey: 'browseBg',
      bgFallback: 'secondary',
      textKey: 'browseText',
      textFallback: 'btn',
      weightFallback: 'medium',
      border: true,
    },
  )

  const selectCategory = (index) => {
    setActiveIndex(index)
    setOpenIds([0])
    setNavOpen(false)
  }

  const toggleQuestion = (index) => {
    setOpenIds((current) =>
      current.includes(index) ? current.filter((id) => id !== index) : [...current, index],
    )
  }

  const toggleAll = () => {
    const ids = questions.map((_, index) => index)
    setOpenIds(visibleAllOpen ? [] : ids)
  }

  return (
    <section
      className={cx(paddingClass, showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col gap-4 md:gap-6">
        {showTitle && title ? (
          <div className={cx('flex flex-col', alignClass)}>
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '800', 'bold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          </div>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-3 md:gap-5 items-stretch lg:items-start">
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <CategoryNav
              categories={categories}
              activeIndex={activeIndex}
              onSelect={selectCategory}
              mobileOpen={navOpen}
              onToggleMobile={() => setNavOpen((open) => !open)}
              iconColor={iconColor}
              activeTabColor={activeTabColor}
              inactiveTabColor={inactiveTabColor}
            />
          </div>

          <section
            className={cx(
              'border py-5 sm:py-6 md:py-8 overflow-hidden flex-1 min-w-0 scroll-mt-28',
              showItemBg ? 'border-200/80 ' : 'border-transparent',
              panelRadius,
            )}
            style={{ backgroundColor: showItemBg ? colorVar(itemBg) : 'transparent' }}
          >
            <div className="flex flex-col">
              <div className="flex flex-col gap-4 px-4 sm:px-8 md:px-10 pb-5 border-b border-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 min-w-0">
                  <h3
                    className={cx(typography.sectionTitle, 'm-0 min-w-0', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(titleStyleKeys, 'titleColor', '800', 'bold')}
                  >
                    {activeCategory?.label}
                  </h3>
                  {questions.length > 0 && (
                    <button
                      type="button"
                      onClick={toggleAll}
                      className={cx(
                        typography.caption,
                        'font-medium text-primary-1 bg-transparent border-none cursor-pointer p-0 shrink-0 self-start',
                      )}
                    >
                      {visibleAllOpen ? t('faq.explorer.closeAll') : t('faq.explorer.openAll')}
                    </button>
                  )}
                </div>
              </div>

              {questions.length === 0 ? (
                <p className={cx(typography.body, 'text-600 m-0 px-4 sm:px-8 md:px-10 pt-5')}>
                  {t('faq.explorer.empty')}
                </p>
              ) : (
                <div>
                  {questions.map((item, index) => (
                    <AccordionItem
                      key={`${activeIndex}-${index}`}
                      item={item}
                      linkProps={linkProps}
                      open={openIds.includes(index)}
                      onToggle={() => toggleQuestion(index)}
                      questionStyleKeys={questionStyleKeys}
                      answerStyleKeys={answerStyleKeys}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {showBrowse && browseLabel ? (
          <div className="flex justify-center pt-1 md:pt-2">
            <LocalizedLink
              href={browseHref === '#' ? undefined : browseHref}
              className={cx(
                typography.button,
                'inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 sm:px-8 font-medium no-underline',
                !browseBgHover && 'hover:opacity-90',
                browseButtonStyle.className,
              )}
              style={browseButtonStyle.style}
            >
              <span>{browseLabel}</span>
            </LocalizedLink>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FaqExplorer
