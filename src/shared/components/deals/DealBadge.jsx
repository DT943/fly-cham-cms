import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../../styles/cmsStyle.js'
import { formatCountdown, parseEndsAt, useNow } from './countdown.js'
import { DEAL_BADGE_CLASS } from './dealsStyle.js'

/**
 * Photo tag. With a future `endsAt` it shows a live "Ends in …" countdown
 * (ticking on its own so the card does not re-render); once that time has
 * passed the tag hides. Without `endsAt` it shows the static `badge` text.
 * Mirrors cms2 shared/deals/DealBadge.
 */
const DealBadge = ({
  variant = 'flight',
  badge = '',
  endsAt = '',
  endsInLabel = '',
  lang = 'en',
  textStyle = {},
  bgFallback = 'secondary-100',
  textFallback = '700',
}) => {
  const end = parseEndsAt(endsAt)
  const now = useNow(end !== null)
  let text = badge
  if (end !== null) {
    const left = formatCountdown(end - now, lang)
    text = left ? [endsInLabel, left].filter(Boolean).join(' ') : ''
  }
  if (!text) return null

  return (
    <span
      className={`${DEAL_BADGE_CLASS[variant] || DEAL_BADGE_CLASS.flight} whitespace-nowrap ${CMS_TEXT_HOVER_CLASS}`}
      style={{
        backgroundColor: colorVar(textStyle.badgeBg || bgFallback),
        ...getTextStyleVars(textStyle, 'badgeText', textFallback, 'medium'),
      }}
    >
      {text}
    </span>
  )
}

export default DealBadge
