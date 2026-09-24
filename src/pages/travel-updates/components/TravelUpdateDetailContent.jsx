import { Question } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { getGuidelineIcon } from '../utils/travelUpdates.js'

const GuidelineBody = ({ updateId, guideline }) => {
  const { t } = useTranslation()
  const base = `travelUpdates.detail.${updateId}.guidelines.${guideline.id}`

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <h3 className={`m-0 font-semibold text-800 ${typography.itemTitle}`}>
        {t(`${base}.title`)}
      </h3>
      <p className={`m-0 leading-relaxed text-700 ${typography.body}`}>
        {t(`${base}.before`)}
        {guideline.linkHref && guideline.linkKey ? (
          <LocalizedLink
            href={guideline.linkHref}
            className="font-medium text-primary-1 underline underline-offset-2 hover:opacity-80"
          >
            {t(`travelUpdates.advisory.links.${guideline.linkKey}`)}
          </LocalizedLink>
        ) : null}
        {t(`${base}.after`)}
      </p>
      {guideline.bullets?.length ? (
        <ul className="m-0 mt-1 flex list-none flex-col gap-1.5 p-0">
          {guideline.bullets.map((bulletId) => (
            <li
              key={bulletId}
              className={`flex gap-2.5 leading-relaxed text-700 ${typography.body}`}
            >
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-1" />
              <span>{t(`${base}.bullets.${bulletId}`)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/**
 * Main content column — overview paragraphs + optional guideline cards.
 */
const TravelUpdateDetailContent = ({ update }) => {
  const { t } = useTranslation()
  const copy = `travelUpdates.detail.${update.id}`
  const paragraphs = t(`${copy}.overview.paragraphs`, { returnObjects: true })
  const overviewParagraphs = Array.isArray(paragraphs) ? paragraphs : []
  const isAdvisory = update.layout === 'advisory'

  return (
    <div className="flex min-w-0 flex-col gap-6 rounded-2xl border border-200 bg-50 p-5 shadow-[0_2px_16px_rgba(33,37,41,0.05)] sm:p-7 md:p-8">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
          {t(`${copy}.overview.title`)}
        </h2>
        {overviewParagraphs.map((paragraph) => (
          <p key={paragraph} className={`m-0 leading-relaxed text-700 ${typography.body}`}>
            {paragraph}
          </p>
        ))}
      </div>

      {isAdvisory && update.guidelines?.length ? (
        <>
          <div aria-hidden className="h-px w-full bg-200" />

          <div className="flex flex-col gap-4 md:gap-5">
            <div className="flex items-center gap-2.5 text-primary-1">
              <Question size={22} weight="regular" className="shrink-0" aria-hidden />
              <h2 className={`m-0 font-semibold ${typography.itemTitle} md:text-lg`}>
                {t(`${copy}.guidelinesTitle`)}
              </h2>
            </div>

            <ul className="m-0 flex list-none flex-col gap-3 p-0 md:gap-4">
              {update.guidelines.map((guideline) => {
                const Icon = getGuidelineIcon(guideline.icon)
                return (
                  <li
                    key={guideline.id}
                    className="flex gap-3 rounded-xl bg-100 p-4 md:gap-4 md:p-5"
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center text-primary-1">
                      <Icon size={24} weight="regular" aria-hidden />
                    </span>
                    <GuidelineBody updateId={update.id} guideline={guideline} />
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default TravelUpdateDetailContent
