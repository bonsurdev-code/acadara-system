import { Router } from 'express';
import { submitRating } from '../controllers/rating.controller.js';
import { verifyToken, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply global auth
router.use(verifyToken);

// Only mentees can rate their experience
router.post('/submit', authorize('mentee'), submitRating);

export default router;