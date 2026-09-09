import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Button from '../../../shared/components/Button.jsx'
import { typography } from '../../../styles/typography.js'
import ThingToDoCard from './ThingToDoCard.jsx'

const DestinationThingsToDo = ({ i18nKey, items, activitiesHref }) => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-2">
        <h2 className={`${typography.sectionTitle} m-0 font-semibold text-700`}>
          {t(`${i18nKey}.thingsToDo.title`)}
        </h2>
        <p className={`${typography.sectionDescription} m-0 text-800`}>
          {t(`${i18nKey}.thingsToDo.subtitle`)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {items.map(({ id, icon, image }) => (
          <ThingToDoCard
            key={id}
            badge={t(`${i18nKey}.thingsToDo.items.${id}.badge`)}
            badgeIcon={icon}
            title={t(`${i18nKey}.thingsToDo.items.${id}.title`)}
            description={t(`${i18nKey}.thingsToDo.items.${id}.description`, { defaultValue: '' })}
            image={image}
            imageAlt={t(`${i18nKey}.thingsToDo.items.${id}.imageAlt`)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button href={activitiesHref} className="gap-2">
          {t(`${i18nKey}.thingsToDo.cta`)}
          <ArrowRight size={16} weight="bold" className="text-btn rtl:-scale-x-100" />
        </Button>
      </div>
    </section>
  )
}

export default DestinationThingsToDo
