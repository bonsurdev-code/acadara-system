import express from 'express';
import * as msgController from '../controllers/message.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:match_id', verifyToken, msgController.getChatHistory);
router.post('/send', verifyToken, msgController.sendMessage);

export default router;