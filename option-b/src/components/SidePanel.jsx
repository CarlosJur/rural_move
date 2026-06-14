import { TIPO_COLORS } from '../data/mockData'
import { MESES } from '../utils/dateUtils'
import ActivityCard from './ActivityCard'

export default function SidePanel({ open, actividades, onEdit, onDelete, onAddParticipant, onNueva }) {
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
      className={`flex flex-col bg-cream-100 transition-all duration-300 overflow-hidden flex-shrink-0 ${
        open ? 'w-72' : 'w-0'
      }`}
    >
      <div className="w-72 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-sage-gradient">
          <h2 className="heading-display text-base">Axenda completa</h2>
          <button
            onClick={onNueva}
            className="text-xs bg-rioja-500 hover:bg-rioja-600 text-white px-2.5 py-1 rounded-lg font-semibold transition-colors shadow-sm"
          >
            + Nova
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 py-2 bg-[#F5F5F7]">
          {Object.entries(TIPO_COLORS).map(([tipo, c]) => (
            <div key={tipo} className="flex items-center gap-1 text-xs text-sage-700 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.dot }} />
              {c.label}
            </div>
          ))}
        </div>

        {/* Activity list */}
        <div className="overflow-y-auto flex-1 bg-[#F5F5F7]">
          {Object.entries(groups).map(([key, { label, items }]) => (
            <div key={key}>
              <div className="px-4 py-2 bg-gray-50 sticky top-0 backdrop-blur-sm">
                <span className="text-xs font-bold text-sage-700 uppercase tracking-[0.15em]">{label}</span>
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
            <p className="text-sm text-sage-500 text-center py-8 px-4 italic">
              Sen actividades. Preme "+ Nova" para crear unha.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
