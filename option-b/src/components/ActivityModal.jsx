import { useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg">
            {mode === 'edit' ? 'Editar actividad' : 'Nueva actividad'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Tipo selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
              Tipo de actividad
            </label>
            <div className="flex gap-2">
              {Object.entries(TIPO_COLORS).map(([tipo, col]) => (
                <button
                  key={tipo}
                  onClick={() => set('tipo', tipo)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors ${
                    form.tipo === tipo
                      ? `${col.bg} text-white border-transparent`
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {col.icon} {col.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Concepto *">
            <input
              value={form.concepto}
              onChange={(e) => set('concepto', e.target.value)}
              placeholder="Nombre de la actividad"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha *">
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => set('fecha', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </Field>
            <Field label="Hora *">
              <input
                type="time"
                value={form.hora}
                onChange={(e) => set('hora', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </Field>
          </div>

          {/* Conditional fields */}
          {form.tipo === 'autobus' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Conductor">
                  <input
                    value={form.conductor}
                    onChange={(e) => set('conductor', e.target.value)}
                    placeholder="Nombre del conductor"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Plazas">
                  <input
                    type="number"
                    min={1}
                    value={form.plazas}
                    onChange={(e) => set('plazas', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              <Field label="Asociación vinculada (opcional)">
                <input
                  value={form.asociacion}
                  onChange={(e) => set('asociacion', e.target.value)}
                  placeholder="Nombre de la asociación"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </Field>
            </>
          )}

          {form.tipo === 'voluntariado' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Voluntario conductor">
                  <input
                    value={form.voluntario}
                    onChange={(e) => set('voluntario', e.target.value)}
                    placeholder="Nombre del voluntario"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Plazas">
                  <input
                    type="number"
                    min={1}
                    value={form.plazas}
                    onChange={(e) => set('plazas', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              {voluntariadoWarning && (
                <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3 text-yellow-800 text-sm">
                  ⚠️ El voluntariado requiere mínimo 2 participantes además del conductor para poder realizarse.
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
                    placeholder="Nombre del responsable"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </Field>
                <Field label="Asociación">
                  <input
                    value={form.asociacion}
                    onChange={(e) => set('asociacion', e.target.value)}
                    placeholder="Nombre de la asociación"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </Field>
              </div>
              <Field label="Lugar">
                <input
                  value={form.lugar}
                  onChange={(e) => set('lugar', e.target.value)}
                  placeholder="Lugar de celebración"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </Field>
            </>
          )}

          {/* Participants */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Participantes ({form.participantes.length})
              </span>
              <button
                onClick={() => setShowAddP((v) => !v)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                + Añadir
              </button>
            </div>

            {form.participantes.length > 0 && (
              <div className="space-y-1 mb-2">
                {form.participantes.map((p, i) => (
                  <div key={i} className="flex items-center bg-slate-50 rounded px-3 py-1.5 text-sm gap-2">
                    <span className="font-medium text-slate-700">{p.nombre}</span>
                    {p.parada && <span className="text-slate-400 text-xs truncate flex-1">· {p.parada}</span>}
                    <button
                      onClick={() => removeParticipante(i)}
                      className="text-red-400 hover:text-red-600 text-xs ml-auto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddP && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-2 border border-blue-200">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    placeholder="Nombre"
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && addParticipante()}
                  />
                  <input
                    value={newParada}
                    onChange={(e) => setNewParada(e.target.value)}
                    placeholder="Parada / Punto de recogida"
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && addParticipante()}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addParticipante} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Confirmar
                  </button>
                  <button onClick={() => setShowAddP(false)} className="text-xs text-slate-500 hover:text-slate-700">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={handleSave} className={`px-5 py-2 rounded-lg text-white text-sm font-semibold ${c.bg} hover:opacity-90`}>
            {mode === 'edit' ? 'Guardar cambios' : 'Crear actividad'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
