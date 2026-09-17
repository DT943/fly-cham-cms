import { useTranslation } from 'react-i18next'
import { sightCategories } from '../utils/sights.js'

/**
 * Presentational filter row. The design ships only the "All" selected state and
 * no category-to-sight mapping, so nothing is wired to the grid yet.
 */
const SightsCategories = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-4 lg:overflow-visible">
      {sightCategories.map(({ id, icon: Icon }, index) => {
        const isActive = index === 0

        return (
          <div
            key={id}
            aria-current={isActive ? 'true' : undefined}
            className={`flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 md:gap-2.5 md:px-4 md:py-3 lg:min-w-0 lg:flex-1 lg:shrink ${
              isActive ? 'bg-primary-1 lg:flex-none' : 'bg-50'
            }`}
          >
            <span
              className={`whitespace-nowrap text-sm font-medium md:text-base ${
                isActive ? 'text-50' : 'text-700'
              }`}
            >
              {t(`citySights.categories.${id}`)}
            </span>
            {Icon && (
              <Icon
                size={20}
                className={`shrink-0 md:size-6 ${isActive ? 'text-50' : 'text-700'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SightsCategories
