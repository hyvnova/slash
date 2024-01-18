import { MongoClient, ServerApiVersion } from 'mongodb';
import "dotenv/config";
// Database URI and name
const DB_URI = process.env.DB_URI;
const DB_NAME = "socket-users";
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
const db = client.db(DB_NAME);
const collection = db.collection("users");
// Document type
// Create a user online record
export async function create_user(socketId, username) {
    const user = {
        username,
        socketId,
        status: "offline" /* Status.OFFLINE */
    };
    await collection.insertOne(user);
    return user;
}
// Check if user exists
export async function exists(username) {
    const user = await collection.findOne({ username }, { projection: { _id: 1 } });
    return !!user;
}
// Get user status
export async function get_status(username) {
    const user = await collection.findOne({ username }, { projection: { status: 1 } });
    if (!user) {
        return "offline" /* Status.OFFLINE */;
    }
    return user.status ?? "offline" /* Status.OFFLINE */;
}
// Set user status
export async function set_status(username, status) {
    await collection.updateOne({ username }, { $set: { status } });
}
// Log user connection
export async function connect(socketId, username) {
    const user = {
        username,
        socketId,
        status: "online" /* Status.ONLINE */
    };
    await collection.updateOne({ username }, { $set: user }, { upsert: true });
}
// Log user disconnection
export async function disconnect(socket_id) {
    await collection.updateOne({ socketId: socket_id }, { $set: { status: "offline" /* Status.OFFLINE */, socketId: undefined } });
}
// Check if user is online
export async function is_online(username) {
    const status = await get_status(username);
    return status === "online" /* Status.ONLINE */;
}
// Get username
export async function get_username(socketId) {
    const user = await collection.findOne({ socketId }, { projection: { username: 1 } });
    return user ? user.username : null;
}
// Get online users from a list of usernames
export async function get_online_from(usernames) {
    console.log("get_online_from", usernames);
    const onlineUsers = await collection.find({ username: { $in: usernames }, status: "online" /* Status.ONLINE */ }).toArray();
    return onlineUsers;
}
