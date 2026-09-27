import { ArrowRight, CheckCircleIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { travelUpdatesAdvisory } from '../utils/travelUpdates.js'

const AdvisoryBody = ({ itemId, linkHref, linkKey }) => {
  const { t } = useTranslation()
  const base = `travelUpdates.advisory.items.${itemId}`

  return (
    <p className={`m-0 leading-relaxed text-700 ${typography.body}`}>
      <span className="font-semibold text-800">{t(`${base}.label`)} </span>
      {t(`${base}.before`)}
      {linkHref && linkKey ? (
        <LocalizedLink
          href={linkHref}
          className="font-medium text-primary-1 no-underline hover:underline"
        >
          {t(`travelUpdates.advisory.links.${linkKey}`)}
        </LocalizedLink>
      ) : null}
      {t(`${base}.after`)}
    </p>
  )
}

/**
 * Featured "Latest Advisories" card with checklist details + Learn More.
 */
const TravelUpdatesAdvisory = () => {
  const { t } = useTranslation()
  const { dateKey, href, items } = travelUpdatesAdvisory

  return (
    <section className="flex min-w-0 flex-col gap-5 md:gap-6">
      <div className="flex max-w-3xl flex-col gap-1.5 md:gap-2">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
          {t('travelUpdates.advisory.title')}
        </h2>
        <p className={`m-0 font-normal text-600 ${typography.sectionDescription}`}>
          {t('travelUpdates.advisory.subtitle')}
        </p>
      </div>

      <article className="rounded-2xl border border-200 bg-50 p-5 shadow-[0_2px_16px_rgba(33,37,41,0.05)] sm:p-7 md:p-8">
        <div className="flex flex-col gap-4 md:gap-5">
          <span
            className={`w-fit rounded-md bg-[#E8F1F4] px-2.5 py-1 font-semibold uppercase tracking-wide text-primary-1 ${typography.caption}`}
          >
            {t(`travelUpdates.dates.${dateKey}`)}
          </span>

          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className={`m-0 font-semibold text-800 ${typography.itemTitle} md:text-xl`}>
              {t('travelUpdates.advisory.heading')}
            </h3>
            <p className={`m-0 leading-relaxed text-700 ${typography.body}`}>
              {t('travelUpdates.advisory.description')}
            </p>
          </div>

          <ul className="m-0 flex list-none flex-col gap-4 p-0 md:gap-5">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <CheckCircleIcon
                  size={24}
                  weight="regular"
                  className="mt-0.5 shrink-0 text-primary-1"
                  aria-hidden
                />
                <div className="flex min-w-0 flex-col gap-2">
                  <AdvisoryBody
                    itemId={item.id}
                    linkHref={item.linkHref}
                    linkKey={item.linkKey}
                  />
                  {item.children?.length ? (
                    <ul className="m-0 flex list-none flex-col gap-1.5 p-0 ps-1 text-700">
                      {item.children.map((child) => (
                        <li key={child.id} className={`flex gap-2.5 leading-relaxed ${typography.body}`}>
                          <span
                            aria-hidden
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-1"
                          />
                          <span>
                            {t(`travelUpdates.advisory.items.${child.id}.before`)}
                            {child.linkHref && child.linkKey ? (
                              <LocalizedLink
                                href={child.linkHref}
                                className="font-medium text-primary-1 no-underline hover:underline"
                              >
                                {t(`travelUpdates.advisory.links.${child.linkKey}`)}
                              </LocalizedLink>
                            ) : null}
                            {t(`travelUpdates.advisory.items.${child.id}.after`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <LocalizedLink
            href={href}
            className={`inline-flex w-fit items-center gap-2.5 font-semibold text-primary-1 no-underline transition-opacity hover:opacity-80 ${typography.button}`}
          >
            <span className="grid size-9 place-items-center rounded-full bg-primary-1 text-50 md:size-10">
              <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
            </span>
            {t('travelUpdates.learnMore')}
          </LocalizedLink>
        </div>
      </article>
    </section>
  )
}

export default TravelUpdatesAdvisory
