# CONTEXT.md — Project Context

## Why This Exists

Portfolio project สำหรับสมัครงาน Full-Stack / IoT / Cloud (Node.js stack).
เป้าหมายคือแสดงว่าสามารถสร้าง end-to-end real-time system ได้ตั้งแต่ backend ถึง frontend
โดยไม่ต้องมี hardware จริง — ใช้ simulator แทน sensor

## Target Audience

| Audience | What they look for |
|----------|--------------------|
| Recruiter | README, screenshot, clean repo, live demo link |
| Tech interviewer | Code quality, architecture decisions, auth awareness, no hardcoded secrets |
| Hiring manager | Completed features, realistic scope, honest roadmap |

## Problem Being Simulated

อาคารสำนักงาน / โรงงาน ต้องการรู้จำนวนคนในห้องแบบ real-time เพื่อ:
- ควบคุม capacity (COVID-era, fire safety)
- แจ้งเตือนเมื่อคนแน่นเกินกำหนด
- ดู trend ย้อนหลัง (roadmap)

## Constraints

- **No real hardware** — sensor data is simulated; this is a software portfolio, not a hardware project
- **Single room** — MVP scope; multi-room is roadmap
- **No persistence** — data lives in memory; page refresh loses history
- **Dev-only security** — HTTP/WS not HTTPS/WSS; demo credentials are hardcoded

## Assumptions

- Sensor pushes one integer (person count) every ~3 s — simple enough to simulate cleanly
- LINE is the notification channel (common in Thailand-based IoT setups)
- One admin user is enough for a demo
- Threshold is a single global number, not per-room

## Out of Scope

- MQTT / real sensor hardware
- Multi-tenant / multi-building
- Role-based access control
- Data persistence / analytics
- Mobile app

## Success Criteria (Portfolio)

- [ ] Recruiter can clone and run in under 5 minutes
- [ ] Dashboard shows live-updating chart without page refresh
- [ ] LINE alert fires when count crosses threshold (verifiable in demo)
- [ ] No secrets in git history
- [ ] Code is readable without heavy comments
