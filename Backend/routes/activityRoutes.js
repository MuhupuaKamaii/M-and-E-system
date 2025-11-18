const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/user-activities - list activities, optional ?limit=50
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 200;
    const { data, error } = await supabase.from('user_activities').select('*').order('timestamp', { ascending: false }).limit(limit);
    if (error) {
      console.error('Supabase activity read error:', error);
      return res.status(500).json({ message: error.message });
    }
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
