# CLAUDE.md — Real-time Room Occupancy Dashboard

## Project Overview
Mini Smart Building dashboard ที่ simulate ข้อมูล sensor จำนวนคนในห้อง
แสดงผล real-time ผ่าน WebSocket + แจ้งเตือน LINE เมื่อคนเกิน threshold
ใช้เป็น portfolio สำหรับสมัครงาน Full-Stack (Node.js/Cloud) IoT

---

## Tech Stack
- **Backend**: Node.js, Express, WebSocket (ws), JWT
- **Frontend**: React + Vite + Tailwind CSS
- **Notification**: LINE Messaging API
- **Auth**: JWT (JSON Web Token)
- **Dev Tools**: nodemon, dotenv, concurrently

---

## Folder Structure
```
room-occupancy-dashboard/
├── server/
│   ├── index.js          # Entry point, Express + WebSocket server
│   ├── auth.js           # JWT middleware
│   ├── simulator.js      # Fake sensor data generator
│   ├── lineNotify.js     # LINE Messaging API integration
│   └── .env              # Environment variables (ไม่ commit)
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   └── components/
│   │       ├── OccupancyChart.jsx
│   │       └── StatusBadge.jsx
│   └── vite.config.js
├── .gitignore
├── README.md
└── CLAUDE.md
```

---

## Environment Variables (server/.env)
```
PORT=3001
JWT_SECRET=your_secret_key_here
LINE_CHANNEL_ACCESS_TOKEN=your_line_token_here
LINE_USER_ID=your_line_user_id_here
OCCUPANCY_THRESHOLD=10
```

---

## Core Logic

### 1. Sensor Simulator (simulator.js)
- Generate จำนวนคน 0-20 ทุก 3 วินาที
- Emit event ให้ WebSocket server

### 2. WebSocket Server (index.js)
- Client connect → ส่ง token มา verify ก่อน
- ถ้า token valid → รับ occupancy data แบบ real-time
- ถ้า occupancy > THRESHOLD → trigger LINE notify

### 3. JWT Auth (auth.js)
- POST /api/login → return JWT token
- Default user: admin / password: admin123 (demo only)
- Token หมดอายุใน 1 ชั่วโมง

### 4. LINE Notify (lineNotify.js)
- เรียกเมื่อ occupancy เกิน threshold
- Cooldown 5 นาที (ไม่ spam)
- ข้อความ: "⚠️ Room A: {count} people detected (limit: {threshold})"

### 5. React Dashboard (Dashboard.jsx)
- Connect WebSocket หลัง login
- แสดง real-time line chart (recharts)
- StatusBadge: green (ปกติ) / red (เกิน threshold)

---

## API Endpoints
```
POST /api/login        → { token } 
GET  /api/status       → occupancy ปัจจุบัน (ต้องมี JWT header)
WS   ws://localhost:3001  → real-time occupancy stream
```

---

## WebSocket Message Format
```json
// Server → Client
{
  "type": "occupancy_update",
  "room": "Room A",
  "count": 7,
  "timestamp": "2025-06-22T10:30:00Z",
  "alert": false
}

// Server → Client (เกิน threshold)
{
  "type": "occupancy_update",
  "room": "Room A", 
  "count": 13,
  "timestamp": "2025-06-22T10:31:00Z",
  "alert": true
}
```

---

## Git Workflow
```bash
main          # production-ready เท่านั้น
├── dev       # development branch
│   ├── feat/websocket-server
│   ├── feat/jwt-auth
│   ├── feat/line-notify
│   └── feat/dashboard-ui
```
- Commit message format: `feat: add websocket server` / `fix: jwt expiry bug`
- Pull Request ทุกครั้งก่อน merge เข้า main

---

## Development Commands
```bash
# Install dependencies
cd server && npm install
cd client && npm install

# Run development (both server + client)
npm run dev          # จาก root (ใช้ concurrently)

# Run server only
cd server && npm run dev

# Run client only  
cd client && npm run dev
```

---

## Coding Guidelines
- ใช้ async/await ทุกที่ ห้าม callback hell
- Error handling ทุก async function ด้วย try/catch
- ห้าม hardcode token หรือ secret ใน code → ใช้ .env เสมอ
- Comment ภาษาไทยได้ถ้าช่วยให้เข้าใจง่ายขึ้น
- ทุก WebSocket message ต้องมี type field เสมอ

---

## .gitignore
```
node_modules/
.env
dist/
.DS_Store
```

---

## README Structure (สำหรับ Portfolio)
1. Project Overview + Screenshot/GIF
2. Features
3. Tech Stack
4. Architecture Diagram (simple)
5. Setup Instructions
6. Environment Variables
7. Demo credentials

---

## Status
- [ ] Project setup + folder structure
- [ ] Express server + WebSocket
- [ ] JWT Auth
- [ ] Sensor simulator
- [ ] LINE Messaging API
- [ ] React Dashboard + Chart
- [ ] README + Screenshot
- [ ] Deploy (optional: Railway + Vercel)
