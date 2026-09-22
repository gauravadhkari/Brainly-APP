import express from "express";

const router = express.Router();

import { me } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
router.get("/me",authMiddleware,me);
export default router;