import * as XLSX from 'xlsx'
import { getEstado, TIPO_COLORS } from '../data/mockData'

export function exportarTodas(actividades) {
  const rows = actividades.map((a) => ({
    ID: a.id,
    Tipo: TIPO_COLORS[a.tipo].label,
    Concepto: a.concepto,
    Fecha: a.fecha,
    Hora: a.hora,
    'Conductor / Voluntario': a.conductor ?? a.voluntario ?? '',
    Responsable: a.responsable ?? '',
    Asociación: a.asociacion ?? '',
    Lugar: a.lugar ?? '',
    Plazas: a.plazas ?? '',
    'Participantes inscritos': a.participantes.length,
    Estado: a.plazas != null ? getEstado(a) : '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Actividades')
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `actividades-${date}.xlsx`)
}
