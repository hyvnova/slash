import { db } from './db'; // Import your database utility function
import { GridFSBucket } from 'mongodb';
import { randomUUID } from 'crypto';

const bucket = new GridFSBucket(db, {
    bucketName: 'files',
});

export type FileType = {
    id: string;
    type: string;
    name: string;
    size: number;
    data: Buffer; // Optional for Binary upload
};

async function upload_gridfs(file: File): Promise<string> {
    const id = randomUUID();

    const uploadStream = bucket.openUploadStream(id, {
        contentType: file.type,
        metadata: {
            name: file.name,
            size: file.size,
        }
    });

    uploadStream.on('error', (error) => {
        console.log(error);
    });

    uploadStream.on('finish', () => {
        console.log('File uploaded:', file.name, file.type, file.size);
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Split buffer into 16MB chunks
    const chunkSizeBytes = 1024 * 1024 * 16;
    for (let i = 0; i < buffer.length; i += chunkSizeBytes) {
        uploadStream.write(buffer.slice(i, i + chunkSizeBytes));
    }

    uploadStream.end();

    return id;
}

export async function upload_file(file: File): Promise<string> {
    return await upload_gridfs(file);
}

export async function get_file(id: string): Promise<FileType | null> {
    // Get file from bucket
    const cursor = bucket.find(
        { filename: id },
        { limit: 1 });

    const file = await cursor.next();
    if (!file) { return null; }

    // Get file data
    const readStream = bucket.openDownloadStream(file._id)
    readStream.on('error', (error) => {
        console.log(error);
    });

    const data = await new Promise((resolve, reject) => {
        const chunks: any[] = [];
        readStream.on('data', (chunk) => chunks.push(chunk));
        readStream.on('error', (error) => reject(error));
        readStream.on('end', () => resolve(Buffer.concat(chunks)));
    });

    const meta = file.metadata as {
        name: string;
        size: number;
    }

    return {
        id,
        type: file.contentType as string,
        name: meta.name,
        size: meta.size,
        data: data as Buffer,
    };
}

/**
 * Check if file exists
 */
export async function exists(id: string): Promise<boolean> {
    const cursor = bucket.find(
        { filename: id },
        { limit: 1 });

    const file = await cursor.next();
    return !!file;
}
