import { Link } from 'react-router-dom'
import logo from '../../../../assets/images/layout/logo.png'
import FooterSocial from './FooterSocial.jsx'

const FooterBrand = () => (
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <Link to="/" aria-label="Fly Cham">
      <img src={logo} alt="Fly Cham" className="h-9 md:h-11 w-auto" />
    </Link>
    <FooterSocial />
  </div>
)

export default FooterBrand
