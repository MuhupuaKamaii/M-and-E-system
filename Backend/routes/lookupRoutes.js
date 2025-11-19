const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const supabase = require('../config/supabaseClient');

// Get all focus areas
router.get('/focus-areas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('focus_area')
            .select('*');

        if (error) throw error;
        res.json({ focusAreas: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get focus areas filtered by organisation ID
router.get('/focus-areas/:organisationId', async (req, res) => {
    try {
        const organisationId = parseInt(req.params.organisationId);
        const { data, error } = await supabase
            .from('focus_area')
            .select('*')
            .eq('organisation_id', organisationId);

        if (error) throw error;
        res.json({ focusAreas: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all pillars
router.get('/pillars', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pillar')
            .select('*');

        if (error) throw error;
        res.json({ pillars: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all programmes
router.get('/programmes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('programme')
            .select('*');

        if (error) throw error;
        res.json({ programmes: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all strategies
router.get('/strategies', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('strategy')
            .select('*');

        if (error) throw error;
        res.json({ strategies: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all themes
router.get('/themes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('theme')
            .select('*');

        if (error) throw error;
        res.json({ themes: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all organisations
router.get('/organisations', async (req, res) => {
    try {
        const { data, error } = await supabase.from('organisation').select('*');
        if (error) throw error;
        res.json({ organisations: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
