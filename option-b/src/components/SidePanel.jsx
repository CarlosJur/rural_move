import { TIPO_COLORS } from '../data/mockData'
import { MESES } from '../utils/dateUtils'
import ActivityCard from './ActivityCard'

export default function SidePanel({ open, actividades, onEdit, onDelete, onAddParticipant, onNueva }) {
  const today = new Date().toISOString().slice(0, 10)
  const sorted = [...actividades]
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

  // Group by year-month
  const groups = {}
  sorted.forEach((a) => {
    const [y, m] = a.fecha.split('-')
    const key = `${y}-${m}`
    if (!groups[key]) groups[key] = { label: `${MESES[Number(m) - 1]} ${y}`, items: [] }
    groups[key].items.push(a)
  })

  return (
    <div
      className={`flex flex-col bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden flex-shrink-0 ${
        open ? 'w-72' : 'w-0'
      }`}
    >
      <div className="w-72">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800 text-sm">Todas las actividades</h2>
          <button
            onClick={onNueva}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-medium transition-colors"
          >
            + Nueva
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 py-2 border-b border-slate-100 bg-slate-50">
          {Object.entries(TIPO_COLORS).map(([tipo, c]) => (
            <div key={tipo} className="flex items-center gap-1 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.dot }} />
              {c.label}
            </div>
          ))}
        </div>

        {/* Activity list */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {Object.entries(groups).map(([key, { label, items }]) => (
            <div key={key}>
              <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 sticky top-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
              </div>
              <div className="px-3 py-2 space-y-2">
                {items.map((a) => (
                  <ActivityCard
                    key={a.id}
                    actividad={a}
                    onEdit={() => onEdit(a)}
                    onDelete={() => onDelete(a.id)}
                    onAddParticipant={() => onAddParticipant(a)}
                  />
                ))}
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8 px-4">
              Sin actividades. Pulsa "+ Nueva" para crear una.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
