import CalendarView from './CalendarView'
import UpcomingList from './UpcomingList'

export default function Dashboard({ actividades }) {
  return (
    <div className="flex flex-col h-full p-6 gap-6 overflow-auto bg-slate-50">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Panel principal</h1>
        <p className="text-sm text-slate-500 mt-0.5">Resumen de actividades municipales</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="🚌" label="Excursiones en autobús" count={actividades.filter((a) => a.tipo === 'autobus').length} color="blue" />
        <StatCard icon="🤝" label="Rutas de voluntariado" count={actividades.filter((a) => a.tipo === 'voluntariado').length} color="green" />
        <StatCard icon="🏛️" label="Actividades de asociaciones" count={actividades.filter((a) => a.tipo === 'asociacion').length} color="orange" />
      </div>

      {/* Main content */}
      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          <CalendarView actividades={actividades} />
        </div>
        <UpcomingList actividades={actividades} />
      </div>
    </div>
  )
}

function StatCard({ icon, label, count, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  }
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 ${colors[color]}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs font-medium opacity-80">{label}</p>
      </div>
    </div>
  )
}
