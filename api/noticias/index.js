/**
 * GET  /api/noticias          → lista todas las noticias (ordenadas por votos)
 * POST /api/noticias          → crea una nueva noticia
 */

const { v4: uuidv4 } = require("uuid");
const { listarNoticias, crearNoticia } = require("../shared/db");

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: corsHeaders() };
    return;
  }

  try {
    // ---------- GET: listar ----------
    if (req.method === "GET") {
      const noticias = await listarNoticias();
      context.res = {
        status: 200,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: noticias
      };
      return;
    }

    // ---------- POST: crear ----------
    if (req.method === "POST") {
      const body = req.body || {};

      if (!body.titulo) {
        context.res = {
          status: 400,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
          body: { error: "El título es obligatorio" }
        };
        return;
      }

      const nueva = {
        id: uuidv4(),
        titulo: String(body.titulo).slice(0, 250),
        resumen: String(body.resumen || "").slice(0, 500),
        contenido: String(body.contenido || body.resumen || "").slice(0, 5000),
        imagen: body.imagen || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
        fuente: body.fuente || "Desconocida",
        fecha: body.fecha || new Date().toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }),
        categoria: body.categoria || "Sociedad",
        votos: 0,
        urlOriginal: body.urlOriginal || null,
        creadoEn: new Date().toISOString()
      };

      const guardada = await crearNoticia(nueva);

      context.res = {
        status: 201,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: guardada
      };
      return;
    }

    context.res = { status: 405, headers: corsHeaders(), body: { error: "Método no permitido" } };
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { error: "Error interno del servidor", detalle: err.message }
    };
  }
};
