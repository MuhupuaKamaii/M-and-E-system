import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Lock } from 'lucide-react';
import OmaSideNav from '../../components/layout/OmaSideNav';
import './QuarterlyReport.css';

const QuarterlyReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project, programme, focusArea, theme, pillar } = location.state || {};
  
  const [formData, setFormData] = useState({
    // Action Steps
    planned_steps: `1. Procure 50,000 units of ART medication.\n2. Hire 15 new community health workers for rural clinics.\n3. Conduct 3 regional training workshops on new protocols.`,
    undertaken_steps: '',
    
    // Budget Execution
    operational_budget_allocated: 1500000,
    operational_budget_spent: 0,
    development_budget_allocated: 3000000,
    development_budget_spent: 0,
    
    // Indicator Performance
    indicators: [
      {
        name: 'ART Coverage (%)',
        baseline: 70,
        target: 80,
        actual: '',
        higherIsBetter: true,
        unit: '%'
      },
      {
        name: 'New Infections Rate (per 1k)',
        baseline: 5,
        target: 3.5,
        actual: '',
        higherIsBetter: false,
        unit: ''
      },
      {
        name: 'Treatment Adherence (%)',
        baseline: 85,
        target: 90,
        actual: '',
        higherIsBetter: true,
        unit: '%'
      }
    ],
    
    // Narrative
    narrative: '',
    
    // Files
    evidence_files: []
  });

  const [saving, setSaving] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState('Quarter 2');
  const [currentYear, setCurrentYear] = useState('2024/25');

  // Calculate budget percentages
  const operationalExecution = formData.operational_budget_allocated > 0 
    ? (formData.operational_budget_spent / formData.operational_budget_allocated) * 100 
    : 0;

  const developmentExecution = formData.development_budget_allocated > 0 
    ? (formData.development_budget_spent / formData.development_budget_allocated) * 100 
    : 0;

  const totalAllocated = formData.operational_budget_allocated + formData.development_budget_allocated;
  const totalSpent = formData.operational_budget_spent + formData.development_budget_spent;
  const totalExecution = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  // Calculate indicator achievements
  const calculateAchievement = (indicator) => {
    if (!indicator.actual || indicator.actual === '') return null;
    const actual = parseFloat(indicator.actual);
    const target = indicator.target;
    
    if (indicator.higherIsBetter) {
      return (actual / target) * 100;
    } else {
      return ((target - Math.max(0, actual - target)) / target) * 100;
    }
  };

  const getStatus = (achievement) => {
    if (achievement === null) return 'pending';
    return achievement >= 95 ? 'success' : achievement >= 80 ? 'warning' : 'danger';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Report saved successfully!');
    } catch (error) {
      alert('Error saving report');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      evidence_files: [...prev.evidence_files, ...files.map(file => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        file: file
      }))]
    }));
  };

  if (!project) {
    return (
      <div className="dashboard-layout">
        <OmaSideNav />
        <div className="dashboard-main">
          <div className="error-state">
            <h2>No project selected</h2>
            <p>Please select a project from the project submission form.</p>
            <button onClick={() => navigate('/project-submission')}>
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <OmaSideNav />
      
      <div className="dashboard-main">
        <div className="report-container">
          <div className="report-header">
            <button className="back-btn" onClick={() => navigate('/project-submission')}>
              <ArrowLeft size={16} />
              Back to Projects
            </button>
            <h1>Quarterly Performance Report</h1>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Report'}
            </button>
          </div>

          {/* LOCKED PROGRAMME INFORMATION */}
          <div className="locked-info-section">
            <div className="locked-info-grid">
              <div className="locked-field">
                <label>Programme</label>
                <div className="locked-value">
                  <Lock size={14} />
                  {programme?.name || 'National HIV/AIDS Response'}
                </div>
              </div>
              <div className="locked-field">
                <label>Year</label>
                <div className="locked-value">
                  <Lock size={14} />
                  {currentYear}
                </div>
              </div>
              <div className="locked-field">
                <label>Quarter</label>
                <div className="locked-value">
                  <Lock size={14} />
                  {currentQuarter}
                </div>
              </div>
              <div className="locked-field">
                <label>Project</label>
                <div className="locked-value">
                  <Lock size={14} />
                  {project.project_title}
                </div>
              </div>
            </div>
          </div>

          {/* 1. ACTION STEPS SECTION */}
          <div className="report-section">
            <h2>1. Action Steps (Project Performance)</h2>
            
            <div className="action-steps-grid">
              <div className="planned-steps">
                <h3>Action Steps Planned (Reference)</h3>
                <div className="locked-value large">
                  <Lock size={14} />
                  <pre>{formData.planned_steps}</pre>
                </div>
              </div>
              
              <div className="undertaken-steps">
                <h3>Action Steps Undertaken (Actual)</h3>
                <textarea
                  value={formData.undertaken_steps}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    undertaken_steps: e.target.value
                  }))}
                  placeholder="Describe the specific actions taken during this quarter to achieve the planned steps..."
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* 2. BUDGET EXECUTION SECTION */}
          <div className="report-section">
            <h2>2. Budget Execution (Financial Performance)</h2>
            
            <div className="budget-table">
              <table>
                <thead>
                  <tr>
                    <th>Budget Category</th>
                    <th>Allocated Amount (N$)</th>
                    <th>Actual Expenditure (N$)</th>
                    <th>% Execution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Operational Budget</td>
                    <td className="allocated">N$ {formData.operational_budget_allocated.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        value={formData.operational_budget_spent}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          operational_budget_spent: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="0.00"
                      />
                    </td>
                    <td className={`execution ${operationalExecution >= 80 ? 'good' : operationalExecution >= 50 ? 'warning' : 'poor'}`}>
                      {operationalExecution.toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td>Development (Capital) Budget</td>
                    <td className="allocated">N$ {formData.development_budget_allocated.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        value={formData.development_budget_spent}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          development_budget_spent: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="0.00"
                      />
                    </td>
                    <td className={`execution ${developmentExecution >= 80 ? 'good' : developmentExecution >= 50 ? 'warning' : 'poor'}`}>
                      {developmentExecution.toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td><strong>N$ {totalAllocated.toLocaleString()}</strong></td>
                    <td><strong>N$ {totalSpent.toLocaleString()}</strong></td>
                    <td className={`execution ${totalExecution >= 80 ? 'good' : totalExecution >= 50 ? 'warning' : 'poor'}`}>
                      <strong>{totalExecution.toFixed(1)}%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. INDICATOR PERFORMANCE SECTION */}
          <div className="report-section">
            <div className="section-header">
              <h2>3. Indicator Performance (Quarterly Actuals)</h2>
              <span className="auto-save-note">* Inputs are automatically saved</span>
            </div>
            
            <div className="indicators-table">
              <table>
                <thead>
                  <tr>
                    <th>Indicator Name</th>
                    <th>Baseline</th>
                    <th>Target</th>
                    <th>Actual</th>
                    <th>Achievement</th>
                    <th>Variance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.indicators.map((indicator, index) => {
                    const achievement = calculateAchievement(indicator);
                    const status = getStatus(achievement);
                    const variance = indicator.actual ? 
                      (indicator.higherIsBetter ? 
                        parseFloat(indicator.actual) - indicator.target : 
                        indicator.target - parseFloat(indicator.actual)) : null;

                    return (
                      <tr key={index}>
                        <td className="indicator-name">{indicator.name}</td>
                        <td className="baseline">{indicator.baseline}{indicator.unit}</td>
                        <td className="target">
                          {indicator.target}{indicator.unit}
                          <span className="direction-arrow">
                            {indicator.higherIsBetter ? '↑' : '↓'}
                          </span>
                        </td>
                        <td className="actual">
                          <input
                            type="number"
                            value={indicator.actual}
                            onChange={(e) => {
                              const newIndicators = [...formData.indicators];
                              newIndicators[index].actual = e.target.value;
                              setFormData(prev => ({ ...prev, indicators: newIndicators }));
                            }}
                            placeholder="Enter..."
                            step="0.1"
                          />
                        </td>
                        <td className="achievement">
                          {achievement !== null ? `${achievement.toFixed(1)}%` : '--'}
                        </td>
                        <td className="variance">
                          {variance !== null ? 
                            `${variance > 0 ? '+' : ''}${variance.toFixed(1)}${indicator.unit}` : 
                            '--'
                          }
                        </td>
                        <td className="status">
                          <span className={`status-badge ${status}`}>
                            {status === 'success' && '🟢 Success'}
                            {status === 'warning' && '🟡 At Risk'}
                            {status === 'danger' && '🔴 Behind'}
                            {status === 'pending' && '⚪ Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="direction-legend">
              <div className="legend-item">
                <div className="legend-icon">↑</div>
                <div className="legend-content">
                  <span className="legend-title">Target ↑ Direction</span>
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

          {/* 4. NARRATIVE SECTION */}
          <div className="report-section">
            <h2>4. Narrative / Comments</h2>
            <textarea
              value={formData.narrative}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                narrative: e.target.value
              }))}
              placeholder="Explain any variances, challenges, or successes for this reporting period..."
              rows={4}
            />
          </div>

          {/* 5. EVIDENCE UPLOAD SECTION */}
          <div className="report-section">
            <h2>5. Upload Supporting Evidence</h2>
            <div className="upload-area">
              <Upload size={24} />
              <p>Click to upload or drag and drop</p>
              <span>PDF, Word, Excel, or images</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
            </div>

            {formData.evidence_files.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files:</h4>
                {formData.evidence_files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{file.size}</span>
                    <button 
                      className="remove-file"
                      onClick={() => {
                        const newFiles = formData.evidence_files.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, evidence_files: newFiles }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FINAL SAVE BUTTON */}
          <div className="report-actions">
            <button className="save-report-btn" onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving Report...' : 'Save Quarterly Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyReport;