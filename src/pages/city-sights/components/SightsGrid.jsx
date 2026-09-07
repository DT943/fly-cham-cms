import { useTranslation } from 'react-i18next'
import { sights } from '../utils/sights.js'
import SightCard from './SightCard.jsx'

const SightsGrid = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-xl font-semibold text-700 sm:text-2xl lg:text-[28px]">
          {t('citySights.grid.title')}
        </h2>
      </div>

      {/* 4-up only from xl — at lg a quarter column is ~220px and the tag row wraps. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sights.map((sight) => (
          <SightCard
            key={sight.id}
            name={t(`citySights.sights.${sight.id}.name`)}
            location={t(`citySights.sights.${sight.id}.location`)}
            imageAlt={t(`citySights.sights.${sight.id}.name`)}
            image={sight.image}
            tags={sight.tags.map((tag) => t(`citySights.tags.${tag}`))}
          />
        ))}
      </div>
    </section>
  )
}

export default SightsGrid
