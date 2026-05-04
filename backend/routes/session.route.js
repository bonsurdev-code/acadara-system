import express from 'express';
import { proposeSession, reviewSessionProposal, getActiveSession } from '../controllers/session.controller.js';
import { verifyToken, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get('/active/:match_id', getActiveSession);

// Mentee creates the proposal
router.post('/propose', authorize('mentee'), proposeSession);

// Mentor reviews the proposal
router.patch('/review/:session_id', authorize('mentor'), reviewSessionProposal);

export default router;