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

  // Mock indicator data with auto-calculated progress
  const [indicators, setIndicators] = useState([
    {
      id: 1,
      name: 'ART Coverage (%)',
      target: 80,
      actual: 73,
      autoProgress: null
    },
    {
      id: 2,
      name: 'New Infections Rate (per 1k)',
      target: 3.5,
      actual: 3.6,
      autoProgress: null
    }
  ]);

  // Calculate auto-progress percentages
  React.useEffect(() => {
    const updatedIndicators = indicators.map(indicator => {
      let progress;
      if (indicator.name.includes('Rate') && indicator.actual > indicator.target) {
        // For rates, higher actual than target is negative progress
        progress = -Math.round(((indicator.actual - indicator.target) / indicator.target) * 100);
      } else {
        // For coverage, calculate normal progress
        progress = Math.round((indicator.actual / indicator.target) * 100);
      }
      return { ...indicator, autoProgress: progress };
    });
    setIndicators(updatedIndicators);
  }, []);

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

  const handleIndicatorChange = (id, field, value) => {
    setIndicators(prev => prev.map(indicator => {
      if (indicator.id === id) {
        const updated = { ...indicator, [field]: parseFloat(value) || 0 };
        
        // Recalculate auto-progress
        let progress;
        if (updated.name.includes('Rate') && updated.actual > updated.target) {
          progress = -Math.round(((updated.actual - updated.target) / updated.target) * 100);
        } else {
          progress = Math.round((updated.actual / updated.target) * 100);
        }
        updated.autoProgress = progress;
        
        return updated;
      }
      return indicator;
    }));
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

            {/* Quarterly Indicator Actuals Card */}
            <div className="content-section indicators-section">
              <h3>Quarterly Indicator Actuals</h3>
              <div className="indicators-table">
                <table>
                  <thead>
                    <tr>
                      <th>INDICATOR NAME</th>
                      <th>TARGET</th>
                      <th>ACTUAL</th>
                      <th>AUTO-PROGRESS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indicators.map(indicator => (
                      <tr key={indicator.id}>
                        <td className="indicator-name">{indicator.name}</td>
                        <td className="target-cell">
                          <input
                            type="number"
                            step="0.1"
                            value={indicator.target}
                            onChange={(e) => handleIndicatorChange(indicator.id, 'target', e.target.value)}
                            className="target-input"
                          />
                        </td>
                        <td className="actual-cell">
                          <div className="actual-input-container">
                            <input
                              type="number"
                              step="0.1"
                              value={indicator.actual}
                              onChange={(e) => handleIndicatorChange(indicator.id, 'actual', e.target.value)}
                              className="actual-input"
                            />
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ 
                                  width: `${Math.min(Math.abs(indicator.autoProgress), 100)}%`,
                                  backgroundColor: indicator.autoProgress >= 0 ? '#10b981' : '#ef4444'
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className={`auto-progress ${indicator.autoProgress >= 0 ? 'positive' : 'negative'}`}>
                          {indicator.autoProgress >= 0 ? '+' : ''}{indicator.autoProgress}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

            {/* Submit Button */}
            <div className="content-section form-actions">
              <button type="submit" className="submit-btn">
                Submit Report
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;