# SKILL.md — Skills Demonstrated

Skills this project is designed to show to a recruiter for a Full-Stack / IoT / Cloud Node.js role.

---

## Backend

| Skill | Where |
|-------|-------|
| Node.js async/await, event-driven architecture | `server/index.js`, `server/simulator.js` |
| Express REST API design | `POST /api/login`, `GET /api/status` |
| WebSocket (ws library) — bi-directional push | `server/index.js` WS upgrade handler |
| JWT auth — issue, verify, expire | `server/auth.js` |
| Third-party API integration (LINE Messaging) | `server/lineNotify.js` |
| Environment-based config (dotenv) | `server/.env` |
| Rate-limiting / cooldown logic | 5-min LINE notify cooldown |

## Frontend

| Skill | Where |
|-------|-------|
| React 18 functional components + hooks | `client/src/` |
| Vite build tooling | `client/vite.config.js` |
| Tailwind CSS utility-first styling | all JSX files |
| Real-time data rendering (WebSocket client) | `Dashboard.jsx` |
| Recharts — time-series line chart | `OccupancyChart.jsx` |
| Protected routing (token gate) | `App.jsx` |

## DevOps / Workflow

| Skill | Where |
|-------|-------|
| Git branching strategy (main / dev / feat/*) | `.git` + branch history |
| Conventional commits | commit messages |
| Concurrently — parallel dev processes | root `package.json` |
| `.gitignore` hygiene — no secrets committed | `.gitignore` |

## IoT / Domain

| Skill | What it shows |
|-------|---------------|
| Sensor simulation pattern | understanding of IoT data ingestion |
| Threshold-based alerting | real-world monitoring logic |
| Real-time dashboard design | low-latency UX decisions |

---

## What This Project Does NOT Cover (honest scope)

- No real hardware / MQTT
- No persistent storage (in-memory only)
- No horizontal scaling / Redis pub-sub
- No HTTPS / WSS (dev only)

Add these to the Roadmap section of README if asked about growth areas.
