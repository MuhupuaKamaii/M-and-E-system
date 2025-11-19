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
  FiUpload
} from 'react-icons/fi';
import '../../Styles/Dashboard.css';

const Reports = () => {
  const { user, logout } = useAuth();
  
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
          <a href="/dashboard" className="nav-item">
            <FiHome className="nav-icon" />
            Dashboard
          </a>
          <a href="/forms" className="nav-item">
            <FiFileText className="nav-icon" />
            Forms
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
            <h1>Reports: Execution Tracking</h1>
            <p>Submit quarterly reports with actuals against your planned targets.</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          <div className="content-section programmes-section">
            <form onSubmit={handleSubmit} className="reports-form">
            {/* Form Controls Card */}
            <div className="content-section report-controls-section">
              <div className="form-controls">
                <div className="form-group">
                  <label htmlFor="programme">Programme</label>
                  <select 
                    id="programme"
                    value={formData.programme}
                    onChange={(e) => handleInputChange('programme', e.target.value)}
                    className="form-select"
                  >
                    {programmes.map(programme => (
                      <option key={programme} value={programme}>{programme}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <select 
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="form-select"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quarter">Quarter</label>
                  <select 
                    id="quarter"
                    value={formData.quarter}
                    onChange={(e) => handleInputChange('quarter', e.target.value)}
                    className="form-select"
                  >
                    {quarters.map(quarter => (
                      <option key={quarter} value={quarter}>{quarter}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 1: Action Steps (Project Performance) */}
            <div className="content-section action-steps-section">
              <div className="section-header">
                <FiFolder className="section-icon" />
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
                </div>
              </div>
            </div>

            {/* SECTION 2: Budget Execution (Financial Performance) */}
            <div className="content-section budget-section">
              <div className="section-header">
                <FiDollarSign className="section-icon" />
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
                <h3><FiTarget className="inline-section-icon" /> 3. Indicator Performance (Quarterly Actuals)</h3>
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
                value={formData.narrative}
                onChange={(e) => handleInputChange('narrative', e.target.value)}
                className="narrative-textarea"
                rows={6}
              />
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

            {/* Action Buttons */}
            <div className="report-actions">
              <button type="button" className="btn btn-secondary">Save Draft</button>
              <button type="submit" className="btn btn-primary">Submit Report</button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;