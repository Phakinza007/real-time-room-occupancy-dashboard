import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'

export default function OccupancyChart({ data, threshold }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis domain={[0, 20]} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: 8, color: '#fff' }}
          labelStyle={{ color: '#9CA3AF' }}
        />
        <ReferenceLine
          y={threshold}
          stroke="#EF4444"
          strokeDasharray="4 4"
          label={{ value: `Limit (${threshold})`, fill: '#EF4444', fontSize: 11, position: 'insideTopRight' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
