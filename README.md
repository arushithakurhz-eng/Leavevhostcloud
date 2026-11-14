# Leavehost Cloud — Minecraft panel starter

This is a responsive React/Vite control-panel frontend for `leavehost.cloud`, inspired by the reference's server-management workflow. It includes a local demo server, console UI, server overview, file list, player list, resource cards, navigation and localStorage persistence.

## Run locally
1. Install Node.js 20 or newer.
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Deploy the website without managing a VPS
Build with `npm run build`. Upload the generated `dist/` folder to Cloudflare Pages, Netlify, or Vercel. Point `leavehost.cloud` to that deployment using the provider's domain instructions.

## Important: what is and isn't live
The included UI runs as a browser demo. Server start/stop, console output, player names, files, and resource figures are simulated and saved locally where applicable. This package does **not** create or run Minecraft worlds, allocate RAM/CPU, or provide a real server IP.

A Minecraft server needs a continuously running machine somewhere. You can avoid owning/managing a VPS by using a managed Minecraft hosting provider or game-server nodes operated by a partner. Your website can remain on serverless/static hosting.

## Connect a real server provider
For real power controls, console streaming, files and player data, connect a backend to a provider's authenticated API (commonly a Pterodactyl-compatible panel API):
- Keep provider API tokens on the backend only. Never put them in browser JavaScript.
- Add authenticated backend endpoints for server list, power actions, websocket console, files, players and resource stats.
- Store user accounts, ownership and server IDs in a database.
- Enforce per-user authorization and rate limits on every endpoint.
- Configure provider webhooks or polling for live status.

Suggested architecture:
`Browser (Cloudflare Pages) -> Auth/API (Supabase Edge Functions or Worker) -> Managed game-host provider API -> Minecraft node`

You must have a provider account and permission to use its API. If you tell us which provider you will use (or whether you already have a Pterodactyl/FeatherPanel panel URL), the integration can be wired to it. Do not share API tokens in chat.
