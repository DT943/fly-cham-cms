import Container from '../shared/components/Container.jsx'
import { typography } from '../styles/typography.js'

function Home() {
  return (
    <main className="page">
      <Container className="py-16 md:py-20">
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
