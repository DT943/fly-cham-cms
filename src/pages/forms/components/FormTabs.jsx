import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { formStageIds } from '../utils/supportForms.js'

const FormTabs = ({ activeId, onSelect }) => {
  const { t } = useTranslation()

  return (
    <div
      role="tablist"
      aria-label={t('forms.filters.label')}
      className="flex flex-wrap gap-2 md:gap-3"
    >
      {formStageIds.map((id) => {
        const isActive = id === activeId

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(id)}
            className={`${typography.caption} m-0 cursor-pointer font-medium rounded-lg w-fit shrink-0 text-center px-4 py-2.5 sm:px-5 sm:py-3 whitespace-nowrap border-none ${
              isActive ? 'bg-primary-1 text-white' : 'bg-200 text-700'
            }`}
          >
            {t(`forms.filters.${id}`)}
          </button>
        )
      })}
    </div>
  )
}

export default FormTabs
