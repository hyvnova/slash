import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
try {
  process.env.DEV = false ? "true" : "false";
} catch (e) {
  process.env.DEV = "true";
}
const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DEV === "true" ? "dev" : "prod";
if (!DB_URI) {
  throw new Error("Database URI is not set");
}
const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  maxPoolSize: 100
});
client.connect();
const db = client.db(DB_NAME);
export {
  db as d
};
