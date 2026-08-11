# Metro // 2033 - Guia de estilo de interfaz

Este documento define el lenguaje visual utilizado por la experiencia de mapa en
`/metro`. Cualquier componente nuevo, panel, control o capa del mapa debe
respetar estas reglas para mantener una interfaz coherente.

## Direccion visual

La interfaz combina tres referencias:

- Cartografia esquematica de una red de metro.
- Terminales de operaciones y herramientas de exploracion.
- Un entorno subterraneo, tecnico y postapocaliptico, sin convertirse en una
  replica de una interfaz de videojuego.

El mapa es el elemento principal. Los paneles deben ayudar a interpretarlo y no
competir con el SVG. La UI debe sentirse sobria, funcional y ligeramente
desgastada: fondos oscuros, bordes finos, tipografia tecnica en etiquetas y un
uso controlado del color de acento.

## Paleta

Los colores base viven en `app/globals.css` como variables CSS:

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `#101517` | Fondo general de la aplicacion |
| `--foreground` | `#e8ebe6` | Texto principal |
| `--muted` | `#829095` | Texto secundario y descripciones |
| `--panel` | `#182125` | Paneles laterales y fichas |
| `--line` | `#2c393d` | Divisores y bordes discretos |
| `--accent` | `#d19a45` | Acciones, estado activo y referencias importantes |

Colores auxiliares ya usados:

- Verde operativo: `#70a978` para estados activos y confirmaciones.
- Rojo de alerta: `#d45252` o `#b76c62` para peligro, abandono o conflicto.
- Naranja de peligro: `#c67952` y `#d98b5e` para hazards.
- Azul grisaceo: `#5d91c7` para la linea Blue.
- Verde de linea: `#62a879` para la linea Emerald.
- Amarillo de linea: `#d19a45` para The Ring.

### Reglas de color

- Reservar `--accent` para acciones, seleccion, metadatos importantes y
  resaltados. No usarlo como color de fondo dominante.
- Mantener los fondos dentro de la familia `#101517` - `#202d31`.
- Usar texto principal claro solo para nombres y valores relevantes.
- Usar texto gris azulado para ayudas, etiquetas y coordenadas.
- Las facciones y lineas deben conservar sus colores definidos en los datos;
  no duplicarlos en los componentes.
- Un elemento desactivado se atenua con opacidad, no se elimina de forma que
  rompa el contexto del mapa.

## Tipografia

El layout carga Geist desde `next/font` en `app/layout.tsx`.

- Texto de lectura: Arial/`sans-serif`, con peso normal y line-height amplio.
- Etiquetas tecnicas: Geist Mono/`monospace`, en mayusculas y con `letter-spacing`
  amplio.
- Titulos de pantalla y estaciones: sans-serif ligera, sin exceso de peso.
- Eyebrows, estados, coordenadas, IDs y metadatos: mono, entre 8 y 10 px.
- Nombres de estaciones y titulos principales: entre 16 y 34 px según el
  contexto.

No introducir una nueva familia tipografica para un componente aislado. Las
etiquetas pequenas deben mantener el tratamiento tecnico existente:

```css
font: 10px var(--font-geist-mono), monospace;
letter-spacing: .13em;
```

## Layout y espaciado

- Header de escritorio: 68 px de alto.
- Toolbar del mapa: aproximadamente 100 px de alto.
- Padding horizontal principal: 32 px en escritorio y 16 px en mobile.
- Panel de filtros: 218 px.
- Panel de estacion: 290 px en escritorio.
- Bordes: `1px solid` en tonos de `#2c393d` o `#344348`.
- Radios: usar radios pequenos, normalmente 2 px. Evitar tarjetas muy
  redondeadas o sombras decorativas.
- Separar grupos con divisores finos antes que con tarjetas adicionales.

La composicion de escritorio es:

```text
header
toolbar / busqueda
filtros | mapa | panel contextual
route dock
```

En anchos menores a 900 px el panel contextual se convierte en un panel fijo
estrecho. En mobile, menor a 640 px, el panel contextual se convierte en un
bottom sheet y el panel de filtros se oculta para priorizar el mapa.

## Componentes

### Header

Usar el header para identidad y estado de red, no para navegacion compleja.
Mantener:

- Marca corta `M:`.
- Nombre del sistema en mono.
- Estado de red con un punto verde.
- Fecha o referencia operativa en texto atenuado.

### Paneles

Los paneles usan fondo `--panel`, borde fino y padding de 17 a 20 px.
Comenzar con un `panel-kicker` tecnico, seguir con el contenido principal y
usar `panel-rule` para separar secciones.

No convertir cada dato en una card. Para informacion corta usar grids,
listas con divisores y pills discretos.

### Botones

