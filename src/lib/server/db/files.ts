import { del } from '@vercel/blob';
import { randomUUID } from 'crypto';
import { GridFSBucket, type GridFSFile } from 'mongodb';
import type {
	AdminFileListItem,
	AdminFileListResponse,
	AdminFileStats,
	AttachmentType,
	FileQuotaSummary,
	FileSource,
	FileStatus,
	UploadPrepareResponse,
	UserFileListItem,
	UserFileListResponse
} from '$lib/types';
import {
	APP_FILE_STORAGE_SOFT_LIMIT_BYTES,
	MAX_SINGLE_UPLOAD_BYTES,
	MONGODB_STORAGE_SOFT_LIMIT_BYTES,
	PENDING_UPLOAD_TTL_MS,
	USER_UPLOAD_QUOTA_BYTES
} from '$lib/server/file-config';
import { getBlobToken } from '$lib/server/blob-token';
import { db } from './db';

const bucket = new GridFSBucket(db, {
	bucketName: 'files'
});

type LegacyFileType = {
	id: string;
	type: string;
	name: string;
	size: number;
	data: Buffer;
};

type StoredFileRecord = {
	id: string;
	sha256: string;
	originalName: string | null;
	blobUrl: string | null;
	blobPathname: string | null;
	contentType: string;
	size: number;
	status: FileStatus;
	source: FileSource;
	createdAt: Date;
	deletedAt: Date | null;
	refCount: number;
	legacyGridFsId: string | null;
};

type UserFileRefRecord = {
	username: string;
	fileId: string;
	displayName: string;
	sizeCounted: number;
	createdAt: Date;
	lastUsedAt: Date;
};

type PendingUploadRecord = {
	id: string;
	fileId: string;
	username: string;
	sha256: string;
	size: number;
	displayName: string;
	contentType: string;
	pathname: string;
	expiresAt: Date;
	status: 'pending' | 'uploaded' | 'completed' | 'failed';
	blobUrl: string | null;
	blobPathname: string | null;
	uploadedAt: Date | null;
	completedAt: Date | null;
};

type BlobResult = {
	url: string;
	pathname: string;
	contentType: string;
};

type FileResolution =
	| { kind: 'redirect'; url: string }
	| { kind: 'legacy'; file: LegacyFileType }
	| { kind: 'deleted' }
	| { kind: 'missing' };

let indexesPromise: Promise<void> | null = null;

function filesCollection() {
	return db.collection<StoredFileRecord>('files');
}

function refsCollection() {
	return db.collection<UserFileRefRecord>('user_file_refs');
}

function pendingCollection() {
	return db.collection<PendingUploadRecord>('pending_uploads');
}

async function ensureIndexes() {
	if (!indexesPromise) {
		indexesPromise = (async () => {
			await filesCollection().createIndexes([
				{ key: { id: 1 }, unique: true },
				{ key: { sha256: 1 }, unique: true }
			]);

			await refsCollection().createIndexes([
				{ key: { username: 1, fileId: 1 }, unique: true },
				{ key: { username: 1 } }
			]);

			await pendingCollection().createIndexes([
				{ key: { id: 1 }, unique: true },
				{ key: { expiresAt: 1 }, expireAfterSeconds: 0 }
			]);
		})().catch((error) => {
			indexesPromise = null;
			throw error;
		});
	}

	await indexesPromise;
}

function toAttachment(
	file: Pick<StoredFileRecord, 'id' | 'contentType' | 'size'>,
	displayName: string
): AttachmentType {
	return {
		id: file.id,
		type: file.contentType,
		name: displayName,
		size: file.size
	};
}

function safeFilename(name: string) {
	return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120) || 'file';
}

async function getUserUsageBytes(username: string) {
	const result = await refsCollection()
		.aggregate<{ total: number }>([
			{ $match: { username } },
			{ $group: { _id: null, total: { $sum: '$sizeCounted' } } }
		])
		.next();

	return result?.total ?? 0;
}

async function getAppActiveBytes() {
	const result = await filesCollection()
		.aggregate<{ total: number }>([
			{ $match: { status: 'active', source: 'blob' } },
			{ $group: { _id: null, total: { $sum: '$size' } } }
		])
		.next();

	return result?.total ?? 0;
}

