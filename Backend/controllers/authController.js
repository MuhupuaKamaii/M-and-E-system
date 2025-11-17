// controllers/authController.js
const { login } = require('../services/authService');

async function loginUser(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const userData = await login(username, password);

    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: userData.user_id,
        full_name: userData.fullName,
        role: userData.role,
        organisation_id: userData.organisationId,
        focus_area_id: userData.focusAreaId,
        token: userData.token
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { loginUser };
