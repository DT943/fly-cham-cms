import { useTranslation } from 'react-i18next'
import { helpCategories } from '../utils/helpCategories.jsx'
import HelpCategoryCard from './HelpCategoryCard.jsx'

const HelpCategories = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-[22px] font-bold text-700 m-0">
          {t('help.categories.title')}
        </h2>
        <p className="text-sm md:text-base text-600 m-0 max-w-3xl">
          {t('help.categories.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {helpCategories.map((cat) => (
          <HelpCategoryCard
            key={cat.id}
            icon={cat.icon}
            title={t(`help.categories.items.${cat.id}.title`)}
            description={t(`help.categories.items.${cat.id}.description`)}
          />
        ))}
      </div>
    </section>
  )
}

export default HelpCategories
