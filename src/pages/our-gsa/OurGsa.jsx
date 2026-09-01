import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import GsaNetwork from './components/GsaNetwork.jsx'
import heroPhoto from '../../assets/images/our-gsa/ph1.png'
import heroMask from '../../assets/images/contact-us/mask.png'

const OurGsa = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.ourGsa') },
  ]

  return (
    <main className="bg-100 min-h-screen w-full">
      <div className="max-w-[1222px] mx-auto px-4 sm:px-8 md:px-10 py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero
          title={t('gsa.hero.title')}
          subtitle={t('gsa.hero.subtitle')}
          image={heroPhoto}
          mask={heroMask}
          imageAlt={t('gsa.hero.imageAlt')}
        />
        <GsaNetwork />
      </div>
    </main>
  )
}

export default OurGsa
