import { useState } from 'react'
import { actividades as mockActividades } from './data/mockData'
import { exportarTodas } from './utils/exportXLSX'
import { MESES } from './utils/dateUtils'
import Toolbar from './components/Toolbar'
import SidePanel from './components/SidePanel'
import MonthGrid from './components/MonthGrid'
import WeekGrid from './components/WeekGrid'
import DayGrid from './components/DayGrid'
import ActivityModal from './components/ActivityModal'
import PosterModal from './components/PosterModal'

const deepCopy = (v) => JSON.parse(JSON.stringify(v))

export default function App() {
  const [actividades, setActividades] = useState(() => deepCopy(mockActividades))
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)) // July 2025
  const [viewMode, setViewMode] = useState('month')
  const [sidePanelOpen, setSidePanelOpen] = useState(true)
  const [selectedTipos, setSelectedTipos] = useState(['autobus', 'voluntariado', 'asociacion'])
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    actividad: null,
    prefillDate: null,
  })
  const [posterTarget, setPosterTarget] = useState(null)

  // CRUD
  const addActividad = (data) =>
    setActividades((prev) => [...prev, { ...data, id: Date.now(), participantes: data.participantes || [] }])

  const updateActividad = (updated) =>
    setActividades((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))

  const deleteActividad = (id) =>
    setActividades((prev) => prev.filter((a) => a.id !== id))

  // Modal helpers
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

  // Date navigation
  const navigate = (delta) => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + delta)
    else if (viewMode === 'week') d.setDate(d.getDate() + delta * 7)
    else d.setDate(d.getDate() + delta)
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date())

  // Tipo toggle
  const toggleTipo = (tipo) =>
    setSelectedTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Toolbar */}
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

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side panel */}
        <SidePanel
          open={sidePanelOpen}
          actividades={actividades}
          onEdit={openEdit}
          onDelete={deleteActividad}
          onAddParticipant={openAddParticipant}
          onNueva={() => openAdd()}
        />

        {/* Calendar area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Month nav header (for month view only) */}
          {viewMode === 'month' && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <h2 className="text-base font-semibold text-slate-700">
                {MESES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{actividades.filter((a) => selectedTipos.includes(a.tipo)).length} actividades visibles</span>
              </div>
            </div>
          )}

          {/* Calendar view */}
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

      {/* Activity modal */}
      {modalState.open && (
        <ActivityModal
          actividad={modalState.actividad}
          prefillDate={modalState.prefillDate}
          mode={modalState.mode}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* Poster modal */}
      {posterTarget && (
        <PosterModal actividad={posterTarget} onClose={() => setPosterTarget(null)} />
      )}
    </div>
  )
}
