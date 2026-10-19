import { HandHeart, Handshake, Leaf, Star } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'

const VALUE_ITEMS = [
  { id: 'hospitality', Icon: Handshake },
  { id: 'sustainability', Icon: Leaf },
  { id: 'customerFocus', Icon: HandHeart },
  { id: 'excellence', Icon: Star },
]

/** Four value cards plus the terms article blocks below the hero. */
const ChamMilesTermsBody = () => {
  const { t } = useTranslation()
  const sections = t('chamMilesTerms.sections', { returnObjects: true })

  return (
    <Container className="flex flex-col gap-10 md:gap-14">
      <section className="flex flex-col gap-6" aria-labelledby="cham-miles-terms-values-title">
        <h2
          id="cham-miles-terms-values-title"
          className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}
        >
          {t('chamMilesTerms.values.title')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {VALUE_ITEMS.map(({ id, Icon }) => (
            <article
              key={id}
              className="flex flex-col items-center gap-2 rounded-xl bg-50 px-4 py-6 text-center shadow-[0_4px_16px_rgba(40,40,38,0.06)]"
            >
              <span className="flex size-[68px] items-center justify-center rounded-full bg-100">
                <Icon size={33} weight="regular" className="shrink-0 text-900" aria-hidden />
              </span>
              <h3 className={`m-0 font-semibold text-secondary-2 ${typography.itemTitle}`}>
                {t(`chamMilesTerms.values.items.${id}.title`)}
              </h3>
              <p className={`m-0 font-normal leading-normal text-700 ${typography.caption}`}>
                {t(`chamMilesTerms.values.items.${id}.description`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex max-w-4xl flex-col gap-8 md:gap-10" aria-label={t('chamMilesTerms.title')}>
        {Array.isArray(sections)
          ? sections.map((section) => (
              <article key={section.title} className="flex flex-col gap-3 md:gap-4">
                <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
                  {section.title}
                </h2>
                {(section.paragraphs || []).map((paragraph) => (
                  <p key={paragraph} className={`m-0 font-normal text-700 ${typography.body}`}>
                    {paragraph}
                  </p>
                ))}
              </article>
            ))
          : null}
      </section>
    </Container>
  )
}

export default ChamMilesTermsBody
