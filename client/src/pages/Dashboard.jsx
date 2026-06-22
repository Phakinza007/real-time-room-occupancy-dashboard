import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OccupancyChart from '../components/OccupancyChart'
import StatusBadge from '../components/StatusBadge'

const MAX_POINTS = 20
const THRESHOLD = Number(import.meta.env.VITE_THRESHOLD) || 10

export default function Dashboard() {
  const [data, setData] = useState([])
  const [latest, setLatest] = useState(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }

    const ws = new WebSocket(`ws://localhost:3001?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type !== 'occupancy_update') return
        setLatest(msg)
        setData(prev => [
          ...prev.slice(-(MAX_POINTS - 1)),
          { time: new Date(msg.timestamp).toLocaleTimeString(), count: msg.count },
        ])
      } catch { /* ignore malformed */ }
    }

    return () => ws.close()
  }, [navigate])

  function logout() {
    wsRef.current?.close()
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Room Occupancy Dashboard</h1>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition">
            Logout
          </button>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">{connected ? 'Live' : 'Disconnected'}</span>
        </div>

        {/* Current reading card */}
        {latest ? (
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">{latest.room}</p>
              <p className="text-6xl font-bold mt-1">
                {latest.count}
                <span className="text-2xl text-gray-500 ml-2">/ 20</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(latest.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <StatusBadge count={latest.count} threshold={THRESHOLD} />
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 text-gray-500 text-sm">
            Waiting for data…
          </div>
        )}

        {/* Chart */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-4">Last {MAX_POINTS} readings</p>
          <OccupancyChart data={data} threshold={THRESHOLD} />
        </div>

      </div>
    </div>
  )
}
