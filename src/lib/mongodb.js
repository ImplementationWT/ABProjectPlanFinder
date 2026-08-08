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

// Usamos siempre `global` para cachear la promesa de conexión, tanto en
// desarrollo (por el hot-reload) como en producción (para reutilizar la
// conexión entre invocaciones del mismo contenedor/instancia serverless).
function getClientPromise() {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect().catch((err) => {
      global._mongoClientPromise = null;
      throw err;
    });
  }
  return global._mongoClientPromise;
}

export default getClientPromise;