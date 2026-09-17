import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import coverImage from '../../../assets/images/traveler-magazine/cover-1.jpg'

/** Intro row: magazine blurb on one side, the latest cover on the other. */
const MarhabaIntro = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
      <div className="flex max-w-[476px] flex-col gap-4.5 text-700">
        <h2 className={`m-0 font-semibold leading-tight ${typography.sectionTitle} lg:text-[32px]`}>
          {t('travelerMagazine.intro.title')}
        </h2>
        <p className={`m-0 font-normal leading-relaxed ${typography.body}`}>
          {t('travelerMagazine.intro.description')}
        </p>
      </div>

      <img
        src={coverImage}
        alt={t('travelerMagazine.intro.imageAlt')}
        className="aspect-[3/4] w-full max-w-[300px] shrink-0 rounded-3xl object-cover shadow-[0px_12px_32px_rgba(1,38,59,0.18)]"
      />
    </section>
  )
}

export default MarhabaIntro