- Accion primaria: fondo `#b8833e`, texto oscuro, mono en mayusculas.
- Accion secundaria: fondo transparente o `#1b292d`, borde fino.
- Controles de mapa: cuadrados pequenos, minimo 31 px de alto.
- Cerrar: boton sin borde, simbolo `x`, gris por defecto y claro en hover.
- Toda accion debe tener estado hover y, cuando corresponda, estado disabled.

No usar gradientes, botones tipo pill ni sombras fuertes salvo para separar un
panel flotante del mapa.

### Inputs y selects

Usar fondo `#1c282c` o `#202d31`, borde `#344348`, texto claro y placeholder
gris. El focus debe cambiar el borde hacia un tono dorado y puede usar un halo
discreto:

```css
border-color: #806239;
box-shadow: 0 0 0 2px #80623933;
```

### Estados

- `active`: verde operativo.
- `captured` / informacion destacada: dorado.
- `independent`: azul verdoso.
- `abandoned` y `destroyed`: rojo apagado.
- Oculto por filtro: bajar opacidad, manteniendo la geometria.
- Seleccionado: halo dorado y glow sutil.
- Focus de teclado: debe ser visible y comportarse como hover.

## Mapa SVG

El mapa debe conservar la separacion de capas existente en
`components/metro/MetroMap.tsx`:

1. Fondo y grid.
2. Tuneles.
3. Paths principales de lineas.
4. Conexiones.
5. Peligros.
6. Estaciones.
7. Etiquetas.

El grupo `viewport` es el unico que recibe la transformacion de D3. React
renderiza los elementos SVG y D3 controla zoom, pan y transiciones; no usar
`d3.select(...).append(...)` para crear elementos del mapa.

### Lineas y conexiones

- Las lineas principales son paths gruesos, redondeados y continuos.
- Las conexiones son mas finas y toman el color de su linea desde los datos.
- Un tunel peligroso usa `stroke-dasharray`.
- Durante una ruta, las conexiones fuera de ella se atenuan y las activas
  reciben una animacion de dash y glow.
- Los nuevos trazados deben definirse en `data/metro/lines.ts` y las aristas en
  `data/metro/connections.ts`, nunca dentro del JSX.

### Estaciones

Las estaciones son grupos SVG con:

- Halo de la faccion.
- Centro claro.
- Label mono con stroke oscuro para legibilidad.
- Estados `hover`, `focus`, `selected` y `route-station`.

Cada estacion debe seguir siendo clickeable y accesible con teclado. Las
coordenadas, nombres y reglas de posicion del label pertenecen a los datos en
`data/metro/stations.ts`.

### Peligros

Los peligros viven en una capa separada y usan simbolos naranjas sobre circulos
oscuros. Deben poder ocultarse mediante el filtro global, enfocarse con mouse o
teclado y abrir un panel contextual.

## Animacion

Las animaciones deben ser cortas y funcionales:

- Hover de estacion: entre 200 y 300 ms.
- Apertura de panel: aproximadamente 300 ms.
- Focus de mapa: aproximadamente 650 ms.
- Ruta activa: dash continuo y glow moderado.

No animar permanentemente elementos que no comuniquen estado. Evitar rebotes,
escalados grandes y efectos de pantalla completa.

## Accesibilidad

- Todo boton debe tener texto o `aria-label`.
- Las estaciones y hazards deben incluir `role="button"`, `tabIndex={0}` y
  respuesta a `Enter` y `Space`.
- No depender solo de hover para mostrar informacion.
- Mantener contraste entre texto y fondos oscuros.
- Los estados de focus deben ser visibles.
- En mobile, los paneles deben poder cerrarse y no bloquear los controles sin
  una accion clara.

## Arquitectura para nuevas funcionalidades

Seguir esta separacion:

- `types/metro.ts`: contratos TypeScript.
- `data/metro/`: estaciones, lineas, conexiones, facciones y hazards.
- `lib/metro/`: algoritmos y transformaciones independientes de UI.
- `components/metro/`: piezas visuales pequenas y reutilizables.
- `app/metro/page.tsx`: composicion y estado de la experiencia.
- `app/globals.css`: tokens y estilos globales de la experiencia.

No añadir condiciones especificas para una estacion, faccion o hazard dentro de
un componente. Si una entidad necesita un tratamiento nuevo, preferir un campo
de datos o una regla basada en su tipo/estado.

## Checklist antes de extender la UI

- ¿El nuevo elemento usa la paleta existente?
- ¿La informacion pertenece a datos o esta accidentalmente hardcodeada en JSX?
- ¿El mapa mantiene sus capas SVG y el viewport de D3?
- ¿El componente funciona con teclado y tiene estados de focus?
- ¿La version mobile sigue priorizando el mapa?
- ¿La animacion comunica un estado o es solo decorativa?
- ¿Se mantuvieron `bun run lint`, `bunx tsc --noEmit` y `bun run build` sin
  errores?
