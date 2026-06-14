import CalendarView from './CalendarView'
import AllActivitiesPanel from './AllActivitiesPanel'

export default function Dashboard({ actividades, onAdd, onUpdate, onDelete }) {
  return (
    <div className="flex flex-col h-full p-4 lg:p-6 gap-4 lg:gap-6 bg-slate-50 overflow-hidden">

      {/* Title */}
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Panel principal</h1>
        <p className="text-sm text-slate-500 mt-0.5">Resumen de actividades municipales</p>
      </div>

      {/* Content row — flex-1 min-h-0 is critical for children to scroll */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 min-h-0">

        {/* Calendar */}
        <div className="flex-1 min-w-0 overflow-auto">
          <CalendarView actividades={actividades} />
        </div>

        {/* Panel — needs explicit h for scroll to work */}
        <div className="lg:w-72 w-full flex-shrink-0 min-h-0 flex flex-col lg:h-full h-72">
          <AllActivitiesPanel
            actividades={actividades}
            onAdd={onAdd}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  )
}
