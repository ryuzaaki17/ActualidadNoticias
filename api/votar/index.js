/**
 * POST /api/noticias/{id}/votar
 */

const { obtenerNoticia, actualizarVotos } = require("../shared/db");

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

module.exports = async function (context, req) {
  try {
    if (req.method === "OPTIONS") {
      context.res = { status: 204, headers: corsHeaders() };
      return;
    }

    const id = (context.bindingData && context.bindingData.id) || (req.params && req.params.id);

    if (!id) {
      ok(context, 400, { error: "ID requerido" });
      return;
    }

    const noticia = await obtenerNoticia(id);
    if (!noticia) {
      ok(context, 404, { error: "Noticia no encontrada" });
      return;
    }

    const nuevosVotos = (noticia.votos || 0) + 1;
    const actualizada = await actualizarVotos(id, nuevosVotos);
    ok(context, 200, actualizada);
  } catch (err) {
    context.log.error(err);
    ok(context, 500, {
      error: "Error interno",
      detalle: err && err.message ? err.message : String(err)
    });
  }
};
