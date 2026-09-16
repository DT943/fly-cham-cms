import { CaretRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { getLinkHref } from '../utils/links.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const JourneyStep = ({
  icon: Icon,
  stepLabel,
  links = [],
  showIcon = true,
  showTitle = true,
  iconBg = '100',
  iconColor = '700',
  linkColor = 'primary-1',
  linkColorHover,
  linkFontWeightHover,
  stepTitleColor = '700',
  stepTitleFontWeight = 'semibold',
  stepTitleColorHover,
  stepTitleFontWeightHover,
}) => {
  const stepTitleStyleKeys = {
    stepTitleColor,
    stepTitleFontWeight,
    stepTitleColorHover,
    stepTitleFontWeightHover,
  }
  const linkStyleKeys = {
    linkColor,
    linkColorHover,
    linkFontWeightHover,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {showIcon && Icon && (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: colorVar(iconBg),
              color: colorVar(iconColor),
            }}
          >
            <Icon size={20} weight="regular" />
          </div>
        )}
        {showTitle && stepLabel && (
          <span
            className={cx(typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(stepTitleStyleKeys, 'stepTitleColor', '700', 'semibold')}
          >
            {stepLabel}
          </span>
        )}
      </div>
      <ul
        className={cx(
          'list-none m-0 flex flex-col gap-2.5 md:gap-3',
          showIcon ? 'ps-[52px]' : '',
        )}
      >
        {links.map((link) => (
          <li key={link.text}>
            <LocalizedLink
              href={getLinkHref(link)}
              className={cx(
                typography.itemDescription,
                'no-underline hover:underline inline-flex items-center gap-1',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(linkStyleKeys, 'linkColor', 'primary-1', 'medium')}
            >
              {link.text}
              <CaretRight size={12} weight="bold" className="flex-shrink-0 rtl:-scale-x-100" />
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JourneyStep
