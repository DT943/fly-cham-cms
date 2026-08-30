import LanguageSwitcher from '../shared/components/LanguageSwitcher.jsx'

function Home() {
  return (
    <main className="page">
      <div className="flex justify-end mb-6">
        <LanguageSwitcher />
      </div>
      <section className="page-hero">
        <p className="page-kicker">FlyCham</p>
        <h1>Fly with Cham Wings</h1>
        <p className="page-lead">
          Discover destinations across the region with comfortable travel,
          flexible booking, and dedicated passenger care.
        </p>
      </section>
    </main>
  )
}

export default Home
