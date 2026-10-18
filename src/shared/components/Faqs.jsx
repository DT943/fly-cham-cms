import { typography } from '../../styles/typography.js'
import {
  ALIGN,
  SECTION_PADDING,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import SearchAnchor from '../search/components/SearchAnchor.jsx'
import FaqItem from './FaqItem.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const ITEM_GAP = {
  tight: 'md:gap-2 lg:gap-3',
  default: 'md:gap-3 lg:gap-4',
  loose: 'md:gap-4 lg:gap-6',
}

/**
 * FAQ list + optional browse CTA.
 * Mobile: one white rounded card (title, divider rows, centered button) —
 * matches the travel-page Figma. Desktop: separate bordered accordion cards.
 */
const Faqs = ({
  title,
  items = [],
  browseLabel,
  browseHref = '#',
  showTitle = true,
  showBrowse = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  itemGap = 'default',
  titleAlign = 'left',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  browseBg = 'secondary',
  browseHoverBg,
  browseText = 'btn',
  browseTextFontWeight = 'semibold',
  browseTextHover,
  browseTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...itemStyle
}) => {
  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const browseButtonStyle = getButtonStyle(
    { browseBg, browseHoverBg, browseText, browseTextFontWeight, browseTextHover, browseTextFontWeightHover },
    {
      bgKey: 'browseBg',
      bgHoverKey: 'browseHoverBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'browseText',
      textFallback: 'btn',
      weightFallback: 'semibold',
    },
  )
  const gapClass = ITEM_GAP[itemGap] || ITEM_GAP.default

  return (
    <section
      className={cx(SECTION_PADDING[sectionPadding], showSectionBg && 'md:rounded-2xl md:px-4 lg:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {/* Mobile = single white card; md+ = flat stack of cards */}
      <div
        className={cx(
          'flex flex-col gap-4 rounded-xl bg-white px-5 py-5',
          'md:gap-6 md:rounded-none md:bg-transparent md:px-0 md:py-0',
        )}
      >
        {showTitle && title && (
          <div className={cx('flex flex-col', ALIGN[titleAlign])}>
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          </div>
        )}
        <div className={cx('flex flex-col gap-0 divide-y divide-200 md:divide-y-0', gapClass)}>
          {items.map((item, index) => {
            const faqItem = (
              <FaqItem
                question={item.question}
                answer={item.answer}
                extra={item.extra}
                links={links}
                showLinks={showLinks}
                linkColor={linkColor}
                linkHoverColor={linkHoverColor}
                linkFontWeight={linkFontWeight}
                linkUnderline={linkUnderline}
                linkItalic={linkItalic}
                {...itemStyle}
              />
            )

            if (!item.hit) {
              return <div key={item.id || index}>{faqItem}</div>
            }

            return (
              <SearchAnchor key={item.id || index} hit={item.hit}>
                {faqItem}
              </SearchAnchor>
            )
          })}
        </div>
        {showBrowse && browseLabel && (
          <div className="flex justify-center pt-1 md:pt-2">
            <LocalizedLink
              href={browseHref}
              className={cx(
                typography.button,
                'no-underline rounded-lg px-8 py-3 md:px-10 md:py-3.5',
                browseButtonStyle.className,
              )}
              style={browseButtonStyle.style}
            >
              {browseLabel}
            </LocalizedLink>
          </div>
        )}
      </div>
    </section>
  )
}

export default Faqs
