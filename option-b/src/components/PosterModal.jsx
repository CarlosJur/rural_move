import { useRef, useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'

export default function PosterModal({ actividad, onClose }) {
  const posterRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const c = TIPO_COLORS[actividad.tipo]

  const handleDescargar = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FBF8F0',
      })
      const link = document.createElement('a')
      link.download = `cartel-${actividad.concepto.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const conductor =
    actividad.conductor ||
    actividad.voluntario ||
    actividad.responsable ||
    null

  return (
    <div className="fixed inset-0 bg-sage-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-cream-50 rounded-2xl shadow-2xl w-full max-w-2xl border border-sage-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-rioja-500 via-gold-400 to-rioja-500" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-sage-200 bg-sage-gradient">
          <h2 className="heading-display text-xl">Xerar cartel</h2>
          <button onClick={onClose} className="text-sage-600 hover:text-rioja-500 text-2xl leading-none transition-colors">&times;</button>
        </div>

        <div className="p-6 flex justify-center bg-cream-100">
          <div
            ref={posterRef}
            className="w-[560px] bg-cream-50 rounded-xl overflow-hidden shadow-card-hover border border-sage-200"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {/* Cabecera heráldica del cartel */}
            <div className="h-2" style={{ background: 'linear-gradient(90deg, #C8102E 0%, #CFA12E 50%, #C8102E 100%)' }} />
            <div className="px-8 py-5 flex items-center gap-4 border-b border-sage-200" style={{ backgroundColor: '#E6EFE8' }}>
              <img src="/escudo-san-xoan.jpg" alt="" className="h-14 w-auto drop-shadow-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-[0.18em]" style={{ color: '#810A1E' }}>CONCELLO DE SAN XOÁN DE RÍO</p>
                <p className="text-base italic font-bold mt-0.5" style={{ color: '#324740', fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Mobilidade rural · Axenda municipal
                </p>
              </div>
              <div className="flex flex-col items-end leading-none">
                <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', color: '#1A1A1A' }}>Rural</span>
                <span style={{ fontFamily: 'Dancing Script, cursive', fontWeight: 700, fontSize: '30px', color: '#C8102E', marginTop: '-8px', marginLeft: '4px' }}>move</span>
              </div>
            </div>

            {/* Banda del tipo */}
            <div style={{ backgroundColor: c.dot }} className="px-8 py-5">
              <span className="bg-white/25 text-white text-[10px] font-bold tracking-[0.15em] px-3 py-1 rounded-full">
                {c.icon} {c.label.toUpperCase()}
              </span>
              <h1 className="text-white text-2xl font-extrabold leading-tight mt-3" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}>
                {actividad.concepto}
              </h1>
            </div>

            <div className="px-8 py-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon="📅" label="Data" value={formatFecha(actividad.fecha)} />
                <InfoRow icon="🕐" label="Hora" value={actividad.hora} />
              </div>
              {conductor && (
                <InfoRow
                  icon="👤"
                  label={actividad.conductor ? 'Condutor' : actividad.voluntario != null ? 'Voluntario condutor' : 'Responsable'}
                  value={conductor}
                />
              )}
              {actividad.lugar && <InfoRow icon="📍" label="Lugar" value={actividad.lugar} />}
              {actividad.asociacion && <InfoRow icon="🏘️" label="Asociación" value={actividad.asociacion} />}
              {actividad.plazas != null && (
                <InfoRow icon="👥" label="Prazas dispoñibles" value={`${actividad.participantes.length} / ${actividad.plazas}`} />
              )}
            </div>

            {/* Pie institucional */}
            <div className="px-8 py-4 flex items-center justify-between border-t border-sage-200" style={{ backgroundColor: '#F5F0E2' }}>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em]" style={{ color: '#476356' }}>CONCELLO DE SAN XOÁN DE RÍO</p>
                <p className="italic mt-0.5" style={{ color: '#C8102E', fontFamily: 'Dancing Script, cursive', fontWeight: 700, fontSize: '18px', lineHeight: 1 }}>
                  Todos os camiños levan a San Xoán de Río
                </p>
              </div>
              <img src="/escudo-san-xoan.jpg" alt="" className="h-12 w-auto opacity-90" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-sage-200 bg-cream-100">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-sage-300 bg-white text-sage-700 text-sm font-semibold hover:bg-sage-50">
            Pechar
          </button>
          <button
            onClick={handleDescargar}
            disabled={downloading}
            className="px-5 py-2 rounded-lg bg-rioja-500 hover:bg-rioja-600 text-white text-sm font-semibold disabled:opacity-60 shadow-heraldic"
          >
            {downloading ? 'Xerando...' : '⬇ Descargar como imaxe'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] text-sage-600 font-bold uppercase tracking-[0.15em]">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}
