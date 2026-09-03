import Container from '../../components/Container.jsx'
import FooterBrand from './components/FooterBrand.jsx'
import FooterColumn from './components/FooterColumn.jsx'
import FooterLegal from './components/FooterLegal.jsx'
import { footerColumns } from './utils/footerLinks.js'

const Footer = () => (
  <footer className="bg-secondary-2 text-50">
    <Container className="py-10 md:py-14 flex flex-col gap-10 md:gap-14">
      <FooterBrand />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-6">
        {footerColumns.map((column) => (
          <FooterColumn key={column.id} column={column} />
        ))}
      </div>
      <FooterLegal />
    </Container>
  </footer>
)

export default Footer
