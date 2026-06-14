import { useRef, useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import { TIPO_ICONS, IconCalendar, IconClock, IconUser, IconMapPin, IconCommunity, IconUsers, IconBuilding, IconDownload } from './Icons'

export default function PosterModal({ actividad, onClose }) {
  const posterRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const c = TIPO_COLORS[actividad.tipo]
  const TipoIcon = TIPO_ICONS[actividad.tipo]

  const handleDescargar = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg">Generar cartel</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 flex justify-center">
          <div
            ref={posterRef}
            className="w-[560px] bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <div style={{ backgroundColor: c.dot }} className="h-2" />
            <div style={{ backgroundColor: c.dot }} className="px-8 py-6">
              <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <TipoIcon className="w-3.5 h-3.5" /> {c.label.toUpperCase()}
              </span>
              <h1 className="text-white text-2xl font-extrabold leading-tight mt-3">
                {actividad.concepto}
              </h1>
            </div>

            <div className="px-8 py-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={<IconCalendar />} label="Fecha" value={formatFecha(actividad.fecha)} />
                <InfoRow icon={<IconClock />} label="Hora" value={actividad.hora} />
              </div>
              {conductor && (
                <InfoRow
                  icon={<IconUser />}
                  label={actividad.conductor ? 'Conductor' : actividad.voluntario != null ? 'Voluntario conductor' : 'Responsable'}
                  value={conductor}
                />
              )}
              {actividad.lugar && <InfoRow icon={<IconMapPin />} label="Lugar" value={actividad.lugar} />}
              {actividad.asociacion && <InfoRow icon={<IconCommunity />} label="Asociación" value={actividad.asociacion} />}
              {actividad.plazas != null && (
                <InfoRow icon={<IconUsers />} label="Plazas disponibles" value={`${actividad.participantes.length} / ${actividad.plazas}`} />
              )}
            </div>

            <div className="px-8 py-4 flex items-center justify-between bg-slate-50 border-t border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-700">Ayuntamiento de Villarejo de Salvanés</p>
                <p className="text-xs text-slate-500">Concejalía de Cultura y Servicios Sociales</p>
              </div>
              <IconBuilding className="w-8 h-8 text-slate-200" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
            Cerrar
          </button>
          <button
            onClick={handleDescargar}
            disabled={downloading}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold disabled:opacity-60"
          >
            <IconDownload /> {downloading ? 'Generando...' : 'Descargar como imagen'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 text-slate-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}
