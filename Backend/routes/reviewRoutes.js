// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const supabase = require('../config/supabaseClient'); // your supabase client

// helper to compute next stage/status
function nextAfterApprove(stage) {
  switch (stage) {
    case 'planning': return { status: 'planning_approved', nextStage: 'execution' };
    case 'execution': return { status: 'execution_approved', nextStage: 'monitoring' };
    case 'monitoring': return { status: 'monitoring_approved', nextStage: 'closure' };
    case 'closure': return { status: 'closed', nextStage: 'closed' };
    default: return null;
  }
}

/**
 * POST /api/reports/:id/review
 * body: { action: 'approve'|'reject', stage: 'planning'|'execution'|'monitoring'|'closure', comment: '...' }
 * only NPC (role_id === 2) or Admin (role_id === 1) allowed
 */
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const reviewer = req.user; // from authMiddleware
    const reviewerId = reviewer.user_id;
    const reviewerRoleId = reviewer.role_id;

    // allow NPC or Admin
    if (![1, 2].includes(reviewerRoleId)) {
      return res.status(403).json({ message: 'Only NPC or Admin can review reports' });
    }

    const reportId = Number(req.params.id);
    const { action, stage, comment } = req.body;

    if (!reportId || !action || !stage) {
      return res.status(400).json({ message: 'report id, action and stage are required' });
    }

    const validActions = ['approve', 'reject'];
    const validStages = ['planning', 'execution', 'monitoring', 'closure'];

    if (!validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be approve or reject' });
    }
    if (!validStages.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage' });
    }

    // 1) load existing report
    const { data: existingReport, error: getErr } = await supabase
      .from('reports')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (getErr || !existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Optional: For extra safety ensure reviewer can view this report:
    // NPC can review any. Admin too. If you want OMA reviewers only for same org then add checks.

    // 2) build npc_comments new entry
    const timestamp = new Date().toISOString();
    const newComment = {
      reviewer_user_id: reviewerId,
      reviewer_role_id: reviewerRoleId,
      action,      // approve | reject
      stage,       // planning | execution | ...
      comment: comment || null,
      created_at: timestamp
    };

    // 3) compute new status / stage
    let newStatus = existingReport.status;
    let newCurrentStage = existingReport.current_stage;

    if (action === 'approve') {
      const next = nextAfterApprove(stage);
      if (!next) {
        return res.status(400).json({ message: 'Cannot approve unknown stage' });
      }
      newStatus = next.status;
      newCurrentStage = next.nextStage;
    } else { // reject
      newStatus = 'rejected';
      newCurrentStage = stage; // stay on same stage so OMA can fix
    }

    // 4) merge npc_comments array: append newComment
    const oldComments = Array.isArray(existingReport.npc_comments) ? existingReport.npc_comments : [];
    const updatedComments = [...oldComments, newComment];

    // 5) update report row
    const { data: updatedReport, error: updateErr } = await supabase
      .from('reports')
      .update({
        status: newStatus,
        current_stage: newCurrentStage,
        npc_comments: updatedComments,
        updated_at: new Date().toISOString()
      })
      .eq('report_id', reportId)
      .select('*')
      .single();

    if (updateErr) {
      console.error('Supabase update error', updateErr);
      return res.status(500).json({ message: updateErr.message || 'Failed to update report' });
    }

    // 6) Optionally: create a notification for the OMA user (not implemented here)
    // You can insert into notifications table to alert report owner.

    res.json({
      message: `Report ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      report: updatedReport
    });

  } catch (err) {
    console.error('Review route error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
