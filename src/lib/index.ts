// place files you want to import through the `$lib` alias in this folder.
// place files you want to import through the `$lib` alias in this folder.
export const REGEX_USERNAME = /^[a-z0-9_]{1,24}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_IMAGE_URL = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;

/**
 * Convert bytes to human readable size
 * @param {number} bytes
 * @returns {string}
 */
export const bytes_to_size = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};



export const MAX_FILE_LOAD_TRIES = 5; // 5! worth of seconds 