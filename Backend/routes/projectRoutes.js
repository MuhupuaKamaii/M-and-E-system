const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

// Create a new project
// This route accepts optional auth: if a valid Bearer token is provided and matches a user,
// the project will be associated with that user and organisation. If no token or invalid
// token/user is provided the project will still be created with null user/organisation.
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
            submitted_by,
            email,
            contact_number,
            project_title,
            budget
        } = req.body;

        // Default payload values
        let user_id = null;
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
                    user_id = user.id;
                    organisation_id = user.organisation_id || null;
                }
            } catch (e) {
                // ignore token errors — we'll create project without user
            }
        }

        const payload = {
            user_id,
            organisation_id,
            start_date,
            expected_end_date,
            focus_area_id,
            pillar_id,
            programme_id,
            strategy_id,
            theme_id,
            submitted_by,
            email,
            contact_number,
            project_title,
            budget
        };

        const { data, error } = await supabase
            .from('projects')
            .insert([payload])
            .select()
            .single();

        if (error) return res.status(400).json({ message: error.message });

        res.json({ message: 'Project created', project: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
