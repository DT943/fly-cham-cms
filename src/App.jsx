import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Help from './pages/help/Help.jsx'
import './pages/pages.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  )
}

export default App
