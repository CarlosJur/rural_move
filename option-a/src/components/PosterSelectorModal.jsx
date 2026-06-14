import { useState, useRef, useEffect } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import { formatFecha } from '../utils/dateUtils'
import {
  TIPO_ICONS,
  IconCalendar, IconClock, IconUser, IconMapPin, IconCommunity, IconUsers,
  IconBuilding, IconImage, IconPackage, IconCheckCircle, IconPrinter, IconDownload,
} from './Icons'

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

function SinglePosterLayout({ actividad, innerRef }) {
  const c = TIPO_COLORS[actividad.tipo]
  const TipoIcon = TIPO_ICONS[actividad.tipo]
  const conductor = actividad.conductor || actividad.voluntario || actividad.responsable || null
  return (
    <div
      ref={innerRef}
      className="bg-white rounded-xl overflow-hidden border border-slate-200"
      style={{ fontFamily: 'system-ui, sans-serif', width: '560px' }}
    >
      <div className="h-3" style={{ backgroundColor: c.dot }} />
      <div className="px-8 py-5" style={{ backgroundColor: c.dot }}>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <TipoIcon className="w-3.5 h-3.5" /> {c.label.toUpperCase()}
        </span>
        <h1 className="text-white text-2xl font-extrabold leading-tight mt-2">{actividad.concepto}</h1>
      </div>
      <div className="px-8 py-6 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <InfoRow icon={<IconCalendar />} label="Fecha" value={formatFecha(actividad.fecha)} />
          <InfoRow icon={<IconClock />} label="Hora" value={actividad.hora} />
        </div>
        {conductor && (
          <InfoRow
            icon={<IconUser />}
            label={actividad.conductor ? 'Conductor' : actividad.voluntario ? 'Voluntario conductor' : 'Responsable'}
            value={conductor}
          />
        )}
        {actividad.lugar && <InfoRow icon={<IconMapPin />} label="Lugar" value={actividad.lugar} />}
        {actividad.asociacion && <InfoRow icon={<IconCommunity />} label="Asociación" value={actividad.asociacion} />}
        {actividad.plazas != null && (
          <InfoRow icon={<IconUsers />} label="Plazas disponibles" value={`${actividad.participantes.length} / ${actividad.plazas}`} />
        )}
      </div>
      <div className="px-8 py-4 flex items-center justify-between" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div>
          <p className="text-xs font-bold text-slate-700">Ayuntamiento de Villarejo de Salvanés</p>
          <p className="text-xs text-slate-500">Concejalía de Cultura y Servicios Sociales</p>
        </div>
        <IconBuilding className="w-8 h-8 text-slate-200" />
      </div>
    </div>
  )
}

