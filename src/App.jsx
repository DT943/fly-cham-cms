import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ContactUs from './pages/contact-us/ContactUs.jsx'
import './pages/pages.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact-us" element={<ContactUs />} />
    </Routes>
  )
}

export default App
