import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Button from '../../../shared/components/Button.jsx'
import { typography } from '../../../styles/typography.js'
import { damascusThingsToDo } from '../utils/damascusContent.js'
import ThingToDoCard from './ThingToDoCard.jsx'

const DamascusThingsToDo = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-2">
        <h2 className={`${typography.sectionTitle} m-0 font-semibold text-700`}>
          {t('thingsToDoInDamascus.thingsToDo.title')}
        </h2>
        <p className={`${typography.sectionDescription} m-0 text-800`}>
          {t('thingsToDoInDamascus.thingsToDo.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {damascusThingsToDo.map(({ id, icon, image }) => (
          <ThingToDoCard
            key={id}
            badge={t(`thingsToDoInDamascus.thingsToDo.items.${id}.badge`)}
            badgeIcon={icon}
            title={t(`thingsToDoInDamascus.thingsToDo.items.${id}.title`)}
            description={t(`thingsToDoInDamascus.thingsToDo.items.${id}.description`)}
            image={image}
            imageAlt={t(`thingsToDoInDamascus.thingsToDo.items.${id}.imageAlt`)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button href="/our-destinations/things-to-do-in-damascus" className="gap-2">
          {t('thingsToDoInDamascus.thingsToDo.cta')}
          <ArrowRight size={16} weight="bold" className="text-btn rtl:-scale-x-100" />
        </Button>
      </div>
    </section>
  )
}

export default DamascusThingsToDo
