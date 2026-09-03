import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { formStageIds } from '../utils/supportForms.js'

const FormTabs = ({ activeId, onSelect }) => {
  const { t } = useTranslation()

  return (
    <div
      role="tablist"
      aria-label={t('forms.filters.label')}
      className="flex w-full gap-2 md:gap-3"
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
            className={`${typography.caption} m-0 box-border cursor-pointer font-medium rounded-lg min-w-0 grow shrink basis-0 text-center px-2 py-2.5 sm:px-3 sm:py-3 md:px-4 whitespace-normal border-none ${
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
