const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const supabase = require('../config/supabaseClient');

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
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

        const payload = {
            user_id: req.user.id || null,
            organisation_id: req.user.organisation_id || null,
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
