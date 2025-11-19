import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
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
  FiUpload,
  FiEdit3,
  FiSearch,
  FiDownload
} from 'react-icons/fi';
import '../../Styles/Dashboard.css';
import { generateReportPDF } from '../../utils/pdfGenerator';

const Reports = () => {
  const { user, logout } = useAuth();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('create');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit'
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Form state with auto-filling capability
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [narrative, setNarrative] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    programme: 'National HIV/AIDS Response',
    year: '2024/25',
    quarter: 'Quarter 2',
    narrative: ''
  });

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Enhanced indicator data with baseline, direction, and proper calculations
  const [indicators, setIndicators] = useState([
    {
      id: 1,
      name: 'ART Coverage (%)',
      baseline: 70,
      target: 80,
      actual: '',
      direction: 'increase', // 'increase' or 'decrease'
      achievement: null,
      variance: null,
      status: 'pending'
    },
    {
      id: 2,
      name: 'New Infections Rate (per 1k)',
      baseline: 5,
      target: 3.5,
      actual: '',
      direction: 'decrease',
      achievement: null,
      variance: null,
      status: 'pending'
    },
    {
      id: 3,
      name: 'Treatment Adherence (%)',
      baseline: 85,
      target: 90,
      actual: '',
      direction: 'increase',
      achievement: null,
      variance: null,
      status: 'pending'
    }
  ]);

  // State for Action Steps (Project Performance)
  const [actionSteps, setActionSteps] = useState({
    planned: "1. Procure 50,000 units of ART medication.\n2. Hire 15 new community health workers for rural clinics.\n3. Conduct 3 regional training workshops on new protocols.",
    undertaken: ""
  });

  // State for Budget Execution (Financial Performance)
  const [budget, setBudget] = useState({
    opAllocated: 1500000,
    devAllocated: 3000000,
    opSpent: '',
    devSpent: ''
  });

  // Calculate achievement, variance, and status with graceful empty states
  const calculateMetrics = (indicator) => {
    if (!indicator.actual || indicator.actual === '') {
      return {
        achievement: '--',
        variance: '--',
        status: 'pending'
      };
    }

    const actual = parseFloat(indicator.actual);
    const target = indicator.target;
    const baseline = indicator.baseline;

    // Calculate achievement percentage
    let achievement;
    if (indicator.direction === 'increase') {
      achievement = (actual / target) * 100;
    } else {
      achievement = (target / actual) * 100;
    }

    // Calculate variance
    const variance = actual - target;

    // Determine status based on achievement
    let status;
    if (achievement >= 95) {
      status = 'success';
    } else if (achievement >= 80) {
      status = 'warning';
    } else {
      status = 'danger';
    }

    return {
      achievement: Math.round(achievement),
      variance: variance.toFixed(1),
      status
    };
  };

  // Mock dropdown options
  const programmes = [
    'National HIV/AIDS Response',
    'Primary Healthcare Program',
    'Maternal Health Initiative',
    'TB Prevention Program',
    'Infrastructure Development'
  ];

  const years = ['2024/25', '2025/26', '2026/27', '2027/28', '2028/29', '2029/30', '2030/31'];
  const quarters = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

  // Mock Data for Past Reports
  const pastReports = [
    { id: 'r1', programme: 'National HIV/AIDS Response', year: '2024/25', quarter: 'Quarter 1', submittedDate: '2024-07-15', status: 'Approved' },
    { id: 'r2', programme: 'Primary Healthcare Program', year: '2024/25', quarter: 'Quarter 1', submittedDate: '2024-07-12', status: 'Returned' },
    { id: 'r3', programme: 'Maternal Health Initiative', year: '2024/25', quarter: 'Quarter 2', submittedDate: '-', status: 'Draft' },
  ];

  // Detailed mock data for reports
  const mockDetailedReports = {
    r1: {
      id: 'r1',
      programme: 'National HIV/AIDS Response',
      year: '2024/25',
      quarter: 'Quarter 1',
      submittedDate: '2024-07-15',
      status: 'Approved',
      actionSteps: {
        planned: "1. Procure 50,000 units of ART medication.\n2. Hire 15 new community health workers for rural clinics.\n3. Conduct 3 regional training workshops on new protocols.",
        undertaken: "1. Successfully procured 48,000 units of ART medication.\n2. Hired 12 new community health workers.\n3. Completed 2 training workshops with third scheduled for next month."
      },
      budget: {
        opAllocated: 1500000,
        devAllocated: 3000000,
        opSpent: 1200000,
        devSpent: 2400000
      },
      indicators: [
        { id: '1', name: 'ART Coverage (%)', baseline: 70, target: 80, actual: 78, direction: 'increase' },
        { id: '2', name: 'New Infections Rate (per 1k)', baseline: 5.0, target: 3.5, actual: 4.2, direction: 'decrease' }
      ],
      narrative: "Good progress achieved in Q1 with strong community engagement and effective medication procurement."
    },
    r2: {
      id: 'r2',
      programme: 'Primary Healthcare Program',
      year: '2024/25',
      quarter: 'Quarter 1',
      submittedDate: '2024-07-12',
      status: 'Returned',
      actionSteps: {
        planned: "1. Establish 10 new primary care clinics.\n2. Train 50 healthcare workers.\n3. Procure medical equipment.",
        undertaken: "1. Established 8 new clinics.\n2. Trained 45 healthcare workers.\n3. Equipment procurement delayed."
      },
      budget: {
        opAllocated: 2000000,
        devAllocated: 5000000,
        opSpent: 1800000,
        devSpent: 3500000
      },
      indicators: [
        { id: '1', name: 'Clinic Accessibility (%)', baseline: 60, target: 75, actual: 68, direction: 'increase' },
        { id: '2', name: 'Patient Wait Time (hrs)', baseline: 3.5, target: 2.0, actual: 2.8, direction: 'decrease' }
      ],
      narrative: "Some challenges with equipment procurement, but clinic establishment is proceeding well."
    }
  };

  // New Handlers for Auto-filling
  const handleProgrammeChange = (e) => {
    const prog = e.target.value;
    setSelectedProgramme(prog);
    if (prog && prog !== 'Choose...') {
      // Simulate intelligent auto-fill based on system logic
      // In a real app, this would fetch the next due report for this programme
      setSelectedYear('2024/25');
      setSelectedQuarter('Quarter 2');
    } else {
      setSelectedYear('');
      setSelectedQuarter('');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIndicatorChange = (id, value) => {
    setIndicators(prev => prev.map(indicator => {
      if (indicator.id === id) {
        const updated = { ...indicator, actual: value };
        const metrics = calculateMetrics(updated);
        return {
          ...updated,
          ...metrics
        };
      }
      return indicator;
    }));
  };

  const handleBudgetChange = (field, value) => {
    if (value === '') {
      setBudget(prev => ({ ...prev, [field]: '' }));
      return;
    }
    setBudget(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  // Budget Calculations
  const totalAllocated = budget.opAllocated + budget.devAllocated;
  const totalSpent = (typeof budget.opSpent === 'number' ? budget.opSpent : 0) + (typeof budget.devSpent === 'number' ? budget.devSpent : 0);
  const opExecution = typeof budget.opSpent === 'number' ? (budget.opSpent / budget.opAllocated) * 100 : 0;
  const devExecution = typeof budget.devSpent === 'number' ? (budget.devSpent / budget.devAllocated) * 100 : 0;
  const totalExecution = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const formatCurrency = (amount) => {
    if (amount === '') return '';
    return new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(amount);
  };

  // File upload handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting report:', { formData, indicators, uploadedFiles });
    alert('Report submitted successfully!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'status-approved';
      case 'Submitted': return 'status-submitted';
      case 'Returned': return 'status-returned';
      default: return 'status-draft';
    }
  };

  // Modal handlers
  const handleViewReport = (reportId) => {
    setSelectedReport(mockDetailedReports[reportId] || null);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditReport = (reportId) => {
    setSelectedReport(mockDetailedReports[reportId] || null);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

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
          <a href="/omaDashboard" className="nav-item">
            <FiHome className="nav-icon" />
            Dashboard
          </a>
          <a href="/project-submission" className="nav-item">
            <FiFileText className="nav-icon" />
            Planning
          </a>
          <a href="/reports" className="nav-item active">
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
            <div className="user-avatar">{user?.ministry?.charAt(0) || 'M'}</div>
            <div className="user-details">
              <div className="user-name">{user?.ministry || 'Ministry of Health'}</div>
              <div className="user-role">OMA User</div>
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
            <h1>Reports Management</h1>
            <p>Create new quarterly reports or view historical submissions.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div className="tab-container">
            <button 
              onClick={() => setActiveTab('create')}
              className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            >
              <FiPlus className="tab-icon" />
              Create New Report
            </button>
            <button 
              onClick={() => setActiveTab('view')}
              className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
            >
              <FiFolder className="tab-icon" />
              View Past Reports
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content reports-content">
          {activeTab === 'create' ? (
            <div className="create-report-container">
              <form onSubmit={handleSubmit} className="reports-form">
            {/* Header Selection */}
            <div className="report-header-card">
              <div className="header-selection-grid">
                <div className="form-group">
                  <label htmlFor="programme-select" className="input-label">Select Programme</label>
                  <select 
                    id="programme-select" 
                    value={selectedProgramme}
                    onChange={handleProgrammeChange}
                    className="form-input select-input"
                  >
                    <option value="">Choose a programme...</option>
                    {programmes.map(programme => (
                      <option key={programme} value={programme}>{programme}</option>
                    ))}
                  </select>
                  <p className="help-text">Selecting a programme auto-fills the reporting period.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="year-select" className="input-label">Reporting Year</label>
                  <input 
                    type="text" 
                    id="year-select" 
                    value={selectedYear} 
                    readOnly 
                    className="form-input auto-filled-input"
                    placeholder="Auto-filled"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quarter-select" className="input-label">Reporting Quarter</label>
                  <input 
                    type="text" 
                    id="quarter-select" 
                    value={selectedQuarter} 
                    readOnly 
                    className="form-input auto-filled-input"
                    placeholder="Auto-filled"
                  />
                </div>
              </div>
            </div>

            {selectedProgramme && (
              <>
            {/* SECTION 1: Action Steps (Project Performance) */}
            <div className="content-section action-steps-section">
              <div className="section-header">
                <h3>1. Action Steps (Project Performance)</h3>
              </div>
              <div className="action-steps-grid">
                <div className="planned-steps">
                  <label className="steps-label">Action Steps Planned (Reference)</label>
                  <div className="planned-content">
                    {actionSteps.planned}
                  </div>
                </div>
                <div className="undertaken-steps">
                  <label className="steps-label actual-label" htmlFor="actions-undertaken">Action Steps Undertaken (Actual)</label>
                  <textarea 
                    id="actions-undertaken" 
                    rows={5} 
                    value={actionSteps.undertaken}
                    onChange={(e) => setActionSteps({...actionSteps, undertaken: e.target.value})}
                    className="undertaken-textarea" 
                    placeholder="Describe the specific actions taken during this quarter to achieve the planned steps..."
                  ></textarea>
                  <div className="text-save-action">
                    <button type="button" className="save-text-btn">Save Action Steps</button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Budget Execution (Financial Performance) */}
            <div className="content-section budget-section">
              <div className="section-header">
                <h3>2. Budget Execution (Financial Performance)</h3>
              </div>
              <div className="budget-table-wrapper">
                <table className="budget-table">
                  <thead>
                    <tr>
                      <th className="budget-category-col">Budget Category</th>
                      <th className="allocated-col">Allocated Amount (N$)</th>
                      <th className="expenditure-col">Actual Expenditure (N$)</th>
                      <th className="execution-col">% Execution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="budget-category">Operational Budget</td>
                      <td className="allocated-amount">{formatCurrency(budget.opAllocated)}</td>
                      <td className="expenditure-input">
                        <input 
                          type="number" 
                          value={budget.opSpent}
                          onChange={(e) => handleBudgetChange('opSpent', e.target.value)}
                          className="budget-input"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="execution-percentage">
                        {typeof budget.opSpent === 'number' ? `${opExecution.toFixed(1)}%` : '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="budget-category">Development (Capital) Budget</td>
                      <td className="allocated-amount">{formatCurrency(budget.devAllocated)}</td>
                      <td className="expenditure-input">
                        <input 
                          type="number" 
                          value={budget.devSpent}
                          onChange={(e) => handleBudgetChange('devSpent', e.target.value)}
                          className="budget-input"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="execution-percentage">
                         {typeof budget.devSpent === 'number' ? `${devExecution.toFixed(1)}%` : '--'}
                      </td>
                    </tr>
                    <tr className="total-row">
                      <td className="budget-category total">TOTAL</td>
                      <td className="allocated-amount total">{formatCurrency(totalAllocated)}</td>
                      <td className="total-spent">{formatCurrency(totalSpent)}</td>
                      <td className={`execution-percentage total ${totalExecution > 100 ? 'over-budget' : ''}`}>
                        {totalExecution.toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: Indicator Performance (Quarterly Actuals) */}
            <div className="content-section indicators-section">
              <div className="section-header">
                <h3>3. Indicator Performance (Quarterly Actuals)</h3>
                <p className="auto-save-note">* Inputs are automatically saved</p>
              </div>
              
              <div className="indicators-table-wrapper">
                <table className="indicators-table">
                  <thead>
                    <tr>
                      <th className="readonly-column">Indicator Name</th>
                      <th className="readonly-column">Baseline</th>
                      <th className="readonly-column">Target</th>
                      <th className="active-column">Actual</th>
                      <th className="readonly-column">Achievement</th>
                      <th className="readonly-column">Variance</th>
                      <th className="readonly-column">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indicators.map((indicator) => {
                      const metrics = calculateMetrics(indicator);
                      return (
                        <tr key={indicator.id}>
                          <td className="readonly-column indicator-name">
                            {indicator.name}
                          </td>
                          <td className="readonly-column numeric-cell">
                            {indicator.baseline}
                          </td>
                          <td className="readonly-column numeric-cell target-cell">
                            <span className="target-value">{indicator.target}</span>
                            <span className="direction-arrow">
                              {indicator.direction === 'increase' ? '↑' : '↓'}
                            </span>
                          </td>
                          <td className="active-column">
                            <input
                              type="number"
                              step="0.1"
                              value={indicator.actual}
                              onChange={(e) => handleIndicatorChange(indicator.id, e.target.value)}
                              className="actual-input"
                              placeholder="Enter..."
                            />
                          </td>
                          <td className="readonly-column numeric-cell">
                            {metrics.achievement !== '--' ? (
                              <span className={`achievement-value ${metrics.status}`}>
                                {metrics.achievement}%
                              </span>
                            ) : (
                              <span className="achievement-value empty">--</span>
                            )}
                          </td>
                          <td className="readonly-column numeric-cell">
                            <span className={`variance-value ${
                              metrics.variance !== '--' 
                                ? (parseFloat(metrics.variance) === 0 ? 'neutral' :
                                   indicator.direction === 'increase' 
                                    ? (parseFloat(metrics.variance) > 0 ? 'positive' : 'negative')
                                    : (parseFloat(metrics.variance) < 0 ? 'positive' : 'negative'))
                                : 'neutral'
                            }`}>
                              {metrics.variance !== '--' 
                                ? `${parseFloat(metrics.variance) > 0 ? '+' : ''}${metrics.variance}`
                                : '--'}
                            </span>
                          </td>
                          <td className="readonly-column">
                            <span className={`status-indicator ${metrics.status}`}>
                              <span>
                                {metrics.status === 'success' && '🟢'}
                                {metrics.status === 'warning' && '🟡'}
                                {metrics.status === 'danger' && '🔴'}
                                {metrics.status === 'pending' && '○'}
                              </span>
                              {metrics.status === 'success' && 'On Track'}
                              {metrics.status === 'warning' && 'Attention'}
                              {metrics.status === 'danger' && 'Off Track'}
                              {metrics.status === 'pending' && 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Direction Legend */}
              <div className="direction-legend">
                <div className="legend-item">
                  <span className="legend-badge">Target ↑</span>
                  <div className="legend-content">
                    <span className="legend-title">Direction</span>
                    <span className="legend-description">Arrow indicates if the goal is to increase (↑) or decrease (↓) the value.</span>
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-icon">🟢</div>
                  <div className="legend-content">
                    <span className="legend-title">Success</span>
                    <span className="legend-description">Achievement ≥ 95% of the planned target.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative/Comments Card */}
            <div className="content-section narrative-section">
              <h3>Narrative / Comments</h3>
              <textarea
                placeholder="Explain any variances, challenges, or successes for this reporting period..."
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="narrative-textarea"
                rows={6}
              />
              <div className="text-save-action">
                <button type="button" className="save-text-btn">Save Narrative</button>
              </div>
            </div>

            {/* Upload Supporting Evidence Card */}
            <div className="content-section upload-section">
              <h3>Upload Supporting Evidence</h3>
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FiUpload className="upload-icon" />
                <p>Click to upload or drag and drop</p>
                <span>PDF, Word, Excel, or images</span>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" 
                  className="file-input"
                  onChange={handleFileInput}
                />
              </div>
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  <h4>Uploaded Files:</h4>
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="file-item">
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">({formatFileSize(file.size)})</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="remove-file-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

                {/* Submit Action */}
                <div className="report-actions">
                  <div className="auto-save-indicator">
                    <span className="auto-save-text">✓ All changes are automatically saved</span>
                  </div>
                  <button type="submit" className="btn btn-primary submit-btn">Submit Report</button>
                </div>
              </>
            )}
            
            {!selectedProgramme && (
              <div className="empty-state">
                <p className="empty-state-message">Please select a programme above to begin your quarterly report.</p>
              </div>
            )}
          </form>
          </div>
        ) : (
          /* View Past Reports Tab */
          <div className="view-reports-container">
            <div className="reports-card">
              <div className="reports-card-header">
                <h3 className="reports-title">Past Report History</h3>
                <div className="search-container">
                  <FiSearch className="search-icon" />
                  <input type="text" className="search-input" placeholder="Search reports..." />
                </div>
              </div>
              
              <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Programme</th>
                    <th>Period</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastReports.map((report) => (
                    <tr key={report.id}>
                      <td className="programme-name">{report.programme}</td>
                      <td>{report.year} - {report.quarter}</td>
                      <td>{report.submittedDate}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn" 
                            title="View Report"
                            onClick={() => handleViewReport(report.id)}
                          >
                            <FiEye />
                          </button>
                          {(report.status === 'Draft' || report.status === 'Returned') && (
                            <button 
                              className="action-btn edit-btn" 
                              title="Edit Report"
                              onClick={() => handleEditReport(report.id)}
                            >
                              <FiEdit3 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}
        </div>
        
        {/* Report Modal */}
        {modalOpen && selectedReport && (
          <ReportModal 
            report={selectedReport}
            mode={modalMode}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

// ReportModal Component
const ReportModal = ({ report, mode, onClose }) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [editableReport, setEditableReport] = useState(report);

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving report:', editableReport);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDownloadPDF = () => {
    try {
      console.log('PDF Download button clicked!');
      console.log('Generating PDF for report:', editableReport);
      
      // Simple test to check if jsPDF works
      if (typeof window !== 'undefined') {
        generateReportPDF(editableReport);
        console.log('PDF generation completed successfully');
      } else {
        console.error('Window object not available');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(amount);
  };

  const calculateAchievement = (actual, target, direction) => {
    if (direction === 'increase') {
      return (actual / target) * 100;
    } else {
      return (target / actual) * 100;
    }
  };

  const getStatus = (achievementRate) => {
    if (achievementRate >= 95) {
      return { label: "On Track", color: "text-green-700 bg-green-100 border border-green-200", icon: "🟢" };
    } else if (achievementRate >= 80) {
      return { label: "Attention", color: "text-amber-700 bg-amber-100 border border-amber-200", icon: "🟡" };
    } else {
      return { label: "Off Track", color: "text-red-700 bg-red-100 border border-red-200", icon: "🔴" };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">
              {isEditing ? 'Edit Report' : 'View Report'}: {report.programme}
            </h2>
            <p className="modal-subtitle">{report.year} - {report.quarter}</p>
          </div>
          <div className="modal-actions">
            <button onClick={handleDownloadPDF} className="modal-download-btn">
              <FiDownload className="w-4 h-4" />
              Download PDF
            </button>
            {!isEditing && (report.status === 'Draft' || report.status === 'Returned') && (
              <button onClick={handleEdit} className="modal-edit-btn">
                <FiEdit3 className="w-4 h-4" />
                Edit
              </button>
            )}
            {isEditing && (
              <button onClick={handleSave} className="modal-save-btn">
                <FiCheckCircle className="w-4 h-4" />
                Save
              </button>
            )}
            <button onClick={onClose} className="modal-close-btn">
              ✕
            </button>
          </div>
        </div>

        <div className="modal-content">
          {/* Action Steps Section */}
          <div className="content-section action-steps-section modal-section-spacing">
            <div className="section-header">
              <h3>1. Action Steps (Project Performance)</h3>
            </div>
            <div className="action-steps-grid">
              <div className="planned-steps">
                <label className="steps-label">Action Steps Planned (Reference)</label>
                <div className="planned-content">{editableReport.actionSteps.planned}</div>
              </div>
              <div className="undertaken-steps">
                <label className="steps-label actual-label">Action Steps Undertaken (Actual)</label>
                {isEditing ? (
                  <>
                    <textarea
                      value={editableReport.actionSteps.undertaken}
                      onChange={(e) => setEditableReport({
                        ...editableReport,
                        actionSteps: { ...editableReport.actionSteps, undertaken: e.target.value }
                      })}
                      className="undertaken-textarea"
                      rows={4}
                      placeholder="Describe the specific actions taken during this quarter to achieve the planned steps..."
                    />
                    <div className="text-save-action">
                      <button type="button" className="save-text-btn">Save Action Steps</button>
                    </div>
                  </>
                ) : (
                  <div className="undertaken-content">{editableReport.actionSteps.undertaken}</div>
                )}
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="content-section budget-section modal-section-spacing">
            <div className="section-header">
              <h3>2. Budget Execution (Financial Performance)</h3>
            </div>
            <div className="budget-table-wrapper">
              <table className="budget-table">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="budget-category-col">Budget Category</th>
                    <th className="allocated-col">Allocated Amount (N$)</th>
                    <th className="expenditure-col">Actual Expenditure (N$)</th>
                    <th className="execution-col">% Execution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="budget-category">Operational Budget</td>
                    <td className="allocated-amount">{formatCurrency(editableReport.budget.opAllocated)}</td>
                    <td className="expenditure-input">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editableReport.budget.opSpent}
                          onChange={(e) => setEditableReport({
                            ...editableReport,
                            budget: { ...editableReport.budget, opSpent: parseFloat(e.target.value) }
                          })}
                          className="budget-input"
                          placeholder="0.00"
                        />
                      ) : (
                        formatCurrency(editableReport.budget.opSpent)
                      )}
                    </td>
                    <td className="execution-percentage">
                      {((editableReport.budget.opSpent / editableReport.budget.opAllocated) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="budget-category">Development (Capital) Budget</td>
                    <td className="allocated-amount">{formatCurrency(editableReport.budget.devAllocated)}</td>
                    <td className="expenditure-input">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editableReport.budget.devSpent}
                          onChange={(e) => setEditableReport({
                            ...editableReport,
                            budget: { ...editableReport.budget, devSpent: parseFloat(e.target.value) }
                          })}
                          className="budget-input"
                          placeholder="0.00"
                        />
                      ) : (
                        formatCurrency(editableReport.budget.devSpent)
                      )}
                    </td>
                    <td className="execution-percentage">
                      {((editableReport.budget.devSpent / editableReport.budget.devAllocated) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="total-row">
                    <td className="budget-category total">TOTAL</td>
                    <td className="allocated-amount total">{formatCurrency(editableReport.budget.opAllocated + editableReport.budget.devAllocated)}</td>
                    <td className="total-spent">{formatCurrency(editableReport.budget.opSpent + editableReport.budget.devSpent)}</td>
                    <td className={`execution-percentage total ${(((editableReport.budget.opSpent + editableReport.budget.devSpent) / (editableReport.budget.opAllocated + editableReport.budget.devAllocated)) * 100) > 100 ? 'over-budget' : ''}`}>
                      {(((editableReport.budget.opSpent + editableReport.budget.devSpent) / (editableReport.budget.opAllocated + editableReport.budget.devAllocated)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Indicators Section */}
          <div className="content-section indicators-section modal-section-spacing">
            <div className="section-header">
              <h3>3. Indicator Performance (Quarterly Actuals)</h3>
              <p className="auto-save-note">* Inputs are automatically saved</p>
            </div>
            
            <div className="indicators-table-wrapper">
              <table className="indicators-table">
                <thead>
                  <tr>
                    <th className="readonly-column">Indicator Name</th>
                    <th className="readonly-column">Baseline</th>
                    <th className="readonly-column">Target</th>
                    <th className="active-column">Actual</th>
                    <th className="readonly-column">Achievement</th>
                    <th className="readonly-column">Variance</th>
                    <th className="readonly-column">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {editableReport.indicators.map((indicator) => {
                    const achievement = calculateAchievement(indicator.actual, indicator.target, indicator.direction);
                    const status = getStatus(achievement);
                    const variance = indicator.actual - indicator.target;
                    
                    return (
                      <tr key={indicator.id}>
                        <td className="readonly-column indicator-name">
                          {indicator.name}
                        </td>
                        <td className="readonly-column numeric-cell">
                          {indicator.baseline}
                        </td>
                        <td className="readonly-column numeric-cell target-cell">
                          <span className="target-value">{indicator.target}</span>
                          <span className="direction-arrow">
                            {indicator.direction === 'increase' ? '↑' : '↓'}
                          </span>
                        </td>
                        <td className="active-column">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={indicator.actual}
                              onChange={(e) => {
                                const newIndicators = editableReport.indicators.map(ind =>
                                  ind.id === indicator.id ? { ...ind, actual: parseFloat(e.target.value) } : ind
                                );
                                setEditableReport({ ...editableReport, indicators: newIndicators });
                              }}
                              className="indicator-input"
                              placeholder="0"
                            />
                          ) : (
                            <span className="numeric-cell actual-value">{indicator.actual}</span>
                          )}
                        </td>
                        <td className="readonly-column numeric-cell achievement-cell">
                          <span className={`achievement-percent ${status.label.toLowerCase().replace(' ', '-')}`}>
                            {achievement.toFixed(1)}%
                          </span>
                        </td>
                        <td className="readonly-column numeric-cell variance-cell">
                          <span className={`variance ${variance >= 0 ? 'positive' : 'negative'}`}>
                            {variance >= 0 ? '+' : ''}{variance.toFixed(1)}
                          </span>
                        </td>
                        <td className="readonly-column">
                          <span className={`status-indicator ${status.label === 'On Track' ? 'success' : status.label === 'At Risk' ? 'warning' : 'danger'}`}>
                            <span>
                              {status.label === 'On Track' && '🟢'}
                              {status.label === 'At Risk' && '🟡'}
                              {status.label === 'Off Track' && '🔴'}
                            </span>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Narrative Section */}
          <div className="content-section narrative-section modal-section-spacing">
            <div className="section-header">
              <h3>4. Narrative / Comments</h3>
            </div>
            <div className="narrative-content">
              <label className="form-label">
                Provide context for any variances, challenges faced, or key successes:
              </label>
              {isEditing ? (
                <textarea
                  value={editableReport.narrative}
                  onChange={(e) => setEditableReport({ ...editableReport, narrative: e.target.value })}
                  className="form-textarea"
                  rows={4}
                  placeholder="Explain any variances, challenges, or successes..."
                />
              ) : (
                <div className="narrative-display">
                  {editableReport.narrative || 'No narrative provided.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;