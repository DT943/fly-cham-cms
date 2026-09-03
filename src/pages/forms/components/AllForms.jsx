import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { filterSupportForms, supportForms } from '../utils/supportForms.js'
import FormCard from './FormCard.jsx'
import FormTabs from './FormTabs.jsx'
import FormAccessModal from './FormAccessModal.jsx'
import { getSearchHitKey, searchHitId } from '../../../shared/search/utils/searchHit.js'

function getHashedFormId(hash) {
  const key = getSearchHitKey(hash)
  return key.startsWith('form-') ? key.slice('form-'.length) : ''
}

const AllForms = ({ query = '' }) => {
  const { t } = useTranslation()
  const { hash } = useLocation()
  const [stageId, setStageId] = useState('all')
  const [selectedForm, setSelectedForm] = useState(null)
  const hashedFormId = getHashedFormId(hash)

  useEffect(() => {
    if (!hashedFormId) return
    const hashedForm = supportForms.find((form) => form.id === hashedFormId)
    if (hashedForm) setStageId('all')
  }, [hashedFormId])

  const forms = useMemo(() => {
    const filtered = filterSupportForms(supportForms, query, t, stageId)
    if (!hashedFormId) return filtered

    const hashedForm = supportForms.find((form) => form.id === hashedFormId)
    if (hashedForm && !filtered.some((form) => form.id === hashedFormId)) {
      return [hashedForm, ...filtered]
    }

    return filtered
  }, [query, t, stageId, hashedFormId])

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <FormTabs activeId={stageId} onSelect={setStageId} />
      <h2 className={`${typography.sectionTitle} font-semibold text-primary-1 m-0`}>
        {t(`forms.filters.${stageId}`)}
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
              id={searchHitId(`form-${form.id}`)}
              icon={form.icon}
              onSelect={() => setSelectedForm(form)}
              category={t(`forms.filters.${form.stageId}`)}
              title={t(`forms.items.${form.id}.title`)}
              description={t(`forms.items.${form.id}.description`)}
            />
          ))}
        </div>
      )}
      {selectedForm && (
        <FormAccessModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
        />
      )}
    </section>
  )
}

export default AllForms
