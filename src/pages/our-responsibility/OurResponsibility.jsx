import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import HelpCta from '../../shared/components/HelpCta.jsx'
import heroPhoto from '../../assets/images/our-responsibility/hero.jpg'
import aboutPhoto from '../../assets/images/our-responsibility/about-cham.jpg'
import ResponsibilitySections from './components/ResponsibilitySections.jsx'

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
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
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

        <HelpCta
          contained={false}
          image={aboutPhoto}
          imageAlt={t('ourResponsibility.about.imageAlt')}
          title={t('ourResponsibility.about.title')}
          description={`${t('ourResponsibility.about.subtitle')}. ${t('ourResponsibility.about.description')}`}
          cta={t('ourResponsibility.about.cta')}
          href="/about-us"
        />

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
