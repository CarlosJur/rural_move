# Estética "Apple" — Rural Move (rama `probando_esteticas`)

Documento que describe la **nueva estética** de la opción B y **qué ha cambiado** respecto a los
diseños anteriores. Todos los cambios viven en la rama `probando_esteticas`.

---

## 1. Resumen de la nueva estética

Inspirada en la web de **apple.com / Apple Store**: minimalista, mucho espacio en blanco,
superficies en gris claro y blanco, texto casi negro, un único color de acento y **sin
decoración superflua** (se eliminaron las cintas heráldicas y la mayoría de líneas separadoras).

Principios:
- **Lienzo gris + tarjetas blancas**: el fondo general es gris claro y el contenido "flota" en blanco.
- **Tipografía de sistema** (SF Pro / `-apple-system`), limpia, sin serif itálico.
- **Color como acento**, no como relleno: la estructura es neutra (grises) y el color se reserva
  para acciones e indicadores.
- **Bordes mínimos**: se quitaron los divisores grises entre bloques para un look más moderno.

---

## 2. Paleta de color (actual)

Definida en `option-b/tailwind.config.js`.

### Superficies y fondos (`cream`)
| Token | HEX | Uso |
|---|---|---|
| `cream-50` | `#FFFFFF` | Tarjetas, celdas, superficies principales |
| `cream-100` | `#E8E8ED` | Lienzo / fondo general de la app y track del scroll |
| `cream-200` | `#DCDCDF` | Gris auxiliar |
| (valor directo) | `#F5F5F7` | Zonas secundarias: cabecera del calendario, leyenda, fondo tras las tarjetas del panel, cuadro de "actividades visibles" |
| (valor directo) | `#FAFAFC` | Celdas de días de otros meses (off-white) |

### Texto / grises neutros (`sage`)
La antigua paleta verde `sage` se **reconvirtió a grises Apple**.
| Token | HEX | Uso |
|---|---|---|
| `sage-500` | `#6E6E73` | Texto secundario (captions, labels) |
| `sage-700` | `#424245` | Texto secundario fuerte |
| `sage-800` | `#1D1D1F` | Texto principal (titulares y cuerpo) |
| `ink` | `#1D1D1F` | Color base de texto |

### Acento principal (`rioja`)
Reconvertida de rojo institucional a **azul de acción** (estilo enlaces Apple `#0066CC`/`#0071E3`).
| Token | HEX | Uso |
|---|---|---|
| `rioja-50` | `#E8F1FD` | Fondo "día de hoy" |
| `rioja-500` | `#002108` | **Barra superior (toolbar)** — actualmente fijada a este tono muy oscuro |
| `rioja-600` | `#0062C4` | Texto del botón "Nova", hovers de acción |

> Nota: la familia `rioja` es azul en casi todos sus tonos, pero el `500` está puesto en
> `#002108` (tono muy oscuro), que es el que pinta la barra superior. Si se quiere la barra en
> azul, basta con devolver `rioja-500` a `#0071E3` (o `#0066CC`).

### Colores de "tipo" de actividad (colores de sistema Apple)
| Tipo | Token | HEX |
|---|---|---|
| Autobús | `rioja` (azul) | `#0071E3` (dot) |
| Voluntariado | `laurel` (verde) | `#34C759` |
| Asociacións | `gold` (naranja) | `#FF9500` |

---

## 3. Tipografía

- **Cuerpo y titulares**: stack `-apple-system, BlinkMacSystemFont, "SF Pro…", Inter, system-ui`.
- `heading-display` (titulares): pasó de **Playfair Display itálico serif** a **sans-serif normal**,
  peso 600, `letter-spacing: -0.02em`, color casi negro.
- El logotipo "Rural move" conserva su tipografía de marca (Playfair + Dancing Script).

---

## 4. Iconografía

- Set propio de **iconos de línea minimalistas estilo Notion/Lucide** (`option-b/src/components/Icon.jsx`):
  trazo `currentColor`, grosor 1.75, esquinas redondeadas.
- Sustituyeron a los **emojis a color** (🚌 🤝 🏛️ 📅 📍 …).

---

## 5. Layout y estructura

- **Lienzo gris `#E8E8ED`** de fondo; el contenido (calendario, tarjetas) en blanco.
- **Calendario (vista Mes)**: celdas **cuadradas** (no redondeadas), días de otros meses en off-white.
- **Sombras** neutras y suaves (negro a baja opacidad) en lugar de sombras con tinte verde.
- **Filtro**: las antiguas píldoras de tipo se sustituyeron por un **botón "Filtrar" con desplegable**
  (checkboxes con color por tipo, atajo Todos/Ningún, cierra con clic fuera o `Esc`).

### Bordes eliminados (look moderno)
Se quitaron los divisores grises **entre bloques**:
- Cabecera y pie (líneas gruesas superior/inferior).
- Panel lateral: borde derecho y divisores de cabecera, leyenda y grupos de mes.
- Calendario: líneas de rejilla entre celdas y borde de la fila de días.
- Semana/Día: borde del carril horario y divisores de cabecera.
- Modales y tarjetas: divisores de cabecera, pie y acciones.

Se **mantienen** los bordes funcionales: botones, inputs, contorno de modales y del desplegable de
filtro, y las **líneas finas de hora** en las vistas Semana/Día.

---

## 6. Qué cambió respecto a las versiones anteriores

### Punto de partida — Diseño institucional verde (rama `opcion_b_carlos`)
- Paleta **verde sage + rojo rioja + dorado heráldico + crema marfil**.
- **Cintas heráldicas** rojo-dorado en cabeceras, pies y modales.
- Titulares en **Playfair Display itálico** (serif), aspecto "institucional/heráldico".
- **Emojis a color** como iconos.
- Fondos cálidos (marfil `#FBF8F0`) y sombras con tinte verde.

### Intermedia — Opción Azul / Blanco / Rojo
- Reconversión de la paleta a **azul (Galicia) + blanco + rojo**; tipos en azul/azul vivo/marino.
- Superficies pasadas a blanco; bordes a gris neutro.

### Actual — Opción Apple (este documento)
| Aspecto | Antes (verde institucional) | Ahora (Apple) |
|---|---|---|
| Fondo | marfil cálido `#FBF8F0` | gris neutro `#E8E8ED` + blanco |
| Acento | rojo `#C8102E` | azul `#0071E3` (barra en `#002108`) |
| Estructura | verde sage | grises neutros |
| Titulares | Playfair serif itálico | sans-serif (SF/system) |
| Iconos | emojis a color | iconos de línea monocromos |
| Decoración | cintas heráldicas rojo-dorado | eliminadas |
| Separadores | múltiples bordes grises | minimizados / eliminados |
| Sombras | tinte verde | neutras suaves |
| Tipos | rojo / verde laurel / dorado | azul / verde / naranja (sistema Apple) |

---

## 7. Historial de commits de la estética (`probando_esteticas`)

1. `opcion azul blanco rojo` — primera reconversión de paleta.
2. `estilo final de domingo` — estética Apple (grises/blanco, tipografía, toolbar, calendario).
3. `elimino_lineas_separadoras` — retirada de bordes entre bloques.
