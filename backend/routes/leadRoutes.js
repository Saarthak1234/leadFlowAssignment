import express from 'express';
const router = express.Router();
import {
  getLeads,
  createLead,
  updateLeadStatus,
  addDiscussion,
  completeFollowUp
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router.route('/:id/status')
  .patch(protect, updateLeadStatus);

router.route('/:id/discussions')
  .post(protect, addDiscussion);

router.route('/:id/followup/complete')
  .patch(protect, completeFollowUp);

import { generateSeedData } from '../controllers/seedController.js';
router.route('/seed')
  .post(protect, generateSeedData);

export default router;
