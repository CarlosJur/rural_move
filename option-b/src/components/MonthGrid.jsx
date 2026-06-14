import { TIPO_COLORS } from '../data/mockData'
import { DIAS_SEMANA_SHORT, mondayOffset } from '../utils/dateUtils'

export default function MonthGrid({ currentDate, actividades, selectedTipos, onDayClick, onActivityClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = mondayOffset(firstDay)

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const isoOfDay = (d) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const actsByDay = {}
  actividades.forEach((a) => {
    const [y, m, d] = a.fecha.split('-').map(Number)
    if (y === year && m === month + 1 && selectedTipos.includes(a.tipo)) {
      if (!actsByDay[d]) actsByDay[d] = []
      actsByDay[d].push(a)
    }
  })

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-cream-50">
      {/* Day headers */}
      <div className="grid grid-cols-7 flex-shrink-0 bg-[#F5F5F7]">
        {DIAS_SEMANA_SHORT.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-500 py-2.5">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto bg-cream-50">
        {cells.map((day, idx) => {
          const dayActs = day ? (actsByDay[day] || []) : []
          const visible = dayActs.slice(0, 3)
          const extra = dayActs.length - visible.length
          const iso = day ? isoOfDay(day) : null

          return (
            <div
              key={idx}
              onClick={() => day && onDayClick(iso)}
              className={`group relative min-h-[104px] p-1.5 transition-colors ${
                day
                  ? isToday(day)
                    ? 'bg-rioja-50 hover:bg-rioja-100'
                    : 'bg-white hover:bg-sage-50 cursor-pointer'
                  : 'bg-[#FAFAFC]'
              }`}
            >
              {day && (
                <>
                  {/* Day number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                        isToday(day)
                          ? 'bg-rioja-500 text-white shadow-heraldic'
                          : 'text-sage-800'
                      }`}
                    >
                      {day}
                    </span>
                    {/* + button on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDayClick(iso) }}
                      className="opacity-0 group-hover:opacity-100 text-sage-400 hover:text-rioja-500 text-sm transition-opacity leading-none font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Activity chips */}
                  <div className="mt-1 space-y-0.5">
                    {visible.map((a) => (
                      <div
                        key={a.id}
                        onClick={(e) => { e.stopPropagation(); onActivityClick(a) }}
                        className="text-[11px] truncate rounded px-1.5 py-0.5 text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                        style={{ backgroundColor: TIPO_COLORS[a.tipo].dot }}
                        title={a.concepto}
                      >
                        {a.hora} {a.concepto}
                      </div>
                    ))}
                    {extra > 0 && (
                      <div
                        onClick={(e) => { e.stopPropagation(); onDayClick(iso) }}
                        className="text-[10px] text-sage-600 hover:text-sage-800 cursor-pointer pl-1 font-semibold"
                      >
                        +{extra} máis
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
