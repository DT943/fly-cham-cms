import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import Button from '../../../shared/components/Button.jsx'
import { travelExperienceStages } from '../utils/travelExperienceContent.js'

const TravelExperienceStages = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      {travelExperienceStages.map(({ id, image, gradient }) => (
        <section
          key={id}
          className="relative isolate overflow-hidden h-125 sm:h-150 md:h-175 lg:h-200"
        >
          <img
            src={image}
            alt={t(`travelExperience.stages.${id}.imageAlt`)}
            className="absolute inset-0 size-full object-cover"
          />
          <div className={`pointer-events-none absolute inset-0 bg-linear-to-r rtl:bg-linear-to-l ${gradient}`} />

          <Container className="relative flex h-full flex-col justify-center">
            <div className="flex max-w-125 flex-col gap-6">
              <div className="flex flex-col gap-3 md:gap-4 text-50">
                <h2 className="m-0 text-3xl font-semibold leading-tight sm:text-4xl md:text-[40px]">
                  {t(`travelExperience.stages.${id}.title`)}
                </h2>
                <p className="m-0 text-sm leading-relaxed sm:text-base">
                  {t(`travelExperience.stages.${id}.description`)}
                </p>
              </div>
              <Button className="inline-flex items-center gap-2.5">
                {t('travelExperience.stages.cta')}
                <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
              </Button>
            </div>
          </Container>
        </section>
      ))}
    </div>
  )
}

export default TravelExperienceStages
