import { Router } from 'express';
import { authorize, verifyToken } from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/dashboard/mentee', authorize('mentee'), userController.getDashboardStats);
router.get('/dashboard/mentor', authorize('mentor'), userController.getMentorDashboardData);

router.get('/verify', userController.isAuthenticated);

router.route('/profile')
  .put(userController.updateProfile)
  .patch(userController.updateProfile);

export default router;