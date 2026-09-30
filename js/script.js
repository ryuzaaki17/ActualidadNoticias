/* =========================================================
   ACTUALIDAD NOTICIAS - JavaScript principal
   Funcionalidades: votación, formularios, simulación de scraping
   ========================================================= */

/* ---------- Datos de ejemplo de noticias ---------- */
const noticiasEjemplo = [
  {
    id: 1,
    titulo: "Tensiones globales: el mundo ante un nuevo escenario",
    fecha: "15 Jun 2025",
    votos: 1248,
    imagen: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    categoria: "Internacional",
    fuente: "Actualidad Noticias",
    resumen: "Los líderes mundiales se reúnen en una cumbre extraordinaria ante el aumento de las tensiones geopolíticas.",
    contenido: "Los líderes mundiales se reúnen en una cumbre extraordinaria ante el aumento de las tensiones geopolíticas. Analistas aseguran que el equilibrio de poder está cambiando de forma acelerada. Expertos consultados por Actualidad Noticias coinciden en que se trata de un momento histórico que definirá las relaciones internacionales de la próxima década."
  },
  {
    id: 2,
    titulo: "Clima extremo: olas de calor azotan varias regiones",
    fecha: "15 Jun 2025",
    votos: 682,
    imagen: "https://media.cnn.com/api/v1/images/stellar/prod/cnne-1420541-el-clima-extremo-afecta-a-regiones-en-todo-el-mundo.jpeg?c=16x9&q=w_1280,c_fill/f_webp",
    categoria: "Sociedad",
    fuente: "El Tiempo",
    resumen: "Temperaturas récord se registran en varias zonas del país y del continente.",
    contenido: "Temperaturas récord se registran en varias zonas del país y del continente. Las autoridades sanitarias recomiendan extremar precauciones, especialmente con niños y adultos mayores. El fenómeno se atribuye al cambio climático y a patrones atmosféricos inusuales."
  },
  {
    id: 3,
    titulo: "Histórica victoria en tiempo de descuento",
    fecha: "14 Jun 2025",
    votos: 512,
    imagen: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    categoria: "Deportes",
    fuente: "Infobae",
    resumen: "El equipo local logró un empate épico en los últimos segundos del partido.",
    contenido: "El equipo local logró un empate épico en los últimos segundos del partido. La afición celebró de forma desbordante en las gradas y en las calles. El técnico destacó el carácter del grupo y la importancia de no rendirse hasta el final."
  },
  {
    id: 4,
    titulo: "Avances en IA: nueva tecnología revoluciona la industria",
    fecha: "14 Jun 2025",
    votos: 410,
    imagen: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    categoria: "Tecnología",
    fuente: "El Espectador",
    resumen: "Una startup local presenta un modelo de inteligencia artificial con resultados sorprendentes.",
    contenido: "Una startup local presenta un modelo de inteligencia artificial con resultados sorprendentes en el sector productivo. Empresas de varios países ya han mostrado interés en adoptar la solución. Expertos hablan de un posible salto generacional en automatización."
  },
  {
    id: 5,
    titulo: "Reforma política: Congreso inicia debate clave",
    fecha: "13 Jun 2025",
    votos: 365,
    imagen: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    categoria: "Política",
    fuente: "Actualidad Noticias",
    resumen: "El proyecto de reforma busca modernizar el sistema de representación ciudadana.",
    contenido: "El proyecto de reforma busca modernizar el sistema de representación ciudadana. Partidos de oposición y de gobierno presentan posturas encontradas. Se espera que el debate se extienda durante varias semanas."
  },
  {
    id: 6,
    titulo: "Nuevas áreas protegidas: un paso hacia la conservación",
    fecha: "13 Jun 2025",
    votos: 298,
    imagen: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    categoria: "Sociedad",
    fuente: "El Tiempo",
    resumen: "El gobierno anuncia la creación de tres nuevas reservas naturales.",
    contenido: "El gobierno anuncia la creación de tres nuevas reservas naturales en zonas de alta biodiversidad. Organizaciones ambientales celebraron la medida, aunque pidieron mayor presupuesto para su protección efectiva."
  },
  {
    id: 7,
    titulo: "Mercados en alerta: inflación y tasas sacuden a inversionistas",
    fecha: "12 Jun 2025",
    votos: 245,
    imagen: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    categoria: "Economía",
    fuente: "Infobae",
    resumen: "Los mercados reaccionan con volatilidad ante nuevos datos económicos.",
    contenido: "Los mercados reaccionan con volatilidad ante nuevos datos económicos. Analistas recomiendan cautela y diversificación de portafolios. El banco central mantiene su postura de monitoreo constante."
  }
];

/* ---------- Utilidades ---------- */

/**
 * Obtiene el nivel de tamaño de tarjeta según la cantidad de votos
 * @param {number} votos
 * @returns {string} clase CSS: tarjeta-pequena | tarjeta-mediana | tarjeta-grande
 */
function obtenerClaseTamano(votos) {
  if (votos >= 800) return "tarjeta-grande";
  if (votos >= 400) return "tarjeta-mediana";
  return "tarjeta-pequena";
}

