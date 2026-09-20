import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const ContactFormCard = ({
  icon: Icon,
  title,
  description,
  href,
  cardBg = 'background',
  iconBg = '100',
  iconColor = '700',
  cardTitleColor = '700',
  cardTitleFontWeight = 'semibold',
  cardTitleColorHover,
  cardTitleFontWeightHover,
  cardDescriptionColor = '700',
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
    cardDescriptionColorHover,
    cardDescriptionFontWeightHover,
  }

  return (
    <LocalizedLink
      href={href}
      className="rounded-lg p-5 flex flex-col gap-3 no-underline text-inherit"
      style={{ backgroundColor: colorVar(cardBg) }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: colorVar(iconBg), color: colorVar(iconColor) }}
      >
        {Icon && <Icon size={22} weight="regular" />}
      </div>
      <h3
        className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
        style={getTextStyleVars(cardTitleStyleKeys, 'cardTitleColor', '700', 'semibold')}
      >
        {title}
      </h3>
      <div className="flex items-end justify-between gap-3">
        <p
          className={cx(typography.caption, 'm-0 leading-snug flex-1', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(cardDescriptionStyleKeys, 'cardDescriptionColor', '700', 'normal')}
        >
          {description}
        </p>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: colorVar(arrowBg) }}
        >
          <ArrowRight
            size={14}
            weight="bold"
            className="rtl:-scale-x-100"
            style={{ color: colorVar(arrowColor) }}
          />
        </div>
      </div>
    </LocalizedLink>
  )
}

export default ContactFormCard
