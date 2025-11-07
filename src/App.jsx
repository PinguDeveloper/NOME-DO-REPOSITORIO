import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './components/Dashboard'
import Refeicoes from './components/Refeicoes'
import Agua from './components/Agua'
import RelatorioSemanal from './components/RelatorioSemanal'
import CalendarioHistorico from './components/CalendarioHistorico'
import ExportarDados from './components/ExportarDados'
import Conquistas from './components/Conquistas'
import AjustarMetas from './components/AjustarMetas'
import Estatisticas from './components/Estatisticas'
import CompartilharProgresso from './components/CompartilharProgresso'
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
        <Route path="/historico" element={<CalendarioHistorico />} />
        <Route path="/exportar" element={<ExportarDados />} />
        <Route path="/conquistas" element={<Conquistas />} />
        <Route path="/metas" element={<AjustarMetas />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/compartilhar" element={<CompartilharProgresso />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  )
}

export default App

