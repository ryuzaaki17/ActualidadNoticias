/**
 * POST /api/extraer
 * Body: { "url": "https://..." }
 */

const axios = require("axios");
const cheerio = require("cheerio");

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

function ok(context, status, data) {
  context.res = {
    status,
    headers: corsHeaders(),
    body: data
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
  return String(texto).replace(/\s+/g, " ").trim();
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

module.exports = async function (context, req) {
  try {
    if (req.method === "OPTIONS") {
      context.res = { status: 204, headers: corsHeaders() };
      return;
    }

    const body = parseBody(req);
    const url = body.url || (req.query && req.query.url);

    if (!url) {
      ok(context, 400, { error: "Debes enviar una URL: { \"url\": \"https://...\" }" });
      return;
    }

    let urlObj;
    try {
      urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) throw new Error("protocolo");
    } catch {
      ok(context, 400, { error: "URL inválida" });
      return;
    }

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
      },
      maxRedirects: 5,
      responseType: "text",
      validateStatus: (s) => s >= 200 && s < 400
    });

    const $ = cheerio.load(response.data || "");

    let titulo =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("h1").first().text() ||
      $("title").text() ||
      "";

    let imagen =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[property="og:image:secure_url"]').attr("content") ||
      $("article img").first().attr("src") ||
      "";

    if (imagen && !imagen.startsWith("http")) {
      try {
        imagen = new URL(imagen, url).href;
      } catch {
        imagen = "";
      }
    }

    let resumen =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $("article p").first().text() ||
      "";

    let fecha =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="publish-date"]').attr("content") ||
      $("time").attr("datetime") ||
      $("time").first().text() ||
      "";

    if (fecha) {
      try {
        const d = new Date(fecha);
        if (!isNaN(d.getTime())) {
          fecha = d.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric"
          });
        }
      } catch {
        /* keep raw */
      }
    } else {
      fecha = new Date().toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }

    const fuente =
      $('meta[property="og:site_name"]').attr("content") || extraerDominio(url);

    const textoCompleto = (titulo + " " + resumen + " " + url).toLowerCase();
    const path = (urlObj.pathname || "").toLowerCase();

    // Preferir categoría por ruta del medio (ej. /politica/, /deportes/)
    let categoria = "Sociedad";
    if (/\/politica|\/gobierno|\/elecciones|\/congreso/.test(path) ||
        /pol[ií]tica|gobierno|congreso|presidente|ministro|ministra|elecciones|partido|senado|fiscal[ií]a|justicia|denuncia|alcalde|gobernador|petro|uribe/.test(textoCompleto))
      categoria = "Política";
    else if (/\/economia|\/negocios|\/finanzas/.test(path) ||
        /econom[ií]a|mercado|inflaci[oó]n|banco|d[oó]lar|empleo|pib|bolsa|impuesto|tribut/.test(textoCompleto))
      categoria = "Economía";
    else if (/\/deportes?|\/futbol|\/sports/.test(path) ||
        /deportes?|f[uú]tbol|gol|liga|mundial|ol[ií]mpic|tenis|baloncesto|ciclismo|atleta/.test(textoCompleto))
      categoria = "Deportes";
    else if (/\/tecnolog|\/tech|\/ciencia/.test(path) ||
        /tecnolog[ií]a|inteligencia artificial|\bia\b|app |software|startup|digital|ciber|robot|chip|internet/.test(textoCompleto))
      categoria = "Tecnología";
    else if (/\/internacional|\/mundo|\/exterior/.test(path) ||
        /internacional|guerra|otan|onu|europa|ee\.?uu|china|rusia|ucrania|medio oriente/.test(textoCompleto))
      categoria = "Internacional";
    else if (/\/salud|\/cultura|\/educacion|\/sociedad|\/medioambiente/.test(path) ||
        /salud|hospital|vacuna|educaci[oó]n|cultura|medio ambiente|clima|protesta/.test(textoCompleto))
      categoria = "Sociedad";

    let contenido = "";
    $("article p, .article-body p, .noticia-cuerpo p, .content p").each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 40) contenido += t + "\n\n";
    });
    if (!contenido) contenido = resumen;

    ok(context, 200, {
      titulo: limpiarTexto(titulo).slice(0, 200) || "Sin título",
      resumen: limpiarTexto(resumen).slice(0, 400) || "Sin resumen disponible",
      imagen:
        imagen ||
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
      fuente: limpiarTexto(fuente),
      fecha,
      categoria,
      contenido: limpiarTexto(contenido).slice(0, 3000) || resumen,
      urlOriginal: url
    });
  } catch (err) {
    context.log.error("Error extraer:", err && err.message ? err.message : err);
    ok(context, 502, {
      error:
        "No se pudo extraer la información de esa URL. El sitio puede bloquear scrapers o usar mucho JavaScript.",
      detalle: err && err.message ? err.message : String(err)
    });
  }
};