/**
 * Formatea un número con separador de miles
 */
function formatearNumero(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Obtiene una noticia por su ID
 */
function obtenerNoticiaPorId(id) {
  return noticiasEjemplo.find(n => n.id === parseInt(id));
}

/* ---------- Página de Inicio: renderizar grid de noticias ---------- */
function renderizarHome() {
  const contenedor = document.getElementById("grid-noticias");
  if (!contenedor) return;

  // Ordenar por votos (mayor a menor) para mejor visualización
  const ordenadas = [...noticiasEjemplo].sort((a, b) => b.votos - a.votos);

  contenedor.innerHTML = ordenadas.map(noticia => {
    const claseTamano = obtenerClaseTamano(noticia.votos);
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

/* ---------- Página Listado: renderizar noticias (con filtro opcional) ---------- */
function renderizarListado(filtroCategoria = "Todas") {
  const contenedor = document.getElementById("grid-listado");
  if (!contenedor) return;

  // Filtrar por categoría si no es "Todas"
  const filtradas = filtroCategoria === "Todas"
    ? noticiasEjemplo
    : noticiasEjemplo.filter(n => n.categoria === filtroCategoria);

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
        <p class="text-secondary small flex-grow-1 mb-2">${noticia.resumen}</p>
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

/**
 * Inicializa los botones de filtro por categoría en la página de listado
 */
function inicializarFiltros() {
  const botones = document.querySelectorAll(".filtro-categoria");
  if (!botones.length) return;

  botones.forEach(boton => {
    boton.addEventListener("click", function () {
      // Quitar estado activo de todos
      botones.forEach(b => {
        b.classList.remove("activo");
        b.style.background = "";
        b.classList.add("bg-secondary");
      });

      // Marcar el actual como activo
      this.classList.add("activo");
      this.classList.remove("bg-secondary");
      this.style.background = "var(--color-acento)";

      // Filtrar noticias
      const categoria = this.dataset.categoria;
      renderizarListado(categoria);
    });
  });
}

/* ---------- Página Detalle: cargar noticia según ID ---------- */
function renderizarDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "1";
  const noticia = obtenerNoticiaPorId(id);

  if (!noticia) {
    document.getElementById("contenido-detalle").innerHTML = `
      <div class="text-center py-5">
        <h2>Noticia no encontrada</h2>
        <a href="index.html" class="btn mt-3" style="background:var(--color-acento);color:white;">Volver al inicio</a>
      </div>
    `;
    return;
  }

  // Imagen hero
  const imgHero = document.getElementById("imagen-hero");
  if (imgHero) {
    imgHero.src = noticia.imagen;
    imgHero.alt = noticia.titulo;
  }

  // Título y meta
  document.getElementById("titulo-detalle").textContent = noticia.titulo;
  document.getElementById("fecha-detalle").textContent = noticia.fecha;
  document.getElementById("fuente-detalle").textContent = noticia.fuente;
  document.getElementById("categoria-detalle").textContent = noticia.categoria;

  // Cuerpo
  document.getElementById("cuerpo-noticia").innerHTML = `
    <p>${noticia.contenido}</p>
    <p>${noticia.resumen} Esta información se actualiza de forma constante para mantener a los lectores al día con los acontecimientos más relevantes.</p>
  `;

  // Contador de votos
  const contador = document.getElementById("contador-votos-detalle");
  if (contador) contador.textContent = formatearNumero(noticia.votos);

  // Botón destacar
  const botonDestacar = document.getElementById("boton-destacar");
  if (botonDestacar) {
    botonDestacar.addEventListener("click", function () {
      // Simular voto (solo en memoria para esta sesión)
      noticia.votos += 1;
      contador.textContent = formatearNumero(noticia.votos);
      this.innerHTML = `<i class="bi bi-check-lg"></i> ¡Destacada! (${formatearNumero(noticia.votos)})`;
      this.disabled = true;
    });
  }
}

/* ---------- Página Agregar: simulación de scraping ---------- */
function inicializarAgregar() {
  const formulario = document.getElementById("formulario-agregar");
  const inputUrl = document.getElementById("input-url");
  const botonProcesar = document.getElementById("boton-procesar");
  const vistaPrevia = document.getElementById("vista-previa");
  const estadoPrevia = document.getElementById("estado-previa");

  if (!formulario) return;

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const url = inputUrl.value.trim();
    if (!url) {
      inputUrl.classList.add("es-invalido");
      return;
    }

    // Validación básica de URL
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

    // Simular proceso de scraping
    botonProcesar.disabled = true;
    botonProcesar.innerHTML = `<span class="spinner-carga"></span> Procesando...`;

    vistaPrevia.classList.remove("visible");
    estadoPrevia.className = "estado-previa cargando";
    estadoPrevia.innerHTML = `<span class="spinner-carga"></span> Extrayendo título, imagen y contenido...`;

    // Simulación de demora (1.5 - 2.5 segundos)
    setTimeout(() => {
      // Datos simulados extraídos
      const datosExtraidos = {
        titulo: "Nuevo acuerdo económico: Gobierno anuncia medidas para reactivar el empleo",
        imagen: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
        resumen: "El plan incluye incentivos para pymes, capacitación laboral y apoyo a sectores productivos. Se espera la creación de 150.000 puestos de trabajo en los próximos dos años.",
        fuente: "elespectador.com",
        fecha: "20 mayo, 2024",
        categoria: "Política"
      };

      // Mostrar vista previa
      document.getElementById("previa-titulo").textContent = datosExtraidos.titulo;
      document.getElementById("previa-imagen").src = datosExtraidos.imagen;
      document.getElementById("previa-resumen").textContent = datosExtraidos.resumen;
      document.getElementById("previa-fuente").textContent = `Fuente: ${datosExtraidos.fuente} · ${datosExtraidos.fecha}`;
      document.getElementById("previa-categoria").textContent = datosExtraidos.categoria;

      estadoPrevia.className = "estado-previa exito";
      estadoPrevia.innerHTML = `<i class="bi bi-check-circle-fill"></i> Listo para revisar y publicar`;

      vistaPrevia.classList.add("visible");

      botonProcesar.disabled = false;
      botonProcesar.innerHTML = `Procesar y publicar <i class="bi bi-arrow-right"></i>`;
    }, 1800);
  });

  // Botón de publicar (dentro de la vista previa)
  const botonPublicar = document.getElementById("boton-publicar");
  if (botonPublicar) {
    botonPublicar.addEventListener("click", function () {
      this.disabled = true;
      this.innerHTML = `<span class="spinner-carga"></span> Publicando...`;
      setTimeout(() => {
        this.innerHTML = `<i class="bi bi-check-lg"></i> ¡Publicada con éxito!`;
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);
      }, 1000);
    });
  }
}

/* ---------- Página Contacto: validación del formulario ---------- */
function inicializarContacto() {
  const formulario = document.getElementById("formulario-contacto");
  if (!formulario) return;

  const campoNombre = document.getElementById("campo-nombre");
  const campoCorreo = document.getElementById("campo-correo");
  const campoMensaje = document.getElementById("campo-mensaje");
  const alertaExito = document.getElementById("alerta-exito");

  // Validación en tiempo real
  function validarCampo(campo, tipo) {
    const valor = campo.value.trim();
    let esValido = false;
    let mensaje = "";

    if (tipo === "nombre") {
      esValido = valor.length >= 2;
      mensaje = esValido ? "Nombre válido" : "El nombre debe tener al menos 2 caracteres";
    } else if (tipo === "correo") {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      esValido = regexCorreo.test(valor);
      mensaje = esValido ? "Correo válido" : "Por favor, ingresa un correo válido";
    } else if (tipo === "mensaje") {
      esValido = valor.length >= 20;
      mensaje = esValido
        ? "Mensaje válido"
        : `El mensaje debe tener al menos 20 caracteres (${valor.length}/20)`;
    }

    // Aplicar clases
    campo.classList.remove("es-valido", "es-invalido");
    campo.classList.add(esValido ? "es-valido" : "es-invalido");

    // Mostrar mensaje
    const idMensaje = `msg-${tipo}`;
    let span = document.getElementById(idMensaje);
    if (!span) {
      span = document.createElement("div");
      span.id = idMensaje;
      span.className = "mensaje-validacion";
      campo.parentNode.appendChild(span);
    }
    span.textContent = mensaje;
    span.className = `mensaje-validacion ${esValido ? "valido" : "invalido"}`;

    return esValido;
  }

  campoNombre.addEventListener("input", () => validarCampo(campoNombre, "nombre"));
  campoCorreo.addEventListener("input", () => validarCampo(campoCorreo, "correo"));
  campoMensaje.addEventListener("input", () => validarCampo(campoMensaje, "mensaje"));

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreOk = validarCampo(campoNombre, "nombre");
    const correoOk = validarCampo(campoCorreo, "correo");
    const mensajeOk = validarCampo(campoMensaje, "mensaje");

    if (nombreOk && correoOk && mensajeOk) {
      // Mostrar mensaje de éxito
      alertaExito.classList.add("visible");
      formulario.reset();

      // Limpiar clases de validación
      [campoNombre, campoCorreo, campoMensaje].forEach(c => {
        c.classList.remove("es-valido", "es-invalido");
      });
      document.querySelectorAll(".mensaje-validacion").forEach(m => m.remove());

      // Ocultar alerta después de unos segundos
      setTimeout(() => {
        alertaExito.classList.remove("visible");
      }, 5000);

      // Scroll suave hacia la alerta
      alertaExito.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

/* ---------- Marcar enlace activo en el menú ---------- */
function marcarMenuActivo() {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu-navegacion .nav-link").forEach(enlace => {
    const href = enlace.getAttribute("href");
    if (href === paginaActual || (paginaActual === "" && href === "index.html")) {
      enlace.classList.add("activo");
    }
  });
}

/* ---------- Inicialización al cargar la página ---------- */
document.addEventListener("DOMContentLoaded", function () {
  marcarMenuActivo();
  renderizarHome();
  renderizarListado();
  inicializarFiltros();
  renderizarDetalle();
  inicializarAgregar();
  inicializarContacto();
});