import { TIPO_COLORS } from '../data/mockData'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7)
const ROW_H = 64

export default function DayGrid({ currentDate, actividades, selectedTipos, onActivityClick }) {
  const iso = currentDate.toISOString().slice(0, 10)
  const [y, m, d] = iso.split('-').map(Number)

  const dayActs = actividades.filter(
    (a) => a.fecha === iso && selectedTipos.includes(a.tipo)
  )

  const topOffset = (hora) => {
    const [h, min] = hora.split(':').map(Number)
    return ((h - 7) + min / 60) * ROW_H
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Time gutter */}
      <div className="w-14 flex-shrink-0 border-r border-slate-200 bg-white">
        <div className="h-10 border-b border-slate-200" />
        <div className="relative" style={{ height: HOURS.length * ROW_H }}>
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute w-full text-right pr-2 text-xs text-slate-400"
              style={{ top: (h - 7) * ROW_H - 7 }}
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
      </div>

      {/* Day column */}
      <div className="flex-1 overflow-auto">
        {/* Day header */}
        <div className="h-10 border-b border-slate-200 flex items-center px-4 bg-white sticky top-0 z-10">
          <span className="font-semibold text-slate-800 text-sm">
            {d}/{m}/{y}
          </span>
          {dayActs.length > 0 && (
            <span className="ml-2 text-xs text-slate-500">({dayActs.length} actividades)</span>
          )}
        </div>

        {/* Time grid */}
        <div className="relative" style={{ height: HOURS.length * ROW_H }}>
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute left-0 right-0 border-t border-slate-100"
              style={{ top: (h - 7) * ROW_H }}
            />
          ))}

          {dayActs.map((a, i) => (
            <div
              key={a.id}
              onClick={() => onActivityClick(a)}
              className="absolute rounded-lg text-white text-sm font-medium px-3 py-2 cursor-pointer hover:opacity-90 overflow-hidden shadow-sm"
              style={{
                top: topOffset(a.hora),
                height: ROW_H - 6,
                left: `${(i % 2) * 50}%`,
                width: '48%',
                backgroundColor: TIPO_COLORS[a.tipo].dot,
              }}
              title={a.concepto}
            >
              <div className="font-bold truncate">{a.hora} — {a.concepto}</div>
              <div className="text-xs opacity-80 truncate">
                {a.conductor ?? a.voluntario ?? a.responsable ?? ''}
                {a.lugar ? ` · ${a.lugar}` : ''}
              </div>
            </div>
          ))}

          {dayActs.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
              Sin actividades este día
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
