"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mongodb_1 = require("mongodb");
require("dotenv/config");
try {
    process.env.DEV = import.meta.env.DEV ? "true" : "false";
}
catch (e) {
    process.env.DEV = "true";
}
// Database URI and name
var DB_URI = process.env.DB_URI;
var DB_NAME = process.env.DEV === "true" ? "dev" : "prod";
if (!DB_URI) {
    throw new Error("Database URI is not set");
}
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
var client = new mongodb_1.MongoClient(DB_URI, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 100,
});
// Connect the client to the server (optional starting in v4.7)
client.connect();
exports.db = client.db(DB_NAME);
