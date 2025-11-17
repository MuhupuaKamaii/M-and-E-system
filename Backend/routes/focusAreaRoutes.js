const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/focus-areas -> get all focus areas (role-based)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = supabase.from("focus_area").select("*");

    let data, error;

    // OMA (role_id = 2) → return ALL focus areas
    if (req.user.role_id === 2) {
      ({ data, error } = await query);
    } else {
      // Other users → only focus areas in their organisation
      ({ data, error } = await query.eq("organisation_id", req.user.organisation_id));
    }

    if (error) return res.status(400).json({ message: error.message });

    res.json({ focusAreas: data });
  } catch (err) {
    console.error("Fetch focus areas error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/focus-areas/:id/details
router.get("/:focusAreaId/details", authMiddleware, async (req, res) => {
  try {
    const focusAreaId = Number(req.params.focusAreaId);

    const { data: focusArea, error } = await supabase
      .from("focus_area")
      .select("*")
      .eq("focus_area_id", focusAreaId)
      .single();

    if (error || !focusArea) return res.status(404).json({ message: "Focus area not found" });

    // Access control: OMA can access all; others must match org
    if (req.user.role_id !== 2 && focusArea.organisation_id !== req.user.organisation_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(focusArea);
  } catch (err) {
    console.error("Focus area details error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