function CombinedPosterLayout({ actividades, innerRef }) {
  return (
    <div
      ref={innerRef}
      className="bg-white rounded-xl overflow-hidden border border-slate-200"
      style={{ fontFamily: 'system-ui, sans-serif', width: '620px' }}
    >
      <div style={{ backgroundColor: '#1e40af' }} className="px-8 py-5">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Ayuntamiento de Villarejo de Salvanés
        </p>
        <h1 className="text-white text-2xl font-extrabold mt-1">Actividades Municipales</h1>
      </div>
      <div className="px-8 py-5 space-y-5">
        {actividades.map((a, i) => {
          const c = TIPO_COLORS[a.tipo]
          const TipoIcon = TIPO_ICONS[a.tipo]
          const conductor = a.conductor || a.voluntario || a.responsable || null
          return (
            <div key={a.id}>
              {i > 0 && <div className="border-t border-slate-200 mb-5" />}
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: c.dot + '22' }}
                >
                  <span className={c.text}><TipoIcon className="w-4 h-4" /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${c.bgLight} ${c.text}`}>
                    {c.label.toUpperCase()}
                  </span>
                  <p className="text-base font-bold text-slate-800 leading-snug">{a.concepto}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <IconCalendar className="w-3 h-3" /> {formatFecha(a.fecha)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <IconClock className="w-3 h-3" /> {a.hora}
                    </span>
                    {conductor && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <IconUser className="w-3 h-3" /> {conductor}
                      </span>
                    )}
                    {a.lugar && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <IconMapPin className="w-3 h-3" /> {a.lugar}
                      </span>
                    )}
                    {a.plazas != null && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <IconUsers className="w-3 h-3" /> {a.participantes.length}/{a.plazas}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-8 py-3 flex items-center justify-between" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <p className="text-xs text-slate-500">Concejalía de Cultura y Servicios Sociales</p>
        <IconBuilding className="w-7 h-7 text-slate-200" />
      </div>
    </div>
  )
}

export default function PosterSelectorModal({ actividades, onClose }) {
  const [selectedIds, setSelectedIds] = useState(new Set(actividades.map(a => a.id)))
  const [step, setStep] = useState('select')
  const [downloading, setDownloading] = useState(false)
  const [renderIndex, setRenderIndex] = useState(0)
  const [done, setDone] = useState(false)
  const combinedRef = useRef(null)
  const separadoRef = useRef(null)
  const queueRef = useRef([])

  const selected = actividades.filter(a => selectedIds.has(a.id))
  const allSelected = actividades.length > 0 && selectedIds.size === actividades.length

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(actividades.map(a => a.id)))
  }

  const toggleId = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDescargarJuntos = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(combinedRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `carteles-combinados-${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const startSeparado = () => {
    queueRef.current = [...selected]
    setRenderIndex(0)
    setDone(false)
    setStep('separado')
    setDownloading(true)
  }

  useEffect(() => {
    if (step !== 'separado' || !downloading) return
    const queue = queueRef.current
    if (renderIndex >= queue.length) {
      setDownloading(false)
      setDone(true)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const { default: html2canvas } = await import('html2canvas')
        const canvas = await html2canvas(separadoRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        const link = document.createElement('a')
        const actividad = queue[renderIndex]
        link.download = `cartel-${actividad.concepto.replace(/\s+/g, '-').toLowerCase()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        setRenderIndex(i => i + 1)
      } catch {
        setRenderIndex(i => i + 1)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [step, downloading, renderIndex])

  if (step === 'select') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <h2 className="font-bold text-slate-800 text-lg">Generar carteles</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>

          <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Seleccionar todas ({actividades.length})
            </label>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
            {actividades.map(a => {
              const c = TIPO_COLORS[a.tipo]
              const TipoIcon = TIPO_ICONS[a.tipo]
              return (
                <label
                  key={a.id}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(a.id)}
                    onChange={() => toggleId(a.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md ${c.bgLight} ${c.text} flex-shrink-0`}>
                    <TipoIcon className="w-3 h-3" /> {c.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{a.concepto}</p>
                    <p className="text-xs text-slate-400">{formatFecha(a.fecha)} · {a.hora}</p>
                  </div>
                </label>
              )
            })}
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
            <p className="text-xs text-slate-500 mb-3">
              {selected.length} actividad{selected.length !== 1 ? 'es' : ''} seleccionada{selected.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => selected.length > 0 && setStep('juntos')}
                disabled={selected.length === 0}
                className="flex-1 flex flex-col items-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl py-3 px-4 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconImage className="w-5 h-5" />
                <span className="text-sm font-semibold">Crear juntos</span>
                <span className="text-[10px] text-blue-500 text-center leading-tight">
                  Un solo cartel con todas las actividades
                </span>
              </button>
              <button
                onClick={() => selected.length > 0 && startSeparado()}
                disabled={selected.length === 0}
                className="flex-1 flex flex-col items-center gap-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 rounded-xl py-3 px-4 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconPackage className="w-5 h-5" />
                <span className="text-sm font-semibold">Crear por separado</span>
                <span className="text-[10px] text-orange-500 text-center leading-tight">
                  Un cartel por actividad, todos a la vez
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'juntos') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('select')}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Volver
              </button>
              <h2 className="font-bold text-slate-800 text-lg">
                Cartel combinado · {selected.length} actividad{selected.length !== 1 ? 'es' : ''}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh] flex justify-center">
            <CombinedPosterLayout actividades={selected} innerRef={combinedRef} />
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              onClick={handleDescargarJuntos}
              disabled={downloading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              <IconDownload /> {downloading ? 'Generando…' : 'Descargar cartel'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const queue = queueRef.current
  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          {done ? (
            <>
              <div className="flex justify-center mb-4 text-green-500">
                <IconCheckCircle />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">¡Carteles listos!</h3>
              <p className="text-sm text-slate-500 mb-6">
                {queue.length} cartel{queue.length !== 1 ? 'es' : ''} descargado{queue.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Cerrar
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4 text-slate-400 animate-pulse">
                <IconPrinter />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Generando carteles…</h3>
              <p className="text-sm text-slate-500 mb-1">
                {renderIndex + 1} de {queue.length}
              </p>
              <p className="text-sm font-medium text-slate-700 mb-4 truncate px-4">
                {queue[renderIndex]?.concepto}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(renderIndex / queue.length) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {!done && queue[renderIndex] && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
          <SinglePosterLayout actividad={queue[renderIndex]} innerRef={separadoRef} />
        </div>
      )}
    </>
  )
}
