// backend/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");

router.post("/", authMiddleware, async (req, res) => {
  const { focus_area_id, programme_id, strategies, description, target, comments } = req.body;

  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([{
        user_id: req.user.id,
        organisation_id: req.user.organisation_id,
        focus_area_id,
        programme_id,
        strategies, // array
        description,
        target,
        comments
      }]);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Report created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// GET /api/reports - list reports (public for now)
router.get('/', async (req, res) => {
  try {
    // attempt to include related focus_area and programme where available
    const { data, error } = await supabase
      .from('reports')
      .select('*, focus_area(*), programme(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase reports read error:', error);
      return res.status(500).json({ message: error.message });
    }

    res.json({ reports: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/analytics?groupBy=pillar|programme|oma&start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/analytics', async (req, res) => {
  try {
    const { groupBy } = req.query;
    const start = req.query.start ? new Date(req.query.start) : null;
    const end = req.query.end ? new Date(req.query.end) : null;

    // fetch reports with related focus_area -> theme -> pillar and programme
    const { data: reports, error } = await supabase
      .from('reports')
      .select(`id, created_at, organisation_id, organisation_name, programme:programme_id (id,name), focus_area:focus_area_id (id,name, theme:theme_id (id,name, pillar:pillar_id (id,name)))`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase reports read error:', error);
      return res.status(500).json({ message: error.message });
    }

    // filter by date range if provided
    const filtered = (reports || []).filter(r => {
      if (!r) return false;
      const ts = r.created_at ? new Date(r.created_at) : null;
      if (!ts) return true;
      if (start && ts < start) return false;
      if (end && ts > end) return false;
      return true;
    });

    // helper to month key
    const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;

    const groups = {};

    filtered.forEach(r => {
      const ts = r.created_at ? new Date(r.created_at) : new Date();
      let key = 'Unspecified';
      if (groupBy === 'programme') {
        key = (r.programme && r.programme.name) ? r.programme.name : (r.programme_id || 'Unspecified');
      } else if (groupBy === 'oma') {
        key = r.organisation_name || r.organisation_id || 'Unspecified';
      } else {
        // default/pillar
        key = (r.focus_area && r.focus_area.theme && r.focus_area.theme.pillar && r.focus_area.theme.pillar.name) ? r.focus_area.theme.pillar.name : (r.pillar || 'Unspecified');
      }

      if (!groups[key]) groups[key] = { total: 0, monthly: {}, samples: [] };
      groups[key].total += 1;
      const m = monthKey(ts);
      groups[key].monthly[m] = (groups[key].monthly[m] || 0) + 1;
      groups[key].samples.push({ id: r.id, created_at: r.created_at, programme: r.programme, focus_area: r.focus_area, organisation_id: r.organisation_id, organisation_name: r.organisation_name });
    });

    // produce simple series for each group
    const result = Object.entries(groups).map(([k, v]) => ({
      key: k,
      total: v.total,
      monthly: v.monthly,
      samples: v.samples.slice(0, 200)
    }));

    res.json({ groupBy: groupBy || 'pillar', results: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reports/seed - insert one dummy report for testing
// NOTE: seed endpoint removed — use client-side demo insertion for local graph previews
