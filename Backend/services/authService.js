// services/authService.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Login function
 * @param {string} username - The username input
 * @param {string} password - The password input
 * @returns {object} user info + JWT token
 */
async function login(username, password) {
  // Fetch user from Supabase, including role info
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      user_id,
      full_name,
      username,
      password_hash,
      role_id,
      roles(role_name),
      organisation_id,
      focus_area_id
    `)
    .eq('username', username)
    .single();

  if (error || !user) {
    throw new Error('User not found');
  }

  // Compare password with hashed password in DB
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Wrong password');
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.roles.role_name,
      organisation_id: user.organisation_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '5h' } // Token expires in 5 hours
  );

  // Return user data + token
  return {
    userId: user.user_id,
    fullName: user.full_name,
    role: user.roles.role_name,
    organisationId: user.organisation_id,
    focusAreaId: user.focus_area_id,
    token
  };
}

module.exports = { login };
