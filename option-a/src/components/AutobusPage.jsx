import { useState } from 'react'
import ActivityTable from './ActivityTable'
import AddActivityModal from './AddActivityModal'
import PosterModal from './PosterModal'
import { exportarPorTipo } from '../utils/exportXLSX'

export default function AutobusPage({ actividades, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [posterTarget, setPosterTarget] = useState(null)

  const filtered = actividades.filter((a) => a.tipo === 'autobus')

  const handleSave = (data) => {
    if (editTarget) {
      onUpdate({ ...editTarget, ...data })
    } else {
      onAdd({ ...data, tipo: 'autobus', id: Date.now() })
    }
    setShowModal(false)
    setEditTarget(null)
  }

  return (
    <div className="flex flex-col h-full p-6 bg-slate-50">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Autobús</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gestión de excursiones y rutas en autobús</p>
      </div>

      <ActivityTable
        tipo="autobus"
        actividades={filtered}
        onAdd={() => { setEditTarget(null); setShowModal(true) }}
        onEdit={(a) => { setEditTarget(a); setShowModal(true) }}
        onDelete={onDelete}
        onExportXLSX={() => exportarPorTipo(filtered, 'autobus')}
        onGenerarCartel={setPosterTarget}
      />

      {showModal && (
        <AddActivityModal
          tipo="autobus"
          actividad={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null) }}
        />
      )}

      {posterTarget && (
        <PosterModal actividad={posterTarget} onClose={() => setPosterTarget(null)} />
      )}
    </div>
  )
}
