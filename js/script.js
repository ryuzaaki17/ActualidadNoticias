/* =========================================================
   ACTUALIDAD NOTICIAS - JavaScript principal
   Ahora conectado a Azure Functions (/api/*)
   ========================================================= */

/* ---------- Configuración de la API ---------- */
const API_BASE = "/api"; // En Azure Static Web Apps las functions se sirven bajo /api

/* ---------- Datos de ejemplo (fallback si la API no responde) ---------- */
const noticiasEjemplo = [
  {
    id: "demo-1",
    titulo: "Tensiones globales: el mundo ante un nuevo escenario",
    fecha: "15 Jun 2025",
    votos: 1248,
    imagen: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    categoria: "Internacional",
    fuente: "Actualidad Noticias",
    resumen: "Los líderes mundiales se reúnen en una cumbre extraordinaria ante el aumento de las tensiones geopolíticas.",
    contenido: "Los líderes mundiales se reúnen en una cumbre extraordinaria ante el aumento de las tensiones geopolíticas. Analistas aseguran que el equilibrio de poder está cambiando de forma acelerada."
  },
  {
    id: "demo-2",
    titulo: "Clima extremo: olas de calor azotan varias regiones",
    fecha: "15 Jun 2025",
    votos: 682,
    imagen: "https://media.cnn.com/api/v1/images/stellar/prod/cnne-1420541-el-clima-extremo-afecta-a-regiones-en-todo-el-mundo.jpeg?c=16x9&q=w_1280,c_fill/f_webp",
    categoria: "Sociedad",
    fuente: "El Tiempo",
    resumen: "Temperaturas récord se registran en varias zonas del país y del continente.",
    contenido: "Temperaturas récord se registran en varias zonas del país y del continente. Las autoridades sanitarias recomiendan extremar precauciones."
  },
  {
    id: "demo-3",
    titulo: "Histórica victoria en tiempo de descuento",
    fecha: "14 Jun 2025",
    votos: 512,
    imagen: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    categoria: "Deportes",
    fuente: "Infobae",
    resumen: "El equipo local logró un empate épico en los últimos segundos del partido.",
    contenido: "El equipo local logró un empate épico en los últimos segundos del partido. La afición celebró de forma desbordante."
  },
  {
    id: "demo-4",
    titulo: "Avances en IA: nueva tecnología revoluciona la industria",
    fecha: "14 Jun 2025",
    votos: 410,
    imagen: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    categoria: "Tecnología",
    fuente: "El Espectador",
    resumen: "Una startup local presenta un modelo de inteligencia artificial con resultados sorprendentes.",
    contenido: "Una startup local presenta un modelo de inteligencia artificial con resultados sorprendentes en el sector productivo."
  },
  {
    id: "demo-5",
    titulo: "Reforma política: Congreso inicia debate clave",
    fecha: "13 Jun 2025",
    votos: 365,
    imagen: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    categoria: "Política",
    fuente: "Actualidad Noticias",
    resumen: "El proyecto de reforma busca modernizar el sistema de representación ciudadana.",
    contenido: "El proyecto de reforma busca modernizar el sistema de representación ciudadana. Partidos presentan posturas encontradas."
  },
  {
    id: "demo-6",
    titulo: "Nuevas áreas protegidas: un paso hacia la conservación",
    fecha: "13 Jun 2025",
    votos: 298,
    imagen: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    categoria: "Sociedad",
    fuente: "El Tiempo",
    resumen: "El gobierno anuncia la creación de tres nuevas reservas naturales.",
    contenido: "El gobierno anuncia la creación de tres nuevas reservas naturales en zonas de alta biodiversidad."
  },
  {
    id: "demo-7",
    titulo: "Mercados en alerta: inflación y tasas sacuden a inversionistas",
    fecha: "12 Jun 2025",
    votos: 245,
    imagen: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    categoria: "Economía",
    fuente: "Infobae",
    resumen: "Los mercados reaccionan con volatilidad ante nuevos datos económicos.",
    contenido: "Los mercados reaccionan con volatilidad ante nuevos datos económicos. Analistas recomiendan cautela."
  }
];

/* ---------- Caché en memoria de las noticias cargadas desde la API ---------- */
let noticiasCache = null;

/* ---------- Utilidades ---------- */

function obtenerClaseTamano(votos) {
  if (votos >= 800) return "tarjeta-grande";
  if (votos >= 400) return "tarjeta-mediana";
  return "tarjeta-pequena";
}

