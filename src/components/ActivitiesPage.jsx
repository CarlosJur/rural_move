import { useEffect, useRef, useState } from 'react'
import { TIPO_COLORS, getEstado } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { exportarActividades } from '../utils/exportXLSX'
import Icon from './Icon'

const ESTADO_STYLE = {
  Completo: 'bg-rioja-100 text-rioja-700',
  Abierto: 'bg-laurel-100 text-laurel-700',
  'Sin inscripciones': 'bg-sage-100 text-sage-600',
}

function getPersoal(a) {
  return a.conductor ?? a.voluntario ?? a.responsable ?? '—'
}

export default function ActivitiesPage({ actividades, onAdd, onEdit, onDelete, onGenerarCartel }) {
  const [selectedTipos, setSelectedTipos] = useState(Object.keys(TIPO_COLORS))
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const filterRef = useRef(null)
  const exportRef = useRef(null)

  useEffect(() => {
    if (!filterOpen && !exportOpen) return
    const handleClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') { setFilterOpen(false); setExportOpen(false) }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [filterOpen, exportOpen])

  const toggleTipo = (tipo) =>
    setSelectedTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )

  const toggleSelect = (id, e) => {
    e.stopPropagation()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const tipos = Object.entries(TIPO_COLORS)
  const allActive = selectedTipos.length === tipos.length

  const filtered = actividades
    .filter((a) => selectedTipos.includes(a.tipo))
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

  const allFilteredSelected = filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id))
  const someFilteredSelected = filtered.some((a) => selectedIds.has(a.id))

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filtered.forEach((a) => next.delete(a.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filtered.forEach((a) => next.add(a.id))
        return next
      })
    }
  }

  const selectedActividades = filtered.filter((a) => selectedIds.has(a.id))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page header */}
      <div className="flex-shrink-0 bg-sage-gradient border-b border-sage-200">
        <div className="h-0.5 bg-gradient-to-r from-rioja-500 via-gold-400 to-rioja-500" />
        <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
          <div>
            <h1 className="heading-display text-2xl">Actividades</h1>
            <p className="text-xs text-sage-600 mt-0.5">
              Xestión de rutas, voluntariado e asociacións · {actividades.length} rexistros
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  filterOpen
                    ? 'bg-sage-100 border-sage-400 text-sage-800'
                    : 'bg-white border-sage-300 text-sage-700 hover:bg-sage-50'
                }`}
              >
                <Icon name="filter" size={15} /> Filtrar
                {!allActive && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rioja-500 rounded-full">
                    {selectedTipos.length}
                  </span>
                )}
                <Icon
                  name="chevron-down"
                  size={14}
                  className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-sage-200 rounded-xl shadow-card-hover z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-sage-100 bg-cream-50">
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-sage-600">
                      Tipos de actividade
                    </span>
                    <button
                      onClick={() =>
                        setSelectedTipos(allActive ? [] : Object.keys(TIPO_COLORS))
                      }
                      className="text-[11px] font-semibold text-rioja-500 hover:text-rioja-700"
                    >
                      {allActive ? 'Ningún' : 'Todos'}
                    </button>
                  </div>
                  <div className="py-1">
                    {tipos.map(([tipo, c]) => {
                      const active = selectedTipos.includes(tipo)
                      return (
                        <button
                          key={tipo}
                          onClick={() => toggleTipo(tipo)}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-sage-800 hover:bg-sage-50 transition-colors"
                        >
                          <span
                            className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                              active
                                ? `${c.bg} border-transparent text-white`
                                : 'bg-white border-sage-300 text-transparent'
                            }`}
                          >
                            <Icon name="check" size={12} strokeWidth={3} />
                          </span>
                          <span className={c.text}>
                            <Icon name={c.icon} size={15} />
                          </span>
                          <span className="font-medium">{c.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-sage-300" />

            <button
              onClick={() => selectedActividades.length > 0 && onGenerarCartel(selectedActividades)}
              disabled={selectedActividades.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sage-300 bg-white text-sage-700 text-sm font-semibold disabled:opacity-40 hover:bg-sage-50 transition-colors"
              title={selectedActividades.length === 0 ? 'Selecciona actividades para xerar o cartel' : `Xerar cartel para ${selectedActividades.length} actividade(s)`}
            >
              <Icon name="image" size={15} /> Xerar cartel{selectedActividades.length > 1 ? ` (${selectedActividades.length})` : ''}
            </button>
            {/* Export dropdown */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  exportOpen
                    ? 'bg-sage-800 text-white'
                    : 'bg-sage-700 hover:bg-sage-800 text-white'
                }`}
              >
                <Icon name="download" size={15} /> XLSX
                <Icon name="chevron-down" size={13} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-sage-200 rounded-xl shadow-card-hover z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-sage-100 bg-cream-50">
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-sage-600">Exportar XLSX</span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { exportarActividades(actividades, 'actividades'); setExportOpen(false) }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sage-800 hover:bg-sage-50 transition-colors"
                    >
                      <Icon name="download" size={14} className="text-sage-500" />
                      <span className="font-medium">Exportar todo</span>
                      <span className="ml-auto text-[11px] text-sage-400">{actividades.length}</span>
                    </button>
                    <button
                      onClick={() => { exportarActividades(selectedActividades, 'seleccion'); setExportOpen(false) }}
                      disabled={selectedActividades.length === 0}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sage-800 hover:bg-sage-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Icon name="check" size={14} className="text-sage-500" />
                      <span className="font-medium">Exportar selección</span>
                      <span className="ml-auto text-[11px] text-sage-400">{selectedActividades.length}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rioja-500 hover:bg-rioja-600 text-white text-sm font-semibold shadow-heraldic transition-colors"
            >
              <Icon name="plus" size={15} /> Nova
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6 bg-cream-50">
        <div className="bg-white rounded-xl border border-sage-200 shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sage-50 border-b border-sage-200">
                {/* Checkbox select-all */}
                <th className="w-10 pl-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAllFiltered}
                    ref={(el) => { if (el) el.indeterminate = !allFilteredSelected && someFilteredSelected }}
                    className="cursor-pointer accent-rioja-500"
                  />
                </th>
                {/* Expand chevron */}
                <th className="w-6" />
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Tipo
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5">
                  Concepto
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Data
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Hora saída
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Hora volta
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Persoal
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Prazas
                </th>
                <th className="text-left text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em] px-4 py-2.5 whitespace-nowrap">
                  Estado
                </th>
                <th className="text-right px-4 py-2.5 text-[11px] font-bold text-sage-600 uppercase tracking-[0.1em]">
                  Accións
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-sage-400 py-12 text-sm italic">
                    Sen actividades. Cambia o filtro ou preme «Nova» para crear unha.
                  </td>
                </tr>
              )}
              {filtered.map((a) => {
                const c = TIPO_COLORS[a.tipo]
                const estado = a.plazas != null ? getEstado(a) : null
                const isSelected = selectedIds.has(a.id)
                const isExpanded = expandedId === a.id

                return (
                  <>
                    <tr
                      key={a.id}
                      onClick={() => setExpandedId((prev) => (prev === a.id ? null : a.id))}
                      className={`border-b border-sage-100 cursor-pointer transition-colors ${
                        isSelected ? 'bg-rioja-50' : 'hover:bg-cream-50'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="pl-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelect(a.id, e)}
                          className="cursor-pointer accent-rioja-500"
                        />
                      </td>

                      {/* Expand chevron */}
                      <td className="pl-3 text-sage-400">
                        <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={13} />
                      </td>

                      {/* Tipo badge */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${c.bgLight} ${c.text}`}
                        >
                          <Icon name={c.icon} size={12} />
                          {c.label}
                        </span>
                      </td>

                      <td className="px-4 py-2.5">
                        <span className="font-semibold text-ink">{a.concepto}</span>
                        {a.lugar && (
                          <span className="block text-[11px] text-sage-500 mt-0.5">
                            <Icon name="map-pin" size={10} className="mr-0.5" />{a.lugar}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2.5 whitespace-nowrap text-sage-700">
                        {formatFecha(a.fecha)}
                      </td>

                      <td className="px-4 py-2.5 whitespace-nowrap text-sage-700">
                        {a.hora}
                      </td>

                      <td className="px-4 py-2.5 whitespace-nowrap text-sage-600">
                        {a.horaVuelta || <span className="text-sage-300">—</span>}
                      </td>

                      <td className="px-4 py-2.5 whitespace-nowrap text-sage-600">
                        {getPersoal(a)}
                      </td>

                      <td className="px-4 py-2.5 whitespace-nowrap text-sage-600">
                        {a.plazas != null
                          ? `${a.participantes.length} / ${a.plazas}`
                          : '—'}
                      </td>

                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {estado ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ESTADO_STYLE[estado] ?? ''}`}
                            >
                              {estado}
                            </span>
                            {a.tipo === 'voluntariado' && a.participantes.length < 2 && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded-full font-semibold">
                                <Icon name="alert" size={10} /> Poucos
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sage-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(a) }}
                          className="inline-flex items-center gap-1 text-xs text-sage-600 hover:text-sage-900 font-semibold mr-3 transition-colors"
                        >
                          <Icon name="pencil" size={12} /> Editar
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(a.id) }}
                          className="inline-flex items-center gap-1 text-xs text-rioja-500 hover:text-rioja-700 font-semibold transition-colors"
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${a.id}-exp`} className="bg-cream-50 border-b border-sage-100">
                        <td colSpan={11} className="px-8 py-3">
                          <p className="text-[11px] font-bold text-sage-600 uppercase tracking-[0.12em] mb-2">
                            Participantes inscritos ({a.participantes.length})
                          </p>
                          {a.participantes.length === 0 ? (
                            <p className="text-xs text-sage-400 italic">Sen inscricións aínda.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {a.participantes.map((p, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 text-xs bg-white border border-sage-200 rounded-lg px-3 py-1 text-ink"
                                >
                                  <Icon name="user" size={11} className="text-sage-400" />
                                  <span className="font-semibold">{p.nombre}</span>
                                  {p.parada && <span className="text-sage-400">· {p.parada}</span>}
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

        {selectedActividades.length > 0 && (
          <p className="text-[11px] text-sage-500 italic mt-3 text-right">
            {selectedActividades.length === 1
              ? <>Seleccionada: <span className="font-semibold text-rioja-600">{selectedActividades[0].concepto}</span></>
              : <><span className="font-semibold text-rioja-600">{selectedActividades.length} actividades</span> seleccionadas</>
            }
            {' '}— preme «Xerar cartel» para continuar.
          </p>
        )}
      </div>
    </div>
  )
}
