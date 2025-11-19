import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './ReportsPage.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, ArcElement);

// === DUMMY DATA GENERATOR ===
const generateDummyAnalytics = (groupBy = 'pillar') => {
  const pillars = ['Governance', 'Economic Growth', 'Human Capital', 'Environment', 'Social Inclusion'];
  const programmes = ['Digital Transformation', 'Youth Employment', 'Green Energy Initiative', 'Health Access Program', 'Rural Development'];
  const organisations = ['Ministry of Finance', 'UNDP', 'World Bank', 'African Development Bank', 'National Statistics Office', 'Local NGO Network'];

  const groups = groupBy === 'pillar' ? pillars :
                 groupBy === 'programme' ? programmes :
                 organisations;

  const startDate = new Date('2023-01-01');
  const endDate = new Date('2025-11-01');
  const months = [];
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  return groups.map((key, idx) => {
    const total = Math.floor(Math.random() * 280) + 50; // 50–330 reports
    const monthly = {};
    let running = 0;
    months.forEach((m, i) => {
      const trend = Math.sin(i / 3) * 15 + 20 + (idx % 3) * 10;
      const count = Math.max(0, Math.floor(Math.random() * trend + 5));
      running += count;
      monthly[m] = count;
    });

    // Generate sample reports (recent first)
    const samples = [];
    const now = Date.now();
    for (let i = 0; i < Math.min(total, 150); i++) {
      const daysAgo = Math.random() * 900; // up to ~2.5 years
      const created = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      samples.push({
        id: `REP-${202300 + i}`,
        programme: { name: programmes[Math.floor(Math.random() * programmes.length)] },
        focus_area: { name: ['Infrastructure', 'Education', 'Health', 'Agriculture', 'Technology'][Math.floor(Math.random() * 5)] },
        created_at: created.toISOString(),
      });
    }
    samples.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { key, total, monthly, samples };
  });
};

