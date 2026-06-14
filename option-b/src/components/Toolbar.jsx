import { TIPO_COLORS } from '../data/mockData'
import { MESES } from '../utils/dateUtils'

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
    <div className="flex items-center justify-between h-14 px-4 border-b border-sage-200 bg-cream-50 shadow-sm flex-shrink-0 gap-2 flex-wrap">
      {/* Left group */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-sage-100 transition-colors text-sage-700 text-base"
          title="Alternar panel lateral"
        >
          ☰
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 border border-sage-300 rounded-lg text-sm font-semibold text-sage-800 bg-white hover:bg-sage-50 transition-colors"
        >
          Hoxe
        </button>
        <div className="flex">
          <button
            onClick={onPrev}
            className="px-2 py-1.5 border border-sage-300 rounded-l-lg text-sage-700 bg-white hover:bg-sage-50 transition-colors text-sm"
          >
            ‹
          </button>
          <button
            onClick={onNext}
            className="px-2 py-1.5 border border-r border-t border-b border-sage-300 rounded-r-lg text-sage-700 bg-white hover:bg-sage-50 transition-colors text-sm"
          >
            ›
          </button>
        </div>
        <span className="heading-display text-lg whitespace-nowrap text-sage-800">
          {mes} <span className="text-rioja-500 not-italic font-bold">{year}</span>
        </span>
      </div>

      {/* Center: view toggle */}
      <div className="flex border border-sage-300 rounded-lg overflow-hidden bg-white">
        {[['month', 'Mes'], ['week', 'Semana'], ['day', 'Día']].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
              viewMode === mode
                ? 'bg-sage-600 text-white'
                : 'text-sage-700 hover:bg-sage-50'
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
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                active
                  ? `${c.bg} text-white border-transparent shadow-sm`
                  : 'bg-white text-sage-600 border-sage-300 hover:border-sage-500'
              }`}
            >
              {c.icon} {c.label}
            </button>
          )
        })}

        <div className="w-px h-5 bg-sage-300 mx-1" />

        <button
          onClick={onNuevaActividad}
          className="flex items-center gap-1.5 bg-rioja-500 hover:bg-rioja-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-heraldic"
        >
          + Nova
        </button>
        <button
          onClick={onExportXLSX}
          className="flex items-center gap-1.5 bg-sage-700 hover:bg-sage-800 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          📊 XLSX
        </button>
      </div>
    </div>
  )
}
