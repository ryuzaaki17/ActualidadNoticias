/**
 * POST /api/extraer
 * Body: { "url": "https://..." }
 * Extrae título, imagen, resumen, fuente y fecha de una noticia usando meta tags + selectores comunes.
 */

const axios = require("axios");
const cheerio = require("cheerio");

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function extraerDominio(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "desconocido";
  }
}

function limpiarTexto(texto) {
  if (!texto) return "";
  return texto.replace(/\s+/g, " ").trim();
}

module.exports = async function (context, req) {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: corsHeaders() };
    return;
  }

  const url = (req.body && req.body.url) || (req.query && req.query.url);

  if (!url) {
    context.res = {
      status: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { error: "Debes enviar una URL en el body: { \"url\": \"https://...\" }" }
    };
    return;
  }

  // Validar URL
  let urlObj;
  try {
    urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) throw new Error();
  } catch {
    context.res = {
      status: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { error: "URL inválida" }
    };
    return;
  }

  try {
    const response = await axios.get(url, {
      timeout: 12000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
      },
      maxRedirects: 5,
      responseType: "text"
    });

    const $ = cheerio.load(response.data);

    // --- Título ---
    let titulo =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("h1").first().text() ||
      $("title").text() ||
      "";

    // --- Imagen ---
    let imagen =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[property="og:image:secure_url"]').attr("content") ||
      $("article img").first().attr("src") ||
      $(".article-image img, .noticia-imagen img, .hero img").first().attr("src") ||
      "";

    // Convertir imagen relativa a absoluta
    if (imagen && !imagen.startsWith("http")) {
      try {
        imagen = new URL(imagen, url).href;
      } catch {
        imagen = "";
      }
    }

    // --- Resumen / descripción ---
    let resumen =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $("article p").first().text() ||
      $(".lead, .bajada, .summary, .entradilla").first().text() ||
      "";

    // --- Fecha ---
    let fecha =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="publish-date"]').attr("content") ||
      $('meta[name="date"]').attr("content") ||
      $("time").attr("datetime") ||
      $("time").first().text() ||
      "";

    // Formatear fecha legible
    if (fecha) {
      try {
        const d = new Date(fecha);
        if (!isNaN(d)) {
          fecha = d.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric"
          });
        }
      } catch {
        // dejar como está
      }
    } else {
      fecha = new Date().toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }

    // --- Fuente ---
    const fuente =
      $('meta[property="og:site_name"]').attr("content") ||
      extraerDominio(url);

    // --- Categoría (heurística simple por palabras clave) ---
    const textoCompleto = (titulo + " " + resumen).toLowerCase();
    let categoria = "Sociedad";
    if (/pol[ií]tica|gobierno|congreso|presidente|elecciones|partido/.test(textoCompleto)) categoria = "Política";
    else if (/econom[ií]a|mercado|inflaci[oó]n|banco|d[oó]lar|empleo|pib/.test(textoCompleto)) categoria = "Economía";
    else if (/deportes?|f[uú]tbol|gol|partido|liga|mundial|ol[ií]mpic/.test(textoCompleto)) categoria = "Deportes";
    else if (/tecnolog[ií]a|ia |inteligencia artificial|app|software|startup|digital/.test(textoCompleto)) categoria = "Tecnología";
    else if (/internacional|mundo|guerra|otan|onu|europa|eeuu|china/.test(textoCompleto)) categoria = "Internacional";

    // --- Contenido más largo (para el detalle) ---
    let contenido = "";
    $("article p, .article-body p, .noticia-cuerpo p, .content p").each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 40) contenido += t + "\n\n";
    });
    if (!contenido) contenido = resumen;

    const resultado = {
      titulo: limpiarTexto(titulo).slice(0, 200) || "Sin título",
      resumen: limpiarTexto(resumen).slice(0, 400) || "Sin resumen disponible",
      imagen: imagen || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
      fuente: limpiarTexto(fuente),
      fecha,
      categoria,
      contenido: limpiarTexto(contenido).slice(0, 3000) || resumen,
      urlOriginal: url
    };

    context.res = {
      status: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: resultado
    };
  } catch (err) {
    context.log.error("Error al extraer:", err.message);
    context.res = {
      status: 502,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: {
        error: "No se pudo extraer la información de esa URL. Puede que el sitio bloquee scrapers o use mucho JavaScript.",
        detalle: err.message
      }
    };
  }
};
