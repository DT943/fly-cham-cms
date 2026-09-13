import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import heroPhoto from '../../assets/images/our-responsibility/hero.jpg'
import ResponsibilitySections from './components/ResponsibilitySections.jsx'
import AboutChamCta from './components/AboutChamCta.jsx'

const OurResponsibility = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('ourResponsibility.breadcrumb') },
  ]

  const faqQuestions = t('ourResponsibility.faq.items', { returnObjects: true }) || []
  const faqItems = faqQuestions.map((question, index) => ({
    id: `faq-${index}`,
    question,
    answer: t('ourResponsibility.faq.answerPlaceholder'),
  }))

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <PageMediaHero
        image={heroPhoto}
        imageAlt={t('ourResponsibility.hero.imageAlt')}
        title={t('ourResponsibility.hero.title')}
        subtitle={t('ourResponsibility.hero.subtitle')}
        objectPosition="center 20%"
      />

      <Container className="flex flex-col gap-14 pt-10 md:gap-16 md:pt-14">
        <ResponsibilitySections />

        <AboutChamCta />

        <Faqs
          title={t('ourResponsibility.faq.title')}
          items={faqItems}
          browseLabel={t('ourResponsibility.faq.browse')}
          browseHref="/help/faqs"
        />
      </Container>
    </main>
  )
}

export default OurResponsibility
