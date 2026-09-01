import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { filterSupportForms, supportForms } from '../utils/supportForms.js'
import FormCard from './FormCard.jsx'

const AllForms = ({ query = '' }) => {
  const { t } = useTranslation()
  const forms = filterSupportForms(supportForms, query, t)

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <h2 className={`${typography.sectionTitle} font-semibold text-primary-1 m-0`}>
        {t('forms.all.title')}
      </h2>
      {forms.length === 0 ? (
        <p className={`${typography.sectionDescription} text-600 m-0`}>
          {t('forms.all.empty')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              icon={form.icon}
              href={form.href}
              category={t(`forms.categories.${form.categoryId}`)}
              title={t(`forms.items.${form.id}.title`)}
              description={t(`forms.items.${form.id}.description`)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default AllForms
