import { useTranslation } from 'react-i18next'
import {
  CaretRight,
  Headset,
  NewspaperClipping,
  GlobeSimple,
  MedalMilitary,
} from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { businessQuickAccess } from '../utils/businessCenterContent.js'

const ICONS = {
  customerCare: Headset,
  latestNews: NewspaperClipping,
  whereWeFly: GlobeSimple,
  responsibility: MedalMilitary,
}

/** Figma 39658:414 — white card, 40px icon holder, primary label, 16px chevron. */
const QuickAccessCard = ({ id, href }) => {
  const { t } = useTranslation()
  const Icon = ICONS[id]

  return (
    <LocalizedLink
      href={href}
      className="flex min-w-0 flex-col gap-3 rounded-lg bg-50 p-4 no-underline transition-shadow hover:shadow-[0_8px_24px_rgba(33,37,41,0.08)] sm:p-5 lg:min-h-[102px] lg:flex-row lg:items-center lg:gap-4 lg:p-5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-100 text-primary-1">
        {Icon ? <Icon size={24} weight="regular" /> : null}
      </span>

      {/* Mobile: short label under icon */}
      <span className={`font-semibold leading-[normal] text-primary-1 lg:hidden ${typography.body}`}>
        {t(`businessCenter.quickAccess.itemsShort.${id}`)}
      </span>

      {/* Desktop: full label + chevron */}
      <span className="hidden min-w-0 flex-1 text-base font-semibold leading-[normal] text-primary-1 lg:inline">
        {t(`businessCenter.quickAccess.items.${id}`)}
      </span>
      <CaretRight
        size={16}
        weight="regular"
        className="hidden shrink-0 text-primary-1 lg:block rtl:-scale-x-100"
      />
    </LocalizedLink>
  )
}

const BusinessQuickAccess = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-4 py-10 md:gap-6 md:py-14">
        <h2 className={`m-0 font-semibold leading-[normal] text-700 ${typography.sectionTitle} lg:text-[28px]`}>
          {t('businessCenter.quickAccess.title')}
        </h2>
        <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {businessQuickAccess.map((item) => (
            <QuickAccessCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default BusinessQuickAccess
