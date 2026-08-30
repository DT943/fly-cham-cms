import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Help from './pages/help/Help.jsx'
import ContactUs from './pages/contact-us/ContactUs.jsx'
import './pages/pages.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help">
        <Route index element={<Help />} />
        <Route path="contact-us" element={<ContactUs />} />
      </Route>
    </Routes>
  )
}

export default App
