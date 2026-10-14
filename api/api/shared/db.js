/**
 * Conexión a Azure Cosmos DB (API SQL)
 * Si no hay credenciales configuradas, usa un almacén en memoria (útil para desarrollo local).
 */

const { CosmosClient } = require("@azure/cosmos");

let container = null;
const memoria = new Map(); // fallback en memoria

async function getContainer() {
  if (container) return container;

  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const databaseId = process.env.COSMOS_DATABASE || "ActualidadNoticias";
  const containerId = process.env.COSMOS_CONTAINER || "noticias";

  // Sin credenciales → modo memoria (desarrollo)
  if (!endpoint || !key) {
    console.warn("[DB] Sin COSMOS_ENDPOINT/COSMOS_KEY → usando almacén en memoria");
    return null;
  }

  try {
    const client = new CosmosClient({ endpoint, key });
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container: cont } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ["/id"] }
    });
    container = cont;
    console.log("[DB] Conectado a Cosmos DB");
    return container;
  } catch (err) {
    console.error("[DB] Error conectando a Cosmos:", err.message);
    return null;
  }
}

async function listarNoticias() {
  const cont = await getContainer();
  if (!cont) {
    // memoria
    return Array.from(memoria.values()).sort((a, b) => (b.votos || 0) - (a.votos || 0));
  }

  const { resources } = await cont.items
    .query("SELECT * FROM c ORDER BY c.votos DESC")
    .fetchAll();
  return resources;
}

async function obtenerNoticia(id) {
  const cont = await getContainer();
  if (!cont) {
    return memoria.get(String(id)) || null;
  }

  try {
    const { resource } = await cont.item(String(id), String(id)).read();
    return resource;
  } catch {
    return null;
  }
}

async function crearNoticia(noticia) {
  const cont = await getContainer();
  if (!cont) {
    memoria.set(String(noticia.id), noticia);
    return noticia;
  }

  const { resource } = await cont.items.create(noticia);
  return resource;
}

async function actualizarVotos(id, nuevosVotos) {
  const cont = await getContainer();
  if (!cont) {
    const n = memoria.get(String(id));
    if (n) {
      n.votos = nuevosVotos;
      memoria.set(String(id), n);
      return n;
    }
    return null;
  }

  const noticia = await obtenerNoticia(id);
  if (!noticia) return null;
  noticia.votos = nuevosVotos;
  const { resource } = await cont.item(String(id), String(id)).replace(noticia);
  return resource;
}

module.exports = {
  listarNoticias,
  obtenerNoticia,
  crearNoticia,
  actualizarVotos
};
