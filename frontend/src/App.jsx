import React, { useEffect, useState, useMemo } from 'react'

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
    fetch('/api/ranked')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
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

  const columns = Object.keys(data[0])

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
                {columns.map(c => <td key={c}>{row[c]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
