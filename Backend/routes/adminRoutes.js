// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const supabase = require("../config/supabaseClient");

// POST /api/admin/create-user
router.post("/create-user", async (req, res) => {
  try {
    let { full_name, username, password, role_id, organisation_id, focus_area_id } = req.body;

    role_id = Number(role_id);
    organisation_id = organisation_id ? Number(organisation_id) : null;
    focus_area_id = focus_area_id ? Number(focus_area_id) : null;

    if (!full_name || !username || !password || !role_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // OMA must have org + focus area
    if (role_id === 3) {
      if (!organisation_id)
        return res.status(400).json({ message: "OMA must have organisation_id" });

      if (!focus_area_id)
        return res.status(400).json({ message: "OMA must have focus_area_id" });

      // ❗ VALIDATE focus area exists in DB
      const { data: fa, error: faErr } = await supabase
        .from("focus_area")
        .select("*")
        .eq("focus_area_id", focus_area_id)
        .eq("organisation_id", organisation_id)
        .single();

      if (faErr || !fa)
        return res.status(400).json({ message: "Invalid focus_area_id for this organisation" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const insertObj = {
      full_name,
      username,
      password_hash,
      role_id,
      organisation_id: role_id === 3 ? organisation_id : null,
      focus_area_id: role_id === 3 ? focus_area_id : null,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([insertObj])
      .select("*")
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({
      message: "User created successfully",
      plain_password: password,
      user: data,
    });

  } catch (err) {
    console.error("create-user error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
