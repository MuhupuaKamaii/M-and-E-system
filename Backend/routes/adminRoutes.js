const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// POST /api/admin/create-user
router.post('/create-user', async (req, res) => {
  try {
    let { full_name, username, password, role_id, organisation_id } = req.body;

    role_id = Number(role_id);
    organisation_id = organisation_id ? Number(organisation_id) : null;

    if (!full_name || !username || !password || !role_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Only organisation required for OMA
    if (role_id === 3 && !organisation_id) {
      return res.status(400).json({ message: 'Organisation required for OMA role' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ full_name, username, password_hash, role_id, organisation_id: role_id === 3 ? organisation_id : null, focus_area_id: null }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ message: error.message });
    }

    const createdUser = data && data.length ? data[0] : null;

    // Log activity (best-effort)
    try {
      const performed_by = req.body.performed_by || 'Admin';
      const details = `Created user ${username} (role_id=${role_id})`;
      await supabase.from('user_activities').insert([{
        timestamp: new Date().toISOString(),
        user: performed_by,
        role: 'Admin',
        action: 'Create User',
        details,
        status: 'success'
      }]);
    } catch (logErr) {
      console.error('Activity log failed', logErr);
    }

    res.json({ message: 'User created successfully', plain_password: password, user: createdUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users - list users
router.get('/users', async (req, res) => {
  try {
    const { data: users, error: usersErr } = await supabase.from('users').select('*');
    if (usersErr) {
      console.error(usersErr);
      return res.status(500).json({ message: usersErr.message });
    }

    const { data: orgs } = await supabase.from('organisations').select('*');

    const mapped = (users || []).map((u) => ({
      id: u.id || u.user_id || null,
      full_name: u.full_name,
      username: u.username,
      role_id: u.role_id || u.role || null,
      role: (u.role && typeof u.role === 'string') ? u.role : (u.role_id === 1 ? 'Admin' : u.role_id === 2 ? 'NPC' : u.role_id === 3 ? 'OMA' : 'User'),
      organisation: orgs && u.organisation_id ? (orgs.find(o => (o.organisation_id || o.id) === u.organisation_id)?.name || null) : null,
      organisation_id: u.organisation_id || null,
    }));

    res.json({ users: mapped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/organisations - list organisations
router.get('/organisations', async (req, res) => {
  try {
    const { data, error } = await supabase.from('organisations').select('*').order('name', { ascending: true });
    if (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
    res.json({ organisations: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id - update user
router.put('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { full_name, username, role_id, organisation_id } = req.body;

  try {
    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (username !== undefined) updates.username = username;
    if (role_id !== undefined) updates.role_id = Number(role_id);
    if (organisation_id !== undefined) updates.organisation_id = organisation_id ? Number(organisation_id) : null;

    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select();
    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }

    // Log activity
    try {
      const performed_by = req.body.performed_by || 'Admin';
      const details = `Updated user id=${id}`;
      await supabase.from('user_activities').insert([{
        timestamp: new Date().toISOString(),
        user: performed_by,
        role: 'Admin',
        action: 'Update User',
        details,
        status: 'success'
      }]);
    } catch (logErr) {
      console.error('Activity log failed', logErr);
    }

    res.json({ message: 'User updated', user: data ? data[0] : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id - delete user
router.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { data, error } = await supabase.from('users').delete().eq('id', id).select();
    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
    // Log activity
    try {
      const performed_by = req.body.performed_by || 'Admin';
      const details = `Deleted user id=${id}`;
      await supabase.from('user_activities').insert([{
        timestamp: new Date().toISOString(),
        user: performed_by,
        role: 'Admin',
        action: 'Delete User',
        details,
        status: 'success'
      }]);
    } catch (logErr) {
      console.error('Activity log failed', logErr);
    }

    res.json({ message: 'User deleted', user: data ? data[0] : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;