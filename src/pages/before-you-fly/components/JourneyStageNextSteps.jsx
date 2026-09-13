import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

const JourneyStageNextSteps = ({ i18nKey, items }) => {
  const { t } = useTranslation()

  if (!items?.length) return null

  return (
    <Container className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-2 md:gap-5 md:pt-10">
      {items.map(({ id, href, icon: Icon }) => (
        <article
          key={id}
          className="flex flex-col justify-between gap-6 rounded-2xl border border-200 bg-background p-5 md:p-6"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {Icon ? (
                <Icon size={22} weight="regular" className="shrink-0 text-700" />
              ) : null}
              <h2 className={`${typography.itemTitle} m-0 font-semibold text-700`}>
                {t(`${i18nKey}.nextSteps.${id}.title`)}
              </h2>
            </div>
            <p className={`${typography.itemDescription} m-0 leading-relaxed text-800`}>
              {t(`${i18nKey}.nextSteps.${id}.description`)}
            </p>
          </div>
          <LocalizedLink
            href={href}
            className="inline-flex items-center gap-2.5 text-sm font-semibold text-primary-1 no-underline"
          >
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-primary-1">
              <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
            </span>
            {t(`${i18nKey}.nextSteps.${id}.cta`, {
              defaultValue: t(`${i18nKey}.nextSteps.learnMore`),
            })}
          </LocalizedLink>
        </article>
      ))}
    </Container>
  )
}

export default JourneyStageNextSteps