function formatearNumero(num) {
  return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Carga las noticias desde la API. Si falla, usa los datos de ejemplo.
 */
async function cargarNoticias() {
  if (noticiasCache) return noticiasCache;

  try {
    const res = await fetch(`${API_BASE}/noticias`);
    if (!res.ok) throw new Error("API no disponible");
    const data = await res.json();
    // Si la BD está vacía, devolvemos los de ejemplo para que el sitio no se vea vacío
    noticiasCache = (Array.isArray(data) && data.length > 0) ? data : noticiasEjemplo;
  } catch (err) {
    console.warn("[API] Usando datos de ejemplo (la API no respondió):", err.message);
    noticiasCache = noticiasEjemplo;
  }
  return noticiasCache;
}

async function obtenerNoticiaPorId(id) {
  // Primero buscar en caché
  const lista = await cargarNoticias();
  const encontrada = lista.find(n => String(n.id) === String(id));
  if (encontrada) return encontrada;

  // Si no está, intentar obtenerla directamente de la API
  try {
    const res = await fetch(`${API_BASE}/noticias/${id}`);
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return null;
}

/* ---------- Página de Inicio ---------- */
async function renderizarHome() {
  const contenedor = document.getElementById("grid-noticias");
  if (!contenedor) return;

  contenedor.innerHTML = `<div class="text-center py-5 text-secondary"><span class="spinner-carga"></span> Cargando noticias...</div>`;

  const noticias = await cargarNoticias();
  const ordenadas = [...noticias].sort((a, b) => (b.votos || 0) - (a.votos || 0));

  contenedor.innerHTML = ordenadas.map(noticia => {
    const claseTamano = obtenerClaseTamano(noticia.votos || 0);
    return `
      <a href="detalle.html?id=${noticia.id}" class="tarjeta-noticia ${claseTamano} vibrar" data-id="${noticia.id}">
        <img src="${noticia.imagen}" alt="${noticia.titulo}" class="imagen-tarjeta" loading="lazy">
        <div class="overlay-tarjeta"></div>
        <div class="contenido-tarjeta">
          <h3 class="titulo-tarjeta">${noticia.titulo}</h3>
          <div class="meta-tarjeta">
            <span class="fecha-tarjeta">
              <i class="bi bi-calendar3"></i> ${noticia.fecha}
            </span>
            <span class="contador-votos">
              <i class="bi bi-fire"></i> ${formatearNumero(noticia.votos)}
            </span>
          </div>
          <span class="boton-ver-mas">Ver más →</span>
        </div>
      </a>
    `;
  }).join("");
}

/* ---------- Página Listado ---------- */
async function renderizarListado(filtroCategoria = "Todas") {
  const contenedor = document.getElementById("grid-listado");
  if (!contenedor) return;

  const noticias = await cargarNoticias();

  const filtradas = filtroCategoria === "Todas"
    ? noticias
    : noticias.filter(n => n.categoria === filtroCategoria);

  if (filtradas.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5 text-secondary">
        <i class="bi bi-inbox" style="font-size:2.5rem;"></i>
        <p class="mt-2 mb-0">No hay noticias en esta categoría.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = filtradas.map(noticia => `
    <article class="tarjeta-listado" data-categoria="${noticia.categoria}">
      <img src="${noticia.imagen}" alt="${noticia.titulo}" class="imagen-listado" loading="lazy">
      <div class="p-3 d-flex flex-column flex-grow-1">
        <span class="categoria-etiqueta">${noticia.categoria}</span>
        <h3 class="h5 fw-semibold mb-2" style="line-height:1.3;">${noticia.titulo}</h3>
        <p class="text-secondary small flex-grow-1 mb-2">${noticia.resumen || ""}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="text-secondary small">
            <i class="bi bi-calendar3"></i> ${noticia.fecha}
          </span>
          <a href="detalle.html?id=${noticia.id}" class="btn btn-sm" style="background:var(--color-acento);color:white;">
            Ver más
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

function inicializarFiltros() {
  const botones = document.querySelectorAll(".filtro-categoria");
  if (!botones.length) return;

  botones.forEach(boton => {
    boton.addEventListener("click", function () {
      botones.forEach(b => {
        b.classList.remove("activo");
        b.style.background = "";
        b.classList.add("bg-secondary");
      });
      this.classList.add("activo");
      this.classList.remove("bg-secondary");
      this.style.background = "var(--color-acento)";
      renderizarListado(this.dataset.categoria);
    });
  });
}

/* ---------- Página Detalle ---------- */
async function renderizarDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    document.getElementById("contenido-detalle").innerHTML = `
      <div class="text-center py-5">
        <h2>Noticia no encontrada</h2>
        <a href="index.html" class="btn mt-3" style="background:var(--color-acento);color:white;">Volver al inicio</a>
      </div>
    `;
    return;
  }

  const noticia = await obtenerNoticiaPorId(id);

  if (!noticia) {
    document.getElementById("contenido-detalle").innerHTML = `
      <div class="text-center py-5">
        <h2>Noticia no encontrada</h2>
        <a href="index.html" class="btn mt-3" style="background:var(--color-acento);color:white;">Volver al inicio</a>
      </div>
    `;
    return;
  }

  const imgHero = document.getElementById("imagen-hero");
  if (imgHero) {
    imgHero.src = noticia.imagen;
    imgHero.alt = noticia.titulo;
  }

  document.getElementById("titulo-detalle").textContent = noticia.titulo;
  document.getElementById("fecha-detalle").textContent = noticia.fecha;
  document.getElementById("fuente-detalle").textContent = noticia.fuente;
  document.getElementById("categoria-detalle").textContent = noticia.categoria;

  document.getElementById("cuerpo-noticia").innerHTML = `
    <p>${noticia.contenido || noticia.resumen || ""}</p>
  `;

  const contador = document.getElementById("contador-votos-detalle");
  if (contador) contador.textContent = formatearNumero(noticia.votos || 0);

  const botonDestacar = document.getElementById("boton-destacar");
  if (botonDestacar) {
    botonDestacar.addEventListener("click", async function () {
      this.disabled = true;
      this.innerHTML = `<span class="spinner-carga"></span> Guardando...`;

      try {
        const res = await fetch(`${API_BASE}/noticias/${noticia.id}/votar`, { method: "POST" });
        if (res.ok) {
          const actualizada = await res.json();
          noticia.votos = actualizada.votos;
          contador.textContent = formatearNumero(actualizada.votos);
          this.innerHTML = `<i class="bi bi-check-lg"></i> ¡Destacada! (${formatearNumero(actualizada.votos)})`;
          // Invalidar caché para que el home se actualice
          noticiasCache = null;
        } else {
          throw new Error("Error al votar");
        }
      } catch {
        // Fallback local si la API no está
        noticia.votos = (noticia.votos || 0) + 1;
        contador.textContent = formatearNumero(noticia.votos);
        this.innerHTML = `<i class="bi bi-check-lg"></i> ¡Destacada! (${formatearNumero(noticia.votos)})`;
      }
    });
  }
}

/* ---------- Página Agregar: scraping real ---------- */
function inicializarAgregar() {
  const formulario = document.getElementById("formulario-agregar");
  const inputUrl = document.getElementById("input-url");
  const botonProcesar = document.getElementById("boton-procesar");
  const vistaPrevia = document.getElementById("vista-previa");
  const estadoPrevia = document.getElementById("estado-previa");

  if (!formulario) return;

  let datosExtraidos = null; // resultado del scraping
  let modo = "extraer";      // "extraer" | "publicar"

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    // ========== MODO PUBLICAR ==========
    if (modo === "publicar" && datosExtraidos) {
      botonProcesar.disabled = true;
      botonProcesar.innerHTML = `<span class="spinner-carga"></span> Publicando...`;

      try {
        const res = await fetch(`${API_BASE}/noticias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosExtraidos)
        });

        const creada = await res.json();
        if (!res.ok) throw new Error(creada.error || "Error al guardar");

        noticiasCache = null; // invalidar caché

        estadoPrevia.className = "estado-previa exito";
        estadoPrevia.innerHTML = `<i class="bi bi-check-circle-fill"></i> ¡Noticia publicada correctamente!`;
        botonProcesar.innerHTML = `<i class="bi bi-check-lg"></i> Publicada`;

        setTimeout(() => {
          window.location.href = `detalle.html?id=${creada.id}`;
        }, 1500);
      } catch (err) {
        estadoPrevia.className = "estado-previa error";
        estadoPrevia.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> ${err.message}`;
        botonProcesar.disabled = false;
        botonProcesar.innerHTML = `Publicar noticia <i class="bi bi-check-lg"></i>`;
      }
      return;
    }

    // ========== MODO EXTRAER ==========
    const url = inputUrl.value.trim();
    if (!url) {
      inputUrl.classList.add("es-invalido");
      return;
    }

    try {
      new URL(url);
    } catch {
      inputUrl.classList.add("es-invalido");
      document.getElementById("error-url").textContent = "Por favor ingresa una URL válida (ejemplo: https://...)";
      document.getElementById("error-url").classList.remove("d-none");
      return;
    }

    inputUrl.classList.remove("es-invalido");
    document.getElementById("error-url").classList.add("d-none");

    botonProcesar.disabled = true;
    botonProcesar.innerHTML = `<span class="spinner-carga"></span> Procesando...`;

    vistaPrevia.classList.remove("visible");
    estadoPrevia.className = "estado-previa cargando";
    estadoPrevia.innerHTML = `<span class="spinner-carga"></span> Extrayendo título, imagen y contenido...`;

    try {
      const res = await fetch(`${API_BASE}/extraer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo extraer la información");

      datosExtraidos = data;

      document.getElementById("previa-titulo").textContent = data.titulo;
      document.getElementById("previa-imagen").src = data.imagen;
      document.getElementById("previa-resumen").textContent = data.resumen;
      document.getElementById("previa-fuente").textContent = `Fuente: ${data.fuente} · ${data.fecha}`;
      document.getElementById("previa-categoria").textContent = data.categoria;

      estadoPrevia.className = "estado-previa exito";
      estadoPrevia.innerHTML = `<i class="bi bi-check-circle-fill"></i> Listo para revisar y publicar`;
      vistaPrevia.classList.add("visible");

      modo = "publicar";
      botonProcesar.innerHTML = `Publicar noticia <i class="bi bi-check-lg"></i>`;
      botonProcesar.disabled = false;

    } catch (err) {
      estadoPrevia.className = "estado-previa error";
      estadoPrevia.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> ${err.message}`;
      vistaPrevia.classList.add("visible");
      botonProcesar.disabled = false;
      botonProcesar.innerHTML = `Procesar y publicar <i class="bi bi-arrow-right"></i>`;
    }
  });
}

/* ---------- Validación del formulario de contacto ---------- */
function inicializarContacto() {
  const form = document.getElementById("formulario-contacto");
  if (!form) return;

  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const mensaje = document.getElementById("mensaje");

  function validarCampo(input, condicion, mensajeError) {
    const feedback = input.parentElement.querySelector(".mensaje-validacion");
    if (condicion) {
      input.classList.remove("es-invalido");
      input.classList.add("es-valido");
      if (feedback) {
        feedback.classList.add("d-none");
      }
      return true;
    } else {
      input.classList.remove("es-valido");
      input.classList.add("es-invalido");
      if (feedback) {
        feedback.textContent = mensajeError;
        feedback.classList.remove("d-none");
      }
      return false;
    }
  }

  nombre?.addEventListener("input", () => {
    validarCampo(nombre, nombre.value.trim().length >= 2, "Ingresa al menos 2 caracteres");
  });

  correo?.addEventListener("input", () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validarCampo(correo, regex.test(correo.value), "Ingresa un correo válido");
  });

  mensaje?.addEventListener("input", () => {
    validarCampo(mensaje, mensaje.value.trim().length >= 20, "El mensaje debe tener al menos 20 caracteres");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const okNombre = validarCampo(nombre, nombre.value.trim().length >= 2, "Ingresa al menos 2 caracteres");
    const okCorreo = validarCampo(correo, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value), "Ingresa un correo válido");
    const okMensaje = validarCampo(mensaje, mensaje.value.trim().length >= 20, "El mensaje debe tener al menos 20 caracteres");

    if (okNombre && okCorreo && okMensaje) {
      const alerta = document.getElementById("alerta-exito");
      if (alerta) {
        alerta.classList.remove("d-none");
        form.reset();
        [nombre, correo, mensaje].forEach(i => {
          i.classList.remove("es-valido", "es-invalido");
        });
      }
    }
  });
}

/* ---------- Marcar enlace activo del menú ---------- */
function marcarMenuActivo() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu-navegacion .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("activo");
    } else {
      link.classList.remove("activo");
    }
  });
}

/* ---------- Inicialización según la página ---------- */
document.addEventListener("DOMContentLoaded", () => {
  marcarMenuActivo();

  const path = window.location.pathname;

  if (path.endsWith("index.html") || path.endsWith("/") || path === "") {
    renderizarHome();
  } else if (path.includes("listado")) {
    renderizarListado();
    inicializarFiltros();
  } else if (path.includes("detalle")) {
    renderizarDetalle();
  } else if (path.includes("agregar")) {
    inicializarAgregar();
  } else if (path.includes("contacto")) {
    inicializarContacto();
  }
});
