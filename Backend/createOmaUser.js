require('dotenv').config();

const supabase = require("./config/supabaseClient");
const bcrypt = require("bcrypt");

async function createOmaUser() {
  try {
    const full_name = "OMA User";
    const username = "oma";
    const plainPassword = "oma";
    const role_id = 2; // OMA role
    const organisation_id = null; // assign if known
    const focus_area_id = null; // assign if known

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(plainPassword, saltRounds);

    // Insert into users table
    const { data, error } = await supabase
      .from("users")
      .insert([{
        full_name,
        username,
        password_hash,
        role_id,
        organisation_id,
        focus_area_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating OMA user:", error.message);
      return;
    }

    console.log("OMA user created successfully:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

createOmaUser();
