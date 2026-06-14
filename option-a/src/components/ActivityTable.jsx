import { useState } from 'react'
import { TIPO_COLORS, getEstado } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { TIPO_ICONS, IconWarning, IconPencil, IconTrash, IconTable, IconImage } from './Icons'

const COLUMN_DEFS = {
  autobus: [
    { key: 'concepto', label: 'Concepto' },
    { key: 'conductor', label: 'Conductor' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'plazas', label: 'Plazas' },
    { key: 'estado', label: 'Estado' },
  ],
  voluntariado: [
    { key: 'concepto', label: 'Concepto' },
    { key: 'voluntario', label: 'Voluntario conductor' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'plazas', label: 'Plazas' },
    { key: 'estado', label: 'Estado' },
  ],
  asociacion: [
    { key: 'concepto', label: 'Concepto' },
    { key: 'asociacion', label: 'Asociación' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'lugar', label: 'Lugar' },
  ],
}

const ESTADO_STYLE = {
  Completo: 'bg-red-100 text-red-700',
  Abierto: 'bg-green-100 text-green-700',
  'Sin inscripciones': 'bg-slate-100 text-slate-600',
}

export default function ActivityTable({
  tipo,
  actividades,
  onAdd,
  onEdit,
  onDelete,
  onExportXLSX,
  onGenerarCartel,
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const columns = COLUMN_DEFS[tipo]
  const c = TIPO_COLORS[tipo]

  const getCellValue = (a, key) => {
    switch (key) {
      case 'fecha': return formatFecha(a.fecha)
      case 'estado': return getEstado(a)
      case 'plazas': return `${a.participantes.length} / ${a.plazas}`
      default: return a[key] ?? '—'
    }
  }

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const isLowParticipants = (a) =>
    tipo === 'voluntariado' && a.participantes.length < 2

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full text-white ${c.bg}`}>
            {(() => { const I = TIPO_ICONS[tipo]; return <I className="w-3.5 h-3.5" /> })()}
            {c.label}
          </span>
          <span className="text-sm text-slate-500">{actividades.length} registros</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            + Añadir
          </button>
          <button
            onClick={onExportXLSX}
            className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <IconTable /> Exportar XLSX
          </button>
          <button
            onClick={() => selectedId && onGenerarCartel(actividades.find((a) => a.id === selectedId))}
            disabled={!selectedId}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            title={!selectedId ? 'Selecciona una fila primero' : ''}
          >
            <IconImage /> Generar cartel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-8" />
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {actividades.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center text-slate-400 py-12 text-sm">
                    No hay actividades. Pulsa "Añadir" para crear una.
                  </td>
                </tr>
              )}
              {actividades.map((a) => (
                <>
                  <tr
                    key={a.id}
                    onClick={() => {
                      setSelectedId((prev) => (prev === a.id ? null : a.id))
                      toggleExpand(a.id)
                    }}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${
                      selectedId === a.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Expand chevron */}
                    <td className="pl-3 text-slate-400 text-xs select-none">
                      {expandedId === a.id ? '▾' : '▸'}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.key === 'estado' ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                ESTADO_STYLE[getEstado(a)] || ''
                              }`}
                            >
                              {getEstado(a)}
                            </span>
                            {isLowParticipants(a) && (
                              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                                <IconWarning className="w-3 h-3" /> Pocos participantes
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={col.key === 'concepto' ? 'font-medium text-slate-800' : 'text-slate-600'}>
                            {getCellValue(a, col.key)}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(a) }}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium mr-3"
                      >
                        <IconPencil /> Editar
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(a.id) }}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        <IconTrash /> Eliminar
                      </button>
                    </td>
                  </tr>
                  {expandedId === a.id && (
                    <tr key={`${a.id}-exp`} className="bg-slate-50/80">
                      <td colSpan={columns.length + 2} className="px-8 py-3">
                        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                          Participantes inscritos ({a.participantes.length})
                        </p>
                        {a.participantes.length === 0 ? (
                          <p className="text-xs text-slate-400">Sin inscripciones aún.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {a.participantes.map((p, i) => (
                              <span
                                key={i}
                                className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1 text-slate-700"
                              >
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
