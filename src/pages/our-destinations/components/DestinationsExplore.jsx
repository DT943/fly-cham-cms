import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import {
  featuredDestination,
  getDestinationPage,
  getDestinationPageCount,
} from '../utils/destinations.js'
import DestinationCard from './DestinationCard.jsx'
import DestinationsPagination from './DestinationsPagination.jsx'
import FeaturedDestination from './FeaturedDestination.jsx'

const DestinationsExplore = () => {
  const { t } = useTranslation()
  const totalPages = getDestinationPageCount()
  const [page, setPage] = useState(1)
  const pageItems = getDestinationPage(page)

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
          image={featuredDestination.image}
          imageAlt={t(`destinations.cities.${featuredDestination.id}.name`)}
        />

        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {/*
            3 columns only from xl. Beside the fixed 326px featured card, lg leaves
            185px-wide cells — 115px tall at the Figma aspect, too short for the
            140px hover CTA block, which then clips. At xl the cell is 282px, the
            width the design is drawn at.
          */}
          <div key={page} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pageItems.map((destination, index) => {
              const city = t(`destinations.cities.${destination.id}.name`)

              return (
                <div
                  key={destination.id}
                  className="animate-[fadeUp_0.4s_ease-out_both] motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <DestinationCard
                    country={t(`destinations.countries.${destination.countryKey}`)}
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

          <DestinationsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            previousLabel={t('destinations.pagination.previous')}
            nextLabel={t('destinations.pagination.next')}
            ofLabel={t('destinations.pagination.of', { total: totalPages })}
          />
        </div>
      </div>
    </section>
  )
}

export default DestinationsExplore
