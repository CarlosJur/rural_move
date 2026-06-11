export const formatFecha = (iso) => {
  if (!iso) return ''
  return iso.split('-').reverse().join('/')
}

export const mondayOffset = (date) => (date.getDay() + 6) % 7

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const DIAS_SEMANA_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
