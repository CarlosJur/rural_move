import { useRef, useState, forwardRef } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import Icon from './Icon'

export default function PosterModal({ actividades, onClose }) {
  const [mode, setMode] = useState('individual')
  const [downloading, setDownloading] = useState(false)
  const isMulti = actividades.length > 1

  const posterRefs = useRef([])
  const combinedRef = useRef(null)

  const handleDescargarIndividual = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      for (let i = 0; i < actividades.length; i++) {
        const el = posterRefs.current[i]
        if (!el) continue
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FBF8F0',
        })
        const link = document.createElement('a')
        link.download = `cartel-${actividades[i].concepto.replace(/\s+/g, '-').toLowerCase()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        await new Promise((r) => setTimeout(r, 300))
      }
    } finally {
      setDownloading(false)
    }
  }

  const handleDescargarCombinado = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(combinedRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FBF8F0',
      })
      const link = document.createElement('a')
      link.download = 'cartel-conjunto.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const handleDescargar = () => {
    if (!isMulti || mode === 'individual') handleDescargarIndividual()
    else handleDescargarCombinado()
  }

  const downloadLabel = () => {
    if (downloading) return 'Generando...'
    if (!isMulti || mode === 'individual') {
      return actividades.length === 1 ? (
        <>
          <Icon name="download" size={15} /> Descargar como imagen
        </>
      ) : (
        <>
          <Icon name="download" size={15} /> Descargar {actividades.length} carteles
        </>
      )
    }
    return (
      <>
        <Icon name="download" size={15} /> Descargar cartel conjunto
      </>
    )
  }

  return (
    <div className="fixed inset-0 bg-sage-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-cream-50 rounded-2xl shadow-2xl w-full max-w-2xl border border-sage-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-rioja-500 via-gold-400 to-rioja-500" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-sage-200 bg-sage-gradient">
          <h2 className="heading-display text-xl">
            {isMulti ? `Generar carteles (${actividades.length} seleccionados)` : 'Generar cartel'}
          </h2>
          <button
            onClick={onClose}
            className="text-sage-600 hover:text-rioja-500 transition-colors"
            title="Cerrar"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Mode selector — only shown for multi-selection */}
        {isMulti && (
          <div className="px-6 py-3 flex items-center gap-6 border-b border-sage-100 bg-cream-100">
            <span className="text-sm font-bold text-sage-700">Modo:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="posterMode"
                value="individual"
                checked={mode === 'individual'}
                onChange={() => setMode('individual')}
                className="accent-rioja-500"
              />
              <span className="text-sm font-semibold text-sage-800">Carteles individuales</span>
              <span className="text-xs text-sage-400">(un fichero por actividad)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="posterMode"
                value="conjunto"
                checked={mode === 'conjunto'}
                onChange={() => setMode('conjunto')}
                className="accent-rioja-500"
              />
              <span className="text-sm font-semibold text-sage-800">Cartel conjunto</span>
              <span className="text-xs text-sage-400">(un único cartel)</span>
            </label>
          </div>
        )}

        {/* Poster preview area */}
        <div className="p-6 overflow-y-auto max-h-[60vh] bg-cream-100 space-y-6">
          {!isMulti || mode === 'individual' ? (
            actividades.map((a, i) => (
              <div key={a.id} className="flex justify-center">
                <SinglePoster
                  actividad={a}
                  ref={(el) => {
                    posterRefs.current[i] = el
                  }}
                />
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <CombinedPoster actividades={actividades} ref={combinedRef} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-sage-200 bg-cream-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-sage-300 bg-white text-sage-700 text-sm font-semibold hover:bg-sage-50"
          >
            Cerrar
          </button>
          <button
            onClick={handleDescargar}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-rioja-500 hover:bg-rioja-600 text-white text-sm font-semibold disabled:opacity-60 shadow-heraldic"
          >
            {downloadLabel()}
          </button>
        </div>
      </div>
    </div>
  )
}

const SinglePoster = forwardRef(function SinglePoster({ actividad }, ref) {
  const c = TIPO_COLORS[actividad.tipo]
  const conductor = actividad.conductor || actividad.voluntario || actividad.responsable || null

  return (
    <div
      ref={ref}
      className="w-[560px] bg-cream-50 rounded-xl overflow-hidden shadow-card-hover border border-sage-200"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Cabeceira heráldica */}
      <div
        className="h-2"
        style={{ background: 'linear-gradient(90deg, #C8102E 0%, #CFA12E 50%, #C8102E 100%)' }}
      />
      <div
        className="px-8 py-5 flex items-center gap-4 border-b border-sage-200"
        style={{ backgroundColor: '#E6EFE8' }}
      >
        <img src="/escudo-san-xoan.jpg" alt="" className="h-14 w-auto drop-shadow-sm" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-[0.18em]" style={{ color: '#810A1E' }}>
            AYUNTAMIENTO DE SAN XOÁN DE RÍO
          </p>
          <p
            className="text-base italic font-bold mt-0.5"
            style={{ color: '#324740', fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Movilidad rural · Agenda municipal
          </p>
        </div>
        <div className="flex flex-col items-end leading-none">
          <span
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 900,
              fontSize: '24px',
              color: '#1A1A1A',
            }}
          >
            Rural
          </span>
          <span
            style={{
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 700,
              fontSize: '30px',
              color: '#C8102E',
              marginTop: '-8px',
              marginLeft: '4px',
            }}
          >
            move
          </span>
        </div>
      </div>

      {/* Banda do tipo */}
      <div style={{ backgroundColor: c.dot }} className="px-8 py-5">
        <span className="inline-flex items-center gap-1.5 bg-white/25 text-white text-[10px] font-bold tracking-[0.15em] px-3 py-1 rounded-full">
          <Icon name={c.icon} size={13} /> {c.label.toUpperCase()}
        </span>
        <h1
          className="text-white text-2xl font-extrabold leading-tight mt-3"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}
        >
          {actividad.concepto}
        </h1>
      </div>

      <div className="px-8 py-6 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <InfoRow icon="calendar" label="Data" value={formatFecha(actividad.fecha)} />
          <InfoRow
            icon="clock"
            label={actividad.horaVuelta ? 'Hora salida' : 'Hora'}
            value={actividad.hora}
          />
        </div>
        {actividad.horaVuelta && (
          <InfoRow icon="corner-down-left" label="Hora vuelta" value={actividad.horaVuelta} />
        )}
        {conductor && (
          <InfoRow
            icon="user"
            label={
              actividad.conductor
                ? 'Conductor'
                : actividad.voluntario != null
                  ? 'Voluntario conductor'
                  : 'Responsable'
            }
            value={conductor}
          />
        )}
        {actividad.lugar && <InfoRow icon="map-pin" label="Lugar" value={actividad.lugar} />}
        {actividad.asociacion && (
          <InfoRow icon="home" label="Asociación" value={actividad.asociacion} />
        )}
        {actividad.plazas != null && (
          <InfoRow icon="users" label="Plazas ofertadas" value={String(actividad.plazas)} />
        )}
      </div>

      {/* Pé institucional */}
      <div
        className="px-8 py-4 flex items-center justify-between border-t border-sage-200"
        style={{ backgroundColor: '#F5F0E2' }}
      >
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em]" style={{ color: '#476356' }}>
            AYUNTAMIENTO DE SAN XOÁN DE RÍO
          </p>
          <p
            className="italic mt-0.5"
            style={{
              color: '#C8102E',
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            Todos los caminos llevan a San Xoán de Río
          </p>
        </div>
        <img src="/escudo-san-xoan.jpg" alt="" className="h-12 w-auto opacity-90" />
      </div>
    </div>
  )
})

const CombinedPoster = forwardRef(function CombinedPoster({ actividades }, ref) {
  const tipos = [...new Set(actividades.map((a) => a.tipo))]
  const isMixed = tipos.length > 1
  const headerColor = isMixed ? '#476356' : TIPO_COLORS[tipos[0]].dot
  const headerIcon = isMixed ? 'calendar' : TIPO_COLORS[tipos[0]].icon
  const headerLabel = isMixed ? 'ACTIVIDADES' : TIPO_COLORS[tipos[0]].label.toUpperCase()

  return (
    <div
      ref={ref}
      className="w-[560px] bg-cream-50 rounded-xl overflow-hidden shadow-card-hover border border-sage-200"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Cabeceira heráldica */}
      <div
        className="h-2"
        style={{ background: 'linear-gradient(90deg, #C8102E 0%, #CFA12E 50%, #C8102E 100%)' }}
      />
      <div
        className="px-8 py-5 flex items-center gap-4 border-b border-sage-200"
        style={{ backgroundColor: '#E6EFE8' }}
      >
        <img src="/escudo-san-xoan.jpg" alt="" className="h-14 w-auto drop-shadow-sm" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-[0.18em]" style={{ color: '#810A1E' }}>
            AYUNTAMIENTO DE SAN XOÁN DE RÍO
          </p>
          <p
            className="text-base italic font-bold mt-0.5"
            style={{ color: '#324740', fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Movilidad rural · Agenda municipal
          </p>
        </div>
        <div className="flex flex-col items-end leading-none">
          <span
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 900,
              fontSize: '24px',
              color: '#1A1A1A',
            }}
          >
            Rural
          </span>
          <span
            style={{
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 700,
              fontSize: '30px',
              color: '#C8102E',
              marginTop: '-8px',
              marginLeft: '4px',
            }}
          >
            move
          </span>
        </div>
      </div>

      {/* Banda do tipo */}
      <div style={{ backgroundColor: headerColor }} className="px-8 py-4">
        <span className="inline-flex items-center gap-1.5 bg-white/25 text-white text-[10px] font-bold tracking-[0.15em] px-3 py-1 rounded-full">
          <Icon name={headerIcon} size={13} /> {headerLabel}
        </span>
        <h1
          className="text-white text-xl font-extrabold leading-tight mt-2"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}
        >
          {actividades.length} actividades seleccionadas
        </h1>
      </div>

      {/* Lista de actividades */}
      <div className="px-8 py-2 divide-y divide-sage-100">
        {actividades.map((a) => {
          const ac = TIPO_COLORS[a.tipo]
          return (
            <div key={a.id} className="py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={ac.text}>
                  <Icon name={ac.icon} size={13} />
                </span>
                <p
                  className="font-bold text-ink text-sm"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}
                >
                  {a.concepto}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-sage-600">
                <span className="inline-flex items-center gap-1">
                  <Icon name="calendar" size={11} /> {formatFecha(a.fecha)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" size={11} /> {a.hora}
                  {a.horaVuelta ? ` → ${a.horaVuelta}` : ''}
                </span>
                {a.plazas != null && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="users" size={11} /> {a.plazas} plazas
                  </span>
                )}
                {a.lugar && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="map-pin" size={11} /> {a.lugar}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pé institucional */}
      <div
        className="px-8 py-4 flex items-center justify-between border-t border-sage-200"
        style={{ backgroundColor: '#F5F0E2' }}
      >
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em]" style={{ color: '#476356' }}>
            AYUNTAMIENTO DE SAN XOÁN DE RÍO
          </p>
          <p
            className="italic mt-0.5"
            style={{
              color: '#C8102E',
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            Todos los caminos llevan a San Xoán de Río
          </p>
        </div>
        <img src="/escudo-san-xoan.jpg" alt="" className="h-12 w-auto opacity-90" />
      </div>
    </div>
  )
})

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sage-500 mt-0.5">
        <Icon name={icon} size={16} />
      </span>
      <div>
        <p className="text-[10px] text-sage-600 font-bold uppercase tracking-[0.15em]">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}
