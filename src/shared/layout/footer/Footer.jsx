import Container from '../../components/Container.jsx'
import FooterBrand from './components/FooterBrand.jsx'
import FooterLegal from './components/FooterLegal.jsx'
import FooterNav from './components/FooterNav.jsx'

const Footer = () => (
  <footer className="bg-primary-1 text-50">
    <Container className="flex flex-col gap-10 py-12 md:gap-12 md:py-16">
      <FooterBrand />
      <FooterNav />
      <FooterLegal />
    </Container>
  </footer>
)

export default Footer
