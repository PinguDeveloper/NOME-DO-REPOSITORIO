import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Refeicoes from './components/Refeicoes'
import Agua from './components/Agua'
import RelatorioSemanal from './components/RelatorioSemanal'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/refeicoes" element={<Refeicoes />} />
        <Route path="/agua" element={<Agua />} />
        <Route path="/relatorio" element={<RelatorioSemanal />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App

