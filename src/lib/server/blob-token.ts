import { env } from '$env/dynamic/private';

export function getBlobToken() {
	return env.BLOB_READ_WRITE_TOKEN;
}
