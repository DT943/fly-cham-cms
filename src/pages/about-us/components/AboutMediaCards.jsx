import { useTranslation } from 'react-i18next'
import MediaCards from '../../../shared/components/MediaCards.jsx'
import responsibilityPhoto from '../../../assets/images/about-us/responsibility.jpg'
import mediaTeamPhoto from '../../../assets/images/about-us/media-team.jpg'

const AboutMediaCards = () => {
  const { t } = useTranslation()
  const cta = t('aboutUs.mediaCards.learnMore')

  return (
    <MediaCards
      cards={[
        {
          id: 'responsibility',
          image: responsibilityPhoto,
          href: '/our-responsibility',
          title: t('aboutUs.mediaCards.responsibility.title'),
          description: t('aboutUs.mediaCards.responsibility.description'),
          cta,
        },
        {
          id: 'mediaTeam',
          image: mediaTeamPhoto,
          href: '/media-center',
          title: t('aboutUs.mediaCards.mediaTeam.title'),
          description: t('aboutUs.mediaCards.mediaTeam.description'),
          cta,
        },
      ]}
    />
  )
}

export default AboutMediaCards
