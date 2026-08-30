import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Help from './pages/help/Help.jsx'
import ContactUs from './pages/contact-us/ContactUs.jsx'
import OurOffices from './pages/our-offices/OurOffices.jsx'
import './pages/pages.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help">
        <Route index element={<Help />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="our-offices" element={<OurOffices />} />
      </Route>
    </Routes>
  )
}

export default App
