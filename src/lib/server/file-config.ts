import { env } from '$env/dynamic/private';

const DEFAULT_MAX_SINGLE_UPLOAD_BYTES = 50 * 1024 * 1024;
const DEFAULT_USER_UPLOAD_QUOTA_BYTES = 100 * 1024 * 1024;
const DEFAULT_PENDING_UPLOAD_TTL_MS = 30 * 60 * 1000;

function parsePositiveInteger(value: string | undefined, fallback: number | null): number | null {
	if (!value) {
		return fallback;
	}

	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return fallback;
	}

	return Math.floor(parsed);
}

export const MAX_SINGLE_UPLOAD_BYTES =
	parsePositiveInteger(env.MAX_SINGLE_UPLOAD_BYTES, DEFAULT_MAX_SINGLE_UPLOAD_BYTES) ??
	DEFAULT_MAX_SINGLE_UPLOAD_BYTES;

export const USER_UPLOAD_QUOTA_BYTES =
	parsePositiveInteger(env.USER_UPLOAD_QUOTA_BYTES, DEFAULT_USER_UPLOAD_QUOTA_BYTES) ??
	DEFAULT_USER_UPLOAD_QUOTA_BYTES;

export const APP_FILE_STORAGE_SOFT_LIMIT_BYTES = parsePositiveInteger(
	env.APP_FILE_STORAGE_SOFT_LIMIT_BYTES,
	null
);

export const MONGODB_STORAGE_SOFT_LIMIT_BYTES = parsePositiveInteger(
	env.MONGODB_STORAGE_SOFT_LIMIT_BYTES,
	null
);

export const PENDING_UPLOAD_TTL_MS =
	parsePositiveInteger(env.PENDING_UPLOAD_TTL_MS, DEFAULT_PENDING_UPLOAD_TTL_MS) ??
	DEFAULT_PENDING_UPLOAD_TTL_MS;

export const TEXT_PREVIEW_MAX_BYTES =
	parsePositiveInteger(env.TEXT_PREVIEW_MAX_BYTES, 256 * 1024) ?? 256 * 1024;
