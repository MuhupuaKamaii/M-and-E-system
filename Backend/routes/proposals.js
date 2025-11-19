const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { propalsController } = require('../controllers/ProposalsController');
router.use(authMiddleware);
router.get('/makeproposals', propalsController.getProposalsdata);
module.exports = router;
