import { e as exists, g as get_file } from "../../../../chunks/files.js";
const GET = async ({ params }) => {
  const id = params.id;
  if (!id || !await exists(id)) {
    return new Response(null, { status: 404, statusText: "File not found" });
  }
  let file = await get_file(id);
  if (!file) {
    return new Response(null, { status: 404, statusText: "File not found" });
  }
  return new Response(
    file.data,
    {
      status: 200,
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename=${file.name}`
      }
    }
  );
};
export {
  GET
};
