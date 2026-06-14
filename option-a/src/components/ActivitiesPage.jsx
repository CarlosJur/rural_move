import { useState, useRef, useEffect } from 'react'
import { TIPO_COLORS, getEstado } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { exportarPorTipo } from '../utils/exportXLSX'
import AddActivityModal from './AddActivityModal'
import PosterSelectorModal from './PosterSelectorModal'
import * as XLSX from 'xlsx'

// SVG icons — Notion style
const IconBus = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
    <rect x="2" y="5" width="16" height="10" rx="2" />
    <path strokeLinecap="round" d="M2 9h16" />
    <circle cx="5.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <path strokeLinecap="round" d="M6 5V3M14 5V3" />
  </svg>
)

const IconUsers = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
    <circle cx="8" cy="6" r="3" />
    <path strokeLinecap="round" d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5" />
    <circle cx="14" cy="6" r="2.5" />
    <path strokeLinecap="round" d="M17 17c0-2.5-1.5-4-3.5-4.5" />
  </svg>
)

const IconBuilding = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
    <path strokeLinecap="round" d="M3 17V8l7-5 7 5v9" />
    <path strokeLinecap="round" d="M3 17h14" />
    <rect x="7.5" y="11" width="2.5" height="3" rx="0.5" />
    <rect x="10" y="11" width="2.5" height="3" rx="0.5" />
    <path strokeLinecap="round" d="M10 3v5" />
  </svg>
)

const IconFilter = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-3.5 h-3.5">
    <path strokeLinecap="round" d="M3 5h14M6 10h8M9 15h2" />
  </svg>
)

const IconCalendar = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-3.5 h-3.5">
    <rect x="3" y="4" width="14" height="13" rx="2" />
    <path strokeLinecap="round" d="M3 9h14M7 2v4M13 2v4" />
  </svg>
)

const TIPO_ICONS = { autobus: IconBus, voluntariado: IconUsers, asociacion: IconBuilding }
const TIPO_LIST = Object.keys(TIPO_COLORS)

const ESTADO_STYLE = {
  Completo: 'bg-red-100 text-red-700',
  Abierto: 'bg-green-100 text-green-700',
  'Sin inscripciones': 'bg-slate-100 text-slate-500',
}

