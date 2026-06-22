# PRODUCT.md — Product Requirements

## User Stories

### Auth
- **US-01** — ในฐานะ admin ฉันต้องการ login ด้วย username/password เพื่อรับ JWT token สำหรับเข้าถึง dashboard
- **US-02** — ถ้า token หมดอายุ ระบบควร redirect กลับ login โดยอัตโนมัติ

### Real-time Occupancy
- **US-03** — ในฐานะ admin ฉันต้องการเห็นจำนวนคนในห้อง ณ ปัจจุบัน โดยไม่ต้อง refresh หน้า
- **US-04** — ฉันต้องการเห็น time-series chart ของ occupancy ย้อนหลัง ~60 จุดข้อมูล
- **US-05** — ฉันต้องการ status badge ที่บอกว่าห้อง "ปกติ" หรือ "เกิน threshold" ทันที

### Alerts
- **US-06** — ฉันต้องการรับ LINE notification เมื่อจำนวนคนเกิน threshold
- **US-07** — ฉันไม่ต้องการรับ notification ซ้ำทุก 3 วินาที — cooldown 5 นาที

### Visibility (Portfolio)
- **US-08** — ในฐานะ recruiter ฉันต้องการ clone และ run project ได้ใน 5 นาที
- **US-09** — ฉันต้องการดู README ที่อธิบาย features, setup, และ architecture ได้ชัดเจน

---

## Acceptance Criteria

### AC-01: Login
- `POST /api/login` with correct credentials → HTTP 200 + `{ token: "..." }`
- Wrong credentials → HTTP 401
- Token expires after 1 hour

### AC-02: WebSocket Auth
- WS connect without token → connection closed immediately
- WS connect with valid token → receives occupancy messages every ~3 s

### AC-03: Occupancy Message
- Message schema: `{ type, room, count, timestamp, alert }`
- `alert: true` when `count > OCCUPANCY_THRESHOLD`
- `timestamp` is ISO 8601

### AC-04: Dashboard Chart
- Chart renders occupancy history (last N points)
- Updates without page interaction
- X-axis = time, Y-axis = person count
- Threshold shown as horizontal reference line (optional but good)

### AC-05: Status Badge
- Green + "Normal" when `count <= threshold`
- Red + "Over Limit" when `count > threshold`
- Updates in sync with chart

### AC-06: LINE Notify
- Alert sent when `count > OCCUPANCY_THRESHOLD`
- Not sent again until 5-minute cooldown expires
- Message contains room name, count, and threshold

### AC-07: Security Baseline
- No JWT secret in source code
- No LINE token in source code
- `node_modules/` and `.env` not in git

---

## Feature Priority

| Feature | Priority | Status |
|---------|----------|--------|
| JWT login | P0 | [ ] |
| WebSocket server | P0 | [ ] |
| Sensor simulator | P0 | [ ] |
| Occupancy chart | P0 | [ ] |
| Status badge | P0 | [ ] |
| LINE notification | P1 | [ ] |
| `/api/status` REST endpoint | P1 | [ ] |
| Deploy (Railway + Vercel) | P2 | [ ] |
| Multi-room support | P3 | [ ] |
| Persistent history | P3 | [ ] |

P0 = MVP must-have, P1 = complete the story, P2 = nice for portfolio, P3 = roadmap
