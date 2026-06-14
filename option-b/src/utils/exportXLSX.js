import * as XLSX from 'xlsx'
import { getEstado, TIPO_COLORS } from '../data/mockData'

export function exportarActividades(actividades, fileName = 'actividades') {
  const wb = XLSX.utils.book_new()

  // Hoja 1: resumen de actividades
  const actRows = actividades.map((a) => ({
    ID: a.id,
    Tipo: TIPO_COLORS[a.tipo].label,
    Concepto: a.concepto,
    Data: a.fecha,
    'Hora saída': a.hora,
    'Hora volta': a.horaVuelta ?? '',
    'Condutor / Voluntario': a.conductor ?? a.voluntario ?? '',
    Responsable: a.responsable ?? '',
    Asociación: a.asociacion ?? '',
    Lugar: a.lugar ?? '',
    Prazas: a.plazas ?? '',
    'Participantes inscritos': a.participantes.length,
    Estado: a.plazas != null ? getEstado(a) : '',
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(actRows), 'Actividades')

  // Hoja 2: participantes con parada (solo actividades con inscritos)
  const partRows = []
  for (const a of actividades) {
    for (const p of a.participantes) {
      partRows.push({
        'ID actividade': a.id,
        Tipo: TIPO_COLORS[a.tipo].label,
        Concepto: a.concepto,
        Data: a.fecha,
        'Hora saída': a.hora,
        'Nome participante': p.nombre,
        'Parada / Punto recollida': p.parada ?? '',
      })
    }
  }
  if (partRows.length > 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(partRows), 'Participantes')
  }

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${fileName}-${date}.xlsx`)
}

// Compatibilidad con la llamada antigua (se puede eliminar si se actualiza todo)
export function exportarTodas(actividades) {
  exportarActividades(actividades, 'actividades')
}
