# Cloudflare Realtime Migration

Slash now has a Cloudflare Workers realtime backend under [`socket-worker/`](C:/Users/Hyvnt/T/Svelte/slash/socket-worker).

## What changed

- The frontend no longer hardcodes the Railway Socket.IO URL.
- [`src/lib/websocket.ts`](C:/Users/Hyvnt/T/Svelte/slash/src/lib/websocket.ts) now uses `PUBLIC_SOCKET_SERVER_URL`.
- The browser client uses a native `WebSocket` adapter that preserves the existing `ws.emit(...)` and `ws.on(...)` usage pattern.
- The Cloudflare Durable Object handles:
  - connection handshakes
  - room fanout
  - friend request events
  - live presence/status updates
  - reconnect-friendly session replay

## Local development

1. Start the Svelte app: `npm run dev`
2. Start the realtime worker: `npm run dev:socket-worker`
3. Set `PUBLIC_SOCKET_SERVER_URL=http://localhost:8787`

## Production cutover

1. Deploy the worker from [`socket-worker/`](C:/Users/Hyvnt/T/Svelte/slash/socket-worker).
2. Set `PUBLIC_SOCKET_SERVER_URL` in the Svelte app to the deployed Worker base URL.
3. Rebuild and redeploy the frontend.
4. Verify:
   - initial connect
   - reconnect after refresh
   - friend request live updates
   - message fanout in an active chat
   - status changes across two users

## Current scope

- MongoDB remains the source of truth for user/chat/message data.
- The old Node socket server remains in the repo as a fallback path until the Worker deployment is validated.
