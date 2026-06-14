import { useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import AddActivityModal from './AddActivityModal'
import PosterModal from './PosterModal'
import {
  TIPO_ICONS,
  IconCalendar, IconClock, IconUser, IconMapPin, IconCommunity, IconUsers,
  IconWarning, IconPencil, IconImage, IconTrash,
} from './Icons'

export default function ActivityDetailModal({ actividad, onClose, onUpdate, onDelete }) {
  const [mode, setMode] = useState('view')
  const c = TIPO_COLORS[actividad.tipo]
  const TipoIcon = TIPO_ICONS[actividad.tipo]

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar "${actividad.concepto}"?`)) {
      onDelete(actividad.id)
      onClose()
    }
  }

  const handleSave = (data) => {
    onUpdate({ ...actividad, ...data })
    onClose()
  }

  if (mode === 'edit') {
    return (
      <AddActivityModal
        tipo={actividad.tipo}
        actividad={actividad}
        onSave={handleSave}
        onClose={() => setMode('view')}
      />
    )
  }

  if (mode === 'poster') {
    return <PosterModal actividad={actividad} onClose={() => setMode('view')} />
  }

  const conductor = actividad.conductor ?? actividad.voluntario ?? actividad.responsable

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        <div style={{ backgroundColor: c.dot }} className="px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <TipoIcon className="w-3.5 h-3.5" /> {c.label}
              </span>
              <h2 className="text-white text-xl font-extrabold mt-2 leading-snug">
                {actividad.concepto}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl leading-none flex-shrink-0 mt-1"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={<IconCalendar />} label="Fecha" value={formatFecha(actividad.fecha)} />
            <InfoRow icon={<IconClock />} label="Hora" value={actividad.hora} />
          </div>

          {conductor && (
            <InfoRow
              icon={<IconUser />}
              label={actividad.conductor ? 'Conductor' : actividad.voluntario != null ? 'Voluntario conductor' : 'Responsable'}
              value={conductor}
            />
          )}
          {actividad.lugar && <InfoRow icon={<IconMapPin />} label="Lugar" value={actividad.lugar} />}
          {actividad.asociacion && <InfoRow icon={<IconCommunity />} label="Asociación" value={actividad.asociacion} />}
          {actividad.plazas != null && (
            <InfoRow
              icon={<IconUsers />}
              label="Participantes"
              value={`${actividad.participantes.length} de ${actividad.plazas} plazas`}
            />
          )}

          {actividad.participantes.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Inscritos
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {actividad.participantes.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-1.5 text-sm">
                    <span className="font-medium text-slate-700">{p.nombre}</span>
                    {p.parada && (
                      <span className="text-slate-400 text-xs ml-2 truncate">{p.parada}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {actividad.tipo === 'voluntariado' && actividad.participantes.length < 2 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2.5 text-yellow-800 text-xs flex items-start gap-2">
              <IconWarning className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Menos de 3 participantes — el viaje podría no realizarse.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setMode('edit')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            <IconPencil className="w-3.5 h-3.5" /> Editar
          </button>
          <button
            onClick={() => setMode('poster')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            <IconImage className="w-3.5 h-3.5" /> Cartel
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex-shrink-0 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}
