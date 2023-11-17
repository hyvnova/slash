import { randomUUID } from "crypto";
import { with_db } from "./db";
import type { UserType } from "$lib/types";


/**
 * Check if a user exists
 * @param identifier - The token, username, or email to search for
 * @returns True if the user exists, otherwise false
 */
export async function exists(identifier: string): Promise<boolean> {
    return await with_db(async db => {
        const collection = db.collection<UserType>("users");
        const user_data = await collection.findOne<UserType>({
            $or: [
                { token: identifier },
                { username: identifier },
            ]
        }, { projection: { _id: 1 }} ) ;
        return user_data !== null;
    });
}

/**
 * Add a user to the database
 * @param data - The user data to add
 */
export async function add_user(data: Partial<UserType>) {
    return await with_db(async db => {
        const collection = db.collection<UserType>("users");

        // If the user already exists, throw an error
        if (await exists(data.username as string)) {
            return;
        }

        data.token = randomUUID();
        data.verified = false;
        data.friends = [];
        data.chats = [];
        data.pending_requests = [];
        data.rejected_requests = [];

        // Assign a default avatar 
        data.avatar ||= `/default_avatars/${Math.floor(Math.random() * 4) + 1}.jpg`;

        await collection.insertOne(data as UserType);

        return data.token;
    });
}


/**
 * Find users matching a query and return specific fields
 * @param query - The query to match against
 * @param fields - The fields to return
 * @returns An array of user data matching the query and fields
 */
export async function find_matching<T extends Partial<UserType>>(query: string, fields: (keyof T)[]): Promise<T[]> {

    const projection: any = {};
    fields.forEach(field => projection[field] = 1);

    return await with_db(async db => {
        const collection = db.collection<UserType>("users");
        const user_data = await collection.find<T>({
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
export async function get_by(identifier: string): Promise<UserType | null> {
    return await with_db(async db => {
        const collection = db.collection("users");
        const user_data = await collection.findOne<UserType>({
            $or: [
                { token: identifier },
                { username: identifier }
            ]
        });

        return user_data;
    });
}

/**
 * Get specific fields from a user by token, username
 * @param identifier - The token, username, to search for
 * @param field - The field to return
 * @returns The value of the specified field if found, otherwise null
 */
export async function get_from<T = string>(identifier: string, field: keyof UserType): Promise<T | null> {
    let projection = {};
    // @ts-ignore
    projection[field] = 1;

    return await with_db(async db => {
        const collection = db.collection("users");
        const user_data = await collection.findOne<UserType>({
            $or: [
                { username: identifier },
                { token: identifier }
            ]
        }, {projection});

        if (!user_data) { return null; }
        return user_data[field] as T ?? null;
    });
}

/**
 * Update a user in the database
 * @param identifier - The token, username, of the user to update
 * @param data - The updated user data
 */
export async function update_user(identifier: string, data: Partial<UserType>) {
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


