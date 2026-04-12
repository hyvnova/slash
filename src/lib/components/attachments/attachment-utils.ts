import { Routes, type AttachmentType } from '$lib/types';

export type AttachmentKind =
	| 'image'
	| 'video'
	| 'audio'
	| 'pdf'
	| 'json'
	| 'csv'
	| 'markdown'
	| 'code'
	| 'text'
	| 'font'
	| 'archive'
	| 'document';

export type CodeLanguage =
	| 'asm'
	| 'bash'
	| 'c'
	| 'css'
	| 'csv'
	| 'diff'
	| 'docker'
	| 'go'
	| 'html'
	| 'ini'
	| 'java'
	| 'js'
	| 'json'
	| 'log'
	| 'lua'
	| 'make'
	| 'md'
	| 'plain'
	| 'py'
	| 'rs'
	| 'sql'
	| 'toml'
	| 'ts'
	| 'xml'
	| 'yaml';

const CODE_EXTENSIONS: Record<string, CodeLanguage> = {
	asm: 'asm',
	bash: 'bash',
	c: 'c',
	css: 'css',
	diff: 'diff',
	dockerfile: 'docker',
	go: 'go',
	html: 'html',
	htm: 'html',
	ini: 'ini',
	java: 'java',
	js: 'js',
	jsx: 'js',
	json: 'json',
	log: 'log',
	lua: 'lua',
	makefile: 'make',
	md: 'md',
	mjs: 'js',
	py: 'py',
	rs: 'rs',
	sql: 'sql',
	svelte: 'html',
	toml: 'toml',
	ts: 'ts',
	tsx: 'ts',
	xml: 'xml',
	yaml: 'yaml',
	yml: 'yaml'
};

const ARCHIVE_EXTENSIONS = new Set(['7z', 'bz2', 'gz', 'rar', 'tar', 'tgz', 'xz', 'zip']);
const FONT_EXTENSIONS = new Set(['otf', 'ttf', 'woff', 'woff2']);

export function fileUrl(attachment: AttachmentType, inline = false) {
	return `${Routes.FILE}/${attachment.id}${inline ? '?inline=1' : ''}`;
}

export function extensionOf(name: string) {
	return name.split('.').pop()?.toLowerCase() ?? '';
}

export function languageFor(attachment: AttachmentType): CodeLanguage {
	const ext = extensionOf(attachment.name);
	if (CODE_EXTENSIONS[ext]) return CODE_EXTENSIONS[ext];
	if (attachment.type.includes('json')) return 'json';
	if (attachment.type.includes('xml')) return 'xml';
	if (attachment.type.includes('html')) return 'html';
	if (attachment.type.includes('javascript')) return 'js';
	if (attachment.type.includes('typescript')) return 'ts';
	if (attachment.type.includes('css')) return 'css';
	if (attachment.type.includes('markdown')) return 'md';
	return 'plain';
}

export function classifyAttachment(attachment: AttachmentType): AttachmentKind {
	const type = attachment.type.toLowerCase();
	const ext = extensionOf(attachment.name);

	if (type.startsWith('image/')) return 'image';
	if (type.startsWith('video/')) return 'video';
	if (type.startsWith('audio/')) return 'audio';
	if (type === 'application/pdf' || ext === 'pdf') return 'pdf';
	if (type.includes('json') || ext === 'json') return 'json';
	if (type.includes('csv') || ext === 'csv' || ext === 'tsv') return 'csv';
	if (type.includes('markdown') || ext === 'md') return 'markdown';
	if (type.startsWith('text/') || CODE_EXTENSIONS[ext])
		return CODE_EXTENSIONS[ext] ? 'code' : 'text';
	if (type.startsWith('font/') || FONT_EXTENSIONS.has(ext)) return 'font';
	if (
		ARCHIVE_EXTENSIONS.has(ext) ||
		type.includes('zip') ||
		type.includes('rar') ||
		type.includes('tar') ||
		type.includes('compressed')
	) {
		return 'archive';
	}

	return 'document';
}

export function attachmentLabel(kind: AttachmentKind) {
	if (kind === 'json') return 'json';
	if (kind === 'csv') return 'table';
	if (kind === 'markdown') return 'markdown';
	if (kind === 'pdf') return 'pdf';
	if (kind === 'font') return 'font';
	if (kind === 'archive') return 'archive';
	if (kind === 'code') return 'code';
	return kind;
}

export function parseDelimited(text: string, delimiter: ',' | '\t') {
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = '';
	let quoted = false;

	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		const next = text[index + 1];

		if (char === '"' && quoted && next === '"') {
			cell += '"';
			index++;
		} else if (char === '"') {
			quoted = !quoted;
		} else if (char === delimiter && !quoted) {
			row.push(cell);
			cell = '';
		} else if ((char === '\n' || char === '\r') && !quoted) {
			if (char === '\r' && next === '\n') index++;
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
		} else {
			cell += char;
		}
	}

	if (cell || row.length) {
		row.push(cell);
		rows.push(row);
	}

	return rows.filter((entry) => entry.some((cellValue) => cellValue.length > 0));
}
