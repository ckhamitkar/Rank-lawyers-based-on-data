import React, { useEffect, useState, useMemo } from 'react'
import Papa from 'papaparse'

function parseNumber(v) {
  const n = Number(String(v).replace(/[^0-9.-]+/g, ''))
  return Number.isFinite(n) ? n : 0
}

export default function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('')
  const [desc, setDesc] = useState(true)

  useEffect(() => {
    // Fetch the generated CSV file which includes a 'score' column
    // Add a timestamp query to avoid cached responses from Vite/browser
    fetch('/ranked_lawyer_data.csv?t=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error('CSV not found')
        return r.text()
      })
      .then(text => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true })
        if (parsed.errors && parsed.errors.length) {
          console.warn('CSV parse warnings/errors', parsed.errors)
        }

        // Normalize keys (trim whitespace) to ensure columns like 'score' are recognized
        const rows = parsed.data.map(row => {
          const norm = {}
          Object.entries(row).forEach(([k, v]) => {
            const key = String(k).trim()
            norm[key] = v
          })
          return norm
        })

        setData(rows)
      })
      .catch(err => {
        console.error('CSV fetch/parse failed:', err)
        // fallback: try the API endpoint
        fetch('/api/ranked')
          .then(r => r.json())
          .then(setData)
          .catch(console.error)
      })
      .finally(() => setLoading(false))
  }, [])

  const sorted = useMemo(() => {
    if (!sortBy) return data
    const arr = [...data]
    arr.sort((a, b) => {
      const av = parseNumber(a[sortBy])
      const bv = parseNumber(b[sortBy])
      return desc ? bv - av : av - bv
    })
    return arr
  }, [data, sortBy, desc])

  if (loading) return <div className="center">Loading ranked data…</div>
  if (!data.length) return <div className="center">No data found.</div>

  // Build columns as the union of keys across all rows so we don't rely on the first row
  const columns = (() => {
    const set = new Set()
    data.forEach(row => {
      Object.keys(row).forEach(k => {
        if (k === null || k === undefined) return
        const key = String(k).trim()
        if (key === '') return
        set.add(key)
      })
    })
    // Ensure 'score' column is present
    if (!set.has('score')) set.add('score')
    return Array.from(set)
  })()

  function formatValue(v, col) {
    if (v === null || v === undefined) return ''
    if (col === 'score') {
      // try to parse number and format to 2 decimals when possible
      const n = Number(String(v).replace(/[^0-9.-]+/g, ''))
      return Number.isFinite(n) ? n.toFixed(2) : v
    }
    return v
  }

  return (
    <div className="container">
      <h1>Lawyer Ranking (API)</h1>
      <p>Rows: {data.length}</p>
      <div className="controls">
        <label>Sort by: </label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">(none)</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setDesc(d => !d)}>{desc ? 'desc' : 'asc'}</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i}>
                {columns.map(c => <td key={c}>{formatValue(row[c], c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
