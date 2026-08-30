import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { journeySteps } from '../utils/journeySteps.js'
import JourneyStep from './JourneyStep.jsx'

const JourneySection = () => {
  const { t } = useTranslation()

  return (
    <section className="bg-background rounded-xl px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12">
      <div className="flex flex-col gap-2 mb-6 md:mb-7">
        <h2 className={`${typography.sectionTitle} font-bold text-700 m-0`}>
          {t('help.journey.title')}
        </h2>
        <p className={`${typography.sectionDescription} text-600 m-0 max-w-4xl`}>
          {t('help.journey.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {journeySteps.map((step) => (
          <JourneyStep
            key={step.id}
            icon={step.icon}
            stepLabel={t(`help.journey.steps.${step.id}.title`)}
            links={step.linkKeys.map((linkKey) => ({
              text: t(`help.journey.steps.${step.id}.links.${linkKey}`),
            }))}
          />
        ))}
      </div>
    </section>
  )
}

export default JourneySection
