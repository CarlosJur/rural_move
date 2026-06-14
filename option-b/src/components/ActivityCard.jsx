import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import Icon from './Icon'

export default function ActivityCard({ actividad, onEdit, onDelete, onAddParticipant, compact = false }) {
  const c = TIPO_COLORS[actividad.tipo]

  if (compact) {
    return (
      <div className={`group relative flex items-center gap-2 px-2 py-1 rounded border-l-2 ${c.border} bg-white hover:bg-sage-50 transition-colors cursor-pointer`}>
        <span className={c.text}><Icon name={c.icon} size={13} /></span>
        <span className="text-xs font-semibold text-sage-800 truncate flex-1">{actividad.concepto}</span>
        <span className="text-xs text-sage-500">{actividad.hora}</span>
      </div>
    )
  }

  return (
    <div className={`relative border-l-4 ${c.border} bg-white rounded-lg p-3 shadow-card hover:shadow-card-hover transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={c.text}><Icon name={c.icon} size={14} /></span>
            <span className={`text-[10px] font-bold tracking-[0.12em] uppercase ${c.text}`}>{c.label}</span>
          </div>
          <p className="text-sm font-semibold text-ink truncate">{actividad.concepto}</p>
          <p className="text-xs text-sage-600 mt-0.5">
            {formatFecha(actividad.fecha)} · {actividad.hora}
            {actividad.plazas != null && (
              <span className="inline-flex items-center gap-1 ml-2"><Icon name="users" size={12} /> {actividad.participantes.length}/{actividad.plazas}</span>
            )}
          </p>
          {actividad.lugar && (
            <p className="inline-flex items-center gap-1 text-xs text-sage-500 mt-0.5"><Icon name="map-pin" size={12} /> {actividad.lugar}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-2 pt-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs text-sage-700 hover:text-sage-900 font-semibold transition-colors"
          title="Editar"
        >
          <Icon name="pencil" size={13} /> Editar
        </button>
        <button
          onClick={onAddParticipant}
          className="inline-flex items-center gap-1 text-xs text-laurel-600 hover:text-laurel-800 font-semibold transition-colors"
          title="Engadir participante"
        >
          <Icon name="user-plus" size={13} /> Participante
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center text-xs text-rioja-500 hover:text-rioja-700 font-semibold ml-auto transition-colors"
          title="Eliminar"
        >
          <Icon name="trash" size={14} />
        </button>
      </div>
    </div>
  )
}
