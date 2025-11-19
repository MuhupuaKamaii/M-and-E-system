// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/dashboardController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/dashboard/stats - Get dashboard statistics
router.get("/stats", getAdminStats);

// GET /api/dashboard/users - Get all users
router.get("/users", getAllUsers);

// PUT /api/dashboard/users/:userId - Update user
router.put("/users/:userId", updateUser);

// DELETE /api/dashboard/users/:userId - Delete user
router.delete("/users/:userId", deleteUser);

module.exports = router;
