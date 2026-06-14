const IconHome = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 18V13h5v5" />
  </svg>
)

const IconList = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
    <rect x="3" y="4" width="14" height="3" rx="1" strokeLinecap="round" />
    <rect x="3" y="9" width="14" height="3" rx="1" strokeLinecap="round" />
    <rect x="3" y="14" width="14" height="3" rx="1" strokeLinecap="round" />
  </svg>
)

const NAV_ITEMS = [
  { page: 'dashboard',    label: 'Panel principal', Icon: IconHome,   border: 'border-slate-400' },
  { page: 'actividades',  label: 'Actividades',     Icon: IconList,   border: 'border-blue-400'  },
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-56 bg-slate-800 text-white flex flex-col flex-shrink-0 h-screen">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.6" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">ERP Municipal</div>
            <div className="text-xs text-slate-400 leading-tight">Ayuntamiento</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ page, label, Icon, border }) => {
          const isActive = currentPage === page
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${isActive
                  ? `bg-slate-700 border-l-4 ${border} pl-2 text-white`
                  : 'hover:bg-slate-700/50 text-slate-300'
                }`}
            >
              <Icon />
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
