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
import { 
  FiTrendingUp, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock,
  FiUsers,
  FiTarget,
  FiBarChart2,
  FiEye,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiHome,
  FiFileText,
  FiPieChart
} from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale);

// Enhanced datasets with more dynamic data
const omas = [
  { id: "oma1", name: "MoHSS", progress: 72, status: "On track" },
  { id: "oma2", name: "MoF", progress: 68, status: "On track" },
  { id: "oma3", name: "OPM", progress: 55, status: "Attention" },
  { id: "oma4", name: "MAWLR", progress: 49, status: "Review" },
];

const pillarsRaw = [
  { omaId: "oma1", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 72, status: "On track", trend: "up" },
  { omaId: "oma1", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 61, status: "Attention", trend: "down" },
  { omaId: "oma1", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 55, status: "Review", trend: "stable" },
  { omaId: "oma2", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 68, status: "On track", trend: "up" },
  { omaId: "oma2", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 58, status: "Attention", trend: "stable" },
  { omaId: "oma2", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 62, status: "On track", trend: "up" },
  { omaId: "oma3", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 74, status: "On track", trend: "up" },
  { omaId: "oma3", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 49, status: "Review", trend: "down" },
  { omaId: "oma3", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 64, status: "Attention", trend: "stable" },
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
    priority: "high"
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
    priority: "medium"
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
    priority: "high"
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
    priority: "low"
  },
];

