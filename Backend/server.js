// server.js
require('dotenv').config();          // Load environment variables
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const focusAreaRoutes = require("./routes/focusAreaRoutes");
const reportRoutes = require("./routes/reportRoutes");
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes"); // ✅ NEW
const lookupRoutes = require("./routes/lookupRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middleware
app.use(cors());                     // Enable Cross-Origin requests
app.use(express.json());             // Parse JSON request bodies

// Root endpoint to check server status
app.get('/', (req, res) => {
  res.send({ message: 'Server is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/focus-areas", focusAreaRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/user-activities', activityRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ NEW
app.use('/api/lookups', lookupRoutes);
app.use('/api/projects', projectRoutes);


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});