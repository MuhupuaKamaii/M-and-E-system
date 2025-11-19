import { useState, useEffect } from 'react';

function TestForm() {
    const [formData, setFormData] = useState({
        start_date: '',
        expected_end_date: '',
        focus_area_id: '',
        organisation_id: '',
        pillar_id: '',
        programme_id: '',
        strategy_id: '',
        theme_id: '',
        submitted_by: '',
        email: '',
        contact_number: '',
        project_title: '',
        budget: ''
    });

    const [options, setOptions] = useState({
        focusAreas: [],
        organisations: [],
        pillars: [],
        programmes: [],
        strategies: [],
        themes: []
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // fetch lookup data
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        async function fetchLookups() {
            try {
                const paths = ['focus-areas', 'organisations', 'pillars', 'programmes', 'strategies', 'themes'];
                const results = {};

                await Promise.all(paths.map(async (p) => {
                    try {
                        const res = await fetch(`/api/lookups/${p}`, { headers });
                        if (!res.ok) {
                            console.warn(`Failed to fetch ${p}: ${res.status}`);
                            return;
                        }
                        const data = await res.json();
                        console.log(`Fetched ${p}:`, data);
                        // map returned key to results
                        if (p === 'focus-areas') results.focusAreas = data.focusAreas || [];
                        if (p === 'organisations') results.organisations = data.organisations || [];
                        if (p === 'pillars') results.pillars = data.pillars || [];
                        if (p === 'programmes') results.programmes = data.programmes || [];
                        if (p === 'strategies') results.strategies = data.strategies || [];
                        if (p === 'themes') results.themes = data.themes || [];
                    } catch (err) {
                        console.error(`Error fetching ${p}:`, err);
                    }
                }));

                setOptions(prev => ({ ...prev, ...results }));
            } catch (err) {
                console.error('Error fetching lookups', err);
            }
        }

        fetchLookups();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create project');

            setMessage({ type: 'success', text: data.message || 'Project created' });
            // reset minimal fields
            setFormData(prev => ({ ...prev, project_title: '', budget: '' }));
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Project Submission</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>
                        Start Date
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                    </label>

                    <label>
                        Expected End Date
                        <input type="date" name="expected_end_date" value={formData.expected_end_date} onChange={handleChange} required />
                    </label>

                    <label>
                        Focus Area
                        <select name="focus_area_id" value={formData.focus_area_id} onChange={handleChange}>
                            <option value="">-- Select Focus Area --</option>
                            {options.focusAreas.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Organisation
                        <select name="organisation_id" value={formData.organisation_id} onChange={handleChange}>
                            <option value="">-- Select Organisation --</option>
                            {options.organisations.map(o => (
                                <option key={o.id || o.organisation_id} value={o.id || o.organisation_id}>{o.name || o.organisation_name || o.organisation_id}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Pillar
                        <select name="pillar_id" value={formData.pillar_id} onChange={handleChange}>
                            <option value="">-- Select Pillar --</option>
                            {options.pillars.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Programme
                        <select name="programme_id" value={formData.programme_id} onChange={handleChange}>
                            <option value="">-- Select Programme --</option>
                            {options.programmes.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Strategy
                        <select name="strategy_id" value={formData.strategy_id} onChange={handleChange}>
                            <option value="">-- Select Strategy --</option>
                            {options.strategies.map(s => (
                                <option key={s.id} value={s.id}>{s.description || s.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Theme
                        <select name="theme_id" value={formData.theme_id} onChange={handleChange}>
                            <option value="">-- Select Theme --</option>
                            {options.themes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Submitted By
                        <input type="text" name="submitted_by" value={formData.submitted_by} onChange={handleChange} required />
                    </label>

                    <label>
                        Email
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>

                    <label>
                        Contact Number
                        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} />
                    </label>

                    <label style={{ gridColumn: '1 / -1' }}>
                        Project Title
                        <input type="text" name="project_title" value={formData.project_title} onChange={handleChange} required />
                    </label>

                    <label>
                        Budget
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange} />
                    </label>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
            </form>

            {message && (
                <div style={{ marginTop: '12px', color: message.type === 'error' ? 'red' : 'green' }}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default TestForm;