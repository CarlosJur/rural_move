import { useState, useRef, useEffect } from 'react'
import { TIPO_COLORS } from '../data/mockData'

const IconBus = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
    <rect x="2" y="5" width="16" height="10" rx="2" />
    <path strokeLinecap="round" d="M2 9h16" />
    <circle cx="5.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
    <circle cx="8" cy="6" r="3" />
    <path strokeLinecap="round" d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5" />
    <circle cx="14" cy="6" r="2.5" />
    <path strokeLinecap="round" d="M17 17c0-2.5-1.5-4-3.5-4.5" />
  </svg>
)
const IconBuilding = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
    <path strokeLinecap="round" d="M3 17V8l7-5 7 5v9M3 17h14" />
    <rect x="7.5" y="11" width="2.5" height="3" rx="0.5" />
    <rect x="10" y="11" width="2.5" height="3" rx="0.5" />
  </svg>
)
const TIPO_ICONS = { autobus: IconBus, voluntariado: IconUsers, asociacion: IconBuilding }
import { MESES } from '../utils/dateUtils'
import ActivityCard from './ActivityCard'
import AddActivityModal from './AddActivityModal'
import PosterModal from './PosterModal'

const TIPO_LIST = Object.keys(TIPO_COLORS)

export default function AllActivitiesPanel({ actividades, onAdd, onUpdate, onDelete }) {
  const [editTarget, setEditTarget] = useState(null)
  const [posterTarget, setPosterTarget] = useState(null)
  const [filterTipos, setFilterTipos] = useState(TIPO_LIST)
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleTipo = (tipo) =>
    setFilterTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )

  const allSelected = filterTipos.length === TIPO_LIST.length
  const activeCount = TIPO_LIST.length - filterTipos.length

  const handleSave = (data) => {
    if (editTarget?.id) {
      onUpdate({ ...editTarget, ...data })
    } else {
      onAdd({ ...data, id: Date.now() })
    }
    setEditTarget(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta actividad?')) onDelete(id)
  }

  // Abrir modal de edición con foco en participantes
  const openAddParticipant = (a) => setEditTarget(a)

  const sorted = [...actividades]
    .filter((a) => filterTipos.includes(a.tipo))
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

  const groups = {}
  sorted.forEach((a) => {
    const [y, m] = a.fecha.split('-')
    const key = `${y}-${m}`
    if (!groups[key]) groups[key] = { label: `${MESES[Number(m) - 1]} ${y}`, items: [] }
    groups[key].items.push(a)
  })

  return (
    <>
      {/* Panel — ocupa todo el alto del contenedor padre */}
      <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full w-full">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <h3 className="font-semibold text-slate-800 text-sm">Todas las actividades</h3>
          <div className="flex items-center gap-2">
            {/* Filter button + dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                  activeCount > 0
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
                </svg>
                Filtrar
                {activeCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipo</span>
                    <button
                      onClick={() => setFilterTipos(allSelected ? [] : TIPO_LIST)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {allSelected ? 'Ninguno' : 'Todos'}
                    </button>
                  </div>
                  {Object.entries(TIPO_COLORS).map(([tipo, c]) => {
                    const TipoIcon = TIPO_ICONS[tipo]
                    return (
                      <label key={tipo} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterTipos.includes(tipo)}
                          onChange={() => toggleTipo(tipo)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={c.text}><TipoIcon /></span>
                        <span className="text-sm text-slate-700">{c.label}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setEditTarget({})}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              + Nueva
            </button>
          </div>
        </div>

        {/* Scrollable list — flex-1 + overflow-y-auto es la clave */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {Object.entries(groups).map(([key, { label, items }]) => (
            <div key={key}>
              <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 sticky top-0 z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
              </div>
              <div className="px-3 py-2 space-y-2">
                {items.map((a) => (
                  <ActivityCard
                    key={a.id}
                    actividad={a}
                    onEdit={() => setEditTarget(a)}
                    onDelete={() => handleDelete(a.id)}
                    onAddParticipant={() => openAddParticipant(a)}
                  />
                ))}
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10 px-4">
              {actividades.length === 0
                ? 'Sin actividades. Pulsa "+ Nueva" para crear una.'
                : 'Sin actividades para los filtros seleccionados.'}
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {editTarget !== null && (
        <AddActivityModal
          tipo={editTarget.tipo || 'autobus'}
          actividad={editTarget.id ? editTarget : null}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {posterTarget && (
        <PosterModal actividad={posterTarget} onClose={() => setPosterTarget(null)} />
      )}
    </>
  )
}