function exportarTodas(actividades) {
  const rows = actividades.map((a) => ({
    Tipo: TIPO_COLORS[a.tipo].label,
    Concepto: a.concepto,
    'Conductor / Responsable': a.conductor ?? a.voluntario ?? a.responsable ?? '',
    Fecha: a.fecha,
    Hora: a.hora,
    Lugar: a.lugar ?? '',
    Asociación: a.asociacion ?? '',
    'Plazas': a.plazas ?? '',
    'Participantes inscritos': a.participantes.length,
    Estado: a.plazas != null ? getEstado(a) : '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Actividades')
  XLSX.writeFile(wb, `actividades-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export default function ActivitiesPage({ actividades, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [posterSelectorOpen, setPosterSelectorOpen] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  // Filters
  const [filterTipos, setFilterTipos] = useState([])        // empty = all
  const [filterDate, setFilterDate] = useState(null)        // { from, to } or null
  const [tipoDropOpen, setTipoDropOpen] = useState(false)
  const [dateDropOpen, setDateDropOpen] = useState(false)
  const [tempFrom, setTempFrom] = useState('')
  const [tempTo, setTempTo] = useState('')

  const tipoRef = useRef(null)
  const dateRef = useRef(null)

  useEffect(() => {
    const h = (e) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target)) setTipoDropOpen(false)
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateDropOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const toggleTipo = (tipo) =>
    setFilterTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )

  const applyDate = () => {
    if (tempFrom || tempTo) setFilterDate({ from: tempFrom, to: tempTo })
    setDateDropOpen(false)
  }

  const clearDate = () => { setFilterDate(null); setTempFrom(''); setTempTo('') }
  const clearTipos = () => setFilterTipos([])

  // Apply filters
  const filtered = actividades.filter((a) => {
    if (filterTipos.length > 0 && !filterTipos.includes(a.tipo)) return false
    if (filterDate) {
      if (filterDate.from && a.fecha < filterDate.from) return false
      if (filterDate.to && a.fecha > filterDate.to) return false
    }
    return true
  }).sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

  const handleSave = (data) => {
    if (editTarget) onUpdate({ ...editTarget, ...data })
    else onAdd({ ...data, id: Date.now() })
    setShowModal(false)
    setEditTarget(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta actividad?')) onDelete(id)
  }

  const openEdit = (a) => { setEditTarget(a); setShowModal(true) }
  const openAdd = () => { setEditTarget(null); setShowModal(true) }

  const dateChipLabel = filterDate
    ? `${filterDate.from ? formatFecha(filterDate.from) : '…'} — ${filterDate.to ? formatFecha(filterDate.to) : '…'}`
    : null

  const hasFilters = filterTipos.length > 0 || filterDate

  return (
    <div className="flex flex-col h-full p-4 lg:p-6 gap-4 bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Actividades</h1>
          <p className="text-sm text-slate-500 mt-0.5">Autobús · Voluntariado · Asociaciones</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportarTodas(filtered)}
            className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-3.5 h-3.5">
              <path strokeLinecap="round" d="M10 3v10M6 9l4 4 4-4M3 15h14" />
            </svg>
            Exportar XLSX
          </button>
          <button
            onClick={() => setPosterSelectorOpen(true)}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            🖼 Generar cartel
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            + Nueva actividad
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex-shrink-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Tipo filter */}
          <div className="relative" ref={tipoRef}>
            <button
              onClick={() => { setTipoDropOpen((v) => !v); setDateDropOpen(false) }}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                filterTipos.length > 0
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <IconFilter />
              Tipo
              {filterTipos.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {filterTipos.length}
                </span>
              )}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-50">
                <path strokeLinecap="round" d="M4 6l4 4 4-4" />
              </svg>
            </button>

            {tipoDropOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filtrar por tipo</span>
                  {filterTipos.length > 0 && (
                    <button onClick={clearTipos} className="text-xs text-slate-400 hover:text-slate-600">Limpiar</button>
                  )}
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

          {/* Date filter */}
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => { setDateDropOpen((v) => !v); setTipoDropOpen(false) }}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                filterDate
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <IconCalendar />
              Fecha
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-50">
                <path strokeLinecap="round" d="M4 6l4 4 4-4" />
              </svg>
            </button>

            {dateDropOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-3 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rango de fechas</p>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Desde</label>
                    <input
                      type="date"
                      value={tempFrom}
                      onChange={(e) => setTempFrom(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Hasta</label>
                    <input
                      type="date"
                      value={tempTo}
                      onChange={(e) => setTempTo(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={applyDate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded-lg"
                  >
                    Aplicar
                  </button>
                  {filterDate && (
                    <button onClick={clearDate} className="px-3 py-1.5 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active count */}
          {hasFilters && (
            <span className="text-xs text-slate-500 ml-1">
              {filtered.length} de {actividades.length} actividades
            </span>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {filterTipos.map((tipo) => {
              const c = TIPO_COLORS[tipo]
              const TipoIcon = TIPO_ICONS[tipo]
              return (
                <span key={tipo} className="flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  <span className="text-blue-500"><TipoIcon /></span>
                  {c.label}
                  <button onClick={() => toggleTipo(tipo)} className="text-blue-400 hover:text-blue-700 ml-0.5 leading-none">×</button>
                </span>
              )
            })}
            {dateChipLabel && (
              <span className="flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                <IconCalendar />
                {dateChipLabel}
                <button onClick={clearDate} className="text-blue-400 hover:text-blue-700 ml-0.5 leading-none">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-6" />
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Tipo</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Concepto</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Responsable</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Fecha</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Hora</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Plazas</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Estado</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Lugar</th>
              <th className="text-right px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-slate-400 py-16 text-sm">
                  {hasFilters ? 'Ninguna actividad coincide con los filtros aplicados.' : 'No hay actividades. Pulsa "+ Nueva actividad" para crear una.'}
                </td>
              </tr>
            )}
            {filtered.map((a) => {
              const c = TIPO_COLORS[a.tipo]
              const TipoIcon = TIPO_ICONS[a.tipo]
              const responsable = a.conductor ?? a.voluntario ?? a.responsable ?? '—'
              const estado = getEstado(a)
              const isExpanded = expandedId === a.id
              const isLow = a.tipo === 'voluntariado' && a.participantes.length < 2

              return (
                <>
                  <tr
                    key={a.id}
                    onClick={() => setExpandedId(isExpanded ? null : a.id)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="pl-3 text-slate-400 text-xs select-none">{isExpanded ? '▾' : '▸'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md ${c.bgLight} ${c.text}`}>
                        <TipoIcon />
                        {c.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">{a.concepto}</td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{responsable}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatFecha(a.fecha)}</td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{a.hora}</td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                      {a.plazas != null ? `${a.participantes.length} / ${a.plazas}` : '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {a.plazas != null && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_STYLE[estado]}`}>
                            {estado}
                          </span>
                        )}
                        {isLow && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            ⚠️ Pocos
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {a.lugar
                        ? <span className="text-xs text-slate-500">📍 {a.lugar}</span>
                        : <span className="text-xs text-slate-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(a) }} className="text-xs text-blue-600 hover:text-blue-800 font-medium mr-3">
                        ✏️ Editar
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }} className="text-xs text-red-500 hover:text-red-700 font-medium">
                        🗑
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${a.id}-exp`} className="bg-slate-50/80">
                      <td colSpan={9} className="px-10 py-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Participantes inscritos ({a.participantes.length})
                        </p>
                        {a.participantes.length === 0 ? (
                          <p className="text-xs text-slate-400">Sin inscripciones.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {a.participantes.map((p, i) => (
                              <span key={i} className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1 text-slate-700">
                                <span className="font-medium">{p.nombre}</span>
                                {p.parada && <span className="text-slate-400"> · {p.parada}</span>}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddActivityModal
          tipo={editTarget?.tipo || 'autobus'}
          actividad={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null) }}
        />
      )}
      {posterSelectorOpen && (
        <PosterSelectorModal actividades={actividades} onClose={() => setPosterSelectorOpen(false)} />
      )}
    </div>
  )
}