async function buildQuotaSummary(username: string): Promise<FileQuotaSummary> {
	const [usedBytes, appUsedBytes] = await Promise.all([
		getUserUsageBytes(username),
		getAppActiveBytes()
	]);

	return {
		usedBytes,
		userLimitBytes: USER_UPLOAD_QUOTA_BYTES,
		remainingBytes: Math.max(0, USER_UPLOAD_QUOTA_BYTES - usedBytes),
		appUsedBytes,
		appLimitBytes: APP_FILE_STORAGE_SOFT_LIMIT_BYTES,
		appRemainingBytes:
			APP_FILE_STORAGE_SOFT_LIMIT_BYTES === null
				? null
				: Math.max(0, APP_FILE_STORAGE_SOFT_LIMIT_BYTES - appUsedBytes)
	};
}

async function syncRefCount(fileId: string) {
	const refCount = await refsCollection().countDocuments({ fileId });
	await filesCollection().updateOne({ id: fileId }, { $set: { refCount } });
	return refCount;
}

async function cleanupExpiredPendingUploads() {
	await pendingCollection().deleteMany({
		expiresAt: { $lt: new Date() },
		status: { $in: ['pending', 'failed'] }
	});
}

async function deleteLegacyGridFsFile(id: string) {
	const file = await bucket.find({ filename: id }, { limit: 1 }).next();
	if (!file) {
		return;
	}

	await bucket.delete(file._id);
}

async function deleteBlobUrl(blobUrl: string | null) {
	if (!blobUrl) {
		return;
	}

	try {
		await del(blobUrl, { token: getBlobToken() });
	} catch (error) {
		console.error('[files] Failed to delete blob', error);
	}
}

export async function upload_file(file: File): Promise<string> {
	const id = randomUUID();
	const uploadStream = bucket.openUploadStream(id, {
		contentType: file.type,
		metadata: {
			name: file.name,
			size: file.size
		}
	});

	const buffer = Buffer.from(await file.arrayBuffer());

	await new Promise<void>((resolve, reject) => {
		uploadStream.on('error', reject);
		uploadStream.on('finish', () => resolve());
		uploadStream.end(buffer);
	});

	return id;
}

export async function get_file(id: string): Promise<LegacyFileType | null> {
	const file = await bucket.find({ filename: id }, { limit: 1 }).next();
	if (!file) {
		return null;
	}

	const readStream = bucket.openDownloadStream(file._id);
	const data = await new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		readStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		readStream.on('error', reject);
		readStream.on('end', () => resolve(Buffer.concat(chunks)));
	});

	const meta = (file.metadata ?? {}) as { name?: string; size?: number };
	return {
		id,
		type: file.contentType ?? 'application/octet-stream',
		name: meta.name ?? id,
		size: meta.size ?? data.length,
		data
	};
}

export async function exists(id: string): Promise<boolean> {
	await ensureIndexes();
	const metadata = await filesCollection().findOne({ id }, { projection: { _id: 1 } });
	if (metadata) {
		return true;
	}

	const legacy = await bucket.find({ filename: id }, { limit: 1 }).next();
	return !!legacy;
}

export async function prepare_file_upload(params: {
	username: string;
	name: string;
	size: number;
	type: string;
	sha256: string;
}): Promise<UploadPrepareResponse> {
	await ensureIndexes();
	await cleanupExpiredPendingUploads();

	const { username, name, size, type, sha256 } = params;
	if (!name || !sha256 || !type) {
		throw new Error('Missing upload metadata');
	}

	if (size <= 0 || size > MAX_SINGLE_UPLOAD_BYTES) {
		throw new Error(`File exceeds the ${MAX_SINGLE_UPLOAD_BYTES} byte upload limit`);
	}

	const [quota, existingFile] = await Promise.all([
		buildQuotaSummary(username),
		filesCollection().findOne({ sha256 })
	]);

	if (existingFile) {
		const existingRef = await refsCollection().findOne({
			username,
			fileId: existingFile.id
		});

		if (existingRef) {
			await refsCollection().updateOne(
				{ username, fileId: existingFile.id },
				{ $set: { lastUsedAt: new Date(), displayName: name } }
			);
			return {
				mode: 'existing',
				attachment: toAttachment(existingFile, name),
				quota
			};
		}

		if (existingFile.status === 'active') {
			if (quota.usedBytes + existingFile.size > USER_UPLOAD_QUOTA_BYTES) {
				throw new Error('Upload quota exceeded');
			}

			await refsCollection().insertOne({
				username,
				fileId: existingFile.id,
				displayName: name,
				sizeCounted: existingFile.size,
				createdAt: new Date(),
				lastUsedAt: new Date()
			});
			await syncRefCount(existingFile.id);

			return {
				mode: 'existing',
				attachment: toAttachment(existingFile, name),
				quota: await buildQuotaSummary(username)
			};
		}
	}

	if (quota.usedBytes + size > USER_UPLOAD_QUOTA_BYTES) {
		throw new Error('Upload quota exceeded');
	}

	if (
		APP_FILE_STORAGE_SOFT_LIMIT_BYTES !== null &&
		quota.appUsedBytes + size > APP_FILE_STORAGE_SOFT_LIMIT_BYTES
	) {
		throw new Error('Application file storage limit exceeded');
	}

	const pending = await pendingCollection().findOne({
		username,
		sha256,
		status: { $in: ['pending', 'uploaded'] }
	});

	if (pending && pending.expiresAt > new Date()) {
		return {
			mode: 'upload',
			pendingId: pending.id,
			pathname: pending.pathname,
			quota
		};
	}

	const fileId = existingFile?.id ?? randomUUID();
	const pendingId = randomUUID();
	const pathname = `attachments/${sha256}/${pendingId}-${safeFilename(name)}`;

	await pendingCollection().insertOne({
		id: pendingId,
		fileId,
		username,
		sha256,
		size,
		displayName: name,
		contentType: type,
		pathname,
		expiresAt: new Date(Date.now() + PENDING_UPLOAD_TTL_MS),
		status: 'pending',
		blobUrl: null,
		blobPathname: null,
		uploadedAt: null,
		completedAt: null
	});

	return {
		mode: 'upload',
		pendingId,
		pathname,
		quota
	};
}

