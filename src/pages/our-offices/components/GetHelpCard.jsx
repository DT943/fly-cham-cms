import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { colorVar, CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * A single Get Help card — the whole card is a link, so its title/description
 * are plain text (no backlinks nested inside an anchor). Colours/weights are
 * CMS-drivable; defaults reproduce the original OurOffices look.
 */
const GetHelpCard = ({
  icon: Icon,
  title,
  description,
  href,
  cardBg = 'background',
  iconColor = '700',
  cardTitleColor = '700',
  cardTitleFontWeight = 'semibold',
  cardTitleColorHover,
  cardTitleFontWeightHover,
  cardDescriptionColor = '800',
  cardDescriptionFontWeight = 'normal',
  cardDescriptionColorHover,
  cardDescriptionFontWeightHover,
  arrowBg = 'primary-1',
  arrowColor = '50',
}) => {
  const cardTitleStyleKeys = {
    cardTitleColor,
    cardTitleFontWeight,
    cardTitleColorHover,
    cardTitleFontWeightHover,
  }
  const cardDescriptionStyleKeys = {
    cardDescriptionColor,
    cardDescriptionFontWeight,
    cardDescriptionColorHover,
    cardDescriptionFontWeightHover,
  }

  return (
    <LocalizedLink
      href={href}
      className="rounded-2xl border border-200 p-5 md:p-6 flex flex-col justify-between gap-6 no-underline text-inherit hover:border-300 transition-colors"
      style={{ backgroundColor: colorVar(cardBg) }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {Icon ? (
            <Icon size={22} weight="regular" className="shrink-0" style={{ color: colorVar(iconColor) }} />
          ) : null}
          <h3
            className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(cardTitleStyleKeys, 'cardTitleColor', '700', 'semibold')}
          >
            {title}
          </h3>
        </div>
        <p
          className={cx(typography.itemDescription, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(cardDescriptionStyleKeys, 'cardDescriptionColor', '800', 'normal')}
        >
          {description}
        </p>
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center self-end shrink-0"
        style={{ backgroundColor: colorVar(arrowBg) }}
      >
        <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" style={{ color: colorVar(arrowColor) }} />
      </div>
    </LocalizedLink>
  )
}

export default GetHelpCard
