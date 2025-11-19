import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, FileText, Eye } from 'lucide-react';
import OmaSideNav from '../../components/layout/OmaSideNav';
import '../pages/ProjectSubmissionForm.css';

const ProjectSubmissionForm = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const navigate = useNavigate();
  
  // Form data
  const [formData, setFormData] = useState({
    start_date: '',
    expected_end_date: '',
    pillar_id: '',
    theme_id: '',
    focus_area_id: '',
    programme_id: '',
    strategy_id: '',
    project_title: '',
    budget: ''
  });

  // Dropdown options
  const [pillars, setPillars] = useState([]);
  const [themes, setThemes] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [strategies, setStrategies] = useState([]);

  // Filtered options based on selections
  const [filteredThemes, setFilteredThemes] = useState([]);
  const [filteredFocusAreas, setFilteredFocusAreas] = useState([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState([]);
  const [filteredStrategies, setFilteredStrategies] = useState([]);

  // API base URL
  const API_BASE_URL = 'http://localhost:4000/api';

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }
    fetchInitialData();
    fetchSubmittedProjects();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching data with token:', token.substring(0, 20) + '...');

      const response = await fetch(`${API_BASE_URL}/proposals/makeproposals`, {
        method: "GET",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      setPillars(data.pillars || []);
      setThemes(data.themes || []);
      setFocusAreas(data.focusAreas || []);
      setProgrammes(data.programmes || []);
      setStrategies(data.strategies || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load form data. Please check if the backend server is running.');
      setLoading(false);
    }
  };

  const fetchSubmittedProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/projects/my-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmittedProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  // Handle authentication errors by redirecting to login
  const handleAuthError = (message) => {
    if (message.includes('session') || message.includes('token') || message.includes('log in')) {
      localStorage.removeItem('token');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  // Handle pillar selection - filters themes
  useEffect(() => {
    if (formData.pillar_id) {
      const filtered = themes.filter(theme => theme.pillar_id === parseInt(formData.pillar_id));
      setFilteredThemes(filtered);
      
      // Reset dependent fields
      setFormData(prev => ({
        ...prev,
        theme_id: '',
        focus_area_id: '',
        programme_id: '',
        strategy_id: ''
      }));
    } else {
      setFilteredThemes([]);
    }
  }, [formData.pillar_id, themes]);

  // Handle theme selection - filters focus areas
  useEffect(() => {
    if (formData.theme_id) {
      const filtered = focusAreas.filter(fa => fa.theme_id === parseInt(formData.theme_id));
      setFilteredFocusAreas(filtered);
      
      setFormData(prev => ({
        ...prev,
        focus_area_id: '',
        programme_id: '',
        strategy_id: ''
      }));
    } else {
      setFilteredFocusAreas([]);
    }
  }, [formData.theme_id, focusAreas]);

  // Handle focus area selection - filters programmes and strategies
  useEffect(() => {
    if (formData.focus_area_id) {
      const filtered = programmes.filter(p => p.focus_area_id === parseInt(formData.focus_area_id));
      setFilteredProgrammes(filtered);
      
      const selectedFocusArea = focusAreas.find(fa => fa.id === parseInt(formData.focus_area_id));
      if (selectedFocusArea && selectedFocusArea.strategy_id) {
        const filtered = strategies.filter(s => s.id === selectedFocusArea.strategy_id);
        setFilteredStrategies(filtered);
      }
      
      setFormData(prev => ({
        ...prev,
        programme_id: '',
        strategy_id: ''
      }));
    } else {
      setFilteredProgrammes([]);
      setFilteredStrategies([]);
    }
  }, [formData.focus_area_id, focusAreas, programmes, strategies]);

  // Auto-fill parent fields when programme is selected
  const handleProgrammeChange = (e) => {
    const programmeId = e.target.value;
    setFormData(prev => ({ ...prev, programme_id: programmeId }));

    if (programmeId) {
      const selectedProgramme = programmes.find(p => p.id === parseInt(programmeId));
      if (selectedProgramme) {
        const selectedFocusArea = focusAreas.find(fa => fa.id === selectedProgramme.focus_area_id);
        if (selectedFocusArea) {
          const selectedTheme = themes.find(t => t.id === selectedFocusArea.theme_id);
          
          setFormData(prev => ({
            ...prev,
            focus_area_id: selectedFocusArea.id.toString(),
            theme_id: selectedFocusArea.theme_id?.toString() || '',
            pillar_id: selectedFocusArea.pillar_id?.toString() || selectedTheme?.pillar_id?.toString() || '',
            strategy_id: selectedFocusArea.strategy_id?.toString() || ''
          }));
        }
      }
    }
  };

  // Handle navigation to quarterly report
  const handleViewReport = (project) => {
    navigate('/quarterly-report', { 
      state: { 
        project,
        programme: programmes.find(p => p.id === project.programme_id),
        focusArea: focusAreas.find(f => f.id === project.focus_area_id),
        theme: themes.find(t => t.id === project.theme_id),
        pillar: pillars.find(p => p.id === project.pillar_id)
      }
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Validate required fields
      const requiredFields = [
        'start_date', 'expected_end_date', 'pillar_id', 'theme_id', 
        'focus_area_id', 'programme_id', 'project_title'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Prepare data for submission
      const submissionData = {
        ...formData,
        budget: formData.budget === '' ? null : parseFloat(formData.budget),
        pillar_id: parseInt(formData.pillar_id),
        theme_id: parseInt(formData.theme_id),
        focus_area_id: parseInt(formData.focus_area_id),
        programme_id: parseInt(formData.programme_id),
        strategy_id: formData.strategy_id ? parseInt(formData.strategy_id) : null
      };

      console.log('Submitting data:', submissionData);

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Failed to submit project: ${response.status}`);
      }

      const result = await response.json();
      console.log('Submission successful:', result);
      
      alert('Project submitted successfully!');
      
      // Reset form and refresh projects list
      setFormData({
        start_date: '',
        expected_end_date: '',
        pillar_id: '',
        theme_id: '',
        focus_area_id: '',
        programme_id: '',
        strategy_id: '',
        project_title: '',
        budget: ''
      });
      
      fetchSubmittedProjects();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
      handleAuthError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  if (error) {
    handleAuthError(error);
    return (
      <div className="dashboard-layout">
        <OmaSideNav />
        <div className="dashboard-main">
          <div className="form-container">
            <div className="form-box">
              <div className="form-header">
                <div className="header-content">
                  <span>Error Loading Form</span>
                </div>
              </div>
              <div className="p-8">
                <div className="error-container">
                  <h2 className="error-title">Unable to Load Data</h2>
                  <p className="error-message">{error}</p>
                  {error.includes('log in') && (
                    <p className="text-blue-600 font-semibold">Redirecting to login page...</p>
                  )}
                  <div className="text-sm text-red-600 space-y-2">
                    <p><strong>To fix this:</strong></p>
                    <ol className="list-decimal list-inside">
                      <li>Start the backend server in a terminal:
                        <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs overflow-auto">
cd Backend
npm install
node server.js
                        </pre>
                      </li>
                      <li>Ensure the backend is running on <code className="bg-gray-200 px-1 rounded">http://localhost:4000</code></li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </div>
                <button
                  onClick={fetchInitialData}
                  className="submit-btn"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <OmaSideNav />
        <div className="dashboard-main">
          <div className="form-container flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading form data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <OmaSideNav />
      
      <div className="dashboard-main">
        <div className="form-container">
          <div className="form-box">
            
            {/* HEADER STRIP */}
            <div className="form-header">
              <div className="header-content">
                <span>Project Submission Form</span>
                <button 
                  className="view-reports-btn"
                  onClick={() => navigate('/reports')}
                >
                  <Eye size={16} />
                  View All Reports
                </button>
              </div>
            </div>

            {/* FORM BODY */}
            <div className="p-8 space-y-8">

              {/* SECTION: PROJECT TIMELINE */}
              <div className="form-section">
                <div className="section-title">
                  Project Timeline
                </div>
                <div className="section-body">
                  <div className="section-grid">
                    {/* Start Date */}
                    <div>
                      <label className="form-label">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>

                    {/* Expected End Date */}
                    <div>
                      <label className="form-label">
                        Expected End Date *
                      </label>
                      <input
                        type="date"
                        name="expected_end_date"
                        value={formData.expected_end_date}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PROJECT CLASSIFICATION */}
              <div className="form-section">
                <div className="section-title">
                  Project Classification
                </div>
                <div className="section-body">
                  <div className="section-grid">
                    {/* Pillar */}
                    <div>
                      <label className="form-label">
                        Pillar *
                      </label>
                      <select
                        name="pillar_id"
                        value={formData.pillar_id}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">-- Select Pillar --</option>
                        {pillars.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Theme */}
                    <div>
                      <label className="form-label">
                        Theme *
                      </label>
                      <select
                        name="theme_id"
                        value={formData.theme_id}
                        onChange={handleChange}
                        disabled={!filteredThemes.length}
                        className="form-select"
                        required
                      >
                        <option value="">-- Select Theme --</option>
                        {filteredThemes.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Focus Area */}
                    <div>
                      <label className="form-label">
                        Focus Area *
                      </label>
                      <select
                        name="focus_area_id"
                        value={formData.focus_area_id}
                        onChange={handleChange}
                        disabled={!filteredFocusAreas.length}
                        className="form-select"
                        required
                      >
                        <option value="">-- Select Focus Area --</option>
                        {filteredFocusAreas.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Programme */}
                    <div>
                      <label className="form-label">
                        Programme *
                      </label>
                      <select
                        name="programme_id"
                        value={formData.programme_id}
                        onChange={handleProgrammeChange}
                        disabled={!filteredProgrammes.length}
                        className="form-select"
                        required
                      >
                        <option value="">-- Select Programme --</option>
                        {filteredProgrammes.map(pg => (
                          <option key={pg.id} value={pg.id}>{pg.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Strategy */}
                    <div>
                      <label className="form-label">
                        Strategy
                      </label>
                      <select
                        name="strategy_id"
                        value={formData.strategy_id}
                        onChange={handleChange}
                        disabled={!filteredStrategies.length}
                        className="form-select"
                      >
                        <option value="">-- Select Strategy --</option>
                        {filteredStrategies.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PROJECT DETAILS */}
              <div className="form-section">
                <div className="section-title">
                  Project Details
                </div>
                <div className="section-body">
                  <div className="space-y-6">
                    {/* Project Title */}
                    <div>
                      <label className="form-label">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="project_title"
                        value={formData.project_title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter project title"
                        required
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="form-label">
                        Budget – N$
                      </label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter budget amount (optional)"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMITTED PROJECTS SECTION */}
              {submittedProjects.length > 0 && (
                <div className="form-section">
                  <div className="section-title">
                    <FileText size={16} />
                    Submitted Projects
                  </div>
                  <div className="section-body">
                    <div className="projects-grid">
                      {submittedProjects.map(project => (
                        <div key={project.id} className="project-card">
                          <div className="project-info">
                            <h4>{project.project_title}</h4>
                            <p className="project-meta">
                              {programmes.find(p => p.id === project.programme_id)?.name || 'Unknown Programme'}
                            </p>
                            <p className="project-date">
                              Started: {new Date(project.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="project-actions">
                            <button
                              onClick={() => handleViewReport(project)}
                              className="report-btn"
                            >
                              <FileText size={14} />
                              Quarterly Report
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="form-footer">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="submit-btn"
                >
                  {submitting ? "Submitting..." : "Submit Project"}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  * Required fields
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSubmissionForm;