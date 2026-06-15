import { useState } from 'react'
import { actividades as mockActividades } from './data/mockData'
import { exportarTodas } from './utils/exportXLSX'
import Header from './components/Brand'
import Toolbar from './components/Toolbar'
import SidePanel from './components/SidePanel'
import MonthGrid from './components/MonthGrid'
import WeekGrid from './components/WeekGrid'
import DayGrid from './components/DayGrid'
import ActivityModal from './components/ActivityModal'
import PosterModal from './components/PosterModal'
import ActivitiesPage from './components/ActivitiesPage'
import Icon from './components/Icon'

const deepCopy = (v) => JSON.parse(JSON.stringify(v))

export default function App() {
  const [actividades, setActividades] = useState(() => deepCopy(mockActividades))
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)) // July 2025
  const [viewMode, setViewMode] = useState('month')
  const [sidePanelOpen, setSidePanelOpen] = useState(true)
  const [selectedTipos, setSelectedTipos] = useState(['autobus', 'voluntariado', 'asociacion'])
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'add',
    actividad: null,
    prefillDate: null,
  })
  const [posterTarget, setPosterTarget] = useState(null)
  const [currentPage, setCurrentPage] = useState('calendar')

  const addActividad = (data) =>
    setActividades((prev) => [...prev, { ...data, id: Date.now(), participantes: data.participantes || [] }])

  const updateActividad = (updated) =>
    setActividades((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))

  const deleteActividad = (id) =>
    setActividades((prev) => prev.filter((a) => a.id !== id))

  const openAdd = (prefillDate = null) =>
    setModalState({ open: true, mode: 'add', actividad: null, prefillDate })

  const openEdit = (actividad) =>
    setModalState({ open: true, mode: 'edit', actividad, prefillDate: null })

  const openAddParticipant = (actividad) =>
    setModalState({ open: true, mode: 'edit', actividad, prefillDate: null })

  const closeModal = () =>
    setModalState({ open: false, mode: 'add', actividad: null, prefillDate: null })

  const handleSave = (data) => {
    if (modalState.mode === 'edit' && modalState.actividad) {
      updateActividad({ ...modalState.actividad, ...data })
    } else {
      addActividad({ ...data, id: Date.now() })
    }
    closeModal()
  }

  const navigate = (delta) => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + delta)
    else if (viewMode === 'week') d.setDate(d.getDate() + delta * 7)
    else d.setDate(d.getDate() + delta)
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date())

  const toggleTipo = (tipo) =>
    setSelectedTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )

  return (
    <div className="flex flex-col h-screen bg-cream-50 overflow-hidden">
      {/* Cabeceira institucional */}
      <Header />

      {/* Navigation tabs */}
      <div className="flex items-center gap-1 px-4 border-b border-sage-200 bg-cream-50 flex-shrink-0">
        {[
          { id: 'calendar', label: 'Calendario', icon: 'calendar' },
          { id: 'actividades', label: 'Actividades', icon: 'table' },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              currentPage === id
                ? 'border-rioja-500 text-rioja-600'
                : 'border-transparent text-sage-600 hover:text-sage-800 hover:border-sage-300'
            }`}
          >
            <Icon name={icon} size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Calendar page */}
      {currentPage === 'calendar' && (
        <>
          <Toolbar
            currentDate={currentDate}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onPrev={() => navigate(-1)}
            onNext={() => navigate(1)}
            onToday={goToday}
            onToggleSidebar={() => setSidePanelOpen((v) => !v)}
            onExportXLSX={() => exportarTodas(actividades)}
            onNuevaActividad={() => openAdd()}
            selectedTipos={selectedTipos}
            onToggleTipo={toggleTipo}
          />
          <div className="flex flex-1 overflow-hidden">
            <SidePanel
              open={sidePanelOpen}
              actividades={actividades}
              onEdit={openEdit}
              onDelete={deleteActividad}
              onAddParticipant={openAddParticipant}
              onNueva={() => openAdd()}
            />
            <div className="flex flex-col flex-1 overflow-hidden">
              {viewMode === 'month' && (
                <MonthGrid
                  currentDate={currentDate}
                  actividades={actividades}
                  selectedTipos={selectedTipos}
                  onDayClick={openAdd}
                  onActivityClick={openEdit}
                />
              )}
              {viewMode === 'week' && (
                <WeekGrid
                  currentDate={currentDate}
                  actividades={actividades}
                  selectedTipos={selectedTipos}
                  onDayClick={openAdd}
                  onActivityClick={openEdit}
                />
              )}
              {viewMode === 'day' && (
                <DayGrid
                  currentDate={currentDate}
                  actividades={actividades}
                  selectedTipos={selectedTipos}
                  onActivityClick={openEdit}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Actividades page */}
      {currentPage === 'actividades' && (
        <div className="flex-1 overflow-hidden">
          <ActivitiesPage
            actividades={actividades}
            onAdd={() => openAdd()}
            onEdit={openEdit}
            onDelete={deleteActividad}
            onGenerarCartel={setPosterTarget}
          />
        </div>
      )}

      {/* Footer institucional */}
      <footer className="flex-shrink-0 border-t-2 border-sage-300 bg-sage-gradient">
        <div className="h-0.5 bg-gradient-to-r from-rioja-500 via-gold-400 to-rioja-500" />
        <div className="flex items-center justify-between px-6 py-2 gap-4">
          <div className="flex items-center gap-2 text-[10px] text-sage-700">
            <img src="/escudo-san-xoan.jpg" alt="" className="h-6 w-auto mix-blend-multiply" />
            <span className="font-bold tracking-[0.12em] uppercase">Concello de San Xoán de Río</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rioja-500" style={{ fontFamily: 'Dancing Script, cursive', fontWeight: 700, fontSize: '14px' }}>
              Rural
            </span>
            <span className="text-rioja-500" style={{ fontFamily: 'Dancing Script, cursive', fontWeight: 700, fontSize: '14px' }}>
              move
            </span>
            <span className="text-[10px] text-sage-600 italic ml-2">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {modalState.open && (
        <ActivityModal
          actividad={modalState.actividad}
          prefillDate={modalState.prefillDate}
          mode={modalState.mode}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {posterTarget && posterTarget.length > 0 && (
        <PosterModal actividades={posterTarget} onClose={() => setPosterTarget(null)} />
      )}
    </div>
  )
}
