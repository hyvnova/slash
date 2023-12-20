import { d as db } from "./db.js";
import { GridFSBucket } from "mongodb";
import { randomUUID } from "crypto";
const bucket = new GridFSBucket(db, {
  bucketName: "files"
});
async function upload_gridfs(file) {
  const id = randomUUID();
  const uploadStream = bucket.openUploadStream(id, {
    contentType: file.type,
    metadata: {
      name: file.name,
      size: file.size
    }
  });
  uploadStream.on("error", (error) => {
    console.log(error);
  });
  uploadStream.on("finish", () => {
    console.log("File uploaded successfully");
  });
  const buffer = Buffer.from(await file.arrayBuffer());
  const chunkSizeBytes = 1024 * 1024 * 16;
  for (let i = 0; i < buffer.length; i += chunkSizeBytes) {
    uploadStream.write(buffer.slice(i, i + chunkSizeBytes));
  }
  uploadStream.end();
  return id;
}
async function upload_file(file) {
  return await upload_gridfs(file);
}
async function get_file(id) {
  const cursor = bucket.find(
    { filename: id },
    { limit: 1 }
  );
  const file = await cursor.next();
  if (!file) {
    return null;
  }
  const readStream = bucket.openDownloadStream(file._id);
  readStream.on("error", (error) => {
    console.log(error);
  });
  const data = await new Promise((resolve, reject) => {
    const chunks = [];
    readStream.on("data", (chunk) => chunks.push(chunk));
    readStream.on("error", (error) => reject(error));
    readStream.on("end", () => resolve(Buffer.concat(chunks)));
  });
  const meta = file.metadata;
  return {
    id,
    type: file.contentType,
    name: meta.name,
    size: meta.size,
    data
  };
}
async function exists(id) {
  const cursor = bucket.find(
    { filename: id },
    { limit: 1 }
  );
  const file = await cursor.next();
  return !!file;
}
export {
  exists as e,
  get_file as g,
  upload_file as u
};
