# ERP Municipal — Instrucciones de instalación

## Requisitos previos

Instala **Node.js LTS** desde: https://nodejs.org

Verifica la instalación abriendo una terminal y ejecutando:
```
node --version   # debe mostrar v18 o superior
npm --version    # debe mostrar v9 o superior
```

---

## Opción A — Aplicación multi-pantalla

```bash
cd option-a
npm install
npm run dev
```

Abre el navegador en: **http://localhost:5173**

### Pantallas disponibles:
- Login → Panel principal con calendario y lista de próximas actividades
- Autobús → Tabla de excursiones con inscripción de participantes
- Voluntariado → Igual que Autobús, con aviso si hay menos de 3 participantes
- Asociaciones → Actividades de asociaciones locales

---

## Opción B — Aplicación calendario de pantalla única

```bash
cd option-b
npm install
npm run dev
```

Abre el navegador en: **http://localhost:5174**

### Funcionalidades:
- Vista Mes / Semana / Día (conmutable desde la barra superior)
- Panel lateral colapsable con todas las actividades
- Clic en un día del calendario → abre formulario de nueva actividad
- Clic en una actividad → abre formulario de edición
- Filtros de tipo de actividad en la barra superior
- Exportar XLSX: descarga todas las actividades en un fichero .xlsx real
- Generar cartel: disponible desde el panel lateral (editar actividad → botón cartel)

---

## Tecnologías utilizadas

| Librería | Uso |
|----------|-----|
| React 18 | Interfaz de usuario |
| Vite 5 | Servidor de desarrollo y build |
| Tailwind CSS 3 | Estilos |
| SheetJS (xlsx) | Exportación real a .xlsx |
| html2canvas | Descarga del cartel como PNG |

---

## Notas de demo

- Datos precargados: 8 actividades de julio–agosto 2025
- Sin backend — todos los cambios son en memoria (se pierden al recargar)
- Ambas apps pueden ejecutarse simultáneamente en puertos distintos (5173 y 5174)
