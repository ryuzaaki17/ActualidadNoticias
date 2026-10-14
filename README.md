# Actualidad Noticias

**Proyecto Full-Stack Serverless — Institución Universitaria Politécnico Grancolombiano**  
**Asignatura:** Front-End (evolución a Backend)  
**Estudiante:** Jeisson Arley López Barrientos  
**Programa:** Ingeniería de Software  
**Año:** 2026

---

## Descripción

**Actualidad Noticias** es una plataforma de noticias con sistema de votación **“Destacar”**.  
Los usuarios pueden **pegar el enlace de cualquier noticia** de internet y el sistema:

1. Extrae automáticamente título, imagen, resumen, fuente, fecha y categoría (**web scraping**).
2. Muestra una vista previa para revisar.
3. Guarda la noticia en **Azure Cosmos DB**.
4. La publica en el portal.

Todo funciona con arquitectura **serverless** en Azure:

- Front-end estático → **Azure Static Web Apps**
- API (scraping + CRUD) → **Azure Functions**
- Base de datos → **Azure Cosmos DB** (opcional en desarrollo)

---

## Estructura del proyecto

```
Actualidad_Noticias/
├── index.html                 # Página de inicio (grid dinámico)
├── listado.html               # Todas las noticias + filtros
├── detalle.html               # Vista de detalle + votar
├── agregar.html               # Pegar URL → scraping → publicar
├── contacto.html              # Formulario de contacto
├── estilos/
│   └── styles.css
├── js/
│   └── script.js              # Lógica front + llamadas a /api
├── api/                       # ← Azure Functions
│   ├── package.json
│   ├── host.json
│   ├── local.settings.json    # Variables de entorno (local)
│   ├── shared/
│   │   └── db.js              # Conexión Cosmos DB + fallback memoria
│   ├── extraer/               # POST /api/extraer
│   ├── noticias/              # GET/POST /api/noticias
│   ├── noticia/               # GET /api/noticias/{id}
│   └── votar/                 # POST /api/noticias/{id}/votar
├── staticwebapp.config.json   # Configuración Azure Static Web Apps
└── README.md
```

---

## Endpoints de la API

| Método | Ruta                        | Descripción                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/api/extraer`              | Scraping de una URL                  |
| GET    | `/api/noticias`             | Listar todas las noticias            |
| POST   | `/api/noticias`             | Crear una noticia                    |
| GET    | `/api/noticias/{id}`        | Obtener una noticia por ID           |
| POST   | `/api/noticias/{id}/votar`  | Sumar 1 voto (“Destacar”)            |

---

## Qué debes hacer paso a paso

### 1. Requisitos en tu computador

Instala:

- [Node.js 18+](https://nodejs.org/)
- [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
  ```bash
  npm install -g azure-functions-core-tools@4 --unsafe-perm true
  ```
- [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/) (opcional pero recomendado)
  ```bash
  npm install -g @azure/static-web-apps-cli
  ```
- Cuenta de GitHub
- Cuenta de Azure (ya la tienes)

### 2. Probar en local (sin Azure todavía)

```bash
# 1. Entra a la carpeta del proyecto
cd Actualidad_Noticias

# 2. Instala dependencias de las Functions
cd api
npm install
cd ..

# 3. Arranca todo junto (front + api)
swa start . --api-location api
```

Abre http://localhost:4280

> Si no tienes el CLI de SWA, puedes arrancar solo las functions:
> ```bash
> cd api
> func start
> ```
> Y servir el front con cualquier servidor estático (Live Server, `npx serve`, etc.).  
> En ese caso cambia temporalmente `API_BASE` en `js/script.js` a `http://localhost:7071/api`.

**Nota:** Sin Cosmos DB configurado el sistema usa **memoria RAM**. Las noticias se pierden al reiniciar, pero todo funciona para probar el scraping.

### 3. Crear Cosmos DB en Azure (recomendado)

1. Entra al [Portal de Azure](https://portal.azure.com).
2. Crea un recurso **Azure Cosmos DB** → API **Core (SQL)**.
3. Elige el plan **Serverless** (pago por uso, ideal para estudiantes).
4. Una vez creado:
   - Ve a **Keys** y copia:
     - `URI` → será `COSMOS_ENDPOINT`
     - `PRIMARY KEY` → será `COSMOS_KEY`
5. Crea una base de datos llamada `ActualidadNoticias` y un contenedor `noticias` (partition key: `/id`).

### 4. Configurar variables de entorno locales

Edita `api/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_ENDPOINT": "https://TU-CUENTA.documents.azure.com:443/",
    "COSMOS_KEY": "TU_PRIMARY_KEY_AQUI",
    "COSMOS_DATABASE": "ActualidadNoticias",
    "COSMOS_CONTAINER": "noticias"
  },
  "Host": {
    "CORS": "*"
  }
}
```

### 5. Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Actualidad Noticias - versión serverless"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/actualidad-noticias.git
git push -u origin main
```

> **Importante:** no subas `api/local.settings.json` con las keys reales.  
> Agrégalo al `.gitignore` si aún no está.

### 6. Crear Azure Static Web App

1. Portal Azure → **Create a resource** → busca **Static Web App**.
2. Configuración recomendada:
   - **Name:** actualidad-noticias
   - **Plan:** Free
   - **Source:** GitHub
   - Autoriza y selecciona tu repositorio + rama `main`
   - **Build Presets:** Custom
   - **App location:** `/` (raíz)
   - **Api location:** `api`
   - **Output location:** (déjalo vacío)
3. Crea el recurso.

Azure automáticamente:
- Detectará las Functions
- Hará el build
- Te dará una URL pública tipo: `https://tu-app.azurestaticapps.net`

### 7. Configurar Cosmos en la Static Web App (producción)

1. Ve a tu Static Web App → **Configuration** → **Application settings**.
2. Agrega las mismas variables:
   - `COSMOS_ENDPOINT`
   - `COSMOS_KEY`
   - `COSMOS_DATABASE` = `ActualidadNoticias`
   - `COSMOS_CONTAINER` = `noticias`
3. Guarda. Se reiniciará la app.

### 8. ¡Listo!

Abre la URL de tu Static Web App y prueba:

1. Ve a **Agregar Noticia**
2. Pega un link real (ej: una noticia de El Tiempo, BBC, etc.)
3. Espera la extracción
4. Publica
5. Verás la noticia en Inicio y podrás votarla

---

## Tecnologías utilizadas

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| Front-end     | HTML5, CSS3, JavaScript, Bootstrap 5 |
| API           | Azure Functions (Node.js 18)        |
| Scraping      | axios + cheerio (meta tags + selectores) |
| Base de datos | Azure Cosmos DB (SQL API)           |
| Hosting       | Azure Static Web Apps               |
| CI/CD         | GitHub Actions (automático)         |

---

## Limitaciones del scraping

- Funciona muy bien con sitios que usan **Open Graph** (`og:title`, `og:image`, etc.).
- Algunos sitios con mucho JavaScript o protección anti-bot pueden fallar.
- Para producción más robusta se puede migrar a **Playwright** o **Puppeteer**, pero consume más recursos.

---

## Autor

**Jeisson Arley López Barrientos**  
Estudiante de Ingeniería de Software  
Institución Universitaria Politécnico Grancolombiano
