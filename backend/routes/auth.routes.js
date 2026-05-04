import { Router } from 'express';
import { register, login, logout, oauthLogin } from '../controllers/auth.controller.js';
import { validate, verifyToken } from '../middlewares/auth.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', verifyToken, logout);

router.post('/oauth/google', (req, res) => {
  req.body.provider = "google";
  oauthLogin(req, res);
});

router.post('/oauth/facebook', (req, res) => {
  req.body.provider = "facebook";
  oauthLogin(req, res);
});

export default router;