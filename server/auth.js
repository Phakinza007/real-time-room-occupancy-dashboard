require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()
const USERS = { admin: 'admin123' }

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || USERS[username] !== password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
})

module.exports = { router, verifyToken }
