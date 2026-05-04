import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.post('/mentor-apply', userController.submitApplication)

export default router;