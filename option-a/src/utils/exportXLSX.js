import * as XLSX from 'xlsx'
import { getEstado } from '../data/mockData'

export function exportarPorTipo(actividades, tipo) {
  const mappers = {
    autobus: (a) => ({
      Concepto: a.concepto,
      Conductor: a.conductor ?? '',
      Fecha: a.fecha,
      Hora: a.hora,
      'Plazas disponibles': a.plazas,
      'Participantes inscritos': a.participantes.length,
      Estado: getEstado(a),
      Asociación: a.asociacion ?? '',
    }),
    voluntariado: (a) => ({
      Concepto: a.concepto,
      'Voluntario conductor': a.voluntario ?? 'Sin asignar',
      Fecha: a.fecha,
      Hora: a.hora,
      'Plazas disponibles': a.plazas,
      'Participantes inscritos': a.participantes.length,
      Estado: getEstado(a),
    }),
    asociacion: (a) => ({
      Concepto: a.concepto,
      Asociación: a.asociacion ?? '',
      Responsable: a.responsable ?? '',
      Fecha: a.fecha,
      Hora: a.hora,
      Lugar: a.lugar ?? '',
      'Participantes inscritos': a.participantes.length,
    }),
  }

  const sheetNames = {
    autobus: 'Autobús',
    voluntariado: 'Voluntariado',
    asociacion: 'Asociaciones',
  }

  const rows = actividades.map(mappers[tipo])
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetNames[tipo])
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `exportacion-${tipo}-${date}.xlsx`)
}
