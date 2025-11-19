import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './ReportsPage.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, ArcElement);

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [groupBy, setGroupBy] = useState('pillar'); // pillar | programme | oma
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [pillars, setPillars] = useState([]);
  const [programmesList, setProgrammesList] = useState([]);
  const [organisationsList, setOrganisationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // fetch analytics from server
  useEffect(() => {
    fetchAnalytics();
  }, [groupBy, start, end]);

  // fetch pillars when grouping by pillar so the dropdown reflects the pillars table
  useEffect(() => {
    if (groupBy === 'pillar') fetchPillars();
  }, [groupBy]);

  // fetch programmes when grouping by programme
  useEffect(() => {
    if (groupBy === 'programme') fetchProgrammes();
  }, [groupBy]);

  // fetch organisations when grouping by oma
  useEffect(() => {
    if (groupBy === 'oma') fetchOrganisations();
  }, [groupBy]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set('groupBy', groupBy);
      if (start) q.set('start', start);
      if (end) q.set('end', end);
      const res = await fetch(`/api/reports/analytics?${q.toString()}`);
      const data = await res.json();
      const results = data.results || [];
      setAnalytics(results);
      setItems(results.map(r => r.key));
      setSelected(results.length ? results[0].key : '');
      // clear month filter when fetching a new grouping
      setMonthFilter('');
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPillars = async () => {
    try {
      const res = await fetch('/api/lookups/pillars');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const list = data.pillars || [];
      setPillars(list);
      const names = list.map(p => p.name);
      setItems(names);
      setSelected(names.length ? names[0] : '');
    } catch (err) {
      console.error('Failed to fetch pillars', err);
    }
  };

  const fetchProgrammes = async () => {
    try {
      const res = await fetch('/api/lookups/programmes');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const list = data.programmes || [];
      setProgrammesList(list);
      const names = list.map(p => p.name);
      setItems(names);
      setSelected(names.length ? names[0] : '');
    } catch (err) {
      console.error('Failed to fetch programmes', err);
    }
  };

  const fetchOrganisations = async () => {
    try {
      const res = await fetch('/api/lookups/organisations');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const list = data.organisations || [];
      setOrganisationsList(list);
      const names = list.map(o => o.name);
      setItems(names);
      setSelected(names.length ? names[0] : '');
    } catch (err) {
      console.error('Failed to fetch organisations', err);
    }
  };

  const distributionData = useMemo(() => {
    // pie showing totals per group
    const labels = analytics.map(a => a.key);
    const data = analytics.map(a => a.total || 0);
    return { labels, datasets: [{ data, backgroundColor: labels.map((_, i) => `hsl(${(i * 60) % 360} 60% 40%)`) }] };
  }, [analytics]);

  const selectedGroup = useMemo(() => analytics.find(a => a.key === selected) || null, [analytics, selected]);

  const timeSeriesData = useMemo(() => {
    if (!selectedGroup) return { labels: [], datasets: [] };
    const months = Object.keys(selectedGroup.monthly || {}).sort();
    const counts = months.map(m => selectedGroup.monthly[m]);
    return { labels: months, datasets: [{ label: `${selected} - Reports`, data: counts, backgroundColor: '#003366' }] };
  }, [selectedGroup, selected]);

  const groupLabel = useMemo(() => {
    if (groupBy === 'programme') return 'Programme';
    if (groupBy === 'oma') return 'OMA / Organisation';
    return 'Pillar';
  }, [groupBy]);

  // month filter when clicking bars
  const [monthFilter, setMonthFilter] = useState('');
  const rootRef = useRef(null);
  const monthKeyFrom = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const onPieClick = (evt, elements) => {
    if (!elements || elements.length === 0) return;
    const idx = elements[0].index;
    const key = distributionData.labels[idx];
    if (key) setSelected(key);
  };

  const onBarClick = (evt, elements) => {
    if (!elements || elements.length === 0) return;
    const idx = elements[0].index;
    const month = timeSeriesData.labels[idx];
    if (month) setMonthFilter(month);
  };

  // build an overall monthly totals series across all groups
  const overallMonthly = useMemo(() => {
    const map = {};
    analytics.forEach(a => {
      const m = a.monthly || {};
      Object.keys(m).forEach(k => { map[k] = (map[k] || 0) + (m[k] || 0); });
    });
    const months = Object.keys(map).sort();
    return { labels: months, datasets: [{ label: 'All reports', data: months.map(m => map[m]), borderColor: '#0066cc', backgroundColor: 'rgba(0,102,204,0.08)', fill: true }] };
  }, [analytics]);

  // stacked bar for top N groups
  const stackedData = useMemo(() => {
    const top = [...analytics].sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
    const monthsSet = new Set();
    top.forEach(t => Object.keys(t.monthly || {}).forEach(m => monthsSet.add(m)));
    const months = Array.from(monthsSet).sort();
    const colors = top.map((_, i) => `hsl(${(i * 60) % 360} 70% 45%)`);
    const datasets = top.map((t, i) => ({ label: t.key, data: months.map(m => (t.monthly && t.monthly[m]) || 0), backgroundColor: colors[i] }));
    return { labels: months, datasets };
  }, [analytics]);

  // small summary KPIs
  const kpis = useMemo(() => {
    const totalReports = analytics.reduce((s, a) => s + (a.total || 0), 0);
    const topGroup = analytics.slice().sort((a, b) => (b.total || 0) - (a.total || 0))[0];
    const last30 = analytics.reduce((s, a) => {
      const samples = a.samples || [];
      const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 30;
      return s + samples.filter(r => new Date(r.created_at).getTime() >= cutoff).length;
    }, 0);
    return { totalReports, topGroup: topGroup ? topGroup.key : '—', last30 };
  }, [analytics]);

  // print helper: convert chart canvases to images so print/PDF captures them reliably
  const convertCanvasesToImages = () => {
    const ids = ['chart-overall-line', 'chart-selected-time', 'chart-distribution', 'chart-stacked'];
    const created = [];
    ids.forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      const canvas = container.querySelector('canvas');
      if (!canvas) return;
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const img = document.createElement('img');
        img.src = dataUrl;
        img.className = 'print-chart-image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        canvas.style.display = 'none';
        container.appendChild(img);
        created.push({ container, canvas, img });
      } catch (err) {
        console.warn('Failed to convert canvas to image for', id, err);
      }
    });
    return created;
  };

  const restoreConverted = (created) => {
    created.forEach(({ container, canvas, img }) => {
      try { if (img && img.parentNode) img.parentNode.removeChild(img); } catch (e) { }
      try { if (canvas) canvas.style.display = ''; } catch (e) { }
    });
  };

  const printWithCharts = () => {
    const created = convertCanvasesToImages();
    const after = () => { restoreConverted(created); window.removeEventListener('afterprint', after); };
    window.addEventListener('afterprint', after);
    window.print();
  };

  return (
    <div ref={rootRef} className="reports-root" style={{ fontFamily: "'Segoe UI', sans-serif", color: '#1b1b1b' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: visible; }
          .reports-root { position: relative; left: 0; top: 0; width: 100%; }
          .print-chart-image { max-width: 100%; height: auto; }
          .controls { display: none !important; }
        }
      `}</style>
      <h2>Reports & Analytics — {groupLabel}</h2>
      <div style={{ marginBottom: 12 }}>
        <div className="filters">
          <div className="filter-item">
            <label>Group by</label>
            <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="pillar">Pillar</option>
              <option value="programme">Programme (Framework)</option>
              <option value="oma">OMA / Organisation</option>
            </select>
          </div>

          <div className="filter-item wide">
            <label>Select {groupLabel}</label>
            <select value={selected} onChange={e => setSelected(e.target.value)}>
              {items.map(it => <option key={it} value={it}>{it}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <label>Start</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} />
          </div>

          <div className="filter-item">
            <label>End</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
        </div>

        <div className="controls" style={{ marginTop: 10 }}>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="no-print btn btn-ghost" onClick={fetchAnalytics}>Refresh</button>
            <button className="no-print btn btn-primary" onClick={printWithCharts}>Print / Download PDF</button>
          </div>
        </div>
      </div>

      {/* if there's no real data and we're not loading, keep the main area blank */}
      {!loading && (!analytics || analytics.length === 0) ? (
        <div className="empty-state">
          <div className="empty-card">
            <div className="emoji" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <title>Live analytics icon</title>
                <rect x="2" y="13" width="3" height="7" rx="0.5" fill="#0077CC" />
                <rect x="7" y="8" width="3" height="12" rx="0.5" fill="#00A3FF" />
                <rect x="12" y="5" width="3" height="15" rx="0.5" fill="#0F4C81" />
                <rect x="17" y="10" width="3" height="10" rx="0.5" fill="#66B2FF" />
                <path d="M2 4c3 2 6 2 9 0s6 0 9 0" stroke="#0F4C81" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.12" />
              </svg>
            </div>
            <h3>No analytics yet</h3>
            <p>There are no reports aggregated for the selected filters. Once reports are submitted, charts and KPIs will appear here.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={fetchAnalytics}>Refresh</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="label">Total reports</div>
              <div className="value">{kpis.totalReports}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Top group</div>
              <div className="value">{kpis.topGroup}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Last 30 days</div>
              <div className="value">{kpis.last30}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 8 }}>
            <div id="chart-overall-line" className="card" style={{ padding: 16 }}>
              <h4 style={{ marginTop: 0 }}>Overall Time Series</h4>
              {loading ? <div>Loading…</div> : (
                <div className="chart-container">
                  <Line data={overallMonthly} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
            <div className="card">
              {loading ? <div>Loading…</div> : (
                <div id="chart-selected-time" className="chart-container">
                  <Bar data={timeSeriesData} onClick={onBarClick} />
                </div>
              )}
              {monthFilter && <div style={{ marginTop: 8 }}><strong>Filtering by month:</strong> {monthFilter} <button onClick={() => setMonthFilter('')} style={{ marginLeft: 8 }}>Clear</button></div>}
              <div style={{ marginTop: 12 }}>
                <h4>Recent reports ({selectedGroup ? selectedGroup.total : 0})</h4>
                <div className="table-wrap">
                  <table className="report-table">
                    <thead>
                      <tr><th>ID</th><th>Programme</th><th>Focus area</th><th>Created</th></tr>
                    </thead>
                    <tbody>
                      {((selectedGroup?.samples || []).filter(r => {
                        if (!monthFilter) return true;
                        const mk = monthKeyFrom(r.created_at);
                        return mk === monthFilter;
                      })).slice(0, 200).map(r => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.programme ? r.programme.name : ''}</td>
                          <td>{r.focus_area ? r.focus_area.name : ''}</td>
                          <td>{new Date(r.created_at || Date.now()).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginTop: 0 }}>Distribution by {groupLabel}</h4>
              <div id="chart-distribution" className="chart-container">
                <Pie data={distributionData} onClick={onPieClick} />
              </div>
              <div style={{ marginTop: 12 }}>
                <ul className="distribution-list">
                  {analytics.map(a => (
                    <li key={a.key}>{a.key}<strong>{a.total}</strong></li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 12 }}>
                <h4 style={{ marginTop: 12 }}>Top {groupLabel}s (stacked)</h4>
                <div id="chart-stacked" className="chart-container">
                  <Bar data={stackedData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
