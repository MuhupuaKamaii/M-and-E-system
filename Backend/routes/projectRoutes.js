const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

// Create a new project
router.post('/', async (req, res) => {
    try {
        const {
            start_date,
            expected_end_date,
            focus_area_id,
            pillar_id,
            programme_id,
            strategy_id,
            theme_id,
            project_title,
            budget
        } = req.body;

        let created_by = null;
        let organisation_id = null;

        // If an Authorization header is present, try to verify and fetch the user.
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_id', decoded.user_id)
                    .single();
                if (!error && user) {
                    created_by = user.user_id; // Use user_id as created_by
                    organisation_id = user.organisation_id || null;
                }
            } catch (e) {
                console.log('Token verification failed:', e.message);
            }
        }

        const payload = {
            created_by, // Changed from user_id to created_by
            organisation_id,
            start_date,
            expected_end_date,
            focus_area_id,
            pillar_id,
            programme_id,
            strategy_id,
            theme_id,
            project_title,
            budget,
            status: 'active',
            created_at: new Date().toISOString()
        };

        console.log('Inserting project with payload:', payload);

        const { data, error } = await supabase
            .from('projects')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ message: error.message });
        }

        res.json({ message: 'Project created', project: data });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get user's submitted projects
router.get('/my-projects', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    
    console.log('Fetching projects for user:', userId);

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Found projects:', projects?.length);

    res.json({ projects: projects || [] });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

module.exports = router;