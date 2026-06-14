import { useEffect, useRef, useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { MESES } from '../utils/dateUtils'
import Icon from './Icon'

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

  const tipos = Object.entries(TIPO_COLORS)
  const totalTipos = tipos.length
  const allActive = selectedTipos.length === totalTipos

  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    if (!filterOpen) return
    const handleClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
    }
    const handleKey = (e) => e.key === 'Escape' && setFilterOpen(false)
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [filterOpen])

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-cream-50 shadow-sm flex-shrink-0 gap-2 flex-wrap">
      {/* Left group */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-sage-100 transition-colors text-sage-700"
          title="Alternar panel lateral"
        >
          <Icon name="panel" size={18} />
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-sage-800 bg-white hover:bg-sage-50 transition-colors"
        >
          Hoxe
        </button>
        <div className="flex">
          <button
            onClick={onPrev}
            className="px-2 py-1.5 border border-gray-300 rounded-l-lg text-sage-700 bg-white hover:bg-sage-50 transition-colors"
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <button
            onClick={onNext}
            className="px-2 py-1.5 border border-r border-t border-b border-gray-300 rounded-r-lg text-sage-700 bg-white hover:bg-sage-50 transition-colors"
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
        <span className="heading-display text-lg whitespace-nowrap text-sage-800">
          {mes} <span className="text-rioja-500 not-italic font-bold">{year}</span>
        </span>
      </div>

      {/* Center: view toggle */}
      <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
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
        {/* Tipo filter dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              filterOpen
                ? 'bg-gray-100 border-gray-400 text-sage-800'
                : 'bg-white border-gray-300 text-sage-700 hover:bg-sage-50'
            }`}
          >
            <Icon name="filter" size={15} /> Filtrar
            {!allActive && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rioja-500 rounded-full">
                {selectedTipos.length}
              </span>
            )}
            <Icon name="chevron-down" size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-card-hover z-50 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-cream-50">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-sage-600">Tipos de actividade</span>
                <button
                  onClick={() => tipos.forEach(([tipo]) => {
                    const active = selectedTipos.includes(tipo)
                    if (allActive ? true : !active) onToggleTipo(tipo)
                  })}
                  className="text-[11px] font-semibold text-rioja-500 hover:text-rioja-700"
                >
                  {allActive ? 'Ningún' : 'Todos'}
                </button>
              </div>
              <div className="py-1">
                {tipos.map(([tipo, c]) => {
                  const active = selectedTipos.includes(tipo)
                  return (
                    <button
                      key={tipo}
                      onClick={() => onToggleTipo(tipo)}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-sage-800 hover:bg-sage-50 transition-colors"
                    >
                      <span
                        className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                          active ? `${c.bg} border-transparent text-white` : 'bg-white border-gray-300 text-transparent'
                        }`}
                      >
                        <Icon name="check" size={12} strokeWidth={3} />
                      </span>
                      <span className={c.text}><Icon name={c.icon} size={15} /></span>
                      <span className="font-medium">{c.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          onClick={onNuevaActividad}
          className="flex items-center gap-1.5 bg-rioja-500 hover:bg-rioja-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-heraldic"
        >
          <Icon name="plus" size={15} /> Nova
        </button>
        <button
          onClick={onExportXLSX}
          className="flex items-center gap-1.5 bg-sage-700 hover:bg-sage-800 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <Icon name="table" size={15} /> XLSX
        </button>
      </div>
    </div>
  )
}
