import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeAboutCards, homeAboutHref } from '../utils/homeAbout.js'

/**
 * About Fly Cham — three image cards + centered CTA.
 */
const HomeAbout = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full min-w-0 bg-100">
      <Container className="flex min-w-0 flex-col gap-6 py-10 md:gap-8 md:py-14">
        <div className="flex max-w-2xl flex-col gap-1.5 md:gap-2">
          <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
            {t('home.about.title')}
          </h2>
          <p className={`m-0 font-normal text-600 ${typography.sectionDescription}`}>
            {t('home.about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {homeAboutCards.map((card) => (
            <article key={card.id} className="flex min-w-0 flex-col gap-3 md:gap-4">
              <div className="aspect-4/3 w-full overflow-hidden rounded-2xl">
                <img
                  src={card.image}
                  alt={t(`home.about.cards.${card.id}.imageAlt`)}
                  className={`size-full object-cover ${card.imageClassName || ''}`}
                />
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <h3 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>
                  {t(`home.about.cards.${card.id}.title`)}
                </h3>
                <p className={`m-0 font-normal leading-relaxed text-600 ${typography.caption}`}>
                  {t(`home.about.cards.${card.id}.description`)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center pt-1 md:pt-2">
          <LocalizedLink
            href={homeAboutHref}
            className={`inline-flex items-center justify-center rounded-lg bg-secondary px-7 py-3.5 font-semibold text-700 no-underline transition-colors hover:bg-secondary-800 ${typography.button}`}
          >
            {t('home.about.cta')}
          </LocalizedLink>
        </div>
      </Container>
    </section>
  )
}

export default HomeAbout
