import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Falta la variable de entorno MONGODB_URI en .env.local");
}

function connect() {
  const client = new MongoClient(uri, options);
  return client.connect();
}

// Devuelve la promesa de conexión activa. Si una conexión anterior falló
// (p. ej. un corte de red pasajero), la descartamos para que el siguiente
// intento abra una conexión nueva en vez de repetir el mismo error para siempre.
function getClientPromise() {
  if (process.env.NODE_ENV === "development") {
    // En desarrollo, Next.js recarga módulos (hot reload), así que guardamos
    // la conexión en una variable global para no abrir una conexión nueva
    // en cada recarga.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connect().catch((err) => {
        global._mongoClientPromise = null;
        throw err;
      });
    }
    return global._mongoClientPromise;
  }
  // En producción, es mejor evitar la variable global.
  return connect();
}

export default getClientPromise;
