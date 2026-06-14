import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { TIPO_ICONS } from './Icons'

export default function UpcomingList({ actividades }) {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = [...actividades]
    .filter((a) => a.fecha >= today)
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))
    .slice(0, 6)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-72 flex-shrink-0">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm">Próximas actividades</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {upcoming.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Sin actividades próximas</p>
        )}
        {upcoming.map((a) => {
          const c = TIPO_COLORS[a.tipo]
          const TipoIcon = TIPO_ICONS[a.tipo]
          return (
            <div key={a.id} className={`flex gap-3 p-3 border-l-4 ${c.border}`}>
              <span className={`flex-shrink-0 mt-0.5 ${c.text}`}><TipoIcon /></span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{a.concepto}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatFecha(a.fecha)} · {a.hora}
                </p>
                <span
                  className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-1 text-white font-medium ${c.bg}`}
                >
                  {c.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
