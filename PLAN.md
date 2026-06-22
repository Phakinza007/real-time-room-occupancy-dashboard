# PLAN.md — What's Next

Current state: ✅ Phases 1–3 complete — app verified, deployed to Render + Vercel, WebSocket reconnect live.

🔗 Frontend: https://real-time-room-occupancy-dashboard-4pmy03rju.vercel.app
🔗 API: https://real-time-room-occupancy-dashboard.onrender.com

---

## Phase 1 — Verify & Screenshot ✅ DONE

- [x] Server + client both start
- [x] Login with `admin` / `admin123` → redirects to dashboard
- [x] Chart updates every 3 s via WebSocket (confirmed live in browser)
- [x] StatusBadge shows green ✓ Normal / red ⚠ Over Limit
- [x] LINE fallback logs to console when no token configured
- [x] Screenshot saved to `docs/screenshot.png`
- [x] README updated with real screenshot

---

## Phase 2 — Deploy (highest portfolio value, ~2 hrs)

**Goal:** live URL a recruiter can click without cloning anything.

### 2a. Server → Railway

1. Go to railway.app → New Project → Deploy from GitHub repo
2. Set root directory: `server`
3. Add environment variables (copy from `server/.env.example`):
   - `JWT_SECRET` — generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `PORT` — Railway sets this automatically, leave blank
   - `LINE_CHANNEL_ACCESS_TOKEN` — paste if you have one, else leave empty
   - `LINE_USER_ID` — same
   - `OCCUPANCY_THRESHOLD=10`
4. Note the Railway public URL: `https://your-app.railway.app`

### 2b. Client → Vercel

1. Go to vercel.com → New Project → import same GitHub repo
2. Set root directory: `client`
3. Add environment variable:
   - `VITE_WS_URL=wss://your-app.railway.app`
4. Update `Dashboard.jsx` line that opens WebSocket:

```js
// change this:
const ws = new WebSocket(`ws://localhost:3001?token=${token}`)
// to:
const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}?token=${token}`)
```

5. Push the change → Vercel auto-deploys

**Deliverable:** live demo URL in README.

---

## Phase 3 — Polish (optional, ~1 hr)

Small things that matter in a code review:

- [ ] Add `VITE_WS_URL` to `.env.example` (document it)
- [ ] Auto-reconnect on WS disconnect (retry after 3 s with exponential backoff)
- [ ] Show "Reconnecting…" banner instead of silent disconnect
- [ ] Add `.env` to root `.gitignore` (currently only in server/)
- [ ] `npm run install:all` script in root README so clone → install is one command

---

## Phase 4 — Stretch (only if asked in interview)

These show growth areas — mention them, don't build them speculatively.

| Feature | What it adds | Effort |
|---------|-------------|--------|
| Multi-room support | array of rooms in simulator, room selector in UI | M |
| Persistent history | SQLite via better-sqlite3, `/api/history` endpoint | M |
| HTTPS / WSS in dev | self-signed cert via `vite --https` + ws `tls` | S |
| Docker Compose | one-command local setup | S |
| MQTT support | replace simulator with real broker (mosquitto) | L |

---

## Priority Order

```
Phase 1 (screenshot)  →  Phase 2 (deploy)  →  Phase 3 (polish)  →  stop
```

Don't start Phase 4 until a recruiter asks about it.
