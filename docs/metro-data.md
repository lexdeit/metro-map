# Datos del mapa

## Alcance

El mapa combina dos capas distintas y deben mantenerse separadas:

1. **Red de tránsito verificable:** nombres, líneas y secuencias de estaciones
   del Metro de Moscú real.
2. **Capa narrativa ficticia:** facciones, población, estados de control,
   peligros y descripciones inspiradas en *Metro 2033*.

No presentar la segunda capa como información histórica u oficial del Metro de
Moscú.

## Fuentes consultadas

La topología inicial se contrastó con estas fuentes públicas:

- [Moscow Metro - Wikipedia](https://en.wikipedia.org/wiki/Moscow_Metro)
- [List of Moscow Metro stations - Wikipedia](https://en.wikipedia.org/wiki/List_of_Moscow_Metro_stations)
- [Anexo: Estaciones del Metro de Moscú - Wikipedia en español](https://es.wikipedia.org/wiki/Anexo:Estaciones_del_Metro_de_Mosc%C3%BA)
- [Moscow Metro - sitio oficial](https://mosmetro.ru/)

Wikipedia es útil para contrastar nombres y secuencias, pero sus artículos
pueden cambiar y algunos datos necesitan más citas. Para una futura ampliación
de precisión geográfica se debe contrastar cada estación con el sitio oficial,
OpenStreetMap o una fuente institucional antes de publicar coordenadas reales.

## Estructura de datos

Los datos se encuentran en `data/metro/`:

- `stations.ts`: nodos, coordenadas esquemáticas, líneas, estado y contenido
  narrativo localizado.
- `lines.ts`: identidad visual y trazos SVG de cada línea.
- `connections.ts`: secuencias ordenadas de estaciones y aristas del grafo.
- `factions.ts`: facciones ficticias y color territorial.
- `hazards.ts`: peligros ficticios independientes de la red real.

Los identificadores son estables y están en kebab-case. No deben cambiarse sin
actualizar conexiones, rutas o referencias persistidas.

## Localización

Los nombres y descripciones que se muestran al usuario usan:

```ts
type LocalizedText = {
  es: string;
  en: string;
};
```

La interfaz se traduce en `lib/metro/i18n.ts`. El idioma por defecto es `es`.
Para agregar otro idioma hay que ampliar `SupportedLanguage`, todos los objetos
`LocalizedText` y el selector de idioma, sin crear copias de los componentes.

Los nombres propios de estaciones no se traducen: se conserva su transliteración
oficial en ambos idiomas cuando corresponde. Lo que sí se localiza son etiquetas,
descripciones, estados y textos de la interfaz.

## Geometría esquemática

Las coordenadas `x`/`y` no son coordenadas geográficas. Son posiciones de una
composición topológica inspirada en el mapa de referencia. La fuente de verdad
de la conectividad es `connections.ts`; la posición visual puede ajustarse sin
alterar el algoritmo de rutas.

Al agregar una estación:

1. Crear un `id` estable y su contenido `es`/`en`.
2. Añadirla a la secuencia de línea correspondiente en `connections.ts`.
3. Añadir todos sus `lineIds` en `stations.ts` para los intercambios.
4. Ajustar `x`, `y` y `labelPosition` para evitar colisiones.
5. Verificar que la ruta, búsqueda y panel sigan funcionando.

No definir estaciones o conexiones dentro de componentes React.

## Creador visual

El editor está disponible en [`/metro/editor`](../app/metro/editor/page.tsx). No
modifica los archivos fuente directamente: trabaja sobre un borrador en memoria
y permite guardarlo en `localStorage`, exportarlo como `moscow-metro-map.json` o
importarlo de nuevo.

Flujo recomendado:

1. Seleccionar una línea existente o crear una nueva.
2. Escribir el nombre de la estación en español e inglés.
3. Activar `Colocar estación` y hacer clic en la posición correcta del mapa.
4. Seleccionar `Conectar estaciones` y hacer clic en origen y destino.
5. Seleccionar cualquier estación para corregir su nombre, estado o posición de
   etiqueta en el inspector.
6. Guardar localmente durante el trabajo y exportar el JSON como respaldo.

El JSON exportado conserva `stations`, `lines` y `connections`, por lo que puede
revisarse o transformarse posteriormente para actualizar los archivos estáticos
de `data/metro/`. La herramienta no intenta inferir la topología: cada conexión
se crea de forma explícita para evitar que una geometría aproximada produzca una
ruta incorrecta.

## Validación recomendada

Antes de integrar una ampliación de datos, comprobar:

- Cada `from` y `to` existe en `stations`.
- Cada `lineId` existe en `lines`.
- No hay IDs duplicados.
- Las secuencias de `connections.ts` forman un grafo conectado donde se espera.
- Las estaciones de intercambio comparten todos sus `lineIds`.
- Todo texto visible tiene `es` y `en`.
- La ruta entre dos estaciones conocidas devuelve el orden esperado.

Ejecutar desde la raíz del proyecto:

```bash
bun run lint
bunx tsc --noEmit
bun run build
```
