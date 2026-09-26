import express from "express";

const router = express.Router();

import { signup, signin } from "../controllers/auth.controller.js";
import { me } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/authLimiter.js";
router.post("/signup",authLimiter, signup);
router.post("/signin",authLimiter, signin);
router.get("/me",authMiddleware,me);
export default router;