import { TIPO_COLORS } from '../data/mockData'
import { mondayOffset, DIAS_SEMANA_SHORT, MESES_SHORT } from '../utils/dateUtils'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7:00–22:00
const ROW_H = 56 // px per hour

export default function WeekGrid({ currentDate, actividades, selectedTipos, onDayClick, onActivityClick }) {
  // Find the Monday of the week containing currentDate
  const offset = mondayOffset(currentDate)
  const monday = new Date(currentDate)
  monday.setDate(currentDate.getDate() - offset)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const today = new Date().toISOString().slice(0, 10)

  const actsByDay = {}
  actividades.forEach((a) => {
    if (!selectedTipos.includes(a.tipo)) return
    if (!actsByDay[a.fecha]) actsByDay[a.fecha] = []
    actsByDay[a.fecha].push(a)
  })

  const isoOf = (d) => d.toISOString().slice(0, 10)

  const topOffset = (hora) => {
    const [h, m] = hora.split(':').map(Number)
    return ((h - 7) + m / 60) * ROW_H
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Time gutter */}
      <div className="w-14 flex-shrink-0 border-r border-slate-200 bg-white">
        <div className="h-10 border-b border-slate-200" /> {/* header spacer */}
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

      {/* Day columns */}
      <div className="flex-1 overflow-auto">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 sticky top-0 bg-white z-10">
          {days.map((d, i) => {
            const iso = isoOf(d)
            const isToday = iso === today
            return (
              <div
                key={i}
                onClick={() => onDayClick(iso)}
                className={`text-center py-2 cursor-pointer hover:bg-slate-50 border-r border-slate-100 last:border-r-0 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className="text-xs text-slate-500">{DIAS_SEMANA_SHORT[i]}</div>
                <div
                  className={`text-sm font-semibold mt-0.5 w-7 h-7 rounded-full flex items-center justify-center mx-auto ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
                  }`}
                >
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-7 relative" style={{ height: HOURS.length * ROW_H }}>
          {/* Hour lines */}
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute left-0 right-0 border-t border-slate-100"
              style={{ top: (h - 7) * ROW_H }}
            />
          ))}

          {days.map((d, colIdx) => {
            const iso = isoOf(d)
            const dayActs = actsByDay[iso] || []
            const isToday = iso === today

            return (
              <div
                key={colIdx}
                className={`relative border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-blue-50/30' : ''}`}
                style={{ height: HOURS.length * ROW_H }}
              >
                {dayActs.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onActivityClick(a)}
                    className="absolute left-0.5 right-0.5 rounded text-white text-[11px] font-medium px-1 py-0.5 cursor-pointer hover:opacity-90 overflow-hidden"
                    style={{
                      top: topOffset(a.hora),
                      height: ROW_H - 4,
                      backgroundColor: TIPO_COLORS[a.tipo].dot,
                    }}
                    title={a.concepto}
                  >
                    {a.hora} {a.concepto}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
