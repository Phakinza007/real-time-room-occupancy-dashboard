require('dotenv').config()
const EventEmitter = require('events')

class Simulator extends EventEmitter {
  constructor() {
    super()
    this._count = 5
    this._latest = null
  }

  start() {
    setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2 // random walk -2 to +2
      this._count = Math.max(0, Math.min(20, this._count + delta))
      const threshold = Number(process.env.OCCUPANCY_THRESHOLD) || 10
      this._latest = {
        room: 'Room A',
        count: this._count,
        timestamp: new Date().toISOString(),
        alert: this._count > threshold,
      }
      this.emit('occupancy', this._latest)
    }, 3000)
  }

  currentData() {
    return this._latest
  }
}

const simulator = new Simulator()
simulator.start()
module.exports = simulator
