import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale } from "chart.js";
import { Doughnut, Bar, Line, Radar } from "react-chartjs-2";
import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";
import StatCard from "../components/common/StatCard";
import ProgressCard from "../components/common/ProgressCard";
import ActivityTimeline from "../components/common/ActivityTimeline";
import NpcApprovalSpotlight from "../components/common/NpcApprovalSpotlight";
import AtRiskCard from "../components/common/AtRiskCard";
// Reverted: no Web3 hero/glass components on main dashboard

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale);

// OMA datasets (dummy) used to drive dynamic Programme trajectory
const omas = [
  { id: "oma1", name: "MoHSS" },
  { id: "oma2", name: "MoF" },
  { id: "oma3", name: "OPM" },
];

const pillarsRaw = [
  { omaId: "oma1", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 72, status: "On track" },
  { omaId: "oma1", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 61, status: "Attention" },
  { omaId: "oma1", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 55, status: "Review" },
  { omaId: "oma2", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 68, status: "On track" },
  { omaId: "oma2", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 58, status: "Attention" },
  { omaId: "oma2", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 62, status: "On track" },
  { omaId: "oma3", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 74, status: "On track" },
  { omaId: "oma3", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 49, status: "Review" },
  { omaId: "oma3", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 64, status: "Attention" },
];

const initialReports = [
  {
    id: "r1",
    programme: "Agriculture Value Chains",
    pillar: "Economic Growth",
    owner: "MAWLR",
    date: "17 Jul 2025",
    status: "Submitted",
    statusVariant: "submitted",
    confidence: "High",
    phase: "review",
  },
  {
    id: "r2",
    programme: "Tourism Revival Labs",
    pillar: "Economic Growth",
    owner: "MoT",
    date: "16 Jul 2025",
    status: "Approved",
    statusVariant: "approved",
    confidence: "Medium",
    phase: "execution",
  },
  {
    id: "r3",
    programme: "Health Workforce Boost",
    pillar: "Human Development",
    owner: "MoHSS",
    date: "15 Jul 2025",
    status: "Pending",
    statusVariant: "pending",
    confidence: "Low",
    phase: "review",
  },
  {
    id: "r4",
    programme: "Governance Modernisation",
    pillar: "Governance",
    owner: "OPM",
    date: "14 Jul 2025",
    status: "Submitted",
    statusVariant: "submitted",
    confidence: "Medium",
    phase: "planning",
  },
  {
    id: "r5",
    programme: "Digital ID Rollout",
    pillar: "Governance",
    owner: "MHAI",
    date: "12 Jul 2025",
    status: "Closed",
    statusVariant: "closed",
    confidence: "High",
    phase: "closure",
  },
  {
    id: "r6",
    programme: "Rural Water Access",
    pillar: "Human Development",
    owner: "MAWLR",
    date: "11 Jul 2025",
    status: "Rejected",
    statusVariant: "rejected",
    confidence: "Low",
    phase: "planning",
  },
];

const initialTimeline = [
  {
    id: "t1",
    title: "Health for All report submitted",
    oma: "MoHSS",
    timeAgo: "45 minutes ago",
    status: "Awaiting review",
  },
  {
    id: "t2",
    title: "NPC approved Tourism labs",
    oma: "MoT",
    timeAgo: "2 hours ago",
    status: "Approved",
  },
  {
    id: "t3",
    title: "Evidence upload requested",
    oma: "MAWLR",
    timeAgo: "6 hours ago",
    status: "Info request",
  },
  {
    id: "t4",
    title: "Governance draft resubmitted",
    oma: "OPM",
    timeAgo: "Yesterday",
    status: "Re-review",
  },
];

