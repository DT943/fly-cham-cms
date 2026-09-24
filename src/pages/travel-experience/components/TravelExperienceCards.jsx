import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { travelExperienceCards } from '../utils/travelExperienceContent.js'

const TravelExperienceCard = ({ id, image, gradientTo, href }) => {
  const { t } = useTranslation()

  return (
    <article className="relative isolate h-105 overflow-hidden rounded-2xl border border-200 bg-50 shadow-[0px_4px_6px_rgba(33,37,41,0.05)] md:h-111">
      <img
        src={image}
        alt={t(`travelExperience.cards.${id}.imageAlt`)}
        className="absolute inset-0 size-full object-cover"
      />
      <div className={`pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-40% ${gradientTo}`} />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 text-50 backdrop-blur-[2px]">
        <h3 className="m-0 text-lg font-semibold leading-snug">
          {t(`travelExperience.cards.${id}.title`)}
        </h3>
        <p className="m-0 text-sm font-normal leading-normal">
          {t(`travelExperience.cards.${id}.description`)}
        </p>
        <LocalizedLink
          href={href}
          aria-label={t(`travelExperience.cards.${id}.title`)}
          className="group/lm relative ms-auto inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full text-sm font-semibold no-underline"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 start-0 w-[34px] rounded-full bg-100 transition-[width] duration-300 ease-out group-hover/lm:w-full group-hover/lm:bg-50"
          />
          <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
            <ArrowRight size={16} weight="bold" className="text-primary-1 rtl:-scale-x-100" />
          </span>
          <span className="relative z-10 pe-3 ps-2.5 text-50 transition-colors duration-300 group-hover/lm:text-primary-1">
            {t('travelExperience.cards.learnMore')}
          </span>
        </LocalizedLink>
      </div>
    </article>
  )
}

const TravelExperienceCards = () => (
  <Container className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {travelExperienceCards.map((card) => (
      <TravelExperienceCard key={card.id} {...card} />
    ))}
  </Container>
)

export default TravelExperienceCards
