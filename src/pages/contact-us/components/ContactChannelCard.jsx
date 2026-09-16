import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const ContactChannelCard = ({
  icon: Icon,
  title,
  description,
  cta,
  href,
  cardBg = 'background',
  iconBg = '100',
  iconColor = '700',
  cardTitleColor = '700',
  cardTitleFontWeight = 'bold',
  cardTitleColorHover,
  cardTitleFontWeightHover,
  cardDescriptionColor = '600',
  cardDescriptionColorHover,
  cardDescriptionFontWeightHover,
  buttonBg = 'primary-1',
  buttonHoverBg = 'primary-800',
  buttonText = '50',
  buttonTextHover,
  buttonTextFontWeightHover,
}) => {
  const [hovered, setHovered] = useState(false)

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
  const buttonTextStyleKeys = {
    buttonText,
    buttonTextHover,
    buttonTextFontWeightHover,
  }

  return (
    <article
      className="rounded-2xl p-5 flex flex-col gap-4 border border-200 md:border-0 md:p-6 md:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      style={{ backgroundColor: colorVar(cardBg) }}
    >
      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: colorVar(iconBg), color: colorVar(iconColor) }}
        >
          {Icon && <Icon size={22} weight="regular" />}
        </div>
        <h3
          className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(cardTitleStyleKeys, 'cardTitleColor', '700', 'bold')}
        >
          {title}
        </h3>
      </div>
      <p
        className={cx(typography.itemDescription, 'm-0 leading-relaxed flex-1', CMS_TEXT_HOVER_CLASS)}
        style={getTextStyleVars(cardDescriptionStyleKeys, 'cardDescriptionColor', '600', 'normal')}
      >
        {description}
      </p>
      <LocalizedLink
        href={href}
        className={cx(
          typography.button,
          'no-underline rounded-xl px-4 py-3 w-full inline-flex items-center justify-center gap-2 transition-colors',
          CMS_TEXT_HOVER_CLASS,
        )}
        style={{
          ...getTextStyleVars(buttonTextStyleKeys, 'buttonText', '50', 'medium'),
          backgroundColor: hovered ? colorVar(buttonHoverBg) : colorVar(buttonBg),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {cta}
        <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
      </LocalizedLink>
    </article>
  )
}

export default ContactChannelCard
