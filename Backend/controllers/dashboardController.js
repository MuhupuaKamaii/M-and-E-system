// controllers/dashboardController.js
const supabase = require("../config/supabaseClient");

/**
 * Get admin dashboard statistics
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getAdminStats(req, res) {
  try {
    // Fetch total users count
    const { data: allUsers, error: usersError } = await supabase
      .from("users")
      .select("user_id, role_id, organisation_id");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return res.status(500).json({ message: "Error fetching users data" });
    }

    // Calculate statistics
    const totalUsers = allUsers.length;
    const admins = allUsers.filter(u => u.role_id === 1).length;
    const npcUsers = allUsers.filter(u => u.role_id === 2).length;
    const omaUsers = allUsers.filter(u => u.role_id === 3).length;

    // Count users per organisation
    const orgCounts = {};
    allUsers.forEach(user => {
      if (user.organisation_id) {
        orgCounts[user.organisation_id] = (orgCounts[user.organisation_id] || 0) + 1;
      }
    });

    // Fetch organisation names
    const { data: organisations, error: orgsError } = await supabase
      .from("organisations")
      .select("organisation_id, name");

    if (orgsError) {
      console.error("Error fetching organisations:", orgsError);
    }

    // Map organisation data
    const organisationStats = organisations ? organisations.map(org => ({
      name: org.name,
      users: orgCounts[org.organisation_id] || 0
    })) : [];

    // Return statistics
    res.json({
      totalUsers,
      admins,
      npcUsers,
      omaUsers,
      organisations: organisationStats
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
}

/**
 * Get all users with details (for User Management)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getAllUsers(req, res) {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        user_id,
        full_name,
        username,
        role_id,
        roles(role_name),
        organisation_id,
        organisations(name)
      `)
      .order("user_id", { ascending: true });

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }

    // Format response
    const formattedUsers = users.map(user => ({
      id: user.user_id,
      full_name: user.full_name,
      username: user.username,
      role: user.roles?.role_name || "Unknown",
      organisation: user.organisations?.name || "N/A"
    }));

    res.json({ users: formattedUsers });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
}

/**
 * Update user details
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function updateUser(req, res) {
  const { userId } = req.params;
  const { full_name, username, role_id, organisation_id } = req.body;

  try {
    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (username) updateData.username = username;
    if (role_id) updateData.role_id = parseInt(role_id);
    if (organisation_id !== undefined) {
      updateData.organisation_id = organisation_id ? parseInt(organisation_id) : null;
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Error updating user:", error);
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: "User updated successfully", user: data[0] });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while updating user" });
  }
}

/**
 * Delete user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function deleteUser(req, res) {
  const { userId } = req.params;

  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting user:", error);
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser
};