import { with_db } from './db'; // Import your database utility function
import { GridFSBucket } from 'mongodb';
import { randomUUID } from 'crypto';

export type FileType = {
    id: string;
    type: string;
    name: string;
    size: number;
    data?: Buffer; // Optional for Binary upload
};

async function upload_gridfs(file: File): Promise<string> {
    return await with_db(async (db) => {
        const bucket = new GridFSBucket(db, { bucketName: 'files' });
        const id = randomUUID();
        const uploadStream = bucket.openUploadStream(file.name, {
            metadata: {
                id: id,
                type: file.type,
                name: file.name,
                size: file.size,
            },
            contentType: file.type,
        });

        await new Promise(async (resolve, reject) => {
            uploadStream.once('finish', resolve);
            uploadStream.once('error', reject);
            uploadStream.end(await file.arrayBuffer());
        });

        return id;
    });
}

async function upload_binary(file: File): Promise<string> {
    return await with_db(async (db) => {
        const id = randomUUID();
        const dataBuffer = await file.arrayBuffer().then((buffer) => Buffer.from(buffer));
        await db.collection<FileType>('files').insertOne({
            id: id,
            type: file.type,
            name: file.name,
            size: file.size,
            data: dataBuffer,
        });
        return id;
    });
}



export async function upload_file(file: File): Promise<string> {
    return await with_db(async (db) => {
        if (file.size > 16 * 1024 * 1024) {
            return await upload_gridfs(file);
        } else {
            return await upload_binary(file);
        }
    });
}

export async function get_file(id: string): Promise<FileType | null> {
    return await with_db(async (db) => {
        const file = await db.collection<FileType>('files').findOne({ id: id });
        return file || null;
    });
}

/**
 * Check if file exists
 */
export async function exists(id: string): Promise<boolean> {
    return await with_db(async (db) => {
        const file = await db.collection<FileType>('files').findOne({ id: id });
        return file !== null;
    });
}
