import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { cargoInfoCards } from '../utils/cargoServiceContent.js'

const CargoInfoCard = ({ id, image, href }) => {
  const { t } = useTranslation()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={image}
          alt={t(`cargoService.info.cards.${id}.imageAlt`)}
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <h3 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>
          {t(`cargoService.info.cards.${id}.title`)}
        </h3>
        <p className={`m-0 flex-1 font-normal leading-relaxed text-600 ${typography.caption}`}>
          {t(`cargoService.info.cards.${id}.description`)}
        </p>
        <LocalizedLink
          href={href}
          className={`mt-1 inline-flex w-fit items-center gap-1.5 font-semibold text-primary-1 no-underline ${typography.caption}`}
        >
          {t(`cargoService.info.cards.${id}.cta`)}
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

const CargoInfoCards = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-6 py-10 md:gap-8 md:py-14">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
          {t('cargoService.info.title')}
        </h2>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {cargoInfoCards.map((card) => (
            <CargoInfoCard key={card.id} {...card} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CargoInfoCards
