import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { RADIUS, WEIGHT, colorVar } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const HelpCategoryCard = ({
  icon: Icon,
  title,
  description,
  href,
  showIcon = true,
  showArrow = true,
  showCardBg = true,
  showCardTitle = true,
  showCardDescription = true,
  cardBg = 'background',
  iconBg = '100',
  iconColor = '700',
  arrowBg = 'primary-1',
  arrowColor = '50',
  cardRadius = 'xl',
  cardTitleColor = '700',
  cardTitleFontWeight = 'bold',
  cardDescriptionColor = '600',
}) => {
  const className = cx(
    'flex cursor-pointer flex-row items-center gap-3 border border-200 p-4 no-underline text-inherit',
    'transition-shadow md:min-h-[220px] md:flex-col md:items-stretch md:justify-between md:gap-0 md:border-0',
    'md:shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)]',
    'lg:min-h-[247px]',
    RADIUS[cardRadius] || RADIUS.xl,
  )

  const content = (
    <>
      <div className="flex min-w-0 flex-1 flex-row items-center gap-3 md:flex-col md:items-start md:gap-5">
        {showIcon && Icon && (
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full md:size-11"
            style={{
              backgroundColor: colorVar(iconBg),
              color: colorVar(iconColor),
            }}
          >
            <Icon size={22} weight="regular" />
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1 md:gap-2">
          {showCardTitle && (
            <h3
              className={cx(typography.itemTitle, WEIGHT[cardTitleFontWeight] || 'font-bold', 'm-0')}
              style={{ color: colorVar(cardTitleColor) }}
            >
              {title}
            </h3>
          )}
          {showCardDescription && description && (
            <p
              className={cx(typography.caption, 'm-0 font-normal leading-snug')}
              style={{ color: colorVar(cardDescriptionColor) }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {showArrow && (
        <div className="shrink-0 md:mt-6 md:self-end">
          <div
            className="flex size-8 items-center justify-center rounded-full"
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
      )}
    </>
  )

  const style = showCardBg ? { backgroundColor: colorVar(cardBg) } : undefined

  if (href) {
    return (
      <LocalizedLink href={href} className={className} style={style}>
        {content}
      </LocalizedLink>
    )
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  )
}

export default HelpCategoryCard
