import Container from '../shared/components/Container.jsx'
import LanguageSwitcher from '../shared/components/LanguageSwitcher.jsx'
import { typography } from '../styles/typography.js'

function Home() {
  return (
    <main className="page">
      <Container className="py-16 md:py-20">
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>
        <section className="page-hero">
          <p className={`${typography.caption} page-kicker`}>FlyCham</p>
          <h1 className={`${typography.pageTitle} page-title`}>Fly with Cham Wings</h1>
          <p className={`${typography.sectionDescription} page-lead`}>
            Discover destinations across the region with comfortable travel,
            flexible booking, and dedicated passenger care.
          </p>
        </section>
      </Container>
    </main>
  )
}

export default Home
