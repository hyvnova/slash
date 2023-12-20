const REGEX_USERNAME = /^[a-z0-9_]{1,24}$/;
const REGEX_IMAGE_URL = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
const bytes_to_size = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0)
    return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};
export {
  REGEX_USERNAME as R,
  REGEX_IMAGE_URL as a,
  bytes_to_size as b
};
