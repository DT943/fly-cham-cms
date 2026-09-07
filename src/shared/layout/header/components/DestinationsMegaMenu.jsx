import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { destinationMenuLinks, featuredDestinations } from '../../headerNav.js'

const DestinationTile = ({ name, code, image, href, featured, onNavigate }) => (
  <LocalizedLink
    to={href}
    onClick={onNavigate}
    className={`group relative h-52 lg:h-58 shrink-0 w-64 sm:w-72 lg:w-auto lg:min-w-0 overflow-hidden rounded-xl no-underline outline-none focus:outline-none focus-visible:outline-none ${
      featured ? 'lg:flex-[2.4]' : 'lg:flex-1'
    }`}
  >
    <img
      src={image}
      alt=""
      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-secondary-2/90 px-4 py-3">
      <span className={`${typography.body} font-semibold text-50 truncate`}>{name}</span>
      <span className={`${typography.caption} font-semibold text-secondary shrink-0`}>{code}</span>
    </span>
  </LocalizedLink>
)

const DestinationsMegaMenu = ({ onNavigate, embedded = false }) => {
  const { t } = useTranslation()

  return (
    <div className={`w-full bg-background ${embedded ? '' : 'shadow-[0_16px_40px_rgba(0,0,0,0.08)]'}`}>
      <Container className={`flex flex-col gap-5 py-6 md:gap-6 md:py-8 ${embedded ? 'px-6 sm:px-6 md:px-6 xl:px-6' : ''}`}>
        <div className="flex flex-col gap-1.5">
          <h2 className={`${typography.sectionTitle} font-semibold text-secondary-2 m-0`}>
            {t('layout.header.destinations.title')}
          </h2>
          <p className={`${typography.caption} text-600 m-0`}>
            {t('layout.header.destinations.subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <div className="flex gap-2.5 overflow-x-auto pb-1 lg:flex-1 lg:min-w-0 lg:overflow-visible lg:pb-0">
            {featuredDestinations.map((city, index) => (
              <DestinationTile
                key={city.id}
                name={t(`destinations.cities.${city.id}.name`)}
                code={city.code}
                image={city.image}
                href={city.href}
                featured={index === 0}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          <div className="flex flex-col lg:w-64 xl:w-72 lg:shrink-0">
            {destinationMenuLinks.map((link, index) => {
              const Icon = link.icon

              return (
                <LocalizedLink
                  key={link.id}
                  to={link.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 py-3 no-underline text-inherit outline-none focus:outline-none focus-visible:outline-none ${
                    index === destinationMenuLinks.length - 1 ? '' : 'border-b border-200'
                  }`}
                >
                  <Icon size={22} weight="regular" className="shrink-0 text-secondary-2" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={`${typography.caption} font-bold text-secondary-2`}>
                      {t(`layout.header.destinations.links.${link.id}.title`)}
                    </span>
                    <span className={`${typography.caption} text-600`}>
                      {t(`layout.header.destinations.links.${link.id}.description`)}
                    </span>
                  </span>
                  <ArrowRight size={16} weight="bold" className="shrink-0 text-700 rtl:-scale-x-100" />
                </LocalizedLink>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="relative h-px flex-1 bg-200" aria-hidden="true">
            <span className="absolute inset-s-0 top-1/2 h-0.75 w-12 -translate-y-1/2 rounded-full bg-secondary" />
          </span>
          <LocalizedLink
            to="/our-destinations"
            onClick={onNavigate}
            className={`${typography.caption} flex shrink-0 items-center gap-2 font-medium text-primary-1 no-underline outline-none focus:outline-none focus-visible:outline-none`}
          >
            {t('layout.header.destinations.viewAll')}
            <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" />
          </LocalizedLink>
        </div>
      </Container>
    </div>
  )
}

export default DestinationsMegaMenu
