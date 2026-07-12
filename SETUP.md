# Rural Move — Instrucciones de instalación

## Requisitos previos

Instala **Node.js LTS** desde: https://nodejs.org

Verifica la instalación abriendo una terminal y ejecutando:
```
node --version   # debe mostrar v18 o superior
npm --version    # debe mostrar v9 o superior
```

---

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre el navegador en: **http://localhost:5173**

### Funcionalidades:
- Vista Mes / Semana / Día (conmutable desde la barra superior)
- Panel lateral con todas las actividades agrupadas por mes
- Clic en un día del calendario → abre formulario de nueva actividad
- Clic en una actividad → abre formulario de edición
- Filtros de tipo de actividad en la barra superior
- Exportar XLSX: descarga todas las actividades en un fichero .xlsx real
- Generar cartel: exporta una imagen PNG del cartel de la actividad

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

- Sin backend — todos los cambios son en memoria (se pierden al recargar)
- Para parar la app: pulsa Ctrl+C en la terminal
