import React from 'react'

export default function StatusBadge({ count, threshold }) {
  const over = count > threshold
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
        over
          ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
          : 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
      }`}
    >
      {over ? '⚠ Over Limit' : '✓ Normal'}
    </span>
  )
}
