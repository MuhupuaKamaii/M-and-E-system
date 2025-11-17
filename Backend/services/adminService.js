// services/adminService.js
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createUser({ full_name, username, password, role_id, organisation_id, focus_area_id }) {
  // organisation exist check only if provided
  if (organisation_id) {
    const { data: org } = await supabase
      .from('organisations')
      .select('*')
      .eq('organisation_id', organisation_id)
      .single();
    if (!org) throw new Error('Organisation does not exist');
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      full_name,
      username,
      password_hash,
      role_id,
      organisation_id: organisation_id || null,
      focus_area_id: focus_area_id || null
    }])
    .select("user_id, full_name, username, role_id, organisation_id, focus_area_id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { createUser };
