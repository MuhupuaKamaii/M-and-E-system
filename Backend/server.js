// server.js
require('dotenv').config();          // Load environment variables
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Auth routes
const adminRoutes = require('./routes/adminRoutes'); // Optional admin routes
const focusAreaRoutes = require("./routes/focusAreaRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require('./routes/reviewRoutes');

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
app.use('/api/admin', adminRoutes); // Optional, if you have admin routes
app.use("/api/focus-areas", focusAreaRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/reports', reviewRoutes); // this will pick POST /api/reports/:id/review


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
