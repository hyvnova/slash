/**
 *  ROUTE: /api/file
 * METHOD: GET
 * Returns file data
 */

import { exists, get_file } from "$lib/server/db/files";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {

    const id = params.id;

    if (!id || !await exists(id)) {
        return new Response(null, { status: 404 });
    }

    let file = await get_file(id);

    if (!file) {
        return new Response(null, { status: 404 });
    }

    // Log a sample of the file data
    return new Response(
        file.data as Buffer,
        {
            status: 200,
            headers: {
                "Content-Type": file.type,
                "Content-Disposition": `attachment; filename=${file.name}`
            }
        }
    );
};