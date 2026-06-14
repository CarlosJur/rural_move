import { useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'
import Icon from './Icon'

const DEFAULTS = {
  tipo: 'autobus',
  concepto: '',
  fecha: '',
  hora: '',
  plazas: 20,
  conductor: '',
  voluntario: '',
  asociacion: '',
  responsable: '',
  lugar: '',
  participantes: [],
}

const inputCls = "w-full border border-sage-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-sage-600 focus:ring-2 focus:ring-sage-200 transition"

export default function ActivityModal({ actividad, prefillDate, mode, onSave, onClose }) {
  const initial = actividad
    ? { ...DEFAULTS, ...actividad }
    : { ...DEFAULTS, fecha: prefillDate || '' }

  const [form, setForm] = useState(initial)
  const [newNombre, setNewNombre] = useState('')
  const [newParada, setNewParada] = useState('')
  const [showAddP, setShowAddP] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const addParticipante = () => {
    if (!newNombre.trim()) return
    setForm((f) => ({
      ...f,
      participantes: [...f.participantes, { nombre: newNombre.trim(), parada: newParada.trim() }],
    }))
    setNewNombre('')
    setNewParada('')
    setShowAddP(false)
  }

  const removeParticipante = (idx) =>
    setForm((f) => ({ ...f, participantes: f.participantes.filter((_, i) => i !== idx) }))

  const handleSave = () => {
    if (!form.concepto.trim() || !form.fecha || !form.hora) return
    onSave(form)
  }

  const voluntariadoWarning = form.tipo === 'voluntariado' && form.participantes.length < 2
  const c = TIPO_COLORS[form.tipo] || TIPO_COLORS.autobus

  return (
    <div className="fixed inset-0 bg-sage-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-cream-50 rounded-2xl shadow-2xl w-full max-w-lg my-4 overflow-hidden border border-sage-200">
        {/* Cinta heráldica */}
        <div className="h-1 bg-gradient-to-r from-rioja-500 via-gold-400 to-rioja-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sage-200 bg-sage-gradient">
          <h2 className="heading-display text-xl">
            {mode === 'edit' ? 'Editar actividade' : 'Nova actividade'}
          </h2>
          <button onClick={onClose} className="text-sage-600 hover:text-rioja-500 transition-colors" title="Pechar"><Icon name="x" size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto bg-cream-50">
          {/* Tipo selector */}
          <div>
            <label className="block text-[10px] font-bold text-sage-700 mb-2 uppercase tracking-[0.15em]">
              Tipo de actividade
            </label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(TIPO_COLORS).map(([tipo, col]) => (
                <button
                  key={tipo}
                  onClick={() => set('tipo', tipo)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors ${
                    form.tipo === tipo
                      ? `${col.bg} text-white border-transparent shadow-sm`
                      : 'bg-white text-sage-700 border-sage-300 hover:border-sage-500'
                  }`}
                >
                  <Icon name={col.icon} size={14} /> {col.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Concepto *">
            <input
              value={form.concepto}
              onChange={(e) => set('concepto', e.target.value)}
              placeholder="Nome da actividade"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data *">
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => set('fecha', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Hora *">
              <input
                type="time"
                value={form.hora}
                onChange={(e) => set('hora', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Conditional fields */}
          {form.tipo === 'autobus' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Condutor">
                  <input
                    value={form.conductor}
                    onChange={(e) => set('conductor', e.target.value)}
                    placeholder="Nome do condutor"
                    className={inputCls}
                  />
                </Field>
                <Field label="Prazas">
                  <input
                    type="number"
                    min={1}
                    value={form.plazas}
                    onChange={(e) => set('plazas', Number(e.target.value))}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Asociación vinculada (opcional)">
                <input
                  value={form.asociacion}
                  onChange={(e) => set('asociacion', e.target.value)}
                  placeholder="Nome da asociación"
                  className={inputCls}
                />
              </Field>
            </>
          )}

          {form.tipo === 'voluntariado' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Voluntario condutor">
                  <input
                    value={form.voluntario}
                    onChange={(e) => set('voluntario', e.target.value)}
                    placeholder="Nome do voluntario"
                    className={inputCls}
                  />
                </Field>
                <Field label="Prazas">
                  <input
                    type="number"
                    min={1}
                    value={form.plazas}
                    onChange={(e) => set('plazas', Number(e.target.value))}
                    className={inputCls}
                  />
                </Field>
              </div>
              {voluntariadoWarning && (
                <div className="flex items-start gap-2 bg-gold-50 border border-gold-300 rounded-lg p-3 text-gold-800 text-sm">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                  <span>O voluntariado require un mínimo de 2 participantes ademais do condutor para poder realizarse.</span>
                </div>
              )}
            </>
          )}

          {form.tipo === 'asociacion' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Responsable">
                  <input
                    value={form.responsable}
                    onChange={(e) => set('responsable', e.target.value)}
                    placeholder="Nome do responsable"
                    className={inputCls}
                  />
                </Field>
                <Field label="Asociación">
                  <input
                    value={form.asociacion}
                    onChange={(e) => set('asociacion', e.target.value)}
                    placeholder="Nome da asociación"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Lugar">
                <input
                  value={form.lugar}
                  onChange={(e) => set('lugar', e.target.value)}
                  placeholder="Lugar de celebración"
                  className={inputCls}
                />
              </Field>
            </>
          )}

          {/* Participants */}
          <div className="pt-2 border-t border-sage-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-sage-800">
                Participantes ({form.participantes.length})
              </span>
              <button
                onClick={() => setShowAddP((v) => !v)}
                className="text-xs text-rioja-500 hover:text-rioja-700 font-semibold"
              >
                + Engadir
              </button>
            </div>

            {form.participantes.length > 0 && (
              <div className="space-y-1 mb-2">
                {form.participantes.map((p, i) => (
                  <div key={i} className="flex items-center bg-white border border-sage-200 rounded px-3 py-1.5 text-sm gap-2">
                    <span className="font-semibold text-sage-800">{p.nombre}</span>
                    {p.parada && <span className="text-sage-500 text-xs truncate flex-1">· {p.parada}</span>}
                    <button
                      onClick={() => removeParticipante(i)}
                      className="text-rioja-400 hover:text-rioja-600 ml-auto"
                      title="Quitar"
                    >
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddP && (
              <div className="bg-sage-50 rounded-lg p-3 space-y-2 border border-sage-300">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    placeholder="Nome"
                    className={inputCls}
                    onKeyDown={(e) => e.key === 'Enter' && addParticipante()}
                  />
                  <input
                    value={newParada}
                    onChange={(e) => setNewParada(e.target.value)}
                    placeholder="Parada / Punto de recollida"
                    className={inputCls}
                    onKeyDown={(e) => e.key === 'Enter' && addParticipante()}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addParticipante} className="text-xs bg-rioja-500 text-white px-3 py-1 rounded font-semibold hover:bg-rioja-600">
                    Confirmar
                  </button>
                  <button onClick={() => setShowAddP(false)} className="text-xs text-sage-600 hover:text-sage-800 font-semibold">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-sage-200 bg-cream-100">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-sage-300 bg-white text-sage-700 text-sm font-semibold hover:bg-sage-50">
            Cancelar
          </button>
          <button onClick={handleSave} className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-heraldic ${c.bg} hover:opacity-90`}>
            {mode === 'edit' ? 'Gardar cambios' : 'Crear actividade'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-sage-700 mb-1 uppercase tracking-[0.15em]">{label}</label>
      {children}
    </div>
  )
}
