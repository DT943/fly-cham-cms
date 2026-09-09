import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { destinations, featuredDestination, featuredImages } from '../utils/destinations.js'
import DestinationCard from './DestinationCard.jsx'
import DestinationsPagination from './DestinationsPagination.jsx'
import FeaturedDestination from './FeaturedDestination.jsx'

const DestinationsExplore = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6">
      <p className={`${typography.caption} text-800 m-0 leading-relaxed max-w-3xl`}>
        {t('destinations.explore.subtitle')}
      </p>

      {/* 16px gutter between the featured card, the grid, and every cell (Figma). */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <FeaturedDestination
          country={t(`destinations.countries.${featuredDestination.countryKey}`)}
          title={t(`destinations.cities.${featuredDestination.id}.flights`)}
          heading={t('destinations.featured.heading')}
          description={t('destinations.featured.description')}
          cta={t('destinations.card.discover', {
            city: t(`destinations.cities.${featuredDestination.id}.name`),
          })}
          activities={t('destinations.featured.activities')}
          href={featuredDestination.href}
          images={featuredImages}
          imageAlt={t(`destinations.cities.${featuredDestination.id}.name`)}
        />

        {/*
          3 columns only from xl. Beside the fixed 326px featured card, lg leaves
          185px-wide cells — 115px tall at the Figma aspect, too short for the
          140px hover CTA block, which then clips. At xl the cell is 282px, the
          width the design is drawn at.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 min-w-0">
          {destinations.map((destination, index) => {
            const city = t(`destinations.cities.${destination.id}.name`)

            return (
              <div
                key={destination.id}
                className="animate-[fadeUp_0.4s_ease-out_both] motion-reduce:animate-none"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <DestinationCard
                  iata={destination.iata}
                  title={t(`destinations.cities.${destination.id}.flights`)}
                  image={destination.image}
                  imageAlt={city}
                  cta={t('destinations.card.discover', { city })}
                  activities={t('destinations.featured.activities')}
                  href={destination.href}
                />
              </div>
            )
          })}
        </div>
      </div>

      <DestinationsPagination
        currentPage={1}
        totalPages={25}
        previousLabel={t('destinations.pagination.previous')}
        nextLabel={t('destinations.pagination.next')}
        ofLabel={t('destinations.pagination.of', { total: 25 })}
      />
    </section>
  )
}

export default DestinationsExplore
