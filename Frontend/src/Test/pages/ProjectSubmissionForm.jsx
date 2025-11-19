import React, { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

const ProjectSubmissionForm = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
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

  // API base URL - adjust as needed
  const API_BASE_URL = 'http://localhost:4000/api';

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/proposals/makeproposals`, {
        method: "GET",
        headers: { Authorization:`Bearer ${localStorage.getItem('token')}`}
      });
      
      if (!response.ok) throw new Error('Failed to fetch form data');
      
      const data = await response.json();
      setPillars(data.pillars || []);
      setThemes(data.themes || []);
      setFocusAreas(data.focusAreas || []);
      setProgrammes(data.programmes || []);
      setStrategies(data.strategies || []);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit project');
      }

      const result = await response.json();
      alert('Project submitted successfully!');
      
      // Reset form
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
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Submission</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Expected End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expected_end_date"
                value={formData.expected_end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Pillar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pillar <span className="text-red-500">*</span>
              </label>
              <select
                name="pillar_id"
                value={formData.pillar_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Pillar --</option>
                {pillars.map(pillar => (
                  <option key={pillar.id} value={pillar.id}>
                    {pillar.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme <span className="text-red-500">*</span>
              </label>
              <select
                name="theme_id"
                value={formData.theme_id}
                onChange={handleChange}
                disabled={!formData.pillar_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">-- Select Theme --</option>
                {filteredThemes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Focus Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Area <span className="text-red-500">*</span>
              </label>
              <select
                name="focus_area_id"
                value={formData.focus_area_id}
                onChange={handleChange}
                disabled={!formData.theme_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">-- Select Focus Area --</option>
                {filteredFocusAreas.map(fa => (
                  <option key={fa.id} value={fa.id}>
                    {fa.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Programme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme <span className="text-red-500">*</span>
              </label>
              <select
                name="programme_id"
                value={formData.programme_id}
                onChange={handleProgrammeChange}
                disabled={!formData.focus_area_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">-- Select Programme --</option>
                {filteredProgrammes.map(programme => (
                  <option key={programme.id} value={programme.id}>
                    {programme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strategy <span className="text-red-500">*</span>
              </label>
              <select
                name="strategy_id"
                value={formData.strategy_id}
                onChange={handleChange}
                disabled={!formData.focus_area_id}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">-- Select Strategy --</option>
                {filteredStrategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project_title"
                value={formData.project_title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmissionForm;