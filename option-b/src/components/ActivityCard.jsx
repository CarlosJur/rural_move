import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { TIPO_ICONS, IconUsers, IconMapPin, IconPencil, IconTrash, IconUserPlus } from './Icons'

export default function ActivityCard({ actividad, onEdit, onDelete, onAddParticipant, compact = false }) {
  const c = TIPO_COLORS[actividad.tipo]
  const TipoIcon = TIPO_ICONS[actividad.tipo]

  if (compact) {
    return (
      <div className={`group relative flex items-center gap-2 px-2 py-1 rounded border-l-2 ${c.border} bg-white hover:bg-slate-50 transition-colors cursor-pointer`}>
        <span className={`flex-shrink-0 ${c.text}`}><TipoIcon className="w-3 h-3" /></span>
        <span className="text-xs font-medium text-slate-700 truncate flex-1">{actividad.concepto}</span>
        <span className="text-xs text-slate-400">{actividad.hora}</span>
      </div>
    )
  }

  return (
    <div className={`border-l-4 ${c.border} bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`${c.text}`}><TipoIcon /></span>
            <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 truncate">{actividad.concepto}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFecha(actividad.fecha)} · {actividad.hora}
            {actividad.plazas != null && (
              <span className="ml-2 inline-flex items-center gap-0.5">
                <IconUsers className="w-3 h-3" /> {actividad.participantes.length}/{actividad.plazas}
              </span>
            )}
          </p>
          {actividad.lugar && (
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <IconMapPin className="w-3 h-3 flex-shrink-0" /> {actividad.lugar}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          title="Editar"
        >
          <IconPencil /> Editar
        </button>
        <button
          onClick={onAddParticipant}
          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
          title="Añadir participante"
        >
          <IconUserPlus /> Participante
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
          title="Eliminar"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}
