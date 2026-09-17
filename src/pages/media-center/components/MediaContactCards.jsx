import { useTranslation } from 'react-i18next'
import { mediaContactCards } from '../utils/mediaContacts.js'
import MediaContactCard from './MediaContactCard.jsx'

const MediaContactCards = () => {
  const { t } = useTranslation()

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {mediaContactCards.map(({ id, icon, email }) => (
        <MediaContactCard
          key={id}
          icon={icon}
          title={t(`mediaCenter.contactCards.${id}.title`)}
          description={t(`mediaCenter.contactCards.${id}.description`)}
          department={t(`mediaCenter.contactCards.${id}.department`, { defaultValue: '' }) || undefined}
          location={t(`mediaCenter.contactCards.${id}.location`, { defaultValue: '' }) || undefined}
          email={email}
        />
      ))}
    </section>
  )
}

export default MediaContactCards
