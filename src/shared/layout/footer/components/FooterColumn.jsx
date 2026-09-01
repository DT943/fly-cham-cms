import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import FooterLinkList from './FooterLinkList.jsx'

const FooterColumn = ({ column }) => {
  const { t } = useTranslation()
  const sections = column.sections || [{ links: column.links }]

  return (
    <div className="flex flex-col gap-4">
      <h2 className={`${typography.caption} font-semibold text-secondary m-0`}>
        {t(`layout.footer.columns.${column.id}.title`)}
      </h2>
      {sections.map((section, index) => (
        <div key={section.titleId || `${column.id}-${index}`} className="flex flex-col gap-2">
          {section.titleId && (
            <h3 className={`${typography.caption} font-semibold text-secondary m-0`}>
              {t(`layout.footer.columns.${column.id}.sections.${section.titleId}`)}
            </h3>
          )}
          <FooterLinkList columnId={column.id} links={section.links} />
        </div>
      ))}
    </div>
  )
}

export default FooterColumn
