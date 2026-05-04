import { Router } from "express";
import { verifyToken, authorize } from "../middlewares/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyToken);

router.get("/stats", authorize('admin'), adminController.getDashboardStats);
router.get("/users", authorize('admin'), adminController.getAllUsers);
router.get("/applications", authorize('admin'), adminController.getApplications);
router.put("/applications/:id", authorize('admin'), adminController.updateApplicationStatus);

export default router;