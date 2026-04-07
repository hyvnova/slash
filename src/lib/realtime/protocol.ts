export const SOCKET_ENDPOINT_PATH = '/websocket';

export type RealtimeEmitPacket = {
	kind: 'emit';
	event: string;
	args: unknown[];
	ackId?: string;
};

export type RealtimeEventPacket = {
	kind: 'event';
	event: string;
	args: unknown[];
};

export type RealtimeAckPacket = {
	kind: 'ack';
	ackId: string;
	args: unknown[];
};

export type RealtimeClientPacket = RealtimeEmitPacket;
export type RealtimeServerPacket = RealtimeEventPacket | RealtimeAckPacket;
export type RealtimePacket = RealtimeClientPacket | RealtimeServerPacket;

type JsonRecord = Record<string, unknown>;

export function serializeRealtimePacket(packet: RealtimePacket): string {
	return JSON.stringify(packet);
}

export function parseRealtimePacket(raw: string): RealtimePacket | null {
	try {
		const parsed = JSON.parse(raw) as unknown;
		return isRealtimePacket(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function isRealtimePacket(value: unknown): value is RealtimePacket {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const packet = value as JsonRecord;
	if (packet.kind === 'emit' || packet.kind === 'event') {
		return typeof packet.event === 'string' && Array.isArray(packet.args);
	}

	if (packet.kind === 'ack') {
		return typeof packet.ackId === 'string' && Array.isArray(packet.args);
	}

	return false;
}

