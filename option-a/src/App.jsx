import { useState } from 'react'
import { actividades as mockActividades } from './data/mockData'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AutobusPage from './components/AutobusPage'
import VoluntariadoPage from './components/VoluntariadoPage'
import AsociacionesPage from './components/AsociacionesPage'

const deepCopy = (v) => JSON.parse(JSON.stringify(v))

export default function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [actividades, setActividades] = useState(() => deepCopy(mockActividades))

  const addActividad = (data) =>
    setActividades((prev) => [...prev, { ...data, id: Date.now() }])

  const updateActividad = (updated) =>
    setActividades((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))

  const deleteActividad = (id) =>
    setActividades((prev) => prev.filter((a) => a.id !== id))

  if (currentPage === 'login') {
    return <Login onLogin={() => setCurrentPage('dashboard')} />
  }

  const pageMap = {
    dashboard: <Dashboard actividades={actividades} />,
    autobus: (
      <AutobusPage
        actividades={actividades}
        onAdd={addActividad}
        onUpdate={updateActividad}
        onDelete={deleteActividad}
      />
    ),
    voluntariado: (
      <VoluntariadoPage
        actividades={actividades}
        onAdd={addActividad}
        onUpdate={updateActividad}
        onDelete={deleteActividad}
      />
    ),
    asociaciones: (
      <AsociacionesPage
        actividades={actividades}
        onAdd={addActividad}
        onUpdate={updateActividad}
        onDelete={deleteActividad}
      />
    ),
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {pageMap[currentPage] || pageMap.dashboard}
      </main>
    </div>
  )
}
