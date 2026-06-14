import { TIPO_COLORS } from '../data/mockData'
import { MESES } from '../utils/dateUtils'
import { TIPO_ICONS, IconMenu, IconTable } from './Icons'

export default function Toolbar({
  currentDate,
  viewMode,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onToggleSidebar,
  onExportXLSX,
  onNuevaActividad,
  selectedTipos,
  onToggleTipo,
}) {
  const mes = MESES[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shadow-sm flex-shrink-0 gap-2 flex-wrap">
      {/* Left group */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 text-base"
          title="Alternar panel lateral"
        >
          <IconMenu />
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Hoy
        </button>
        <div className="flex">
          <button
            onClick={onPrev}
            className="px-2 py-1.5 border border-slate-300 rounded-l-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm"
          >
            ‹
          </button>
          <button
            onClick={onNext}
            className="px-2 py-1.5 border border-r border-t border-b border-slate-300 rounded-r-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm"
          >
            ›
          </button>
        </div>
        <span className="font-semibold text-slate-800 text-base whitespace-nowrap">
          {mes} {year}
        </span>
      </div>

      {/* Center: view toggle */}
      <div className="flex border border-slate-300 rounded-lg overflow-hidden">
        {[['month', 'Mes'], ['week', 'Semana'], ['day', 'Día']].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right group */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Tipo filter pills */}
        {Object.entries(TIPO_COLORS).map(([tipo, c]) => {
          const active = selectedTipos.includes(tipo)
          return (
            <button
              key={tipo}
              onClick={() => onToggleTipo(tipo)}
              className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                active
                  ? `${c.bg} text-white border-transparent`
                  : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
              }`}
            >
              {(() => { const I = TIPO_ICONS[tipo]; return <I className="w-3 h-3" /> })()} {c.label}
            </button>
          )
        })}

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          onClick={onNuevaActividad}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          + Nueva
        </button>
        <button
          onClick={onExportXLSX}
          className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <IconTable /> XLSX
        </button>
      </div>
    </div>
  )
}
