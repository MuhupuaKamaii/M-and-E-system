const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// POST /api/admin/create-user
router.post("/create-user", async (req, res) => {
  let { full_name, username, password, role_id, organisation_id } = req.body;

  role_id = Number(role_id);
  organisation_id = organisation_id ? Number(organisation_id) : null;

  if (!full_name || !username || !password || !role_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Only organisation required for OMA
  if (role_id === 3 && !organisation_id) {
    return res.status(400).json({ message: "Organisation required for OMA role" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{
        full_name,
        username,
        password_hash,
        role_id,
        organisation_id: role_id === 3 ? organisation_id : null,
        focus_area_id: null     // <<< always null!
      }]);

    if (error) return res.status(400).json({ message: error.message });

    res.json({
      message: "User created successfully",
      plain_password: password,
      user: data[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
