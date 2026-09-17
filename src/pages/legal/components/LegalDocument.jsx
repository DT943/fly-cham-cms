import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import LegalSidebar from './LegalSidebar.jsx'
import LegalSectionCard from './LegalSectionCard.jsx'
import LegalContactCard from './LegalContactCard.jsx'

/**
 * The sidebar + clause-cards layout shared by the Terms and Privacy pages.
 * `baseKey` is the i18n namespace (`legal.terms` / `legal.privacy`) and
 * `activeId` highlights the matching sidebar entry.
 */
const LegalDocument = ({ baseKey, activeId }) => {
  const { t } = useTranslation()

  const sections = t(`${baseKey}.sections`, { returnObjects: true }) || []
  const contact = t(`${baseKey}.contact`, { returnObjects: true })

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
      <aside className="lg:w-[280px] lg:shrink-0">
        <LegalSidebar activeId={activeId} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-7">
        <p className={`m-0 font-normal text-700 ${typography.caption}`}>{t('legal.lastUpdated')}</p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
              {t(`${baseKey}.intro.title`)}
            </h2>
            <p className={`m-0 font-normal leading-relaxed text-700 ${typography.caption}`}>
              {t(`${baseKey}.intro.body`)}
            </p>
          </div>

          {sections.map((section, index) => (
            <LegalSectionCard key={index} {...section} />
          ))}

          <LegalContactCard {...contact} />
        </div>
      </div>
    </div>
  )
}

export default LegalDocument
