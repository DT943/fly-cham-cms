import { useTranslation } from 'react-i18next'
import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeTravelExperience } from '../utils/homeTravelExperience.js'

const CardCopy = ({ id, gapClass = 'gap-1.5', clamp = false }) => {
  const { t } = useTranslation()

  return (
    <div className={`flex min-w-0 flex-col ${gapClass}`}>
      <h3 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>
        {t(`home.travelExperience.cards.${id}.title`)}
      </h3>
      <p
        className={`m-0 font-normal leading-relaxed text-600 ${typography.caption} ${
          clamp ? 'line-clamp-2' : ''
        }`}
      >
        {t(`home.travelExperience.cards.${id}.description`)}
      </p>
    </div>
  )
}

/** Mobile (< lg): image on top, content below. */
const StackCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={image}
          alt={t(`home.travelExperience.cards.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2.5 p-4">
        <CardCopy id={id} />
        <LocalizedLink
          href={href}
          className={`mt-1 inline-flex w-full items-center justify-between gap-3 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t('home.travelExperience.learnMore')}
          <ArrowRight size={16} weight="bold" className="shrink-0 rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

/** Desktop row card (right column) — compact height. */
const RowCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="grid min-h-0 min-w-0 flex-1 grid-cols-[38%_1fr] overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="min-h-0 min-w-0 overflow-hidden">
        <img
          src={image}
          alt={t(`home.travelExperience.cards.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col p-4 xl:p-5">
        <CardCopy id={id} clamp />
        <LocalizedLink
          href={href}
          className={`mt-auto inline-flex w-fit items-center gap-1.5 pt-3 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t('home.travelExperience.learnMore')}
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

/** Desktop featured — shorter image band, tighter content. */
const FeaturedCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="aspect-[16/10] w-full shrink-0 overflow-hidden">
        <img
          src={image}
          alt={t(`home.travelExperience.cards.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col p-5">
        <CardCopy id={id} gapClass="gap-2" />
        <LocalizedLink
          href={href}
          className={`mt-auto inline-flex w-fit items-center gap-1.5 pt-4 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t('home.travelExperience.learnMore')}
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

/**
 * Home Travel Experience — compact featured + row cards (Business Center layout).
 */
const HomeTravelExperience = () => {
  const { t } = useTranslation()
  const { featured, cards } = homeTravelExperience
  const allCards = [featured, ...cards]

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-5 py-8 md:gap-6 md:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="flex max-w-3xl flex-col gap-1.5 md:gap-2">
            <h2 className={`m-0 font-semibold break-words text-700 ${typography.sectionTitle} lg:text-[32px]`}>
              {t('home.travelExperience.title')}
            </h2>
            <p className={`m-0 font-normal leading-relaxed break-words text-600 ${typography.sectionDescription}`}>
              {t('home.travelExperience.subtitle')}
            </p>
          </div>
          <LocalizedLink
            href="/travel-experience"
            className={`inline-flex shrink-0 items-center gap-1 font-semibold text-primary-1 no-underline hover:underline ${typography.caption}`}
          >
            {t('home.travelExperience.explore')}
            <CaretRight size={14} weight="bold" className="rtl:-scale-x-100" />
          </LocalizedLink>
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:hidden">
          {allCards.map((card) => (
            <StackCard key={card.id} {...card} />
          ))}
        </div>

        <div className="hidden min-w-0 gap-4 lg:grid lg:grid-cols-2 lg:items-stretch xl:gap-5">
          <FeaturedCard {...featured} />
          <div className="flex min-h-0 min-w-0 flex-col gap-3">
            {cards.map((card) => (
              <RowCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HomeTravelExperience
