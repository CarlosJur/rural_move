import { useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { MESES, DIAS_SEMANA_SHORT, mondayOffset } from '../utils/dateUtils'

export default function CalendarView({ actividades }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(2025)
  const [viewMonth, setViewMonth] = useState(6) // July = index 6

  const firstDay = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startOffset = mondayOffset(firstDay)

  // Build grid: leading empty cells + day cells
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const isoDate = (d) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const actsByDay = {}
  actividades.forEach((a) => {
    const [y, m, d] = a.fecha.split('-').map(Number)
    if (y === viewYear && m === viewMonth + 1) {
      if (!actsByDay[d]) actsByDay[d] = []
      actsByDay[d].push(a)
    }
  })

  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-600">‹</button>
        <span className="font-semibold text-slate-800">
          {MESES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-600">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {DIAS_SEMANA_SHORT.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayActs = day ? (actsByDay[day] || []) : []
          const visible = dayActs.slice(0, 3)
          const extra = dayActs.length - visible.length
          return (
            <div
              key={idx}
              className={`min-h-[80px] border-b border-r border-slate-100 p-1 ${
                day ? (isToday(day) ? 'bg-blue-50' : 'bg-white') : 'bg-slate-50/50'
              }`}
            >
              {day && (
                <>
                  <span
                    className={`text-xs font-medium ${
                      isToday(day)
                        ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {visible.map((a) => (
                      <span
                        key={a.id}
                        title={a.concepto}
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: TIPO_COLORS[a.tipo].dot }}
                      />
                    ))}
                    {extra > 0 && (
                      <span className="text-[9px] text-slate-400">+{extra}</span>
                    )}
                  </div>
                  {visible.map((a) => (
                    <div
                      key={a.id}
                      className="text-[10px] truncate rounded px-1 mt-0.5 text-white font-medium"
                      style={{ backgroundColor: TIPO_COLORS[a.tipo].dot }}
                      title={a.concepto}
                    >
                      {a.concepto}
                    </div>
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-200 bg-slate-50">
        {Object.entries(TIPO_COLORS).map(([tipo, c]) => (
          <div key={tipo} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.dot }} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}
