import { useTranslation } from 'react-i18next'
import { ShieldPlus, Handshake, Leaf, HandHeart, Star, UsersThree } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const values = [
  { id: 'safety', icon: ShieldPlus },
  { id: 'hospitality', icon: Handshake },
  { id: 'sustainability', icon: Leaf },
  { id: 'customerFocus', icon: HandHeart },
  { id: 'excellence', icon: Star },
  { id: 'teamwork', icon: UsersThree },
]

const AboutValues = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6">
      <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
        {t('aboutUs.values.title')}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {values.map(({ id, icon: Icon }) => (
          <article
            key={id}
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-50 px-4 py-6 text-center"
          >
            <span className="flex size-[68px] items-center justify-center rounded-full bg-100">
              <Icon size={33} weight="regular" className="text-primary-1" />
            </span>
            <h3 className={`m-0 font-semibold text-secondary-2 ${typography.itemTitle}`}>
              {t(`aboutUs.values.items.${id}.title`)}
            </h3>
            <p className={`m-0 font-normal leading-normal text-700 ${typography.caption}`}>
              {t(`aboutUs.values.items.${id}.description`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AboutValues
