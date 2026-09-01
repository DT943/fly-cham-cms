import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import heroPhoto from '../../assets/images/forms/ph1.png'
import heroMask from '../../assets/images/contact-us/mask.png'

const Forms = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.forms') },
  ]

  return (
    <main className="bg-100 min-h-screen w-full">
      <div className="max-w-[1222px] mx-auto px-4 sm:px-8 md:px-10 py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero
          title={t('forms.hero.title')}
          subtitle={t('forms.hero.subtitle')}
          image={heroPhoto}
          mask={heroMask}
          imageAlt={t('forms.hero.imageAlt')}
        />
      </div>
    </main>
  )
}

export default Forms
