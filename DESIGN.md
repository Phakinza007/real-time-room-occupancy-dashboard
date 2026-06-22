# DESIGN.md — Technical Design

## System Overview

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  Login.jsx  ──►  App.jsx  ──►  Dashboard.jsx │
│                              │               │
│                    OccupancyChart.jsx         │
│                    StatusBadge.jsx            │
└──────────────────────┬──────────────────────┘
                       │  HTTP (REST) + WS
┌──────────────────────▼──────────────────────┐
│              Express + ws  (server/)          │
│                                              │
│  /api/login ──► auth.js (JWT sign)           │
│  /api/status ──► auth.js (JWT verify)        │
│  WS upgrade ──► auth.js (JWT verify)         │
│                    │                         │
│              simulator.js ──► emit every 3s  │
│                    │                         │
│              count > threshold?              │
│                    │ yes                     │
│              lineNotify.js ──► LINE API      │
└──────────────────────────────────────────────┘
```

---

## Data Flow

### Login Flow
```
Client                        Server
  │── POST /api/login ────────►│
  │   { username, password }   │ verify hardcoded creds
  │◄── 200 { token } ─────────│ jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
  │   store token in state     │
```

### WebSocket Flow
```
Client                        Server
  │── WS connect + ?token=... ►│ jwt.verify(token)
  │                            │── reject if invalid
  │◄── occupancy_update ───────│ every 3s from simulator
  │   update chart + badge     │
  │                            │ count > threshold AND cooldown expired?
  │                            │── POST to LINE API
```

---

## Module Responsibilities

### `server/index.js`
- Boot Express on `PORT`
- Attach WebSocket server to same HTTP server (`server.on('upgrade', ...)`)
- On WS connect: extract token from query string → call `auth.verifyToken()`
- Subscribe to simulator events → broadcast to all authenticated clients
- Call `lineNotify.send()` when `alert === true`

### `server/auth.js`
```js
// Two exports:
login(username, password) → token | null
verifyToken(token) → payload | null   // used by REST middleware + WS handler
```

### `server/simulator.js`
```js
// EventEmitter pattern
const emitter = new EventEmitter()
setInterval(() => {
  const count = Math.floor(Math.random() * 21)   // 0-20
  emitter.emit('occupancy', { room: 'Room A', count, timestamp: new Date().toISOString() })
}, 3000)
module.exports = emitter
```

### `server/lineNotify.js`
```js
let lastSent = 0
async function send(room, count, threshold) {
  if (Date.now() - lastSent < 5 * 60 * 1000) return   // cooldown
  // POST to LINE Messaging API
  lastSent = Date.now()
}
```

### `client/src/pages/Dashboard.jsx`
- On mount: open `new WebSocket(url + '?token=' + token)`
- `onmessage`: push data point to state array (keep last 60 points)
- `onclose` / `onerror`: show reconnect banner or redirect to login on 401-equivalent
- Pass data to `<OccupancyChart />` and `<StatusBadge />`

### `client/src/components/OccupancyChart.jsx`
- Recharts `<LineChart>` with `<ReferenceLine y={threshold}>`
- X-axis: formatted timestamp, Y-axis: count 0-20

### `client/src/components/StatusBadge.jsx`
- Props: `{ count, threshold }`
- Returns a `<span>` with conditional Tailwind classes (green / red)

---

## WebSocket Message Schema

```ts
type OccupancyUpdate = {
  type: "occupancy_update"
  room: string          // "Room A"
  count: number         // 0–20
  timestamp: string     // ISO 8601
  alert: boolean        // count > OCCUPANCY_THRESHOLD
}
```

---

## Security Decisions

| Decision | Reason |
|----------|--------|
| JWT in WS query string (not header) | WebSocket API has no custom headers in browser |
| Token expiry 1 h | Short enough for demo security, long enough for a recruiter session |
| Cooldown in memory (not DB) | Stateless restart is fine for single-instance demo |
| Credentials in .env only | Never expose secrets; .env in .gitignore |

---

## Key Design Tradeoffs

**WebSocket vs SSE**
Chose WebSocket — bidirectional capability is the skill being demonstrated. SSE would be simpler for one-way push but less impressive on a portfolio.

**In-memory state vs DB**
No persistence for MVP. Restart loses history. Acceptable for a demo; noted honestly in CONTEXT.md.

**Single room vs multi-room**
Single room keeps the data model flat and readable. Multi-room = add `room` dimension to state + chart legend. Roadmap item.

**LINE vs email/Slack**
LINE Messaging API is common in Thai IoT stacks and shows regional API integration experience.