export async function mark_pending_upload_uploaded(pendingId: string, blob: BlobResult) {
	await ensureIndexes();
	await pendingCollection().updateOne(
		{ id: pendingId },
		{
			$set: {
				status: 'uploaded',
				blobUrl: blob.url,
				blobPathname: blob.pathname,
				contentType: blob.contentType,
				uploadedAt: new Date()
			}
		}
	);
}

export async function get_pending_upload(pendingId: string) {
	await ensureIndexes();
	return pendingCollection().findOne({ id: pendingId });
}

export async function finalize_file_upload(params: {
	pendingId: string;
	blob?: BlobResult;
}): Promise<AttachmentType> {
	await ensureIndexes();

	const pending = await pendingCollection().findOne({ id: params.pendingId });
	if (!pending) {
		throw new Error('Upload reservation not found');
	}

	if (pending.status === 'completed') {
		const file = await filesCollection().findOne({ id: pending.fileId });
		if (!file) {
			throw new Error('File metadata missing after completion');
		}

		const ref = await refsCollection().findOne({
			username: pending.username,
			fileId: pending.fileId
		});

		return toAttachment(file, ref?.displayName ?? pending.displayName);
	}

	const blob =
		params.blob ??
		(pending.blobUrl && pending.blobPathname
			? {
					url: pending.blobUrl,
					pathname: pending.blobPathname,
					contentType: pending.contentType
				}
			: null);

	if (!blob) {
		throw new Error('Uploaded blob metadata not found');
	}

	let file = await filesCollection().findOne({ sha256: pending.sha256 });
	let duplicateBlobUrl: string | null = null;

	if (!file) {
		const newFile: StoredFileRecord = {
			id: pending.fileId,
			sha256: pending.sha256,
			originalName: pending.displayName,
			blobUrl: blob.url,
			blobPathname: blob.pathname,
			contentType: blob.contentType || pending.contentType,
			size: pending.size,
			status: 'active',
			source: 'blob',
			createdAt: new Date(),
			deletedAt: null,
			refCount: 0,
			legacyGridFsId: null
		};

		try {
			await filesCollection().insertOne(newFile);
			file = await filesCollection().findOne({ id: newFile.id });
		} catch {
			file = await filesCollection().findOne({ sha256: pending.sha256 });
			duplicateBlobUrl = blob.url;
		}
	} else if (file.status === 'deleted') {
		await filesCollection().updateOne(
			{ id: file.id },
			{
				$set: {
					blobUrl: blob.url,
					blobPathname: blob.pathname,
					originalName: pending.displayName,
					contentType: blob.contentType || pending.contentType,
					size: pending.size,
					status: 'active',
					source: 'blob',
					deletedAt: null
				}
			}
		);
		file = await filesCollection().findOne({ id: file.id });
	} else if (file.blobUrl !== blob.url) {
		duplicateBlobUrl = blob.url;
	}

	if (!file) {
		throw new Error('Failed to finalize file metadata');
	}

	const refResult = await refsCollection().updateOne(
		{ username: pending.username, fileId: file.id },
		{
			$setOnInsert: {
				username: pending.username,
				fileId: file.id,
				displayName: pending.displayName,
				sizeCounted: file.size,
				createdAt: new Date()
			},
			$set: {
				lastUsedAt: new Date(),
				displayName: pending.displayName
			}
		},
		{ upsert: true }
	);

	await syncRefCount(file.id);

	await pendingCollection().updateOne(
		{ id: pending.id },
		{
			$set: {
				status: 'completed',
				fileId: file.id,
				blobUrl: file.blobUrl,
				blobPathname: file.blobPathname,
				completedAt: new Date()
			}
		}
	);

	if (duplicateBlobUrl && refResult.upsertedCount >= 0) {
		await deleteBlobUrl(duplicateBlobUrl);
	}

	return toAttachment(file, pending.displayName);
}

