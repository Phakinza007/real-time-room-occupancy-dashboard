const axios = require('axios')

const COOLDOWN_MS = 5 * 60 * 1000
let lastSent = 0

async function sendAlert(room, count, threshold) {
  if (Date.now() - lastSent < COOLDOWN_MS) return

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const userId = process.env.LINE_USER_ID
  const message = `⚠️ ${room}: ${count} people detected (limit: ${threshold})`

  if (!token || !userId) {
    console.log('[LINE] No token configured — alert:', message)
    lastSent = Date.now()
    return
  }

  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      { to: userId, messages: [{ type: 'text', text: message }] },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    )
    lastSent = Date.now()
    console.log('[LINE] Alert sent:', message)
  } catch (e) {
    console.error('[LINE] Failed:', e.response?.data || e.message)
    throw e
  }
}

module.exports = { sendAlert }
