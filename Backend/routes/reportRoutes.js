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
