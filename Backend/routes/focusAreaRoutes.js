// backend/routes/focusAreaRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");

// Get all focus areas for this user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("focus_area")
      .select("*")
      .eq("organisation_id", req.user.organisation_id);

    if (error) throw error;

    res.json({ focusAreas: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get details for a specific focus area
router.get("/:focusAreaId/details", authMiddleware, async (req, res) => {
  const focusAreaId = parseInt(req.params.focusAreaId);

  try {
    const { data: focusArea, error } = await supabase
      .from("focus_area")
      .select(`
        id,
        name,
        theme:theme_id (id, name, pillar:pillar_id (id, name)),
        programmes:programme_id (id, name, strategies:strategy_id (id, description))
      `)
      .eq("id", focusAreaId)
      .eq("organisation_id", req.user.organisation_id)
      .single();

    if (error || !focusArea) {
      return res.status(404).json({ message: "Focus area not found" });
    }

    res.json(focusArea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
