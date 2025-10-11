const { useState, useEffect, useMemo } = React;

function parseNumber(v) {
  const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [desc, setDesc] = useState(true);

  useEffect(() => {
    // Fetch the CSV from the repo root
    fetch('../lawyer_data.csv')
      .then(r => r.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        setData(parsed.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    if (!sortBy) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const av = parseNumber(a[sortBy]);
      const bv = parseNumber(b[sortBy]);
      return desc ? bv - av : av - bv;
    });
    return arr;
  }, [data, sortBy, desc]);

  if (loading) return <div className="center">Loading data…</div>;
  if (!data.length) return <div className="center">No data found.</div>;

  const columns = Object.keys(data[0]);

  return (
    <div className="container">
      <h1>Lawyer Ranking</h1>
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
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
