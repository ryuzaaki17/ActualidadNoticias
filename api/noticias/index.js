/**
 * GET  /api/noticias  → lista
 * POST /api/noticias  → crea
 */

const { listarNoticias, crearNoticia } = require("../shared/db");
const crypto = require("crypto");

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

    if (req.method === "GET") {
      const noticias = await listarNoticias();
      ok(context, 200, Array.isArray(noticias) ? noticias : []);
      return;
    }

    if (req.method === "POST") {
      const body = parseBody(req);

      if (!body.titulo) {
        ok(context, 400, { error: "El título es obligatorio" });
        return;
      }

      const nueva = {
        id: crypto.randomUUID(),
        titulo: String(body.titulo).slice(0, 250),
        resumen: String(body.resumen || "").slice(0, 500),
        contenido: String(body.contenido || body.resumen || "").slice(0, 5000),
        imagen:
          body.imagen ||
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
        fuente: body.fuente || "Desconocida",
        fecha:
          body.fecha ||
          new Date().toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }),
        categoria: body.categoria || "Sociedad",
        votos: 0,
        urlOriginal: body.urlOriginal || null,
        creadoEn: new Date().toISOString()
      };

      const guardada = await crearNoticia(nueva);
      ok(context, 201, guardada);
      return;
    }

    ok(context, 405, { error: "Método no permitido" });
  } catch (err) {
    context.log.error(err);
    ok(context, 500, {
      error: "Error interno del servidor",
      detalle: err && err.message ? err.message : String(err)
    });
  }
};
