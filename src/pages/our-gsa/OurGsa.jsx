import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import GsaNetwork from './components/GsaNetwork.jsx'
import PromoBanner from '../../shared/components/PromoBanner.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import heroPhoto from '../../assets/images/our-gsa/ph1.png'
import heroMask from '../../assets/images/contact-us/mask.png'
import partnerBanner from '../../assets/images/our-gsa/ph2.png'

const faqIds = ['agencySupport', 'setupFees', 'complianceDocs', 'apiAccess']

const OurGsa = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.ourGsa') },
  ]

  const faqs = faqIds.map((id) => ({
    id,
    question: t(`gsa.faqs.items.${id}.question`),
    answer: t(`gsa.faqs.items.${id}.answer`),
  }))

  return (
    <main className="bg-100 w-full">
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
        <PromoBanner
          title={t('gsa.partner.title')}
          description={t('gsa.partner.description')}
          cta={t('gsa.partner.cta')}
          image={partnerBanner}
          imageAlt={t('gsa.partner.imageAlt')}
        />
        <Faqs
          title={t('gsa.faqs.title')}
          items={faqs}
          browseLabel={t('gsa.faqs.browse')}
          browseHref="/help/faqs"
        />
      </div>
    </main>
  )
}

export default OurGsa
