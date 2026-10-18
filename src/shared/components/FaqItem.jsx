import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const ITEM_RADIUS_CLASS = {
  none: 'md:rounded-none',
  sm: 'md:rounded-lg',
  lg: 'md:rounded-xl',
}

/**
 * Accordion row. On mobile it is a divider row inside the Faqs card; from md
 * it is its own bordered card (desktop look).
 */
const FaqItem = ({
  question,
  answer,
  extra = null,
  itemBg = 'background',
  itemBorderColor = '200',
  itemRadius = 'lg',
  questionColor = '700',
  questionFontWeight = 'medium',
  questionColorHover,
  questionFontWeightHover,
  answerColor = '600',
  answerFontWeight = 'normal',
  answerColorHover,
  answerFontWeightHover,
  iconColor = '700',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const [open, setOpen] = useState(false)
  const buttonId = useId()
  const panelId = useId()

  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const questionStyleKeys = { questionColor, questionFontWeight, questionColorHover, questionFontWeightHover }
  const answerStyleKeys = { answerColor, answerFontWeight, answerColorHover, answerFontWeightHover }
  const radiusClass = ITEM_RADIUS_CLASS[itemRadius] ?? ITEM_RADIUS_CLASS.lg

  const paragraphs = String(answer || '')
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <div
      className={cx(
        // Mobile: bare rows; dividers come from the parent `divide-y`.
        // Desktop: individual bordered cards.
        'md:border md:transition-colors md:duration-200',
        !open && 'md:hover:!bg-100',
        radiusClass,
      )}
      style={{
        backgroundColor: colorVar(itemBg),
        borderColor: colorVar(itemBorderColor),
      }}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={cx(
            typography.itemTitle,
            CMS_TEXT_HOVER_CLASS,
            'w-full bg-transparent border-0 flex items-center justify-between gap-3 cursor-pointer px-0 py-4 md:gap-4 md:px-6 md:py-5 text-start',
          )}
          style={{
            ...getTextStyleVars(questionStyleKeys, 'questionColor', '700', 'medium'),
            ...(open
              ? { color: colorVar('primary-1'), '--cms-hc': colorVar('primary-1') }
              : {}),
          }}
        >
          <span className="min-w-0">
            <LinkedText text={question} {...linkProps} />
          </span>
          <CaretDown
            size={18}
            weight="regular"
            className={cx('shrink-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none', open && 'rotate-180')}
            style={{ color: colorVar(iconColor) }}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cx(
          'grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden min-h-0">
          {(paragraphs.length > 0 || extra) && (
            <div className="flex flex-col gap-3 px-0 pb-4 md:px-6 md:pb-5">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cx(typography.itemDescription, 'm-0 leading-relaxed whitespace-pre-line', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(answerStyleKeys, 'answerColor', '600', 'normal')}
                >
                  <LinkedText text={paragraph} {...linkProps} />
                </p>
              ))}
              {extra}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaqItem
