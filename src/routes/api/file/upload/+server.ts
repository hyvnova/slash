/**
 * Handle message attachments upload
 * Takes FormData containing files and uploads them to the server
 * 
 * @param {FormData} formData - FormData object containing files 
 * @returns {Promise<AttachmentType[]>}
 */

import { upload_file } from "$lib/server/db/files";
import type { AttachmentType } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";
import "dotenv/config";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const formData = await request.formData();

    // Check if user is logged in
    if (!cookies.get("token")) {
        return json({
            error: "You are not logged in"
        }, { status: 400 });
    }

    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
        return json({
            error: "Missing files in the request"
        }, { status: 400 });
    }

    const result: AttachmentType[] = [];

    // Upload files
    for (const file of files) {
        try{
            const id = await upload_file(file);

            result.push({
                id: id,
                type: file.type,
                name: file.name
            });
        } catch (e) {
            console.log("Error uploading file", e);
        }
    }

    return json(result, { status: 200 });
};
