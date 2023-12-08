import { db } from "./db";

type OnlineType = {
    username: string; // The username of the user - works as an id
    socket_id: string;
    status: string | null; // null if offline, otherwise the status: online or custom
}

/**
 * Create "online" collection if it doesn't exist
 */
const collection = db.collection<OnlineType>("online");
await collection.createIndex({ username: 1 }, { unique: true });

/**
 * Create a user online record
 * @param username 
 * @returns 
 */
export async function create_user_online(username: string) {
    const collection = db.collection("online");

    await collection.insertOne({
        username,
        socket_id: "",
        status: null
    });
}

/**
 * Check if record exists
 * @param username
 * @returns boolean
 */
export async function exists(username: string): Promise<boolean> {
    const collection = db.collection<OnlineType>("online");

    const user = await collection.findOne({
        username
    }, {
        projection: {
            username: 1
        }
    });

    return user !== null;
}


/**
 * Get the status of a user
 * @param username - The username of the user
 * @returns The status of the user or null if the user doesn't exist
 */
export async function get_status(username: string): Promise<string | null> {
    const collection = db.collection<OnlineType>("online");

    // If the user doesn't exist, create a record for them
    if (!await exists(username)) {
        await create_user_online(username);
    }

    const user = await collection.findOne({
        username
    }, {
        projection: {
            status: 1
        }

    });

    return user?.status ?? null;
}


/**
 * log a user socket connection - used for online status
 * @param socket_id - The socket id of the user
 * @param username - The username of the user
 */
export async function connect(socket_id: string, username: string) {
    const collection = db.collection("online");

    let status = await get_status(username);

    // Update the user
    await collection.updateOne({
        username
    }, {
        $set: {
            socket_id,
            status: status ?? "online"
        }
    });

}

/**
 * log a user socket disconnection - used for online status
 * @param socket_id - The socket id of the user
 */
export async function disconnect(socket_id: string) {
    const collection = db.collection("online");

    // Update the user
    await collection.updateOne({
        socket_id
    }, {
        $set: {
            socket_id: "",
            status: null
        }
    });

}

/**
 * Get the username of a user from their socket id
 * @param socket_id - The socket id of the user
 * @returns The username of the user or null if the user doesn't exist
*/
export async function get_username(socket_id: string): Promise<string | null> {
    const collection = db.collection<OnlineType>("online");

    const user = await collection.findOne({
        socket_id
    }, {
        projection: {
            username: 1
        }
    });

    return user?.username ?? null;
}

/**
 * Check if a user is online
 * @param username - The username of the user
 * @returns True if the user is online, otherwise false
 */
export async function is_online(username: string): Promise<boolean> {
    const collection = db.collection<OnlineType>("online");

    const user = await collection.findOne({
        username
    }, {
        projection: {
            status: 1
        }
    });

    return user?.status !== null;
}