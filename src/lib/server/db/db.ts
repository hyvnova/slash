import { MongoClient, ServerApiVersion, type Db } from 'mongodb';
import "dotenv/config";

try {
    process.env.DEV = import.meta.env.DEV ? "true" : "false";
} catch (e) {
    process.env.DEV = "true";
}

// Database URI and name
const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME ? "dev" : "prod";

if (!DB_URI) {
    throw new Error("Database URI is not set");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 100,
});

// Connect the client to the server (optional starting in v4.7)
client.connect();

/**
 * Execute a function with the database
 * @param fn - The function to execute with the database
 * @returns The result of the function
 */
export async function with_db<T>(fn: (db: Db) => Promise<T>): Promise<T> {
    const db = client.db(DB_NAME);
    try {
        return await fn(db);
    } finally {
        // Do nothing
    }
}

