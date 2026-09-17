import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import shieldIcon from '../../../assets/images/legal/shield-check.svg'
import cookieIcon from '../../../assets/images/legal/cookie.svg'

// The card icon is chosen by the target page it links to (privacy/terms share
// the shield mark; cookies has its own biscuit).
const ICONS = {
  terms: shieldIcon,
  privacy: shieldIcon,
  cookies: cookieIcon,
  beforeYouBook: shieldIcon,
  manageBooking: shieldIcon,
  prepareJourney: shieldIcon,
}

/**
 * A "Get more information" card: a solid blue icon panel on the leading edge and
 * a title / description / arrow link on the other. `id` selects both the icon
 * and the copy (from `legal.cards.<id>`); `href` is the localized destination.
 */
const LegalInfoCard = ({ id, href }) => {
  const { t } = useTranslation()

  return (
    <LocalizedLink
      href={href}
      className="group flex overflow-hidden rounded-2xl bg-50 no-underline shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex w-[92px] shrink-0 items-center justify-center bg-main sm:w-[120px]">
        <img src={ICONS[id]} alt="" className="size-11" />
      </div>
      <div className="flex flex-col gap-2 px-4 py-6">
        <h3 className={`m-0 font-semibold text-primary-1 ${typography.itemTitle} leading-6`}>
          {t(`legal.cards.${id}.title`)}
        </h3>
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.caption}`}>
          {t(`legal.cards.${id}.description`)}
        </p>
        <span className={`mt-1 inline-flex items-center gap-1 font-semibold text-primary-1 ${typography.caption} group-hover:underline`}>
          {t(`legal.cards.${id}.cta`)}
          <span aria-hidden className="rtl:-scale-x-100">→</span>
        </span>
      </div>
    </LocalizedLink>
  )
}

export default LegalInfoCard
