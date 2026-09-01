import { Routes, Route } from 'react-router-dom'
import Layout from './shared/layout/Layout.jsx'
import LocalizedRoutes from './shared/routing/LocalizedRoutes.jsx'
import './pages/pages.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<LocalizedRoutes />} />
      </Route>
    </Routes>
  )
}

export default App
