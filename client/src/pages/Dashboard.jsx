import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OccupancyChart from '../components/OccupancyChart'
import StatusBadge from '../components/StatusBadge'

const MAX_POINTS = 20
const THRESHOLD = Number(import.meta.env.VITE_THRESHOLD) || 10
const BACKOFF_MAX = 30000

export default function Dashboard() {
  const [data, setData] = useState([])
  const [latest, setLatest] = useState(null)
  const [connected, setConnected] = useState(false)
  const [countdown, setCountdown] = useState(null) // null = not retrying

  const wsRef = useRef(null)
  const retryDelayRef = useRef(1000)
  const retryTimerRef = useRef(null)
  const countdownTimerRef = useRef(null)
  const unmountedRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    unmountedRef.current = false
    connect()
    return () => {
      unmountedRef.current = true
      clearTimeout(retryTimerRef.current)
      clearInterval(countdownTimerRef.current)
      wsRef.current?.close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function connect() {
    if (unmountedRef.current) return
    const token = localStorage.getItem('token')
    if (!token) { navigate('/'); return }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    const ws = new WebSocket(`${wsUrl}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      if (unmountedRef.current) { ws.close(); return }
      setConnected(true)
      setCountdown(null)
      retryDelayRef.current = 1000 // reset backoff on success
    }

    ws.onerror = () => {} // absorbed — onclose fires next and handles retry

    ws.onclose = () => {
      if (unmountedRef.current) return
      setConnected(false)
      scheduleRetry()
    }

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
  }

  function scheduleRetry() {
    if (unmountedRef.current) return
    const delay = retryDelayRef.current
    retryDelayRef.current = Math.min(delay * 2, BACKOFF_MAX)

    // start countdown ticker
    setCountdown(Math.round(delay / 1000))
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownTimerRef.current)
          return null
        }
        return prev - 1
      })
    }, 1000)

    retryTimerRef.current = setTimeout(() => {
      clearInterval(countdownTimerRef.current)
      connect()
    }, delay)
  }

  function logout() {
    unmountedRef.current = true
    clearTimeout(retryTimerRef.current)
    clearInterval(countdownTimerRef.current)
    wsRef.current?.close()
    localStorage.removeItem('token')
    navigate('/')
  }

  const isReconnecting = !connected && countdown !== null

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Reconnect banner */}
      {isReconnecting && (
        <div className="w-full bg-yellow-500/20 border-b border-yellow-500/30 px-6 py-2 text-yellow-400 text-sm text-center">
          ⚠️ Connection lost — retrying in {countdown}s…
        </div>
      )}

      <div className="max-w-3xl mx-auto p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Room Occupancy Dashboard</h1>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition">
            Logout
          </button>
        </div>

        {/* Connection status dot */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : isReconnecting ? 'bg-yellow-400' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">
            {connected ? 'Live' : isReconnecting ? `Reconnecting (${countdown}s…)` : 'Disconnected'}
          </span>
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
