import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './footer/Footer.jsx'

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
  </div>
)

export default Layout
