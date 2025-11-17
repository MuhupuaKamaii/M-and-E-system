const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");

// Create new report (planning)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { focus_area_id, programme_id, strategies, description, target, comments, period } = req.body;

    // Validate focus area
    const { data: fa, error: faErr } = await supabase
      .from("focus_area")
      .select("focus_area_id, organisation_id")
      .eq("focus_area_id", focus_area_id)
      .single();

    if (faErr || !fa) return res.status(400).json({ message: "Focus area not found" });

    if (fa.organisation_id !== req.user.organisation_id && req.user.role_id !== 2 /* NPC */) {
      return res.status(403).json({ message: "You are not allowed to create a report for this focus area" });
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([{
        user_id: req.user.user_id,
        organisation_id: req.user.organisation_id,
        focus_area_id,
        programme_id,
        strategies,
        description,
        target,
        period,
        status: 'pending_planning',
        current_stage: 'planning'
      }])
      .select('*')
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Report created successfully", report: data });
  } catch (err) {
    console.error("create report error", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/mine -> OMA sees only their own reports
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id; // 🔹 make consistent with POST

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ reports: data });
  } catch (err) {
    console.error("Fetch my reports error", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
