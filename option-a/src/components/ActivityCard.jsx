import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { TIPO_ICONS, IconUsers, IconUser, IconMapPin, IconWarning, IconPencil, IconTrash, IconUserPlus } from './Icons'

export default function ActivityCard({ actividad, onEdit, onDelete, onAddParticipant }) {
  const c = TIPO_COLORS[actividad.tipo]
  const TipoIcon = TIPO_ICONS[actividad.tipo]

  return (
    <div className={`border-l-4 ${c.border} bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-2 min-w-0">
        <span className={`flex-shrink-0 mt-0.5 ${c.text}`}><TipoIcon /></span>
        <div className="min-w-0 flex-1">
          <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
          <p className="text-sm font-semibold text-slate-800 truncate">{actividad.concepto}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFecha(actividad.fecha)} · {actividad.hora}
            {actividad.plazas != null && (
              <span className="ml-2 inline-flex items-center gap-0.5">
                <IconUsers className="w-3 h-3" /> {actividad.participantes.length}/{actividad.plazas}
              </span>
            )}
          </p>
          {(actividad.conductor || actividad.voluntario || actividad.responsable) && (
            <p className="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1">
              <IconUser className="w-3 h-3 flex-shrink-0" />
              {actividad.conductor ?? actividad.voluntario ?? actividad.responsable}
            </p>
          )}
          {actividad.lugar && (
            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
              <IconMapPin className="w-3 h-3 flex-shrink-0" /> {actividad.lugar}
            </p>
          )}
          {actividad.tipo === 'voluntariado' && actividad.participantes.length < 2 && (
            <p className="text-xs text-yellow-600 font-medium mt-0.5 flex items-center gap-1">
              <IconWarning className="w-3 h-3" /> Pocos participantes
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <IconPencil /> Editar
        </button>
        <button
          onClick={onAddParticipant}
          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
        >
          <IconUserPlus /> Participante
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}
