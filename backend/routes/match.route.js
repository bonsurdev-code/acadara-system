import { Router } from "express";
import { verifyToken, authorize } from "../middlewares/auth.middleware.js";
import * as matchController from "../controllers/match.controller.js";

const router = Router();

router.use(verifyToken);

// Only Mentees can run the engine or send requests
router.post("/run", authorize('mentee'), matchController.matchFromProfile);
router.post("/request", authorize('mentee'), matchController.requestMentorship);
router.get("/my-requests", authorize('mentee'), matchController.getMenteeRequests);

router.patch('/terminate/:match_id', verifyToken, matchController.terminateMentorship);

// Only Mentors can see their incoming requests or update status
router.get("/mentor-requests", authorize('mentor'), matchController.getMentorRequests);
router.patch("/status/:match_id", authorize('mentor'), matchController.updateRequestStatus);

export default router;