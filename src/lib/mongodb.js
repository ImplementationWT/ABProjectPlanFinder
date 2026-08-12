import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable in .env.local");
}

function connect() {
  const client = new MongoClient(uri, options);
  return client.connect();
}

// We always use `global` to cache the connection promise, both in
// development (for hot-reload) and in production (to reuse the
// connection across invocations of the same container/serverless instance).
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