const dummyLookups = {
  pillars: ['Governance', 'Economic Growth', 'Human Capital', 'Environment', 'Social Inclusion'].map(name => ({ name })),
  programmes: ['Digital Transformation', 'Youth Employment', 'Green Energy Initiative', 'Health Access Program', 'Rural Development'].map(name => ({ name })),
  organisations: ['Ministry of Finance', 'UNDP', 'World Bank', 'African Development Bank', 'National Statistics Office', 'Local NGO Network'].map(name => ({ name })),
};

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [groupBy, setGroupBy] = useState('pillar');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false); // fake loading off
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  // Simulate fetch with dummy data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateDummyAnalytics(groupBy);
      setAnalytics(data);
      const keys = data.map(d => d.key);
      setItems(keys);
      setSelected(keys.length ? keys[0] : '');
      setMonthFilter('');
      setLoading(false);
    }, 600); // fake delay
  }, [groupBy, start, end]);

  // Fake lookup fetches
  useEffect(() => {
    setTimeout(() => {
      const list = groupBy === 'pillar' ? dummyLookups.pillars :
                   groupBy === 'programme' ? dummyLookups.programmes :
                   dummyLookups.organisations;
      const names = list.map(i => i.name);
      setItems(names);
      setSelected(names.length ? names[0] : '');
    }, 300);
  }, [groupBy]);

  const distributionData = useMemo(() => {
    const labels = analytics.map(a => a.key);
    const data = analytics.map(a => a.total || 0);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map((_, i) => `hsl(${(i * 72) % 360}, 70%, 55%)`),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [analytics]);

  const selectedGroup = useMemo(() => analytics.find(a => a.key === selected) || null, [analytics, selected]);

  const timeSeriesData = useMemo(() => {
    if (!selectedGroup) return { labels: [], datasets: [] };
    const months = Object.keys(selectedGroup.monthly || {}).sort();
    const counts = months.map(m => selectedGroup.monthly[m]);
    return {
      labels: months,
      datasets: [{
        label: `${selected} - Reports`,
        data: counts,
        backgroundColor: '#003366',
        borderColor: '#0055aa',
        borderWidth: 2
      }]
    };
  }, [selectedGroup, selected]);

  const groupLabel = useMemo(() => {
    if (groupBy === 'programme') return 'Programme';
    if (groupBy === 'oma') return 'OMA / Organisation';
    return 'Pillar';
  }, [groupBy]);

  const overallMonthly = useMemo(() => {
    const map = {};
    analytics.forEach(a => {
      Object.entries(a.monthly || {}).forEach(([k, v]) => {
        map[k] = (map[k] || 0) + v;
      });
    });
    const months = Object.keys(map).sort();
    return {
      labels: months,
      datasets: [{
        label: 'All reports',
        data: months.map(m => map[m]),
        borderColor: '#0066cc',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        fill: true,
        tension: 0.3
      }]
    };
  }, [analytics]);

  const stackedData = useMemo(() => {
    const top = [...analytics].sort((a, b) => b.total - a.total).slice(0, 5);
    const monthsSet = new Set();
    top.forEach(t => Object.keys(t.monthly || {}).forEach(m => monthsSet.add(m)));
    const months = Array.from(monthsSet).sort();
    const colors = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];
    const datasets = top.map((t, i) => ({
      label: t.key,
      data: months.map(m => t.monthly[m] || 0),
      backgroundColor: colors[i]
    }));
    return { labels: months, datasets };
  }, [analytics]);

  const kpis = useMemo(() => {
    const totalReports = analytics.reduce((s, a) => s + a.total, 0);
    const topGroup = analytics.length ? analytics.sort((a, b) => b.total - a.total)[0].key : '—';
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const last30 = analytics.reduce((sum, a) => {
      return sum + (a.samples?.filter(r => new Date(r.created_at) >= cutoff).length || 0);
    }, 0);
    return { totalReports, topGroup, last30 };
  }, [analytics]);

  const onPieClick = (evt, elements) => {
    if (!elements.length) return;
    const key = distributionData.labels[elements[0].index];
    setSelected(key);
  };

  const onBarClick = (evt, elements) => {
    if (!elements.length) return;
    const month = timeSeriesData.labels[elements[0].index];
    setMonthFilter(month);
  };

  const monthKeyFrom = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // Print helper (unchanged)
  const convertCanvasesToImages = () => { /* ... same as before ... */ };
  const restoreConverted = (created) => { /* ... */ };
  const printWithCharts = () => {
    const created = convertCanvasesToImages();
    const after = () => { restoreConverted(created); window.removeEventListener('afterprint', after); };
    window.addEventListener('afterprint', after);
    window.print();
  };

  return (
    <div className="reports-root" style={{ fontFamily: "'Segoe UI', sans-serif", color: '#1b1b1b' }}>
      <style>{`@media print { ... }`}</style>

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

        <div className="controls" style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="no-print btn btn-primary" onClick={printWithCharts}>Print / Download PDF</button>
        </div>
      </div>

      {/* if there's no real data and we're not loading, keep the main area blank */}
      {!loading && (!analytics || analytics.length === 0) ? (
        <div className="empty-state">
          <div className="empty-card">
            <div className="emoji" aria-hidden="true">
              
            </div>
            <h3>No analytics yet</h3>
            <p>There are no reports aggregated for the selected filters. Once reports are submitted, charts and KPIs will appear here.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={() => { setLoading(true); setTimeout(() => { const data = generateDummyAnalytics(groupBy); setAnalytics(data); setLoading(false); }, 600); }}>Refresh</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="kpi-row">
            <div className="kpi-card"><div className="label">Total reports</div><div className="value">{kpis.totalReports.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="label">Top {groupLabel.toLowerCase()}</div><div className="value">{kpis.topGroup}</div></div>
            <div className="kpi-card"><div className="label">Last 30 days</div><div className="value">{kpis.last30}</div></div>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 16 }}>
            <div id="chart-overall-line" className="card" style={{ padding: 16 }}>
              <h4 style={{ marginTop: 0 }}>Overall Time Series (All {groupLabel}s)</h4>
              <div className="chart-container"><Line data={overallMonthly} options={{ maintainAspectRatio: false }} /></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
            <div className="card">
              <h4>{selected} – Monthly Breakdown</h4>
              <div id="chart-selected-time" className="chart-container" style={{ height: 300 }}>
                <Bar data={timeSeriesData} options={{ onClick: onBarClick, maintainAspectRatio: false }} />
              </div>
              {monthFilter && <p><strong>Filtered to:</strong> {monthFilter} <button onClick={() => setMonthFilter('')}>Clear</button></p>}

              <h4 style={{ marginTop: 20 }}>Recent Reports</h4>
              <div className="table-wrap">
                <table className="report-table">
                  <thead><tr><th>ID</th><th>Programme</th><th>Focus Area</th><th>Created</th></tr></thead>
                  <tbody>
                    {(selectedGroup?.samples || [])
                      .filter(r => !monthFilter || monthKeyFrom(r.created_at) === monthFilter)
                      .slice(0, 50)
                      .map(r => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.programme?.name || '-'}</td>
                          <td>{r.focus_area?.name || '-'}</td>
                          <td>{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="card">
                <h4>Distribution by {groupLabel}</h4>
                <div id="chart-distribution" className="chart-container" style={{ height: 320 }}>
                  <Pie data={distributionData} options={{ onClick: onPieClick, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="card" style={{ marginTop: 16 }}>
                <h4>Top 5 {groupLabel}s (Stacked over Time)</h4>
                <div id="chart-stacked" className="chart-container" style={{ height: 300 }}>
                  <Bar data={stackedData} options={{ scales: { x: { stacked: true }, y: { stacked: true } }, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
