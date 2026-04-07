# Slash Realtime Worker

Cloudflare Workers + Durable Objects replacement for the old Railway Socket.IO host.

## Local dev

1. `cd socket-worker`
2. `npm install`
3. `npm run dev`

Wrangler serves the worker at `http://localhost:8787`, with the websocket endpoint at `/websocket`.

## Deploy

1. `cd socket-worker`
2. `npm install`
3. `npm run deploy`
4. Set `PUBLIC_SOCKET_SERVER_URL` in the Svelte app to your deployed worker URL, for example:
   `https://slash-realtime.<your-subdomain>.workers.dev`

The client normalizes that public URL to `wss://.../websocket`.
