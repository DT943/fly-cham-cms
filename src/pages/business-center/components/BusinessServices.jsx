import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { businessServices } from '../utils/businessCenterContent.js'

const ServiceCopy = ({ id, gapClass = 'gap-2' }) => {
  const { t } = useTranslation()

  return (
    <div className={`flex min-w-0 flex-col ${gapClass}`}>
      <h3 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>
        {t(`businessCenter.services.${id}.title`)}
      </h3>
      <p className={`m-0 font-normal leading-relaxed text-600 ${typography.caption}`}>
        {t(`businessCenter.services.${id}.description`)}
      </p>
    </div>
  )
}

/** Mobile (< lg): image on top, content below, Learn more with arrow on the far end. */
const ServiceStackCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={image}
          alt={t(`businessCenter.services.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <ServiceCopy id={id} gapClass="gap-2" />
        <LocalizedLink
          href={href}
          className={`mt-2 inline-flex w-full items-center justify-between gap-3 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t('businessCenter.services.learnMore')}
          <ArrowRight size={16} weight="bold" className="shrink-0 rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

/** Desktop row card (right column). */
const ServiceRowCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="grid min-h-36 min-w-0 flex-1 grid-cols-2 overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="min-h-0 min-w-0 overflow-hidden">
        <img
          src={image}
          alt={t(`businessCenter.services.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col p-5">
        <ServiceCopy id={id} />
        <LocalizedLink
          href={href}
          className={`mt-auto inline-flex w-fit items-center gap-1.5 pt-4 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t(`businessCenter.services.${id}.cta`)}
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

/** Desktop featured: vertical 50/50 image + content. */
const FeaturedServiceCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <img
          src={image}
          alt={t(`businessCenter.services.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">
        <ServiceCopy id={id} gapClass="gap-3" />
        <LocalizedLink
          href={href}
          className={`mt-auto inline-flex w-fit items-center gap-1.5 pt-6 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t(`businessCenter.services.${id}.cta`)}
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

const BusinessServices = () => {
  const { t } = useTranslation()
  const { featured, cards } = businessServices
  const allCards = [featured, ...cards]

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-6 py-10 md:gap-8 md:py-14">
        <div className="flex max-w-3xl flex-col gap-2 md:gap-3">
          <h2 className={`m-0 font-semibold break-words text-700 ${typography.sectionTitle} lg:text-[32px]`}>
            {t('businessCenter.services.title')}
          </h2>
          <p className={`m-0 font-normal leading-relaxed break-words text-600 ${typography.sectionDescription}`}>
            {t('businessCenter.services.description')}
          </p>
        </div>

        {/* < lg: stacked cards — full-width image on top */}
        <div className="flex min-w-0 flex-col gap-4 lg:hidden">
          {allCards.map((card) => (
            <ServiceStackCard key={card.id} {...card} />
          ))}
        </div>

        {/* lg+: featured left + row cards right */}
        <div className="hidden min-w-0 gap-6 lg:grid lg:grid-cols-2 lg:items-stretch xl:gap-8">
          <FeaturedServiceCard {...featured} />
          <div className="flex min-h-140 min-w-0 flex-col gap-5">
            {cards.map((card) => (
              <ServiceRowCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default BusinessServices