export async function get_user_files(username: string): Promise<UserFileListResponse> {
	await ensureIndexes();

	const refs = await refsCollection()
		.aggregate<UserFileListItem>([
			{ $match: { username } },
			{
				$lookup: {
					from: 'files',
					localField: 'fileId',
					foreignField: 'id',
					as: 'file'
				}
			},
			{ $unwind: '$file' },
			{ $sort: { lastUsedAt: -1 } },
			{
				$project: {
					_id: 0,
					id: '$file.id',
					name: '$displayName',
					type: '$file.contentType',
					size: '$file.size',
					status: '$file.status',
					source: '$file.source',
					uploadedAt: {
						$dateToString: { date: '$createdAt' }
					},
					lastUsedAt: {
						$dateToString: { date: '$lastUsedAt' }
					}
				}
			}
		])
		.toArray();

	return {
		files: refs,
		quota: await buildQuotaSummary(username)
	};
}

async function tombstone_file(file: StoredFileRecord) {
	if (file.source === 'blob') {
		await deleteBlobUrl(file.blobUrl);
	}

	if (file.source === 'legacy-gridfs') {
		await deleteLegacyGridFsFile(file.id);
	}

	await filesCollection().updateOne(
		{ id: file.id },
		{
			$set: {
				status: 'deleted',
				deletedAt: new Date(),
				blobUrl: null,
				blobPathname: null,
				refCount: 0
			}
		}
	);
}

export async function delete_user_file(username: string, fileId: string) {
	await ensureIndexes();

	const ref = await refsCollection().findOne({ username, fileId });
	if (!ref) {
		throw new Error('File not found');
	}

	await refsCollection().deleteOne({ username, fileId });
	const refCount = await syncRefCount(fileId);
	const file = await filesCollection().findOne({ id: fileId });

	if (file && file.status === 'active' && refCount === 0) {
		await tombstone_file(file);
	}

	return buildQuotaSummary(username);
}

export async function delete_file_as_admin(fileId: string) {
	await ensureIndexes();
	const file = await filesCollection().findOne({ id: fileId });
	if (!file) {
		throw new Error('File not found');
	}

	await refsCollection().deleteMany({ fileId });
	await tombstone_file(file);
}

export async function get_admin_files(params: {
	page?: number;
	pageSize?: number;
	filter?: 'all' | 'active' | 'deleted' | 'orphaned' | 'legacy';
}): Promise<AdminFileListResponse> {
	await ensureIndexes();

	const page = Math.max(1, params.page ?? 1);
	const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 25));
	const filter = params.filter ?? 'all';

	const match: Record<string, unknown> = {};
	if (filter === 'active') {
		match.status = 'active';
	} else if (filter === 'deleted') {
		match.status = 'deleted';
	} else if (filter === 'orphaned') {
		match.refCount = 0;
		match.status = 'active';
	} else if (filter === 'legacy') {
		match.source = 'legacy-gridfs';
	}

	const [total, files, stats] = await Promise.all([
		filesCollection().countDocuments(match),
		filesCollection()
			.find(match, { projection: { _id: 0 } })
			.sort({ createdAt: -1 })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.toArray(),
		get_admin_file_stats()
	]);

	const items: AdminFileListItem[] = files.map((file) => ({
		id: file.id,
		name: file.originalName || file.blobPathname?.split('/').pop() || file.id,
		type: file.contentType,
		size: file.size,
		status: file.status,
		source: file.source,
		sha256: file.sha256,
		refCount: file.refCount,
		uploadedAt: file.createdAt.toISOString(),
		deletedAt: file.deletedAt?.toISOString() ?? null,
		blobUrl: file.blobUrl
	}));

	return {
		files: items,
		stats,
		page,
		pageSize,
		total,
		filter
	};
}

