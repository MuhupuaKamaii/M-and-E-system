// controllers/authController.js

const { login } = require('../services/authService');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Login controller
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function loginUser(req, res) {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Attempt to login using the service
    const userData = await login(username, password);

    // Send back user info + JWT token
    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: userData.userId,
        fullName: userData.fullName,
        role: userData.role,
        organisationId: userData.organisationId,
        focusAreaId: userData.focusAreaId,
        token: userData.token
      }
    });

    // Fire-and-forget: log successful login to user_activities table (best-effort)
    (async () => {
      try {
        await supabase.from('user_activities').insert([{
          timestamp: new Date().toISOString(),
          user: userData.fullName || userData.userId || userData.user || 'Unknown',
          user_id: userData.userId || null,
          role: userData.role || null,
          action: 'Login',
          details: 'User logged in successfully',
          status: 'success'
        }]);
      } catch (logErr) {
        console.error('Failed to log login activity', logErr);
      }
    })();
  } catch (err) {
    // Handle errors (wrong password, user not found, etc.)
    res.status(400).json({ message: err.message });
  }
}

module.exports = { loginUser };