export default function NpcDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState(initialReports);
  const [activityItems, setActivityItems] = useState(initialTimeline);
  const [statusCounts, setStatusCounts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedOma, setSelectedOma] = useState("all");
  // Reverted: no trading-style chart controls in main dashboard

  // Using dummy data only: no backend fetch for now

  const pendingCount = useMemo(() => {
    if (summary && typeof summary.submittedOrPending === "number") return summary.submittedOrPending;
    return reports.filter((report) => ["Submitted", "Pending"].includes(report.status)).length;
  }, [summary, reports]);
  const approvedCount = useMemo(() => {
    if (summary && typeof summary.approved === "number") return summary.approved;
    return reports.filter((report) => report.status === "Approved").length;
  }, [summary, reports]);
  const flaggedCount = useMemo(() => {
    if (summary && typeof summary.rejected === "number") return summary.rejected;
    return reports.filter((report) => report.status === "Rejected").length;
  }, [summary, reports]);
  const totalReports = useMemo(() => {
    if (summary && typeof summary.totalReports === "number") return summary.totalReports;
    return reports.length;
  }, [summary, reports]);

  const analyticsLabels = {
    "oma-programme-progress": { title: "Programme Progress Dashboard", eyebrow: "Analytics • OMA" },
    "oma-indicator-performance": { title: "Indicator Performance Dashboard", eyebrow: "Analytics • OMA" },
    "oma-budget-tracking": { title: "Budget Tracking Dashboard", eyebrow: "Analytics • OMA" },
    "oma-report-status": { title: "Report Submission Status", eyebrow: "Analytics • OMA" },
    "oma-risks-heatmap": { title: "Risks & Challenges Heatmap", eyebrow: "Analytics • OMA" },
    "oma-evidence-completion": { title: "Evidence Completion Dashboard", eyebrow: "Analytics • OMA" },
    "npc-pillar-performance": { title: "National Pillar Performance", eyebrow: "Analytics • NPC" },
    "npc-cross-programme": { title: "Cross-Programme Comparison", eyebrow: "Analytics • NPC" },
    "npc-kpi": { title: "National KPI Dashboard", eyebrow: "Analytics • NPC" },
    "npc-alerts": { title: "Alerts & Early Warnings", eyebrow: "Analytics • NPC" },
    "npc-evidence-verification": { title: "Evidence Verification Dashboard", eyebrow: "Analytics • NPC" },
    "npc-outcome-achievement": { title: "Desired Outcome Achievement", eyebrow: "Analytics • NPC" },
    "admin-user-activity": { title: "User Activity Dashboard", eyebrow: "Analytics • Admin" },
    "admin-form-usage": { title: "Form Usage Analytics", eyebrow: "Analytics • Admin" },
    "admin-data-quality": { title: "Data Quality Dashboard", eyebrow: "Analytics • Admin" },
    "admin-workflow-performance": { title: "Workflow Performance Dashboard", eyebrow: "Analytics • Admin" },
    "public-summary": { title: "National Development Summary", eyebrow: "Analytics • Public" },
    "public-highlights": { title: "Public Highlight Visualisations", eyebrow: "Analytics • Public" },
  };

  // Semantic coloring helpers
  const COLORS = {
    good: '#2CB1A3',      // green
    warn: '#F4B33D',      // yellow/orange
    bad:  '#C0342A',      // red
    neutral: '#4A90E2',   // blue
    light: '#e5eef8',
  };
  const statusForPercent = (v) => {
    if (v >= 80) return { label: 'On track', color: COLORS.good };
    if (v >= 50) return { label: 'At risk', color: COLORS.warn };
    return { label: 'Off track', color: COLORS.bad };
  };

  const selectedAnalytics = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("analytics");
    if (key && analyticsLabels[key]) return { key, ...analyticsLabels[key] };
    return null;
  }, [location.search]);

  const selectedGroup = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const g = params.get("analyticsGroup");
    if (g === "oma" || g === "npc") return g;
    return null;
  }, [location.search]);

  const selectedSection = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("section");
    if (s === "planning" || s === "report") return s;
    return null; // null means Dashboard
  }, [location.search]);

  const omaCategories = [
    { label: "Programme Progress", key: "oma-programme-progress" },
    { label: "Indicator Performance", key: "oma-indicator-performance" },
    { label: "Budget Tracking", key: "oma-budget-tracking" },
    { label: "Report Submission Status", key: "oma-report-status" },
    { label: "Risks & Challenges", key: "oma-risks-heatmap" },
    { label: "Evidence Completion", key: "oma-evidence-completion" },
  ];

  // Demo report data to mirror OMA submission (read-only for NPC)
  const reportFilters = useMemo(() => ({ programme: 'National HIV/AIDS Response', year: '2024/25', quarter: 'Quarter 2' }), []);
  const omaReportSample = useMemo(() => ({
    indicators: [
      { label: 'ART Coverage (%)', unit: '%', target: 80, actual: 73, higherIsBetter: true },
      { label: 'New Infections Rate (per 1k)', unit: '', target: 3.5, actual: 3.6, higherIsBetter: false },
    ],
    narrative: 'Focused scale-up in high-burden districts. Slight reporting delays in two regions due to stockouts.',
    evidence: [
      { name: 'Q2_coverage_summary.pdf', size: '1.2 MB' },
      { name: 'facility_uplifts.xlsx', size: '540 KB' },
    ],
  }), []);
  const formatDelta = (t, a, higherIsBetter) => {
    const diff = a - t; const pct = t ? Math.round((diff / t) * 100) : 0;
    const good = higherIsBetter ? diff >= 0 : diff <= 0;
    const tone = good ? COLORS.good : COLORS.bad;
    const sign = pct > 0 ? '+' : '';
    return { text: `${sign}${pct}%`, tone };
  };

  // Chart type selection for NPC analytics
  const chartType = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('chart');
  }, [location.search]);

  const chartTypeOptions = {
    'npc-pillar-performance': ['bar', 'radar'],
    'npc-cross-programme': ['bar', 'line'],
    'npc-kpi': ['line', 'bar'],
    'npc-alerts': ['stacked', 'doughnut'],
    'npc-evidence-verification': ['stacked', 'doughnut'],
    'npc-outcome-achievement': ['stacked', 'line'],
  };

  const defaultChartType = (key) => {
    const map = {
      'npc-pillar-performance': 'bar',
      'npc-cross-programme': 'bar',
      'npc-kpi': 'line',
      'npc-alerts': 'stacked',
      'npc-evidence-verification': 'stacked',
      'npc-outcome-achievement': 'stacked',
    };
    return map[key] || null;
  };

  // Shared chart options and helpers for better UX
  const formatNumber = (n) =>
    typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 1 }) : n;
  const formatCurrency = (n) => `N$ ${Number(n).toLocaleString()}`;
  const withUnit = (value, unit) => {
    if (unit === '%') return `${formatNumber(value)}%`;
    if (unit === 'N$') return formatCurrency(value);
    if (unit) return `${formatNumber(value)} ${unit}`;
    return `${formatNumber(value)}`;
  };
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 450, easing: 'easeOutQuart' },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
            const v = ctx.parsed?.y ?? ctx.parsed ?? ctx.raw;
            return `${label}${formatNumber(v)}`;
          },
        },
      },
      legend: { labels: { usePointStyle: true } },
    },
  };
  const npcCategories = [
    { label: "Pillar Performance", key: "npc-pillar-performance" },
    { label: "Cross-Programme Comparison", key: "npc-cross-programme" },
    { label: "National KPI Dashboard", key: "npc-kpi" },
    { label: "Alerts & Early Warnings", key: "npc-alerts" },
    { label: "Evidence Verification", key: "npc-evidence-verification" },
    { label: "Outcome Achievement", key: "npc-outcome-achievement" },
  ];

  const statusBuckets = useMemo(() => {
    const keys = ["Submitted", "Approved", "Pending", "Rejected", "Closed"];
    const counts = statusCounts
      ? keys.map((k) => statusCounts[k] || 0)
      : keys.map((k) => reports.filter((r) => r.status === k).length);
    return { keys, counts };
  }, [reports, statusCounts]);

  function badgeColorFor(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("review") || s.includes("off")) return "#C0342A";
    if (s.includes("attention") || s.includes("warn")) return "#F4B33D";
    return "#2CB1A3";
  }

  const programmeProgress = useMemo(() => {
    if (selectedOma === "all") {
      const grouped = pillarsRaw.reduce((acc, p) => {
        acc[p.pillar] = acc[p.pillar] || [];
        acc[p.pillar].push(p);
        return acc;
      }, {});
      return Object.keys(grouped).map((pillar) => {
        const list = grouped[pillar];
        const avg = Math.round(list.reduce((a, b) => a + b.progress, 0) / list.length);
        let status = "On track";
        if (list.some((x) => String(x.status).toLowerCase().includes("review"))) status = "Review";
        else if (list.some((x) => String(x.status).toLowerCase().includes("attention"))) status = "Attention";
        return {
          title: pillar,
          programme: list[0].programme,
          progress: avg,
          status,
          badgeColor: badgeColorFor(status),
        };
      });
    }
    return pillarsRaw
      .filter((p) => p.omaId === selectedOma)
      .map((p) => ({
        title: p.pillar,
        programme: p.programme,
        progress: p.progress,
        status: p.status,
        badgeColor: badgeColorFor(p.status),
      }));
  }, [selectedOma]);

  const doughnutData = useMemo(
    () => ({
      labels: statusBuckets.keys,
      datasets: [
        {
          data: statusBuckets.counts,
          backgroundColor: [
            "rgba(44, 177, 163, 0.7)",
            "rgba(47, 155, 98, 0.7)",
            "rgba(244, 179, 61, 0.7)",
            "rgba(192, 52, 42, 0.7)",
            "rgba(14, 53, 93, 0.7)",
          ],
          borderColor: [
            "rgba(44, 177, 163, 1)",
            "rgba(47, 155, 98, 1)",
            "rgba(244, 179, 61, 1)",
            "rgba(192, 52, 42, 1)",
            "rgba(14, 53, 93, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [statusBuckets],
  );

  const doughnutOptions = useMemo(
    () => ({
      cutout: '72%',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e8eef9', boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: 'rgba(17,19,26,0.95)',
          titleColor: '#e8eef9',
          bodyColor: '#e8eef9',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1
        }
      }
    }),
    [],
  );

  const barData = useMemo(
    () => ({
      labels: programmeProgress.map((p) => p.programme),
      datasets: [
        {
          label: "Progress %",
          data: programmeProgress.map((p) => p.progress),
          backgroundColor: "rgba(14, 53, 93, 0.75)",
          borderRadius: 8,
        },
      ],
    }),
    [],
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: 'rgba(17,19,26,0.95)',
        titleColor: '#e8eef9',
        bodyColor: '#e8eef9',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1
      } },
      scales: {
        x: { ticks: { color: '#e8eef9' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: '#e8eef9' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      }
    }),
    [],
  );

  // Reverted: no trading-style series/candles on main dashboard

  const statBlocks = useMemo(
    () => [
      {
        label: "Total reports in cycle",
        value: totalReports.toString(),
        subtext: "All pillars • FY 2025/26",
        trend: { direction: "up", value: "+12%" },
        onClick: () => navigate(`/npc-dashboard?filter=all`),
      },
      {
        label: "Pending NPC review",
        value: pendingCount.toString(),
        subtext: "Need action",
        trend: { direction: "down", value: "-4%" },
        tone: pendingCount > 15 ? "warning" : "default",
        onClick: () => navigate(`/npc-dashboard?filter=pending`),
      },
      {
        label: "Flagged for follow-up",
        value: flaggedCount.toString(),
        subtext: "Escalated to sector leads",
        trend: { direction: "up", value: `+${flaggedCount}` },
        tone: flaggedCount ? "alert" : "default",
        onClick: () => navigate(`/npc-dashboard?filter=flagged`),
      },
    ],
    [totalReports, pendingCount, flaggedCount],
  );

  return (
    <div className="npc-dashboard">
      <NpcTopNav />

      <div className="npc-dashboard__grid">
        <NpcSideNav pendingApprovals={pendingCount} />

        <main className="npc-dashboard__main">
          {/* Reverted: remove Web3 hero section */}

          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                {(() => {
                  const groupFromAnalytic = selectedAnalytics?.key?.startsWith('oma-') ? 'oma' : (selectedAnalytics?.key?.startsWith('npc-') ? 'npc' : null);
                  const activeGroup = selectedGroup || groupFromAnalytic;
                  const headerEyebrow = selectedAnalytics
                    ? selectedAnalytics.eyebrow
                    : activeGroup === 'oma'
                      ? 'Analytics • OMA'
                      : activeGroup === 'npc'
                        ? 'Analytics • NPC'
                        : selectedSection
                          ? 'Workspace'
                          : 'Monitoring overview';
                  const headerTitle = selectedAnalytics
                    ? selectedAnalytics.title
                    : activeGroup === 'oma'
                      ? 'OMA Analytics'
                      : activeGroup === 'npc'
                        ? 'NPC Analytics'
                        : selectedSection === 'planning'
                          ? 'Planning'
                          : selectedSection === 'report'
                            ? 'Report'
                            : 'NPC dashboard';
                  return (
                    <>
                      <p className="npc-section__eyebrow">{headerEyebrow}</p>
                      <h1 className="npc-section__title">{headerTitle}</h1>
                    </>
                  );
                })()}
                {!selectedAnalytics && !selectedGroup && !selectedSection && (
                  <p className="npc-section__description">
                    Focus on the live review queue while OMAs progress through execution and closure.
                  </p>
                )}
                {(() => {
                  const groupFromAnalytic = selectedAnalytics?.key?.startsWith('oma-') ? 'oma' : (selectedAnalytics?.key?.startsWith('npc-') ? 'npc' : null);
                  const activeGroup = selectedGroup || groupFromAnalytic;
                  const categories = activeGroup === 'oma' ? omaCategories : activeGroup === 'npc' ? npcCategories : null;
                  if (!categories) return null;
                  return (
                    <div style={{ marginTop: 8 }}>
                      <div className="npc-chip-group">
                        {categories.map((cat) => {
                          const isActive = selectedAnalytics?.key === cat.key;
                          return (
                            <button
                              key={cat.key}
                              className={`npc-link-button${isActive ? ' npc-chip--active' : ''}`}
                              onClick={() => {
                                const params = new URLSearchParams();
                                params.set('analyticsGroup', activeGroup);
                                params.set('analytics', cat.key);
                                if (activeGroup === 'npc') {
                                  params.set('chart', defaultChartType(cat.key));
                                }
                                navigate(`/npc-dashboard?${params.toString()}`);
                              }}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedAnalytics && activeGroup === 'npc' && chartTypeOptions[selectedAnalytics.key] ? (
                        <div style={{ marginTop: 8 }}>
                          <div className="npc-chip-group">
                            {chartTypeOptions[selectedAnalytics.key].map((t) => {
                              const isTActive = (chartType || defaultChartType(selectedAnalytics.key)) === t;
                              const params = new URLSearchParams(location.search);
                              params.set('chart', t);
                              return (
                                <button
                                  key={t}
                                  className={`npc-link-button${isTActive ? ' npc-chip--active' : ''}`}
                                  onClick={() => navigate(`/npc-dashboard?${params.toString()}`)}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            </div>
            {!selectedAnalytics && !selectedGroup && !selectedSection ? (
              <>
                <div className="npc-stats-grid">
                  {statBlocks.map((stat) => (
                    <StatCard key={stat.label} {...stat} onClick={stat.onClick} />
                  ))}
                </div>
              </>
            ) : null}

          {selectedAnalytics ? (
            <section className="npc-section">
              {/* Render static charts for the selected analytics */}
              {(() => {
                const key = selectedAnalytics.key;

                if (key === 'oma-programme-progress') {
                  const values = [72, 58, 64, 49];
                  const colors = values.map(v => statusForPercent(v).color);
                  const data = {
                    labels: ['Irrigation Dev', 'Water Supply', 'Agri Inputs', 'Market Access'],
                    datasets: [{
                      label: '% progress',
                      data: values,
                      backgroundColor: colors,
                    }]
                  };
                  const trend = {
                    labels: ['2023', '2024', '2025', '2026'],
                    datasets: [
                      { label: 'Target', data: [40, 60, 80, 100], borderColor: '#4A90E2', backgroundColor: 'rgba(74,144,226,0.15)', fill: true, tension: 0.3 },
                      { label: 'Actual', data: [35, 52, 63, 0], borderColor: '#2CB1A3', backgroundColor: 'rgba(44,177,163,0.15)', fill: true, tension: 0.3 },
                    ]
                  };
                  return (
                    <div className="npc-charts-grid">
                      <div className="npc-card">
                        <div className="npc-card__head"><p className="npc-card__title">Programme progress</p><p className="npc-card__subtitle">% completion by programme</p></div>
                        <div className="npc-chart"><Bar data={data} options={{
                          ...baseOpts,
                          plugins: { ...baseOpts.plugins, legend: { display: false }, tooltip: { callbacks: { label: (ctx) => {
                            const v = ctx.parsed.y ?? ctx.parsed; const s = statusForPercent(v);
                            return `${ctx.label}: ${withUnit(v, '%')} • ${s.label}`;
                          } } } },
                          scales: { y: { beginAtZero: true, max: 100 } },
                        }} /></div>
                      </div>
                      <div className="npc-card">
                        <div className="npc-card__head"><p className="npc-card__title">Target vs actual</p><p className="npc-card__subtitle">Yearly trajectory</p></div>
                        <div className="npc-chart"><Line data={trend} options={{
                          ...baseOpts,
                          plugins: { ...baseOpts.plugins, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, '%')}` } } },
                          scales: { y: { beginAtZero: true, max: 100 } },
                        }} /></div>
                      </div>
                    </div>
                  );
                }

                if (key === 'oma-indicator-performance') {
                  const actVals = [15, 19, 22, 0];
                  const line = {
                    labels: ['Baseline','2024','2025','2026'],
                    datasets: [
                      { label: 'Target', data: [15, 22, 26, 30], borderColor: COLORS.neutral, backgroundColor:'rgba(74,144,226,0.12)', fill:true, tension: 0.25 },
                      { label: 'Actual', data: actVals, borderColor: '#2CB1A3', pointBackgroundColor: actVals.map(v => statusForPercent(Math.min(100, v/30*100)).color), tension: 0.25 },
                    ]
                  };
                  const doughnut = {
                    labels: ['Achieved','Remaining'],
                    datasets: [{ data: [22, 8], backgroundColor: ['#2CB1A3','#e5eef8'] }]
                  };
                  return (
                    <div className="npc-charts-grid">
                      <div className="npc-card">
                        <div className="npc-card__head"><p className="npc-card__title">Indicator trajectory</p><p className="npc-card__subtitle">Baseline → target → actual</p></div>
                        <div className="npc-chart"><Line data={line} options={{ ...baseOpts, plugins: { ...baseOpts.plugins, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, '%')}` } } } }} /></div>
                      </div>
                      <div className="npc-card">
                        <div className="npc-card__head"><p className="npc-card__title">% of target reached</p></div>
                        <div className="npc-chart npc-chart--small"><Doughnut data={doughnut} options={{
                          ...baseOpts,
                          plugins: {
                            ...baseOpts.plugins,
                            tooltip: {
                              ...baseOpts.plugins.tooltip,
                              callbacks: {
                                label: (ctx) => `${ctx.label}: ${withUnit(ctx.parsed, '%')}`,
                              },
                            },
                          },
                          cutout: '60%',
                        }} /></div>
                      </div>
                    </div>
                  );
                }

                if (key === 'oma-budget-tracking') {
                  const bar = {
                    labels: ['Water Infra', 'Irrigation', 'Rural Access'],
                    datasets: [
                      { label: 'Planned', data: [50, 38, 22], backgroundColor: '#4A90E2' },
                      { label: 'Spent', data: [32, 25, 14], backgroundColor: '#2CB1A3' },
                    ]
                  };
                  const pie = { labels: ['CapEx','OpEx','Maintenance'], datasets:[{ data:[45,35,20], backgroundColor:['#2C5AA0','#2CB1A3','#F4B33D'] }]};
                  return (
                    <div className="npc-charts-grid">
                      <div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Planned vs actual</p></div><div className="npc-chart"><Bar data={bar} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, 'N$')}` } } }, scales:{ y:{ beginAtZero:true }}}} /></div></div>
                      <div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Spending distribution</p></div><div className="npc-chart npc-chart--small"><Doughnut data={pie} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.label}: ${withUnit(ctx.parsed, 'N$')}` } } } }} /></div></div>
                    </div>
                  );
                }

                if (key === 'oma-report-status') {
                  const donut = { labels:['Draft','Submitted','Approved','Rejected'], datasets:[{ data:[4,3,10,1], backgroundColor:['#dfe8f5',COLORS.neutral,COLORS.good,COLORS.bad] }]};
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Submission status</p></div><div className="npc-chart npc-chart--small"><Doughnut data={donut} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.label}: ${withUnit(ctx.parsed, 'reports')}` } } } }} /></div></div>);
                }

                if (key === 'oma-risks-heatmap') {
                  const bar = { labels:['Data gaps','Logistics','Budget limits','Skills','Weather'], datasets:[{ label:'Frequency', data:[14,9,7,6,5], backgroundColor:'#C0342A' }]};
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Top reported risks</p></div><div className="npc-chart"><Bar data={bar} options={{ ...baseOpts, indexAxis:'y', plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.x, 'risks')}` } } }, scales:{ x:{ beginAtZero:true }}}} /></div></div>);
                }

                if (key === 'oma-evidence-completion') {
                  const bar = { labels:['With evidence','Without evidence'], datasets:[{ data:[12,8], backgroundColor:['#2CB1A3','#F26D5B'] }]};
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Evidence status</p></div><div className="npc-chart"><Bar data={bar} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, 'reports')}` } } }, scales:{ y:{ beginAtZero:true }}}} /></div></div>);
                }

                if (key === 'npc-pillar-performance') {
                  const pvals = [48,62,55,51];
                  const pcolors = pvals.map(v => statusForPercent(v).color);
                  const bar = { labels:['Economic','Human Dev','Governance','Environment'], datasets:[{ data:pvals, backgroundColor:pcolors }]};
                  const radar = { labels:['Economic','Human','Gov','Env'], datasets:[{ label:'Strength', data:[48,62,55,51], backgroundColor:'rgba(74,144,226,0.2)', borderColor:'#4A90E2' }]};
                  const type = chartType || defaultChartType(key);
                  if (type === 'radar') {
                    return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Pillar comparison</p></div><div className="npc-chart"><Radar data={radar} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${withUnit(ctx.raw, '%')}` } } } }} /></div></div>);
                  }
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Pillar progress %</p></div><div className="npc-chart"><Bar data={bar} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> { const v = ctx.parsed.y; const s = statusForPercent(v); return `${ctx.label}: ${withUnit(v, '%')} • ${s.label}`; } } }, legend:{ display:false } }, scales:{ y:{ beginAtZero:true, max:100 }}}} /></div></div>);
                }

                if (key === 'npc-cross-programme') {
                  const scores = [85,72,32,66];
                  const scColors = scores.map(v => statusForPercent(v).color);
                  const bar = { labels:['Renewable Energy','Primary Healthcare','Youth Employment','Road Access'], datasets:[{ data:scores, backgroundColor: scColors }]};
                  const type = chartType || defaultChartType(key);
                  if (type === 'line') {
                    const line = { labels: bar.labels, datasets:[{ label:'Score', data:scores, borderColor: COLORS.neutral, pointBackgroundColor: scColors, tension:0.25, fill:false }] };
                    return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Programme comparison (line)</p></div><div className="npc-chart"><Line data={line} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> { const v = ctx.parsed.y; const s = statusForPercent(v); return `${ctx.label}: ${withUnit(v, '%')} • ${s.label}`; } } } }, scales:{ y:{ beginAtZero:true, max:100 }}}} /></div></div>);
                  }
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Programme leaderboard</p></div><div className="npc-chart"><Bar data={bar} options={{ ...baseOpts, indexAxis:'y', plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> { const v = ctx.parsed.x; const s = statusForPercent(v); return `${ctx.label}: ${withUnit(v, '%')} • ${s.label}`; } } } }, scales:{ x:{ beginAtZero:true, max:100 }}}} /></div></div>);
                }

                if (key === 'npc-kpi') {
                  const vals = [58,60,62,63];
                  const type = chartType || defaultChartType(key);
                  if (type === 'bar') {
                    const bar = { labels:['2022','2023','2024','2025'], datasets:[{ label:'Employment Rate', data:vals, backgroundColor: vals.map(v => statusForPercent(v).color) }]};
                    return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">KPI trend (bar)</p></div><div className="npc-chart"><Bar data={bar} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> { const v = ctx.parsed.y; const s = statusForPercent(v); return `${ctx.label}: ${withUnit(v, '%')} • ${s.label}`; } } } }, scales:{ y:{ beginAtZero:true, max:100 }}}} /></div></div>);
                  }
                  const line = { labels:['2022','2023','2024','2025'], datasets:[{ label:'Employment Rate', data:vals, borderColor:COLORS.neutral, backgroundColor:'rgba(44,90,160,0.12)', fill:true, tension:0.25, pointBackgroundColor: vals.map(v => statusForPercent(v).color) }]};
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">KPI trend</p></div><div className="npc-chart"><Line data={line} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> { const v = ctx.parsed.y; const s = statusForPercent(v); return `${ctx.dataset.label}: ${withUnit(v, '%')} • ${s.label}`; } } } }, scales:{ y:{ beginAtZero:true, max:100 }}}} /></div></div>);
                }

                if (key === 'npc-alerts') {
                  const months = ['Apr','May','Jun','Jul','Aug','Sep'];
                  const stacked = {
                    labels: months,
                    datasets:[
                      { label:'Overdue', data:[2,3,1,4,1,1], backgroundColor:'#C0342A', stack:'alerts' },
                      { label:'Off-track', data:[1,0,2,1,1,1], backgroundColor:'#F4B33D', stack:'alerts' },
                      { label:'Overspent', data:[0,1,0,1,0,0], backgroundColor:'#2C5AA0', stack:'alerts' },
                    ]
                  };
                  const totalTrend = {
                    labels: months,
                    datasets:[{ label:'Total alerts', data: months.map((_,i)=> stacked.datasets.reduce((s,d)=> s + d.data[i],0)), borderColor:'#4A90E2', backgroundColor:'rgba(74,144,226,0.15)', fill:true, tension:0.25 }]
                  };
                  const type = chartType || defaultChartType(key);
                  if (type === 'doughnut') {
                    const sums = stacked.datasets.map(ds => ds.data.reduce((a,b)=>a+b,0));
                    const donut = { labels: stacked.datasets.map(ds => ds.label), datasets:[{ data: sums, backgroundColor: stacked.datasets.map(ds=> ds.backgroundColor) }] };
                    return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Alerts composition</p></div><div className="npc-chart npc-chart--small"><Doughnut data={donut} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.label}: ${withUnit(ctx.parsed, 'alerts')}` } } } }} /></div></div>);
                  }
                  return (
                    <div className="npc-charts-grid">
                      <div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Alerts by type</p><p className="npc-card__subtitle">Stacked by month</p></div><div className="npc-chart"><Bar data={stacked} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, 'alerts')}` } } }, scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true }}}} /></div></div>
                      <div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Total alerts trend</p><p className="npc-card__subtitle">6-month view</p></div><div className="npc-chart"><Line data={totalTrend} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, 'alerts')}` } } } }} /></div></div>
                    </div>
                  );
                }

                if (key === 'npc-evidence-verification') {
                  const months = ['Apr','May','Jun','Jul','Aug','Sep'];
                  const stacked = {
                    labels: months,
                    datasets:[
                      { label:'Approved', data:[3,4,2,5,2,2], backgroundColor:'#2CB1A3', stack:'ev' },
                      { label:'Pending', data:[1,2,1,1,0,1], backgroundColor:'#F4B33D', stack:'ev' },
                      { label:'Rejected', data:[1,0,1,0,1,0], backgroundColor:'#C0342A', stack:'ev' },
                    ]
                  };
                  const donut = { labels:['Approved','Pending','Rejected'], datasets:[{ data:[18,6,4], backgroundColor:['#2CB1A3','#F4B33D','#C0342A'] }]};
                  const type = chartType || defaultChartType(key);
                  if (type === 'doughnut') {
                    return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Overall evidence status</p></div><div className="npc-chart npc-chart--small"><Doughnut data={donut} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.label}: ${withUnit(ctx.parsed, 'reports')}` } } } }} /></div></div>);
                  }
                  return (
                    <div className="npc-charts-grid">
                      <div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Evidence decisions over time</p><p className="npc-card__subtitle">Monthly, stacked</p></div><div className="npc-chart"><Bar data={stacked} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, 'reports')}` } } }, scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true }}}} /></div></div>
                      <div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Overall evidence status</p></div><div className="npc-chart npc-chart--small"><Doughnut data={donut} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.label}: ${withUnit(ctx.parsed, 'reports')}` } } } }} /></div></div>
                    </div>
                  );
                }

                if (key === 'npc-outcome-achievement') {
                  const stacked = { labels:['2019','2020','2021','2022','2023','2024','2025'], datasets:[{ label:'Programme A', data:[5,7,9,12,14,16,18], backgroundColor:'#4A90E2', stack:'a' },{ label:'Programme B', data:[3,4,6,7,9,10,12], backgroundColor:'#2CB1A3', stack:'a' }]};
                  return (<div className="npc-card"><div className="npc-card__head"><p className="npc-card__title">Outcome achievement</p></div><div className="npc-chart"><Bar data={stacked} options={{ ...baseOpts, plugins:{ ...baseOpts.plugins, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${withUnit(ctx.parsed.y, '%')}` } } }, scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true }}}} /></div></div>);
                }

                return null;
              })()}
            </section>
          ) : null}
          </section>

          {!selectedAnalytics && !selectedGroup && !selectedSection ? (
            <section className="npc-section npc-section--split">
              {/* Left column */}
              <div className="npc-section__column">
                <section className="npc-section">
                  <div className="npc-section__head">
                    <div>
                      <p className="npc-section__eyebrow">Programme trajectory</p>
                      <h2 className="npc-section__title">Across priority pillars</h2>
                    </div>
                    <div>
                      <select className="npc-select" value={selectedOma} onChange={(e) => setSelectedOma(e.target.value)}>
                        <option value="all">All OMAs</option>
                        {omas.map((o) => (
                          <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="npc-trajectory-grid">
                    {programmeProgress.map((p) => (
                      <ProgressCard
                        key={`${p.title}-${p.programme}`}
                        {...p}
                        onClick={() =>
                          navigate(
                            `/npc-dashboard?pillar=${encodeURIComponent(p.title)}&oma=${selectedOma}`
                          )
                        }
                      />
                    ))}
                  </div>
                </section>

                <div className="npc-card">
                  <div className="npc-card__head">
                    <div>
                      <p className="npc-card__title">Submission status</p>
                      <p className="npc-card__subtitle">Live distribution</p>
                    </div>
                  </div>
                  <div style={{ height: 220 }}>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </div>

                <ActivityTimeline items={activityItems} />
              </div>

              {/* Right column */}
              <div className="npc-section__column npc-section__column--narrow">
                <AtRiskCard
                  title="At-risk OMAs"
                  body="One or more OMAs may be vulnerable or behind schedule."
                  ctaLabel="View at-risk OMAs"
                  onClick={() => navigate("/npc-dashboard?filter=at-risk")}
                />
                <NpcApprovalSpotlight
                  pending={pendingCount}
                  approved={approvedCount}
                  rejected={flaggedCount}
                />
                <div className="npc-card">
                  <p className="npc-card__title">Indicator progress</p>
                  <div className="npc-indicators">
                    <div>
                      <p className="npc-indicators__value">68%</p>
                      <p className="npc-card__subtitle">Economic Growth</p>
                    </div>
                    <div>
                      <p className="npc-indicators__value">55%</p>
                      <p className="npc-card__subtitle">Governance</p>
                    </div>
                  </div>
                </div>
                <div className="npc-card">
                  <div className="npc-card__head">
                    <div>
                      <p className="npc-card__title">Programme progress</p>
                      <p className="npc-card__subtitle">% completion by programme</p>
                    </div>
                  </div>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </section>
          ) : null}

          {selectedSection === 'planning' ? (
            <section className="npc-section">
              <div className="npc-card">
                <div className="npc-card__head">
                  <div>
                    <p className="npc-card__title">Planning workspace</p>
                    <p className="npc-card__subtitle">Create and manage plans, targets and timelines.</p>
                  </div>
                </div>
                <div style={{ minHeight: 160 }}>
                  {/* Add planning-specific components here */}
                </div>
              </div>
            </section>
          ) : null}

          {selectedSection === 'report' ? (
            <section className="npc-section">
              <div className="npc-card">
                <div className="npc-card__head">
                  <div>
                    <p className="npc-card__title">Reports: Execution Tracking</p>
                    <p className="npc-card__subtitle">Read-only view of OMA submissions.</p>
                  </div>
                </div>
                <div className="npc-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem' }}>
                  <select className="npc-select" value={reportFilters.programme} disabled>
                    <option>{reportFilters.programme}</option>
                  </select>
                  <select className="npc-select" value={reportFilters.year} disabled>
                    <option>{reportFilters.year}</option>
                  </select>
                  <select className="npc-select" value={reportFilters.quarter} disabled>
                    <option>{reportFilters.quarter}</option>
                  </select>
                </div>

                <div className="npc-card" style={{ marginTop: '1rem' }}>
                  <div className="npc-card__head"><div><p className="npc-card__title">Quarterly Indicator Actuals</p></div></div>
                  <div style={{ display:'grid', gap:'1rem', padding:'0.75rem 1rem 1.25rem' }}>
                    {omaReportSample.indicators.map((ind) => {
                      const delta = formatDelta(ind.target, ind.actual, ind.higherIsBetter);
                      return (
                        <div key={ind.label} style={{ display:'grid', gridTemplateColumns:'1.2fr auto auto auto', gap:'1rem', alignItems:'center' }}>
                          <div>
                            <p className="npc-table__primary" style={{ margin:0 }}>{ind.label}</p>
                          </div>
                          <div><div className="npc-tag">{ind.target}{ind.unit}</div></div>
                          <div><div className="npc-tag" style={{ borderColor: '#4A90E2', color:'#0e0f13' }}>{ind.actual}{ind.unit}</div></div>
                          <div style={{ color: delta.tone, fontWeight:700 }}>{delta.text}</div>
                          <div style={{ gridColumn:'1 / -1', height:6, background:'#eef4fb', borderRadius:6, overflow:'hidden' }}>
                            <div style={{ width: `${Math.min(100, (ind.actual/(ind.target||1))*100)}%`, height:'100%', background: delta.tone }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="npc-card" style={{ marginTop: '1rem' }}>
                  <div className="npc-card__head"><div><p className="npc-card__title">Narrative / Comments</p></div></div>
                  <div style={{ padding:'1rem' }}>
                    <div style={{ border:'1px solid var(--border)', borderRadius:12, padding:'0.9rem', background:'#fff' }}>
                      {omaReportSample.narrative}
                    </div>
                  </div>
                </div>

                <div className="npc-card" style={{ marginTop: '1rem' }}>
                  <div className="npc-card__head"><div><p className="npc-card__title">Uploaded Supporting Evidence</p></div></div>
                  <div style={{ padding:'1rem', display:'grid', gap:'0.5rem' }}>
                    {omaReportSample.evidence.map((f) => (
                      <div key={f.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px dashed var(--border)', borderRadius:10, padding:'0.6rem 0.9rem', background:'#fff' }}>
                        <span>{f.name}</span>
                        <span style={{ opacity:0.7 }}>{f.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}


