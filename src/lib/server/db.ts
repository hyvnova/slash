import type { UserData } from '$lib/types';
import { randomUUID } from 'crypto';
import { MongoClient, ServerApiVersion, type Db } from 'mongodb';
import "dotenv/config";

// Database URI and name
const DB_URI = process.env.DB_URI;
const DB_NAME = import.meta.env.DEV ? "dev" : "prod";

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

/**
 * Add a user to the database
 * @param data - The user data to add
 */
export async function add_user(data: Partial<UserData>) {
    return await with_db(async db => {
        const collection = db.collection<UserData>("users");

        data.token = randomUUID();
        data.verified = false;
        data.friends = [];

        // Assign a default avatar 
        data.avatar ||= `/default_avatars/${Math.floor(Math.random() * 4) + 1}.jpg`;

        await collection.insertOne(data as UserData);

        return data.token;
    });
}

/**
 * Find a user by any field
 * @param fields - The fields to search for
 * @returns The user data if found, otherwise null
 */
export async function find_by(fields: Partial<UserData>): Promise<UserData | null> {
    return await with_db(async db => {
        const collection = db.collection<UserData>("users");
        const user_data = await collection.findOne(fields);
        return user_data ?? null;
    });
}

/**
 * Find users matching a query and return specific fields
 * @param query - The query to match against
 * @param fields - The fields to return
 * @returns An array of user data matching the query and fields
 */
export async function find_matching(query: string, fields: (keyof UserData)[]): Promise<Partial<UserData>[]> {
    const projection: any = {};
    fields.forEach(field => projection[field] = 1);

    return await with_db(async db => {
        const collection = db.collection<UserData>("users");
        const user_data = await collection.find<Partial<UserData>>({
            $or: [
                { username: { $regex: query, $options: "i" } }
            ]
        }, { projection }).toArray();
        return user_data ?? [];
    });
}

/**
 * Get a user by token or username
 * @param identifier - The token to search for
 * @returns The user data if found, otherwise null
 */
export async function get_by(identifier: string): Promise<UserData> {
    return await with_db(async db => {
        const collection = db.collection("users");
        const user_data = await collection.findOne<UserData>({
            $or: [
                { token: identifier },
                { username: identifier }
            ]
        });
        return user_data as UserData;
    });
}

/**
 * Get specific fields from a user by token, username
 * @param identifier - The token, username, to search for
 * @param field - The field to return
 * @returns The value of the specified field if found, otherwise null
 */
export async function get_from<T = string>(identifier: string, field: keyof UserData): Promise<T | null> {
    const projection: any = {};
    projection[field] = 1;

    return await with_db(async db => {
        const collection = db.collection("users");
        const user_data = await collection.findOne<UserData>({
            $or: [
                { username: identifier },
                { token: identifier }
            ]
        }, { projection });

        return user_data ? user_data[field] as T : null;
    });
}

/**
 * Update a user in the database
 * @param identifier - The token, username, of the user to update
 * @param data - The updated user data
 */
export async function update_user(identifier: string, data: Partial<UserData>) {
    return await with_db(async db => {

        const collection = db.collection("users");

        // Update the user
        await collection.updateOne({
            $or: [
                { token: identifier },
                { username: identifier }
            ]
        }, {
            $set: data
        });

    });
}

/**
 * Delete a user from the database
 * @param identifier - The token, username, of the user to delete
 */
export async function delete_user(identifier: string) {
    return await with_db(async db => {

        const collection = db.collection("users");

        // Delete the user
        await collection.deleteOne({
            $or: [
                { token: identifier },
                { username: identifier },
            ]
        });

    });
}