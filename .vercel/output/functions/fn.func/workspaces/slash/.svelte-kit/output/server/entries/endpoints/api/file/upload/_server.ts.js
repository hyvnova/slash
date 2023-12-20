import { u as upload_file } from "../../../../../chunks/files.js";
import { j as json } from "../../../../../chunks/index.js";
import "dotenv/config";
const POST = async ({ request, cookies }) => {
  const formData = await request.formData();
  if (!cookies.get("token")) {
    return json({
      error: "You are not logged in"
    }, { status: 400 });
  }
  const files = formData.getAll("files");
  console.log("Files", files);
  if (!files || files.length === 0) {
    return json({
      error: "Missing files in the request"
    }, { status: 400 });
  }
  const result = [];
  for (const file of files) {
    try {
      const id = await upload_file(file);
      result.push({
        id,
        type: file.type,
        name: file.name,
        size: file.size
      });
    } catch (e) {
      console.log("Error uploading file", e);
    }
  }
  return json(result, { status: 200 });
};
export {
  POST
};
