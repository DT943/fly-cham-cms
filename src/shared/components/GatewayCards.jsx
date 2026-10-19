import { useState } from 'react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import Dropdown from './Dropdown.jsx'
import { GATEWAY_POS_OPTIONS, cardMatchesPos, posLabel } from './gatewayPos.js'

const COLUMNS_CLASS = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const DESCRIPTION_SIZE = 'text-sm leading-normal md:text-base'
const CARD_TITLE_SIZE = 'text-[22px] leading-[22px]'
const CARD_DESCRIPTION_SIZE = 'text-sm leading-[1.4]'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Logo grid for payment gateways (Figma 40502:24283): optional title +
 * description over white cards, each a centered logo, title, and optional
 * card description.
 */
const GatewayCards = ({
  title = '',
  description = '',
  items = [],
  columns = '4',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showHeader = true,
  showDescription = true,
  showCardLogo = true,
  showCardTitle = true,
  showCardDescription = true,
  cardBg = 'background',
  links = [],
  filterByPos = false,
  posLabels = {},
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const language = useCurrentLanguage()
  const [pos, setPos] = useState('all')
  const list = items.filter((item) => item?.title || item?.imageUrl)
  const visible = list.filter((item) => cardMatchesPos(item, pos, filterByPos))
  const posOptions = GATEWAY_POS_OPTIONS.map((option) => ({
    value: option.value,
    label: posLabel(option.value, language, posLabels),
  }))
  const headerOn = showHeader !== false
  const descriptionOn = showDescription !== false
  const logoOn = showCardLogo !== false
  const cardTitleOn = showCardTitle !== false
  const cardDescriptionOn = showCardDescription !== false
  const headerVisible =
    (headerOn && (title || (descriptionOn && description))) || filterByPos
  if (!title && !description && !list.length) return null

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
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '', showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex min-w-0 flex-col gap-6">
        {headerVisible ? (
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {headerOn && title ? (
                <h2
                  className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : (
                <span />
              )}
              {filterByPos ? (
                <Dropdown
                  label={language === 'ar' ? 'نقطة البيع' : 'Point of sale'}
                  value={pos}
                  onChange={setPos}
                  options={posOptions}
                  className="w-full sm:w-[220px]"
                />
              ) : null}
            </div>
            {headerOn && descriptionOn && description ? (
              <p
                className={cx('m-0 max-w-3xl', DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}
        {visible.length ? (
          <div className={cx('grid min-w-0 items-stretch gap-[19px]', COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[4])}>
            {visible.map((item, index) => {
              const body = (
                <>
                  {logoOn && item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || ''}
                      className="h-[75px] w-auto max-w-[168px] object-contain"
                    />
                  ) : null}
                  {cardTitleOn || cardDescriptionOn ? (
                    <div className="flex w-full flex-col gap-2.5 text-center">
                      {cardTitleOn && item.title ? (
                        <h3
                          className={cx('m-0', CARD_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                          style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'medium')}
                        >
                          {item.href ? item.title : <LinkedText text={item.title} {...linkProps} />}
                        </h3>
                      ) : null}
                      {cardDescriptionOn && item.description ? (
                        <p
                          className={cx('m-0', CARD_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                          style={getTextStyleVars(textStyle, 'cardDescriptionColor', '800', 'normal')}
                        >
                          {item.href ? item.description : <LinkedText text={item.description} {...linkProps} />}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )
              const className = 'flex h-full min-w-0 flex-col items-center justify-center gap-4 rounded-xl px-3.5 pb-6 pt-7'
              const cardStyle = { backgroundColor: colorVar(cardBg) }
              return item.href ? (
                <LocalizedLink
                  key={item.id || index}
                  href={item.href}
                  className={cx(className, 'no-underline')}
                  style={cardStyle}
                >
                  {body}
                </LocalizedLink>
              ) : (
                <article key={item.id || index} className={className} style={cardStyle}>
                  {body}
                </article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default GatewayCards
