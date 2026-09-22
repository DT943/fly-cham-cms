import { useState } from 'react'
import {
  Bank,
  Image,
  Mosque,
  PingPong,
  ShoppingBagOpen,
  TreePalm,
  MapPin,
  Camera,
  Mountains,
  Storefront,
} from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import blueMosque from '../../assets/images/city-sights/sight-blue-mosque.png'
import burjKhalifa from '../../assets/images/city-sights/sight-burj-khalifa.png'
import colosseum from '../../assets/images/city-sights/sight-colosseum.png'
import dohaCorniche from '../../assets/images/city-sights/sight-doha-corniche.png'
import eiffelTower from '../../assets/images/city-sights/sight-eiffel-tower.png'
import flameTowers from '../../assets/images/city-sights/sight-flame-towers.png'
import operaHouse from '../../assets/images/city-sights/sight-opera-house.png'
import romanTheatre from '../../assets/images/city-sights/sight-roman-theatre.png'

const IMAGE_BY_ID = {
  blueMosque,
  romanTheatre,
  dohaCorniche,
  flameTowers,
  eiffelTower,
  burjKhalifa,
  operaHouse,
  colosseum,
}

const CATEGORY_ICON = {
  none: null,
  landmarks: Image,
  religion: Mosque,
  shopping: ShoppingBagOpen,
  activities: PingPong,
  nature: TreePalm,
  museums: Bank,
  mapPin: MapPin,
  camera: Camera,
  mountains: Mountains,
  storefront: Storefront,
}

const COLUMNS = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const CARD_GAP = { tight: 'gap-3', default: 'gap-4', loose: 'gap-6' }

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SightCard = ({ item, cardRadius, linkProps }) => {
  const src = item.image || IMAGE_BY_ID[item.id] || ''
  const tags = Array.isArray(item.tags) ? item.tags : []
  return (
    <article className={`group relative flex h-[300px] flex-col justify-end overflow-hidden p-4 ${cardRadius}`}>
      <img
        src={src}
        alt={item.imageAlt || item.name || ''}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,37,60,0)_45%,#00253c_100%)]" />

      <div className="relative flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-xl font-semibold text-secondary-700">
            <LinkedText text={item.name} {...linkProps} />
          </h3>
          <p className="m-0 text-sm font-normal text-[#e2e8f0]">{item.location}</p>
        </div>

        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/**
 * Filterable sights grid with category pills. Defaults reproduce the static
 * city-sights grid; the CMS (via the section registry) overrides the title,
 * categories, items (each with an assigned `category`), colours and backlinks.
 */
const SightsGrid = ({
  title = '',
  categories = [],
  items = [],
  columns = '4',
  cardGap = 'default',
  cardRadius = 'lg',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const allId = categories[0]?.id
  const [active, setActive] = useState(allId)

  if (!items.length) return null

  const columnsClass = COLUMNS[columns] || COLUMNS[4]
  const gapClass = CARD_GAP[cardGap] || CARD_GAP.default
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.lg
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }

  const visible =
    !active || active === allId ? items : items.filter((item) => item.category === active)

  return (
    <section className="flex flex-col gap-6">
      {categories.length > 0 && (
        <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-4 lg:overflow-visible">
          {categories.map((cat, index) => {
            const isActive = (active ?? allId) === cat.id
            const Icon = CATEGORY_ICON[cat.icon]
            return (
              <div
                key={cat.id || index}
                role="button"
                tabIndex={0}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => setActive(cat.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActive(cat.id)
                  }
                }}
                className={`flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 md:gap-2.5 md:px-4 md:py-3 lg:min-w-0 lg:flex-1 lg:shrink ${
                  isActive ? 'bg-primary-1 lg:flex-none' : 'bg-50'
                }`}
              >
                <span
                  className={`whitespace-nowrap text-sm font-medium md:text-base ${
                    isActive ? 'text-50' : 'text-700'
                  }`}
                >
                  {cat.label}
                </span>
                {Icon && (
                  <Icon size={20} className={`shrink-0 md:size-6 ${isActive ? 'text-50' : 'text-700'}`} />
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2
          className={`m-0 text-xl sm:text-2xl lg:text-[28px] ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      </div>

      <div className={`grid ${columnsClass} ${gapClass}`}>
        {visible.map((item, index) => (
          <SightCard key={item.id || index} item={item} cardRadius={radiusClass} linkProps={linkProps} />
        ))}
      </div>
    </section>
  )
}

export default SightsGrid
