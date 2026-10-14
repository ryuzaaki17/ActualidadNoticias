# Actualidad Noticias

**Proyecto Front-End — Institución Universitaria Politécnico Grancolombiano**  
**Asignatura:** Front-End  
**Estudiante:** Jeisson Arley López Barrientos  
**Profesor:** John Olarte  
**Programa:** Ingeniería de Software  
**Año:** 2026

---

## Descripción del proyecto

**Actualidad Noticias** es una plataforma web de noticias orientada al consumo interactivo de información del día. Su principal diferenciador es el sistema de votación **“Destacar”**: los usuarios votan por las noticias que consideran más relevantes y, a mayor cantidad de votos, mayor es el tamaño visual de la tarjeta en la página de inicio.

El diseño sigue una estética **editorial moderna en modo oscuro**, con una paleta basada en negro profundo, blanco y el color de acento rojo `#E63946`.

### Funcionalidades principales

- Página de inicio con grid tipo masonry (tamaño de tarjetas según votos)
- Sistema de votación “Destacar”
- Efecto visual sutil de movimiento en las tarjetas
- Listado de todas las noticias con **filtro por categoría**
- Vista de detalle de cada noticia
- Agregar noticia mediante URL (simulación de scraping)
- Página de contacto con validación de formulario
- Diseño responsive con Bootstrap 5

---

## Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura de las páginas |
| **CSS3** | Estilos personalizados (clases en español) |
| **JavaScript (ES6+)** | Interactividad, votación, filtros, formularios |
| **Bootstrap 5** | Layout responsive, navbar, grid y utilidades |
| **Bootstrap Icons** | Iconografía |

> Solo se utilizan estas tecnologías. No hay frameworks adicionales ni backend real.

---

## Estructura del proyecto

```
Actualidad_Noticias/
├── index.html          # Página de inicio (Home)
├── listado.html        # Todas las noticias + filtros por categoría
├── detalle.html        # Vista de detalle de una noticia
├── agregar.html        # Agregar noticia desde un enlace (URL)
├── contacto.html       # Formulario de contacto
├── estilos             # Carpeta de archivos de estilos css
├──── styles.css          # Estilos personalizados del sitio
├── js                  # Carpeta de archivos JS
├──── script.js           # Lógica JavaScript compartida
└── README.md           # Este archivo
```

---

## Descripción de cada archivo

### `index.html`
Página principal del sitio. Muestra las noticias del día en un **grid dinámico tipo masonry**. El tamaño de cada tarjeta (`tarjeta-pequena`, `tarjeta-mediana` o `tarjeta-grande`) depende de la cantidad de votos “Destacar”. Incluye el header de navegación, el título “Noticias del día” y el footer.

### `listado.html`
Vista secundaria que lista **todas las noticias** publicadas. Incluye botones de filtro por categoría (Política, Economía, Internacional, Sociedad, Tecnología, Deportes). Al hacer clic en una categoría, el listado se actualiza dinámicamente.

### `detalle.html`
Muestra el contenido completo de una noticia seleccionada: imagen hero, título, fecha, fuente, categoría, cuerpo del artículo y un panel lateral con el botón **“Destacar esta noticia”**, opciones de guardar/compartir y enlace para volver al inicio. La noticia se carga según el parámetro `?id=` de la URL.

### `agregar.html`
Permite publicar una nueva noticia **pegando un enlace (URL)**. Al procesar, se simula un proceso de scraping que extrae título, imagen, resumen y fuente. Se muestra una vista previa y, tras confirmar, se simula la publicación.

### `contacto.html`
Formulario de contacto con campos Nombre, Correo electrónico y Mensaje. Incluye **validación en tiempo real** (campos obligatorios, formato de correo y mínimo de 20 caracteres en el mensaje). Al enviar correctamente se muestra un mensaje de confirmación.

### `styles.css`
Hoja de estilos personalizada del proyecto. Define variables CSS (colores, bordes, sombras), el tema oscuro, los tamaños de las tarjetas del Home, el overlay de las imágenes, los formularios, el panel de acciones del detalle y estilos responsive. Las **clases propias están escritas en español** y el código está comentado.

### `script.js`
Lógica JavaScript compartida por todas las páginas. Contiene:
- Datos de ejemplo de noticias
- Renderizado del grid del Home y del listado
- Carga del detalle según el ID
- Sistema de votación “Destacar”
- Simulación de scraping en Agregar Noticia
- Validación del formulario de contacto
- Filtros por categoría en el listado
- Marcado del enlace activo en el menú

---

## Navegación del sitio

| Sección | Archivo | Descripción |
|---------|---------|-------------|
| Inicio | `index.html` | Noticias del día con tarjetas de tamaño variable |
| Agregar Noticia | `agregar.html` | Publicar noticia desde un link |
| Destacadas | `listado.html` | Listado completo + filtros por categoría |
| Contacto | `contacto.html` | Formulario de contacto validado |

---

## Autor

**Jeisson Arley López Barrientos**  
Estudiante de Ingeniería de Software  
Institución Universitaria Politécnico Grancolombiano  
Asignatura: Front-End — 2026
