require('dotenv').config()
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const cors = require('cors')
const { router: authRouter, verifyToken } = require('./auth')
const simulator = require('./simulator')
const { sendAlert } = require('./lineNotify')

const app = express()
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}))
app.use(express.json())
app.use('/api', authRouter)

app.get('/api/status', (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const payload = verifyToken(auth.slice(7))
  if (!payload) return res.status(401).json({ error: 'Invalid token' })
  res.json({ room: simulator.currentData() })
})

const server = http.createServer(app)
const wss = new WebSocket.Server({ noServer: true })

server.on('upgrade', (req, socket, head) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const token = url.searchParams.get('token')
    const payload = verifyToken(token)
    if (!payload) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req))
  } catch (e) {
    socket.destroy()
  }
})

simulator.on('occupancy', async (data) => {
  const msg = JSON.stringify({ type: 'occupancy_update', ...data })
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(msg)
  }
  if (data.alert) {
    try {
      await sendAlert(data.room, data.count, Number(process.env.OCCUPANCY_THRESHOLD) || 10)
    } catch (e) {
      console.error('Alert error:', e.message)
    }
  }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`Server running on :${PORT}`))
