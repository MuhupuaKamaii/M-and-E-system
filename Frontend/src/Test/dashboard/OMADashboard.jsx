import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiFileText, 
  FiBarChart2, 
  FiLogOut, 
  FiFolder, 
  FiTarget, 
  FiDollarSign, 
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiSearch
} from 'react-icons/fi';
import BudgetChart from '../../components/BudgetChart';
import '../Dashboard.css';

const OMADashboard = () => {
  const { user, logout } = useAuth();

  // Mock budget data
  const mockBudgetData = [
    { name: 'HIV/AIDS', allocatedOp: 50, spentOp: 45, allocatedDev: 30, spentDev: 25 },
    { name: 'Primary Care', allocatedOp: 70, spentOp: 60, allocatedDev: 50, spentDev: 40 },
    { name: 'Maternal Health', allocatedOp: 40, spentOp: 25, allocatedDev: 20, spentDev: 5 },
    { name: 'TB Prevention', allocatedOp: 35, spentOp: 30, allocatedDev: 15, spentDev: 10 },
    { name: 'Infrastructure', allocatedOp: 20, spentOp: 15, allocatedDev: 80, spentDev: 30 },
  ];


  const [reportingYear, setReportingYear] = useState('2024/25');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  const handleKpiClick = (kpiType) => {
    console.log(`Clicked ${kpiType} KPI card`);
    // Add detailed breakdown logic here
  };

  // Mock data specific to logged-in user
  const getUserSpecificData = () => {
    const baseData = {
      OMA: {
        organizationName: 'Ministry of Health and Social Services',
        totalProgrammes: 5,
        indicatorsOnTrack: { current: 3, total: 6 },
        budgetUtilization: 78,
        reportsApproved: { approved: 4, rejected: 1, pending: 2 }
      },
      OPM: {
        organizationName: 'Office of the Prime Minister',
        totalProgrammes: 8,
        indicatorsOnTrack: { current: 5, total: 8 },
        budgetUtilization: 82,
        reportsApproved: { approved: 6, rejected: 2, pending: 3 }
      },
      STAFF: {
        organizationName: 'Ministry of Education',
        totalProgrammes: 6,
        indicatorsOnTrack: { current: 4, total: 7 },
        budgetUtilization: 65,
        reportsApproved: { approved: 5, rejected: 0, pending: 1 }
      }
    };
    return baseData[user?.userType] || baseData.OMA;
  };

  const userData = getUserSpecificData();

  const programmes = [
    {
      name: 'National HIV/AIDS Response',
      progress: 85,
      status: 'On Track',
      statusColor: 'success',
      progressColor: '#10b981'
    },
    {
      name: 'Primary Healthcare Expansion',
      progress: 65,
      status: 'On Track',
      statusColor: 'success',
      progressColor: '#10b981'
    },
    {
      name: 'Maternal Health Improvement',
      progress: 45,
      status: 'At Risk',
      statusColor: 'warning',
      progressColor: '#f59e0b'
    },
    {
      name: 'TB Prevention and Treatment',
      progress: 72,
      status: 'On Track',
      statusColor: 'success',
      progressColor: '#10b981'
    },
    {
      name: 'Public Health Infrastructure',
      progress: 30,
      status: 'Behind',
      statusColor: 'danger',
      progressColor: '#ef4444'
    }
  ];

  // Calculate indicator breakdown from actual programmes data
  const calculateIndicatorBreakdown = () => {
    const onTrack = programmes.filter(p => p.status === 'On Track').length;
    const atRisk = programmes.filter(p => p.status === 'At Risk').length;
    const behind = programmes.filter(p => p.status === 'Behind').length;
    const total = programmes.length;
    
    return {
      onTrack: { 
        count: onTrack, 
        percentage: Math.round((onTrack / total) * 100),
        width: Math.round((onTrack / total) * 100)
      },
      atRisk: { 
        count: atRisk, 
        percentage: Math.round((atRisk / total) * 100),
        width: Math.round((atRisk / total) * 100)
      },
      behind: { 
        count: behind, 
        percentage: Math.round((behind / total) * 100),
        width: Math.round((behind / total) * 100)
      }
    };
  };

  const indicatorBreakdown = calculateIndicatorBreakdown();

  // Filter programmes based on search term
  const filteredProgrammes = programmes.filter(programme =>
    programme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentActivity = [
    {
      type: 'success',
      message: 'Q2 Report for National HIV/AIDS Response submitted.',
      time: '2 days ago'
    },
    {
      type: 'warning',
      message: 'Annual Budget Submission for 2024 is due.',
      time: 'In 5 days'
    },
    {
      type: 'success',
      message: 'Q2 Report for Primary Healthcare Expansion submitted.',
      time: '3 days ago'
    }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="ndp-logo">
              <span className="logo-text">NDP6</span>
              <span className="logo-subtitle">V2030</span>
            </div>
            <span className="system-label">M&E SYSTEM</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active">
            <FiHome className="nav-icon" />
            Dashboard
          </a>
          <a href="/forms" className="nav-item">
            <FiFileText className="nav-icon" />
            Forms
          </a>
          <a href="/reports" className="nav-item">
            <FiFileText className="nav-icon" />
            Reports
          </a>
          <a href="/analytics" className="nav-item">
            <FiBarChart2 className="nav-icon" />
            Analytics
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{userData.organizationName.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{userData.organizationName}</div>
              <div className="user-role">O/M/A User</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <FiLogOut className="logout-icon" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Welcome, {userData.organizationName}</p>
          </div>
          <div className="header-controls">
            <label htmlFor="reporting-year">Reporting Year:</label>
            <select 
              id="reporting-year" 
              value={reportingYear} 
              onChange={(e) => setReportingYear(e.target.value)}
              className="year-selector"
            >
              <option value="2024/25">2024/25</option>
              <option value="2025/26">2025/26</option>
              <option value="2026/27">2026/27</option>
              <option value="2027/28">2027/28</option>
              <option value="2028/29">2028/29</option>
              <option value="2029/30">2029/30</option>
              <option value="2030/31">2030/31</option>
            </select>
          </div>
        </div>

        {/* Quick Access */}
        <div className="quick-access">
          <h2>Quick Actions</h2>
          <div 
            className="quick-access-buttons"
            onMouseLeave={() => setHoveredButton(null)}
          >
            <button 
              className={`quick-btn primary ${hoveredButton && hoveredButton !== 'report' ? 'grayed' : ''}`}
              onMouseEnter={() => setHoveredButton('report')}
            >
              <FiFileText className="btn-icon" />
              Submit New Report
            </button>
            <button 
              className={`quick-btn primary ${hoveredButton && hoveredButton !== 'plan' ? 'grayed' : ''}`}
              onMouseEnter={() => setHoveredButton('plan')}
            >
              <FiPlus className="btn-icon" />
              Start New Plan
            </button>
            <button 
              className={`quick-btn primary ${hoveredButton && hoveredButton !== 'history' ? 'grayed' : ''}`}
              onMouseEnter={() => setHoveredButton('history')}
            >
              <FiFolder className="btn-icon" />
              View Plan History
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-cards">
          <div className="kpi-card clickable" onClick={() => handleKpiClick('programmes')}>
            <div className="kpi-header">
              <h3>Total Programmes</h3>
              <FiFolder className="kpi-icon blue" />
            </div>
            <div className="kpi-value">{userData.totalProgrammes}</div>
          </div>

          <div className="kpi-card clickable indicators-highlight" onClick={() => handleKpiClick('indicators')}>
            <div className="kpi-header">
              <h3>Indicators On Track</h3>
              <FiCheckCircle className="kpi-icon green" />
            </div>
            <div className="kpi-value">{userData.indicatorsOnTrack.current} <span className="kpi-total">/ {userData.indicatorsOnTrack.total}</span></div>
            <div className="indicators-progress-section">
              <div className="indicators-progress-bar">
                {indicatorBreakdown.onTrack.count > 0 && (
                  <div 
                    className="progress-segment green" 
                    style={{ width: `${indicatorBreakdown.onTrack.width}%` }}
                    onMouseEnter={() => setHoveredSegment('green')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    title={`On Track: ${indicatorBreakdown.onTrack.count} programmes (${indicatorBreakdown.onTrack.percentage}%)`}
                  ></div>
                )}
                {indicatorBreakdown.atRisk.count > 0 && (
                  <div 
                    className="progress-segment yellow" 
                    style={{ width: `${indicatorBreakdown.atRisk.width}%` }}
                    onMouseEnter={() => setHoveredSegment('yellow')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    title={`At Risk: ${indicatorBreakdown.atRisk.count} programmes (${indicatorBreakdown.atRisk.percentage}%)`}
                  ></div>
                )}
                {indicatorBreakdown.behind.count > 0 && (
                  <div 
                    className="progress-segment red" 
                    style={{ width: `${indicatorBreakdown.behind.width}%` }}
                    onMouseEnter={() => setHoveredSegment('red')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    title={`Behind: ${indicatorBreakdown.behind.count} programmes (${indicatorBreakdown.behind.percentage}%)`}
                  ></div>
                )}
              </div>
              <div className="progress-label">
                {hoveredSegment === 'green' && `On Track: ${indicatorBreakdown.onTrack.count} programmes (${indicatorBreakdown.onTrack.percentage}%)`}
                {hoveredSegment === 'yellow' && `At Risk: ${indicatorBreakdown.atRisk.count} programmes (${indicatorBreakdown.atRisk.percentage}%)`}
                {hoveredSegment === 'red' && `Behind: ${indicatorBreakdown.behind.count} programmes (${indicatorBreakdown.behind.percentage}%)`}
                {!hoveredSegment && `${indicatorBreakdown.onTrack.percentage}% Target Met`}
              </div>
            </div>
          </div>

          <div className="kpi-card clickable" onClick={() => handleKpiClick('budget')}>
            <div className="kpi-header">
              <h3>Budget Utilisation</h3>
              <FiDollarSign className="kpi-icon orange" />
            </div>
            <div className="kpi-value">{userData.budgetUtilization}%</div>
          </div>

          <div className="kpi-card clickable" onClick={() => handleKpiClick('reports')}>
            <div className="kpi-header">
              <h3>Reports Status</h3>
              <FiCheckCircle className="kpi-icon green" />
            </div>
            <div className="kpi-value">{userData.reportsApproved.approved}/{userData.reportsApproved.approved + userData.reportsApproved.rejected}</div>
            <div className="kpi-subtitle">
              Approved/Total
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          {/* Programmes Table */}
          <div className="content-section programmes-section">
            <div className="programmes-header">
              <h3>Programmes & Indicator Overview</h3>
              <div className="search-container">
                <div className="search-input-wrapper">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search programmes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>
            <div className="programmes-table">
              <table>
                <thead>
                  <tr>
                    <th>Programme Name</th>
                    <th>Overall Progress</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProgrammes.map((programme, index) => (
                    <tr key={index}>
                      <td className="programme-name">
                        {programme.name}
                      </td>
                      <td>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${programme.progress}%`,
                              backgroundColor: programme.progressColor
                            }}
                          ></div>
                          <span className="progress-text">{programme.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${programme.statusColor}`}>
                          {programme.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn">
                          <FiEye className="action-icon" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="content-sidebar">
            {/* Budget Overview Chart */}
            <div className="content-section chart-section">
              <h3>Budget Overview (in N$ Million)</h3>
              <div className="h-64">
                <BudgetChart data={mockBudgetData} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="content-section activity-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />}
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OMADashboard;