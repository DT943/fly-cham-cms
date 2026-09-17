import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * A directory card on the Legal hub: an icon tile, a heading, a short
 * description, and a "View …" link. `id` selects the copy from
 * `legal.hub.cards.<id>`; `Icon` is a Phosphor component; `href` is the
 * localized destination page.
 */
const LegalHubCard = ({ id, Icon, href }) => {
  const { t } = useTranslation()

  return (
    <LocalizedLink
      href={href}
      className="group flex h-full flex-col gap-6 rounded-2xl border border-200 bg-50 p-6 no-underline shadow-sm transition-shadow hover:shadow-md sm:p-8"
    >
      <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-100">
        <Icon size={40} weight="regular" className="text-main" />
      </span>

      <div className="flex flex-1 flex-col gap-3">
        <h2 className={`m-0 font-semibold text-primary-1 ${typography.itemTitle}`}>
          {t(`legal.hub.cards.${id}.title`)}
        </h2>
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>
          {t(`legal.hub.cards.${id}.description`)}
        </p>
      </div>

      <span className={`inline-flex items-center gap-2 font-semibold text-primary-1 ${typography.caption} group-hover:gap-3`}>
        {t(`legal.hub.cards.${id}.cta`)}
        <ArrowRight size={20} weight="bold" className="transition-all rtl:-scale-x-100" />
      </span>
    </LocalizedLink>
  )
}

export default LegalHubCard
