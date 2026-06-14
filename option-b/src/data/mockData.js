export const actividades = [
  {
    id: 1,
    tipo: 'autobus',
    concepto: 'Excursión a Toledo',
    conductor: 'Manuel García',
    fecha: '2025-07-15',
    hora: '09:00',
    plazas: 40,
    asociacion: 'Asociación de Mayores',
    participantes: [
      { nombre: 'Ana López', parada: 'Plaza Mayor' },
      { nombre: 'Luis Martín', parada: 'Calle del Pino' },
      { nombre: 'Rosa Pérez', parada: 'Avenida del Parque' },
    ],
  },
  {
    id: 2,
    tipo: 'voluntariado',
    concepto: 'Taller de jardinería comunitaria',
    voluntario: 'Sara Ruiz',
    fecha: '2025-07-18',
    hora: '10:30',
    plazas: 5,
    participantes: [
      { nombre: 'Pedro Sánchez', parada: 'Avenida Central' },
    ],
  },
  {
    id: 3,
    tipo: 'asociacion',
    concepto: 'Reunión mensual Asociación Cultural',
    responsable: 'Carmen Vega',
    fecha: '2025-07-22',
    hora: '18:00',
    lugar: 'Casa de Cultura',
    asociacion: 'Asociación Cultural El Pino',
    participantes: [],
  },
  {
    id: 4,
    tipo: 'autobus',
    concepto: 'Visita al Museo del Prado',
    conductor: 'Jorge Méndez',
    fecha: '2025-07-29',
    hora: '08:30',
    plazas: 35,
    asociacion: 'Club de Jubilados',
    participantes: [
      { nombre: 'María Fernández', parada: 'Calle Mayor' },
    ],
  },
  {
    id: 5,
    tipo: 'voluntariado',
    concepto: 'Recogida de alimentos — banco',
    voluntario: 'Elena Torres',
    fecha: '2025-08-05',
    hora: '09:00',
    plazas: 8,
    participantes: [
      { nombre: 'Raúl Gómez', parada: 'Mercado Central' },
      { nombre: 'Isabel Díaz', parada: 'Plaza del Sol' },
    ],
  },
  {
    id: 6,
    tipo: 'asociacion',
    concepto: 'Taller de pintura para mayores',
    responsable: 'Antonio Blanco',
    fecha: '2025-08-12',
    hora: '17:00',
    lugar: 'Centro Cívico Norte',
    asociacion: 'Asociación de Mayores',
    participantes: [],
  },
  {
    id: 7,
    tipo: 'autobus',
    concepto: 'Excursión a la Sierra de Guadarrama',
    conductor: 'Pedro Jiménez',
    fecha: '2025-08-19',
    hora: '07:45',
    plazas: 50,
    asociacion: 'Club Senderismo El Roble',
    participantes: [],
  },
  {
    id: 8,
    tipo: 'voluntariado',
    concepto: 'Limpieza del parque municipal',
    voluntario: null,
    fecha: '2025-08-26',
    hora: '08:00',
    plazas: 3,
    participantes: [
      { nombre: 'Carlos López', parada: 'Entrada Parque Norte' },
    ],
  },
]

export function getEstado(actividad) {
  const filled = actividad.participantes.length
  if (filled >= actividad.plazas) return 'Completo'
  if (filled > 0) return 'Abierto'
  return 'Sin inscripciones'
}

export const TIPO_COLORS = {
  autobus: {
    bg: 'bg-rioja-500',
    bgLight: 'bg-rioja-50',
    text: 'text-rioja-600',
    border: 'border-rioja-500',
    dot: '#C8102E',
    label: 'Autobús',
    icon: 'bus',
  },
  voluntariado: {
    bg: 'bg-laurel-500',
    bgLight: 'bg-laurel-50',
    text: 'text-laurel-600',
    border: 'border-laurel-500',
    dot: '#3F7D4E',
    label: 'Voluntariado',
    icon: 'handshake',
  },
  asociacion: {
    bg: 'bg-gold-500',
    bgLight: 'bg-gold-50',
    text: 'text-gold-700',
    border: 'border-gold-500',
    dot: '#B58623',
    label: 'Asociacións',
    icon: 'landmark',
  },
}
