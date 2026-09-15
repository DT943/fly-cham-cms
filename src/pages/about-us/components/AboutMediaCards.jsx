import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import responsibilityPhoto from '../../../assets/images/about-us/responsibility.jpg'
import mediaTeamPhoto from '../../../assets/images/about-us/media-team.jpg'

const cards = [
  { id: 'responsibility', image: responsibilityPhoto, href: '/our-responsibility' },
  { id: 'mediaTeam', image: mediaTeamPhoto, href: '/media-center' },
]

const AboutMediaCards = () => {
  const { t } = useTranslation()

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cards.map(({ id, image, href }) => (
        <article
          key={id}
          className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl p-8 md:p-10"
        >
          <img src={image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent to-secondary-2" />

          <div className="flex flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-bold md:text-[28px]">
              {t(`aboutUs.mediaCards.${id}.title`)}
            </h2>
            <p className={`m-0 font-normal leading-normal text-100 ${typography.caption}`}>
              {t(`aboutUs.mediaCards.${id}.description`)}
            </p>
            <LocalizedLink
              href={href}
              className={`mt-1 inline-flex w-fit items-center gap-2.5 font-semibold text-50 no-underline ${typography.button}`}
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-100">
                <ArrowRight size={16} weight="bold" className="text-primary-1 rtl:rotate-180" />
              </span>
              {t('aboutUs.mediaCards.learnMore')}
            </LocalizedLink>
          </div>
        </article>
      ))}
    </section>
  )
}

export default AboutMediaCards
