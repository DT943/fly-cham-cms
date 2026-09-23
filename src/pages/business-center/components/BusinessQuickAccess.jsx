import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Headset,
  Newspaper,
  GlobeHemisphereWest,
  Medal,
} from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { businessQuickAccess } from '../utils/businessCenterContent.js'

const ICONS = {
  customerCare: Headset,
  latestNews: Newspaper,
  whereWeFly: GlobeHemisphereWest,
  responsibility: Medal,
}

const QuickAccessCard = ({ id, href }) => {
  const { t } = useTranslation()
  const Icon = ICONS[id]

  return (
    <LocalizedLink
      href={href}
      className="flex min-w-0 flex-col gap-3 rounded-2xl bg-50 p-4 no-underline shadow-[0_4px_16px_rgba(33,37,41,0.06)] transition-shadow hover:shadow-[0_8px_24px_rgba(33,37,41,0.1)] sm:gap-3.5 sm:p-5 lg:flex-row lg:items-center lg:gap-2.5 lg:px-4 lg:py-3.5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F4] text-primary-1">
        {Icon ? <Icon size={20} weight="regular" /> : null}
      </span>

      {/* Mobile: short label under icon */}
      <span className={`font-semibold text-primary-1 lg:hidden ${typography.body}`}>
        {t(`businessCenter.quickAccess.itemsShort.${id}`)}
      </span>

      {/* Desktop: full label + chevron */}
      <span className={`hidden min-w-0 flex-1 font-semibold text-primary-1 lg:inline ${typography.body}`}>
        {t(`businessCenter.quickAccess.items.${id}`)}
      </span>
      <ArrowRight
        size={18}
        weight="bold"
        className="hidden shrink-0 text-primary-1 lg:block rtl:-scale-x-100"
      />
    </LocalizedLink>
  )
}

const BusinessQuickAccess = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-4 py-10 md:gap-5 md:py-14">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
          {t('businessCenter.quickAccess.title')}
        </h2>
        <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3">
          {businessQuickAccess.map((item) => (
            <QuickAccessCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default BusinessQuickAccess
