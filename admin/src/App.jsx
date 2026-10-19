import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { api, clearSession, setSession } from './api.js'
import Candidaturas from './pages/Candidaturas.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Relatorios from './pages/Relatorios.jsx'
import Site from './pages/Site.jsx'
import Usuarios from './pages/Usuarios.jsx'

function Protected({ children }) {
  const [state, setState] = useState('loading')

  useEffect(() => {
    api('/me', { redirectOnUnauthorized: false })
      .then((data) => {
        setSession(data.admin)
        setState('ready')
      })
      .catch(() => {
        clearSession()
        setState('denied')
      })
  }, [])

  if (state === 'loading') return <div className="grid min-h-screen place-items-center bg-paper font-mono text-xs tracking-[0.12em] text-ink/50 uppercase">A verificar sessão…</div>
  if (state === 'denied') return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidaturas" element={<Candidaturas />} />
          <Route path="/utilizadores" element={<Usuarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/site" element={<Site />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