const initialTimeline = [
  {
    id: "t1",
    title: "Health for All report submitted",
    oma: "MoHSS",
    timeAgo: "45 minutes ago",
    status: "Awaiting review",
    type: "submission"
  },
  {
    id: "t2",
    title: "NPC approved Tourism labs",
    oma: "MoT",
    timeAgo: "2 hours ago",
    status: "Approved",
    type: "approval"
  },
  {
    id: "t3",
    title: "Evidence upload requested",
    oma: "MAWLR",
    timeAgo: "6 hours ago",
    status: "Info request",
    type: "action"
  },
  {
    id: "t4",
    title: "Governance draft resubmitted",
    oma: "OPM",
    timeAgo: "Yesterday",
    status: "Re-review",
    type: "resubmission"
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
  const [timeRange, setTimeRange] = useState("month");
  const [viewMode, setViewMode] = useState("overview");

  // Enhanced color scheme
  const COLORS = {
    primary: '#0F3D6A',
    secondary: '#2C5AA0',
    accent: '#4A90E2',
    success: '#2CB1A3',
    warning: '#F4B33D',
    danger: '#C0342A',
    neutral: '#64748B',
    light: '#F8FAFC',
    dark: '#0F172A'
  };

  // Compute programme-level progress from `pillarsRaw`, optionally filtered by selected OMA
  const programmeProgress = useMemo(() => {
    const filtered = selectedOma === 'all' ? pillarsRaw : pillarsRaw.filter(p => p.omaId === selectedOma);
    const map = {};
    filtered.forEach(item => {
      const key = item.programme || item.pillar || 'Unnamed Programme';
      if (!map[key]) map[key] = { programme: item.programme || key, title: item.pillar || '', total: 0, count: 0 };
      map[key].total += (item.progress || 0);
      map[key].count += 1;
    });
    return Object.values(map).map(v => ({
      programme: v.programme,
      title: v.title,
      progress: Math.round(v.count ? v.total / v.count : 0)
    }));
  }, [selectedOma]);

  // Add missing doughnut data and options
  const doughnutData = useMemo(() => ({
    labels: ['Submitted', 'Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [8, 12, 4, 2],
        backgroundColor: [
          'rgba(74, 144, 226, 0.8)',
          'rgba(44, 177, 163, 0.8)',
          'rgba(244, 179, 61, 0.8)',
          'rgba(192, 52, 42, 0.8)'
        ],
        borderColor: [
          'rgba(74, 144, 226, 1)',
          'rgba(44, 177, 163, 1)',
          'rgba(244, 179, 61, 1)',
          'rgba(192, 52, 42, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  }), []);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0F172A',
        bodyColor: '#374151',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        boxPadding: 10,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }), []);

  const statusForPercent = (v) => {
    if (v >= 80) return { label: 'On track', color: COLORS.success, icon: FiTrendingUp };
    if (v >= 50) return { label: 'At risk', color: COLORS.warning, icon: FiAlertTriangle };
    return { label: 'Off track', color: COLORS.danger, icon: FiClock };
  };

  // Analytics categories for navigation
  const analyticsLabels = {
    "oma-programme-progress": { title: "Programme Progress Dashboard", eyebrow: "Analytics • OMA", icon: FiBarChart2 },
    "oma-indicator-performance": { title: "Indicator Performance Dashboard", eyebrow: "Analytics • OMA", icon: FiTarget },
    "oma-budget-tracking": { title: "Budget Tracking Dashboard", eyebrow: "Analytics • OMA", icon: FiTrendingUp },
    "oma-report-status": { title: "Report Submission Status", eyebrow: "Analytics • OMA", icon: FiCheckCircle },
    "oma-risks-heatmap": { title: "Risks & Challenges Heatmap", eyebrow: "Analytics • OMA", icon: FiAlertTriangle },
    "oma-evidence-completion": { title: "Evidence Completion Dashboard", eyebrow: "Analytics • OMA", icon: FiUsers },
    "npc-pillar-performance": { title: "National Pillar Performance", eyebrow: "Analytics • NPC", icon: FiBarChart2 },
    "npc-cross-programme": { title: "Cross-Programme Comparison", eyebrow: "Analytics • NPC", icon: FiTarget },
    "npc-kpi": { title: "National KPI Dashboard", eyebrow: "Analytics • NPC", icon: FiTrendingUp },
    "npc-alerts": { title: "Alerts & Early Warnings", eyebrow: "Analytics • NPC", icon: FiAlertTriangle },
    "npc-evidence-verification": { title: "Evidence Verification Dashboard", eyebrow: "Analytics • NPC", icon: FiCheckCircle },
    "npc-outcome-achievement": { title: "Desired Outcome Achievement", eyebrow: "Analytics • NPC", icon: FiUsers },
  };

  const omaCategories = [
    { label: "Programme Progress", key: "oma-programme-progress" },
    { label: "Indicator Performance", key: "oma-indicator-performance" },
    { label: "Budget Tracking", key: "oma-budget-tracking" },
    { label: "Report Submission Status", key: "oma-report-status" },
    { label: "Risks & Challenges", key: "oma-risks-heatmap" },
    { label: "Evidence Completion", key: "oma-evidence-completion" },
  ];

  const npcCategories = [
    { label: "Pillar Performance", key: "npc-pillar-performance" },
    { label: "Cross-Programme Comparison", key: "npc-cross-programme" },
    { label: "National KPI Dashboard", key: "npc-kpi" },
    { label: "Alerts & Early Warnings", key: "npc-alerts" },
    { label: "Evidence Verification", key: "npc-evidence-verification" },
    { label: "Outcome Achievement", key: "npc-outcome-achievement" },
  ];

  // Get current analytics selection from URL
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

  // Dynamic stat blocks
  const statBlocks = useMemo(() => [
    {
      label: "Total Reports",
      value: reports.length.toString(),
      subtext: "All pillars • FY 2025/26",
      trend: { direction: "up", value: "+12%" },
      icon: FiBarChart2,
      color: COLORS.primary,
      onClick: () => navigate(`/npc-dashboard?filter=all`),
    },
    {
      label: "Pending Review",
      value: reports.filter(r => r.status === "Pending" || r.status === "Submitted").length.toString(),
      subtext: "Need immediate action",
      trend: { direction: "down", value: "-4%" },
      icon: FiClock,
      color: COLORS.warning,
      tone: "warning",
      onClick: () => navigate(`/npc-dashboard?filter=pending`),
    },
    {
      label: "Flagged Items",
      value: reports.filter(r => r.status === "Rejected").length.toString(),
      subtext: "Requires escalation",
      trend: { direction: "up", value: "+1" },
      icon: FiAlertTriangle,
      color: COLORS.danger,
      tone: "alert",
      onClick: () => navigate(`/npc-dashboard?filter=flagged`),
    },
    {
      label: "Approved This Week",
      value: reports.filter(r => r.status === "Approved").length.toString(),
      subtext: "On track for delivery",
      trend: { direction: "up", value: "+5" },
      icon: FiCheckCircle,
      color: COLORS.success,
      onClick: () => navigate(`/npc-dashboard?filter=approved`),
    }
  ], [reports, navigate]);

  // Enhanced quick actions
  const quickActions = [
    { label: "Review Queue", icon: FiEye, onClick: () => navigate("/review-queue"), color: COLORS.warning },
    { label: "Export Reports", icon: FiDownload, onClick: () => navigate("/export"), color: COLORS.primary },
    { label: "Manage Filters", icon: FiFilter, onClick: () => navigate("/filters"), color: COLORS.accent },
    { label: "Refresh Data", icon: FiRefreshCw, onClick: () => window.location.reload(), color: COLORS.success }
  ];

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

  // Render analytics charts based on selection
  const renderAnalyticsCharts = () => {
    if (!selectedAnalytics) return null;

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
      return (
        <div className="analytics-chart-container">
          <Bar data={data} options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } },
          }} />
        </div>
      );
    }

    if (key === 'npc-pillar-performance') {
      const pvals = [48,62,55,51];
      const pcolors = pvals.map(v => statusForPercent(v).color);
      const bar = { 
        labels: ['Economic','Human Dev','Governance','Environment'],
        datasets: [{ data: pvals, backgroundColor: pcolors }]
      };
      return (
        <div className="analytics-chart-container">
          <Bar data={bar} options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } },
          }} />
        </div>
      );
    }

    // Add more analytics cases as needed
    return (
      <div className="analytics-placeholder">
        <FiPieChart size={48} />
        <h3>{selectedAnalytics.title}</h3>
        <p>Analytics view for {selectedAnalytics.title}</p>
      </div>
    );
  };

  return (
    <div className="npc-dashboard-enhanced">
      <NpcTopNav />
      
      <div className="dashboard-layout">
        <NpcSideNav pendingApprovals={8} />
        
        <main className="dashboard-main-enhanced">
          {/* Enhanced Header with Navigation */}
          <div className="dashboard-header-enhanced">
            <div className="header-content">
              <div className="header-text">
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
                            : 'NPC Dashboard';
                  return (
                    <>
                      <p className="npc-section__eyebrow">{headerEyebrow}</p>
                      <h1 className="npc-section__title">{headerTitle}</h1>
                    </>
                  );
                })()}
                
                {/* Analytics Navigation */}
                {!selectedAnalytics && (selectedGroup || selectedSection === null) && (
                  <div className="analytics-navigation">
                    <div className="npc-chip-group">
                      <button
                        className={`npc-link-button ${!selectedGroup ? 'npc-chip--active' : ''}`}
                        onClick={() => navigate('/npc-dashboard')}
                      >
                        <FiHome /> Dashboard
                      </button>
                      <button
                        className={`npc-link-button ${selectedGroup === 'oma' ? 'npc-chip--active' : ''}`}
                        onClick={() => navigate('/npc-dashboard?analyticsGroup=oma')}
                      >
                        <FiBarChart2 /> OMA Analytics
                      </button>
                      <button
                        className={`npc-link-button ${selectedGroup === 'npc' ? 'npc-chip--active' : ''}`}
                        onClick={() => navigate('/npc-dashboard?analyticsGroup=npc')}
                      >
                        <FiPieChart /> NPC Analytics
                      </button>
                    </div>
                  </div>
                )}

                {/* Analytics Sub-navigation */}
                {!selectedAnalytics && selectedGroup && (
                  <div className="analytics-subnav">
                    <div className="npc-chip-group">
                      {(selectedGroup === 'oma' ? omaCategories : npcCategories).map((cat) => (
                        <button
                          key={cat.key}
                          className="npc-link-button"
                          onClick={() => {
                            const params = new URLSearchParams();
                            params.set('analyticsGroup', selectedGroup);
                            params.set('analytics', cat.key);
                            navigate(`/npc-dashboard?${params.toString()}`);
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="header-controls-enhanced">
                <div className="control-group">
                  <label>Time Range:</label>
                  <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="control-select"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>View:</label>
                  <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value)}
                    className="control-select"
                  >
                    <option value="overview">Overview</option>
                    <option value="detailed">Detailed</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Show analytics content when selected */}
          {selectedAnalytics ? (
            <div className="analytics-content">
              <div className="analytics-header">
                <h2>{selectedAnalytics.title}</h2>
                <p>{selectedAnalytics.eyebrow}</p>
              </div>
              {renderAnalyticsCharts()}
              <button 
                className="back-button"
                onClick={() => navigate(`/npc-dashboard?analyticsGroup=${selectedGroup}`)}
              >
                ← Back to {selectedGroup?.toUpperCase()} Analytics
              </button>
            </div>
          ) : (
            <>
              {/* Quick Actions Bar - Only show on main dashboard */}
              {!selectedGroup && !selectedSection && (
                <div className="quick-actions-bar">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="quick-action-btn"
                      onClick={action.onClick}
                      style={{ '--action-color': action.color }}
                    >
                      <action.icon className="action-icon" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Enhanced Stats Grid - Only show on main dashboard */}
              {!selectedGroup && !selectedSection && (
                <div className="stats-grid-enhanced">
                  {statBlocks.map((stat, index) => (
                    <div key={index} className="stat-card-enhanced" onClick={stat.onClick}>
                      <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                        <stat.icon style={{ color: stat.color }} />
                      </div>
                      <div className="stat-content">
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-trend">
                          <span className={`trend-${stat.trend.direction}`}>
                            {stat.trend.value}
                          </span>
                          <span className="stat-subtext">{stat.subtext}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Content Grid - Only show on main dashboard */}
              {!selectedGroup && !selectedSection && (
                <div className="main-content-grid">
                  {/* Left Column - Programme Progress */}
                  <div className="content-column">
                    <div className="content-card">
                      <div className="card-header">
                        <h3>Programme Performance</h3>
                        <select 
                          value={selectedOma} 
                          onChange={(e) => setSelectedOma(e.target.value)}
                          className="card-select"
                        >
                          <option value="all">All Ministries</option>
                          {omas.map(oma => (
                            <option key={oma.id} value={oma.id}>{oma.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="programme-list">
                        {programmeProgress.map((programme, index) => {
                          const status = statusForPercent(programme.progress);
                          const StatusIcon = status.icon;
                          return (
                            <div key={index} className="programme-item">
                              <div className="programme-info">
                                <div className="programme-name">{programme.programme}</div>
                                <div className="programme-pillar">{programme.title}</div>
                              </div>
                              <div className="programme-progress">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill" 
                                    style={{ 
                                      width: `${programme.progress}%`,
                                      backgroundColor: status.color
                                    }}
                                  />
                                </div>
                                <div className="progress-text">{programme.progress}%</div>
                              </div>
                              <div className="programme-status">
                                <StatusIcon style={{ color: status.color }} />
                                <span>{status.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Activity Enhanced */}
                    <div className="content-card">
                      <div className="card-header">
                        <h3>Recent Activity</h3>
                        <button className="view-all-btn">View All</button>
                      </div>
                      <div className="activity-timeline">
                        {activityItems.map((activity, index) => (
                          <div key={index} className="activity-item">
                            <div className="activity-icon">
                              {activity.type === 'submission' && <FiBarChart2 />}
                              {activity.type === 'approval' && <FiCheckCircle />}
                              {activity.type === 'action' && <FiAlertTriangle />}
                              {activity.type === 'resubmission' && <FiRefreshCw />}
                            </div>
                            <div className="activity-content">
                              <div className="activity-title">{activity.title}</div>
                              <div className="activity-meta">
                                <span className="activity-oma">{activity.oma}</span>
                                <span className="activity-time">{activity.timeAgo}</span>
                              </div>
                            </div>
                            <div className={`activity-status status-${activity.status.toLowerCase().replace(' ', '-')}`}>
                              {activity.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Charts & Insights */}
                  <div className="content-column">
                    {/* Status Distribution */}
                    <div className="content-card">
                      <div className="card-header">
                        <h3>Submission Status</h3>
                      </div>
                      <div className="chart-container">
                        <Doughnut 
                          data={doughnutData}
                          options={doughnutOptions}
                        />
                      </div>
                    </div>

                    {/* At Risk Overview */}
                    <div className="content-card risk-overview">
                      <div className="card-header">
                        <h3>Priority Attention</h3>
                        <FiAlertTriangle className="risk-icon" />
                      </div>
                      <div className="risk-list">
                        <div className="risk-item">
                          <div className="risk-details">
                            <div className="risk-title">Health for All Campaign</div>
                            <div className="risk-reason">Behind schedule by 2 weeks</div>
                          </div>
                          <div className="risk-priority high">High</div>
                        </div>
                        <div className="risk-item">
                          <div className="risk-details">
                            <div className="risk-title">Digital ID Rollout</div>
                            <div className="risk-reason">Budget overallocation detected</div>
                          </div>
                          <div className="risk-priority medium">Medium</div>
                        </div>
                      </div>
                      <button className="action-btn primary">Review All Issues</button>
                    </div>

                    {/* Quick Metrics */}
                    <div className="content-card metrics-grid">
                      <div className="metric-item">
                        <div className="metric-value">92%</div>
                        <div className="metric-label">Data Quality Score</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-value">{programmeProgress.length}</div>
                        <div className="metric-label">Active Programmes</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-value">3.2d</div>
                        <div className="metric-label">Avg. Response Time</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-value">78%</div>
                        <div className="metric-label">Target Achievement</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Category Grid */}
              {selectedGroup && !selectedAnalytics && (
                <div className="analytics-category-grid">
                  <h2>Select Analytics View</h2>
                  <div className="category-cards">
                    {(selectedGroup === 'oma' ? omaCategories : npcCategories).map((category) => {
                      const Icon = analyticsLabels[category.key]?.icon || FiBarChart2;
                      return (
                        <div
                          key={category.key}
                          className="category-card"
                          onClick={() => {
                            const params = new URLSearchParams();
                            params.set('analyticsGroup', selectedGroup);
                            params.set('analytics', category.key);
                            navigate(`/npc-dashboard?${params.toString()}`);
                          }}
                        >
                          <div className="category-icon">
                            <Icon />
                          </div>
                          <h3>{category.label}</h3>
                          <p>View detailed analytics and insights</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style jsx>{`
        .npc-dashboard-enhanced {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        .dashboard-main-enhanced {
          padding: 2rem;
          min-height: 100vh;
          width: calc(100% - 100px);
        }

        .dashboard-header-enhanced {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .header-text p {
          color: #64748b;
          font-size: 1.125rem;
        }

        .npc-section__eyebrow {
          font-size: 0.875rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .npc-section__title {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .analytics-navigation {
          margin-top: 1rem;
        }

        .analytics-subnav {
          margin-top: 1rem;
        }

        .npc-chip-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .npc-link-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .npc-link-button:hover {
          background: #e2e8f0;
          color: #374151;
        }

        .npc-chip--active {
          background: #0f3d6a;
          color: white;
          border-color: #0f3d6a;
        }

        .header-controls-enhanced {
          display: flex;
          gap: 1.5rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .control-select {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 0.875rem;
        }

        .quick-actions-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
 .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--action-color);
          color: var(--action-color);
        }

        .action-icon {
          font-size: 1.25rem;
        }

        .stats-grid-enhanced {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card-enhanced {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-card-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }

        .stat-subtext {
          color: #94a3b8;
        }

        .main-content-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .content-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .card-select {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-size: 0.875rem;
        }

        .programme-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .programme-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .programme-item:hover {
          border-color: #e2e8f0;
          background: #f8fafc;
        }

        .programme-info {
          flex: 1;
        }

        .programme-name {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .programme-pillar {
          font-size: 0.875rem;
          color: #64748b;
        }

        .programme-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 120px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          min-width: 40px;
        }

        .programme-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          min-width: 80px;
        }

        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 500;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .activity-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .activity-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-awaiting-review { background: #fef3c7; color: #92400e; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-info-request { background: #dbeafe; color: #1e40af; }
        .status-re-review { background: #fce7f3; color: #be185d; }

        .risk-overview .risk-icon {
          color: #ef4444;
          font-size: 1.5rem;
        }

        .risk-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .risk-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #fef2f2;
          border-radius: 8px;
          background: #fef2f2;
        }

        .risk-details {
          flex: 1;
        }

        .risk-title {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .risk-reason {
          font-size: 0.875rem;
          color: #64748b;
        }

        .risk-priority {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .risk-priority.high { background: #fecaca; color: #dc2626; }
        .risk-priority.medium { background: #fed7aa; color: #ea580c; }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .metric-item {
          text-align: center;
          padding: 1rem;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .action-btn {
          width: 100%;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.primary {
          background: #0f3d6a;
          color: white;
        }

        .action-btn.primary:hover {
          background: #0c2e52;
          transform: translateY(-1px);
        }

        .view-all-btn {
          background: none;
          border: none;
          color: #4a90e2;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .chart-container {
          height: 200px;
          position: relative;
        }

        @media (max-width: 1200px) {
          .main-content-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-main-enhanced {
            margin-left: 0;
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          
          .header-controls-enhanced {
            width: 100%;
          }
          
          .stats-grid-enhanced {
            grid-template-columns: 1fr;
          }
          
          .quick-actions-bar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
