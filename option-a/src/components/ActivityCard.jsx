import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'

export default function ActivityCard({ actividad, onEdit, onDelete, onAddParticipant }) {
  const c = TIPO_COLORS[actividad.tipo]

  return (
    <div className={`border-l-4 ${c.border} bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-2 min-w-0">
        <span className="text-base flex-shrink-0 mt-0.5">{c.icon}</span>
        <div className="min-w-0 flex-1">
          <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
          <p className="text-sm font-semibold text-slate-800 truncate">{actividad.concepto}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFecha(actividad.fecha)} · {actividad.hora}
            {actividad.plazas != null && (
              <span className="ml-2">👥 {actividad.participantes.length}/{actividad.plazas}</span>
            )}
          </p>
          {(actividad.conductor || actividad.voluntario || actividad.responsable) && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              👤 {actividad.conductor ?? actividad.voluntario ?? actividad.responsable}
            </p>
          )}
          {actividad.lugar && (
            <p className="text-xs text-slate-400 truncate">📍 {actividad.lugar}</p>
          )}
          {actividad.tipo === 'voluntariado' && actividad.participantes.length < 2 && (
            <p className="text-xs text-yellow-600 font-medium mt-0.5">⚠️ Pocos participantes</p>
          )}
        </div>
      </div>

      {/* Inline actions */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          ✏️ Editar
        </button>
        <button
          onClick={onAddParticipant}
          className="text-xs text-green-600 hover:text-green-800 font-medium"
        >
          👤+ Participante
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