export async function get_admin_file_stats(): Promise<AdminFileStats> {
	await ensureIndexes();

	const [fileSummary, topUsers, mongoStats] = await Promise.all([
		filesCollection()
			.aggregate<{
				uniqueActiveBytes: number;
				deletedCount: number;
				activeCount: number;
				orphanedCount: number;
				legacyCount: number;
				dedupeSavingsBytes: number;
			}>([
				{
					$group: {
						_id: null,
						uniqueActiveBytes: {
							$sum: {
								$cond: [{ $eq: ['$status', 'active'] }, '$size', 0]
							}
						},
						deletedCount: {
							$sum: {
								$cond: [{ $eq: ['$status', 'deleted'] }, 1, 0]
							}
						},
						activeCount: {
							$sum: {
								$cond: [{ $eq: ['$status', 'active'] }, 1, 0]
							}
						},
						orphanedCount: {
							$sum: {
								$cond: [
									{
										$and: [{ $eq: ['$status', 'active'] }, { $eq: ['$refCount', 0] }]
									},
									1,
									0
								]
							}
						},
						legacyCount: {
							$sum: {
								$cond: [{ $eq: ['$source', 'legacy-gridfs'] }, 1, 0]
							}
						},
						dedupeSavingsBytes: {
							$sum: {
								$max: [{ $multiply: [{ $subtract: ['$refCount', 1] }, '$size'] }, 0]
							}
						}
					}
				}
			])
			.next(),
		refsCollection()
			.aggregate<{ username: string; usedBytes: number }>([
				{
					$group: {
						_id: '$username',
						usedBytes: { $sum: '$sizeCounted' }
					}
				},
				{ $sort: { usedBytes: -1 } },
				{ $limit: 10 },
				{
					$project: {
						_id: 0,
						username: '$_id',
						usedBytes: 1
					}
				}
			])
			.toArray(),
		get_mongo_storage_stats()
	]);

	return {
		uniqueActiveBytes: fileSummary?.uniqueActiveBytes ?? 0,
		deletedCount: fileSummary?.deletedCount ?? 0,
		dedupeSavingsBytes: fileSummary?.dedupeSavingsBytes ?? 0,
		activeCount: fileSummary?.activeCount ?? 0,
		orphanedCount: fileSummary?.orphanedCount ?? 0,
		legacyCount: fileSummary?.legacyCount ?? 0,
		topUsers,
		mongo: mongoStats
	};
}

export async function get_mongo_storage_stats() {
	try {
		const stats = await db.stats();
		return {
			dataSize: stats.dataSize ?? null,
			storageSize: stats.storageSize ?? null,
			collections: stats.collections ?? null,
			objects: stats.objects ?? null,
			remainingBytes:
				MONGODB_STORAGE_SOFT_LIMIT_BYTES === null || stats.storageSize == null
					? null
					: Math.max(0, MONGODB_STORAGE_SOFT_LIMIT_BYTES - stats.storageSize)
		};
	} catch (error) {
		console.error('[files] Failed to read Mongo stats', error);
		return {
			dataSize: null,
			storageSize: null,
			collections: null,
			objects: null,
			remainingBytes: null
		};
	}
}

export async function resolve_file(id: string): Promise<FileResolution> {
	await ensureIndexes();

	const metadata = await filesCollection().findOne({ id });
	if (metadata) {
		if (metadata.status === 'deleted') {
			return { kind: 'deleted' };
		}

		if (metadata.source === 'blob' && metadata.blobUrl) {
			return { kind: 'redirect', url: metadata.blobUrl };
		}

		const legacy = await get_file(metadata.legacyGridFsId ?? metadata.id);
		return legacy ? { kind: 'legacy', file: legacy } : { kind: 'deleted' };
	}

	const legacy = await get_file(id);
	return legacy ? { kind: 'legacy', file: legacy } : { kind: 'missing' };
}

export async function get_file_metadata(id: string) {
	await ensureIndexes();
	return filesCollection().findOne({ id });
}

export async function mark_legacy_file(id: string, file: GridFSFile) {
	await ensureIndexes();
	const existing = await filesCollection().findOne({ id });
	if (existing) {
		return existing;
	}

	const metadata = (file.metadata ?? {}) as { name?: string; size?: number; sha256?: string };
	const record: StoredFileRecord = {
		id,
		sha256: metadata.sha256 ?? `legacy:${id}`,
		originalName: metadata.name ?? id,
		blobUrl: null,
		blobPathname: null,
		contentType: file.contentType ?? 'application/octet-stream',
		size: metadata.size ?? file.length,
		status: 'active',
		source: 'legacy-gridfs',
		createdAt: file.uploadDate ?? new Date(),
		deletedAt: null,
		refCount: 0,
		legacyGridFsId: id
	};

	await filesCollection().insertOne(record);
	return record;
}

export async function list_legacy_gridfs_files(limit = 1000) {
	return bucket.find({}, { limit }).toArray();
}
