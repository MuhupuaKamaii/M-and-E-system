// routes/proposals.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware'); // Fixed import
const { proposalsController } = require('../controllers/ProposalsController');

// Use authenticate middleware for all routes in this file
router.use(authenticate);

router.get('/makeproposals', proposalsController.getProposalsdata);

module.exports = router;