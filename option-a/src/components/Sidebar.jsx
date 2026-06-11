import { TIPO_COLORS } from '../data/mockData'

const NAV_ITEMS = [
  { page: 'dashboard', label: 'Panel principal', icon: '🏠' },
  { page: 'autobus', label: 'Autobús', icon: TIPO_COLORS.autobus.icon, color: TIPO_COLORS.autobus.bg },
  { page: 'voluntariado', label: 'Voluntariado', icon: TIPO_COLORS.voluntariado.icon, color: TIPO_COLORS.voluntariado.bg },
  { page: 'asociaciones', label: 'Asociaciones', icon: TIPO_COLORS.asociacion.icon, color: TIPO_COLORS.asociacion.bg },
]

const BORDER_COLORS = {
  dashboard: 'border-slate-400',
  autobus: 'border-blue-600',
  voluntariado: 'border-green-600',
  asociaciones: 'border-orange-500',
}

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-56 bg-slate-800 text-white flex flex-col flex-shrink-0 h-screen">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <div>
            <div className="font-bold text-sm leading-tight">ERP Municipal</div>
            <div className="text-xs text-slate-400 leading-tight">Ayuntamiento</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ page, label, icon }) => {
          const isActive = currentPage === page
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${isActive
                  ? `bg-slate-700 border-l-4 ${BORDER_COLORS[page]} pl-2`
                  : 'hover:bg-slate-700/50 text-slate-300'
                }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">v1.0 — Demo</p>
      </div>
    </aside>
  )
}
