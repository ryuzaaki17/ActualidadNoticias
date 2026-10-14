/**
 * POST /api/noticias/{id}/votar  → suma 1 voto a la noticia
 */

const { obtenerNoticia, actualizarVotos } = require("../shared/db");

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: corsHeaders() };
    return;
  }

  const id = context.bindingData.id || req.params.id;

  if (!id) {
    context.res = {
      status: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { error: "ID requerido" }
    };
    return;
  }

  try {
    const noticia = await obtenerNoticia(id);
    if (!noticia) {
      context.res = {
        status: 404,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: { error: "Noticia no encontrada" }
      };
      return;
    }

    const nuevosVotos = (noticia.votos || 0) + 1;
    const actualizada = await actualizarVotos(id, nuevosVotos);

    context.res = {
      status: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: actualizada
    };
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: { error: "Error interno", detalle: err.message }
    };
  }
};
