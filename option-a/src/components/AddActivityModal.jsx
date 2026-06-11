import { useState } from 'react'
import { TIPO_COLORS } from '../data/mockData'

const EMPTY = {
  autobus: { concepto: '', conductor: '', fecha: '', hora: '', plazas: 30, asociacion: '', participantes: [] },
  voluntariado: { concepto: '', voluntario: '', fecha: '', hora: '', plazas: 5, participantes: [] },
  asociacion: { concepto: '', responsable: '', fecha: '', hora: '', lugar: '', asociacion: '', participantes: [] },
}

export default function AddActivityModal({ tipo, actividad, onSave, onClose }) {
  const defaults = actividad
    ? { ...actividad }
    : { ...EMPTY[tipo], tipo }
  const [form, setForm] = useState(defaults)
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

  const isVoluntariadoWarning =
    tipo === 'voluntariado' && form.participantes.length < 2

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg">
            {actividad ? 'Editar actividad' : 'Nueva actividad'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Tipo badge */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${TIPO_COLORS[tipo].bg}`}>
              {TIPO_COLORS[tipo].icon} {TIPO_COLORS[tipo].label}
            </span>
          </div>

          <Field label="Concepto *">
            <input
              value={form.concepto}
              onChange={(e) => set('concepto', e.target.value)}
              placeholder="Nombre de la actividad"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha *">
              <input type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} className="input" />
            </Field>
            <Field label="Hora *">
              <input type="time" value={form.hora} onChange={(e) => set('hora', e.target.value)} className="input" />
            </Field>
          </div>

          {/* Type-specific fields */}
          {tipo === 'autobus' && (
            <>
              <Field label="Conductor">
                <input value={form.conductor} onChange={(e) => set('conductor', e.target.value)} placeholder="Nombre del conductor" className="input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Plazas">
                  <input type="number" min={1} value={form.plazas} onChange={(e) => set('plazas', Number(e.target.value))} className="input" />
                </Field>
                <Field label="Asociación vinculada">
                  <input value={form.asociacion} onChange={(e) => set('asociacion', e.target.value)} placeholder="Opcional" className="input" />
                </Field>
              </div>
            </>
          )}

          {tipo === 'voluntariado' && (
            <>
              <Field label="Voluntario conductor">
                <input value={form.voluntario || ''} onChange={(e) => set('voluntario', e.target.value)} placeholder="Nombre del voluntario" className="input" />
              </Field>
              <Field label="Plazas">
                <input type="number" min={1} value={form.plazas} onChange={(e) => set('plazas', Number(e.target.value))} className="input" />
              </Field>
              {isVoluntariadoWarning && (
                <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3 text-yellow-800 text-sm">
                  ⚠️ El voluntariado requiere al menos 2 participantes además del conductor para realizarse.
                </div>
              )}
            </>
          )}

          {tipo === 'asociacion' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Responsable">
                  <input value={form.responsable || ''} onChange={(e) => set('responsable', e.target.value)} placeholder="Nombre del responsable" className="input" />
                </Field>
                <Field label="Asociación">
                  <input value={form.asociacion || ''} onChange={(e) => set('asociacion', e.target.value)} placeholder="Nombre de la asociación" className="input" />
                </Field>
              </div>
              <Field label="Lugar">
                <input value={form.lugar || ''} onChange={(e) => set('lugar', e.target.value)} placeholder="Lugar de celebración" className="input" />
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
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded px-3 py-1.5 text-sm">
                    <span className="font-medium text-slate-700">{p.nombre}</span>
                    <span className="text-slate-500 text-xs mx-2 truncate">{p.parada}</span>
                    <button
                      onClick={() => removeParticipante(i)}
                      className="text-red-400 hover:text-red-600 ml-auto text-xs flex-shrink-0"
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
                    className="input text-sm"
                  />
                  <input
                    value={newParada}
                    onChange={(e) => setNewParada(e.target.value)}
                    placeholder="Parada"
                    className="input text-sm"
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
          <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">
            {actividad ? 'Guardar cambios' : 'Crear actividad'}
          </button>
        </div>
      </div>

      <style>{`.input { width:100%; border:1px solid #cbd5e1; border-radius:0.5rem; padding:0.4rem 0.625rem; font-size:0.875rem; outline:none; } .input:focus { ring: 2px; border-color:#3b82f6; }`}</style>
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
