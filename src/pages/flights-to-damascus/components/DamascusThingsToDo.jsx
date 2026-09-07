import { useTranslation } from 'react-i18next'
import { damascusThingsToDo } from '../utils/damascusContent.js'
import ThingToDoCard from './ThingToDoCard.jsx'

const DamascusThingsToDo = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-xl font-semibold text-700 sm:text-2xl lg:text-[28px]">
          {t('flightsToDamascus.thingsToDo.title')}
        </h2>
        <p className="m-0 text-sm text-800 sm:text-base">
          {t('flightsToDamascus.thingsToDo.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {damascusThingsToDo.map(({ id, icon, image }) => (
          <ThingToDoCard
            key={id}
            badge={t(`flightsToDamascus.thingsToDo.items.${id}.badge`)}
            badgeIcon={icon}
            title={t(`flightsToDamascus.thingsToDo.items.${id}.title`)}
            description={t(`flightsToDamascus.thingsToDo.items.${id}.description`)}
            cta={t('flightsToDamascus.thingsToDo.cta')}
            image={image}
            imageAlt={t(`flightsToDamascus.thingsToDo.items.${id}.imageAlt`)}
          />
        ))}
      </div>
    </section>
  )
}

export default DamascusThingsToDo
